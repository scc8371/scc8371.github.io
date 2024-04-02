import * as api from "./apiReader.js";

class PokeAPI {
    numTotalPokemon = 0;
    pokemonData = null;

    async getTotalPokemon() {
        let all = await api.getData("pokedex/national");
        this.numTotalPokemon = all.pokemon_entries.length;
    }

    async generatePokemon(numPokemon, genTrouble = false) {

        if (this.numTotalPokemon == 0) {
            await this.getTotalPokemon();
        }

        let pokemonData = [];
        this.pokemonData = pokemonData;
        let uniqueNums = new Set();

        while (pokemonData.length < numPokemon) {
            let rand = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            if (!uniqueNums.has(rand)) {
                uniqueNums.add(rand);
                let newData = { pokedex_num: rand };
                pokemonData.push(newData);
            }
        }

        for (let data of pokemonData) {
            data.special_questions = [];
            data.physical = [];
            data.evo = [];
            data.general = [];
        }

        const promises = pokemonData.map(data => this.processPokemonData(data, pokemonData));

        await Promise.all(promises);

        return pokemonData;
    }

    async processPokemonData(data, pokemonData) {
        let speciesData = await api.getData("pokemon-species/" + data.pokedex_num);
        let generalPokemonInfo = await api.getData("pokemon/" + data.pokedex_num);

        data.evo.has_mega = false;
        if (speciesData.varieties.length > 1) {
            speciesData.varieties.forEach(variant => {
                if (variant.pokemon.name.includes("mega")) data.evo.has_mega = true;
            });
        }

        data.name = speciesData.name;
        data.evo.variant = '';
        data.stats = generalPokemonInfo.stats.map(stat => stat = stat.base_stat);

        data.cry = generalPokemonInfo.cries.latest;

        let regionalData;

        let genSuccess = false;

        if (speciesData.varieties.length > 1) {
            let rand = Math.floor(Math.random() * speciesData.varieties.length);
            if (rand > 0) {
                regionalData = await api.getData(speciesData.varieties[rand].pokemon.url, true);
                if (this.getPokemonImage(data, regionalData)) {
                    genSuccess = true;
                    generalPokemonInfo = regionalData;
                    data.evo.variant = regionalData.name.substring(regionalData.name.lastIndexOf("-") + 1, regionalData.name.length)
                    data.evo.variant = data.evo.variant.charAt(0).toUpperCase() + data.evo.variant.substring(1);
                }
                else {
                    genSuccess = this.getPokemonImage(data, generalPokemonInfo);
                }
            }
            else {
                genSuccess = this.getPokemonImage(data, generalPokemonInfo);
            }
        }
        else {
            genSuccess = this.getPokemonImage(data, generalPokemonInfo);
        }

        if (!genSuccess) {

            let pokedexNum = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            while (pokemonData.filter(pokemon => pokemon.pokedex_num == pokedexNum).length > 0) {
                pokedexNum = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            }

            data.pokedex_num = pokedexNum;
            await this.processPokemonData(data, pokemonData);
            return;
        }

        let filter = speciesData.genera.filter(dat => dat.language.name == 'en');
        data.special_questions.classification = filter.length > 0 ? filter[0].genus : "No classification was found for this Pokémon";

        //abilities
        data.general.abilities = generalPokemonInfo.abilities;
        if (data.general.abilities.length > 0) data.general.abilities = data.general.abilities.map(p => p = p.ability.name);

        //colors:
        await this.getPokemonColors(data);

        //egg groups
        data.general.egg_groups = speciesData.egg_groups;
        if (data.general.egg_groups.length > 0) data.general.egg_groups = data.general.egg_groups.map(p => p = p.name);

        if (speciesData.shape != null) data.physical.shape = speciesData.shape.name;
        else data.physical.shape = "No discernable shape.";

        //held items
        data.general.held_items = generalPokemonInfo.held_items;

        if (data.general.held_items.length > 0) data.general.held_items = data.general.held_items.map(p => p = p.item.name);
        else data.general.held_items.push("No held items.");

        data.physical.weight = (generalPokemonInfo.weight / 4.536).toFixed(2) + " lbs";
        let feetConversion = generalPokemonInfo.height / 3.048;
        let roundedFeet = Math.floor(feetConversion);
        data.physical.height = roundedFeet + "ft " + Math.round((feetConversion - roundedFeet) * 12) + "in";

        //generation
        data.special_questions.generation = await api.getData(speciesData.generation.url, true);
        data.special_questions.generation = data.special_questions.generation.id;

        //elemental typings
        data.general.types = generalPokemonInfo.types;

        for (let i = 0; i < data.general.types.length; i++) {
            data.general.types[i] = data.general.types[i].type.name;
        }

        //legendary/mythical data
        data.evo.is_legendary = speciesData.is_legendary;
        data.evo.is_mythical = speciesData.is_mythical;
        data.evo.is_baby = speciesData.is_baby;

        //pokedex entry
        filter = speciesData.flavor_text_entries.filter(dat => dat.language.name == 'en');
        data.special_questions.pokedex_info = filter.length > 0 ? filter[filter.length - 1].flavor_text : "No Pokédex Entry for this Pokémon found.";

        //stage of evolution
        let evoData = await api.getData(speciesData.evolution_chain.url, true);
        evoData = evoData.chain;

        let evoChain = await this.formatEvolutionData(evoData, data);
        evoChain = evoChain.split('|');
        data.evo.evolution_chain = evoChain;


        switch (evoChain.length) {
            case 1:
                data.evo.stage_of_evolution = "Only";
                break;
            case 2:
                if (evoChain[0] == data.name) data.evo.stage_of_evolution = "First";
                else data.evo.stage_of_evolution = "Last";
                break;

            case 3:
                if (evoChain[0] == data.name) data.evo.stage_of_evolution = "First";
                else if (evoChain[1] == data.name) data.evo.stage_of_evolution = "Middle";
                else data.evo.stage_of_evolution = "Last";
                break;
        }

        data.name = data.name[0].toUpperCase() + data.name.slice(1);
        data.name = data.name.replace(/\-[a-z]/g, match => match.toUpperCase());
    }

    //formats evolution data from first evolution to last evolution.
    async formatEvolutionData(chain, jsonData) {
        let evoChain = [];

        if (chain && chain.species && chain.species.name) {
            evoChain.push(chain.species.name);

            let data = await this.getSpeciesData(chain.species.url);

            data.varieties.forEach(variety => {
                if (variety.pokemon.name.includes("mega")) {
                    jsonData.evo.has_mega = true;
                }
            });


            if (chain.evolves_to && chain.evolves_to.length > 0) {
                //single evolution branch
                console.log(chain);
                let activeChain = chain.evolves_to[0];

                if (chain.evolves_to.length > 1) {
                    let firstEvo = chain.evolves_to[0].species.name;

                    

                    let foundMatch = false;

                    chain.evolves_to.forEach(pkmn => {
                        console.log(pkmn.species.name, jsonData.name);
                        if (pkmn.species.name == jsonData.name) {
                            foundMatch = true;
                            activeChain = pkmn;
                        }
                    });
                    
                    
                    if (!foundMatch) {
                        chain.evolves_to[0].species.name = "";
                        for (let i = 0; i < chain.evolves_to.length; i++) {
                            let nameConcat = chain.evolves_to[i].species.name;
                            if (i == 0) nameConcat = firstEvo;

                            chain.evolves_to[0].species.name += this.capitalizeName(nameConcat);
                            console.log(chain.evolves_to[i]);
                            if (i < chain.evolves_to.length - 1) {
                                chain.evolves_to[0].species.name += " / ";
                            }
                        }
                    }
                }
                evoChain.push(`${await this.formatEvolutionData(activeChain, jsonData)}`);
            }
        }
        return evoChain.join('|');
    }

    capitalizeName(name) {
        let firstLetter = name.charAt(0).toUpperCase();
        let restOfName = name.slice(1);

        return firstLetter + restOfName;
    }

    async getSpeciesData(url) {
        let data = await api.getData(url, true);
        return data;
    }

    getPokemonImage(dataList, pokemonData) {
        if (pokemonData.sprites.front_default) {
            dataList.pixel_sprite = pokemonData.sprites.front_default;
        }
        if (pokemonData.sprites.other["official-artwork"].front_default) {
            dataList.image = pokemonData.sprites.other["official-artwork"].front_default;
            return true;
        }
        else if (pokemonData.sprites.front_default) {
            dataList.image = pokemonData.sprites.front_default;
            return true;
        }

        return false;
    }

    async getPokemonColors(data) {
        //https://github.com/yassenshopov/PokePalette/blob/main/src/Poke.js

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let img = new Image();

        canvas.willReadFrequently = true;
        img.crossOrigin = "Anonymous";
        img.src = data.pixel_sprite;

        return new Promise(resolve => {
            img.onload = () => {
                //prepares canvas to draw new image
                ctx.beginPath();
                ctx.clearRect(0, 0, 100, 100);
                ctx.stroke();
                ctx.drawImage(img, 0, 0, 100, 100);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const rgb = [];

                for (let i = 0; i < imgData.data.length; i += 4) {

                    //gets rgb data in the canvas based on the image drawn
                    let r = imgData.data[i];

                    let r1 = Math.floor(r / 16).toString(16);
                    let r2 = ((r / 16 - Math.floor(r / 16)) * 16).toString(16);

                    let g = imgData.data[i + 1];
                    let g1 = Math.floor(g / 16).toString(16);
                    let g2 = ((g / 16 - Math.floor(g / 16)) * 16).toString(16);

                    let b = imgData.data[i + 2];
                    let b1 = Math.floor(b / 16).toString(16);
                    let b2 = ((b / 16 - Math.floor(b / 16)) * 16).toString(16);

                    let color = "#" + r1 + r2 + g1 + g2 + b1 + b2;
                    rgb.push(color);
                }

                let numOfEachColor = {};

                //counts each pixel to determine duplicates.
                for (let i = 0; i < rgb.length; i++) {
                    if (!(rgb[i] in numOfEachColor)) {
                        numOfEachColor[rgb[i]] = 1;
                    }
                    else {
                        numOfEachColor[rgb[i]] = numOfEachColor[rgb[i]] + 1;
                    }
                }

                //get rid of colors that do not pertain to the primary color of the pokemon.
                delete numOfEachColor["#101010"];
                delete numOfEachColor["#000000"];
                delete numOfEachColor["#0f0f0f"];
                delete numOfEachColor["#ffffff"];
                delete numOfEachColor["#fefefe"]
                delete numOfEachColor["#010101"];
                delete numOfEachColor["#080808"];
                delete numOfEachColor["#202020"];
                delete numOfEachColor["#181818"];
                delete numOfEachColor["#181810"];
                delete numOfEachColor["#292929"];
                delete numOfEachColor["#0f110d"];
                delete numOfEachColor["#e8e8e8"];
                delete numOfEachColor["#020501"];
                delete numOfEachColor["#050505"];
                delete numOfEachColor["#060606"];
                delete numOfEachColor["#070707"];
                delete numOfEachColor["#a39698"];
                delete numOfEachColor["#656068"];
                delete numOfEachColor["#edebe6"];

                //sort the list of colors based on the largest number of colored pixels to the least number of colored pixels
                let colorScheme = Object.entries(numOfEachColor);
                let sort = colorScheme.sort((a, b) => a[1] - b[1]).reverse();

                function colorDist(rgb1, rgb2) {
                    const rDiff = parseInt(rgb1.substring(1, 3), 16) - parseInt(rgb2.substring(1, 3), 16);
                    const gDiff = parseInt(rgb1.substring(3, 5), 16) - parseInt(rgb2.substring(3, 5), 16);
                    const bDiff = parseInt(rgb1.substring(5, 7), 16) - parseInt(rgb2.substring(5, 7), 16);

                    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
                }

                function hexToHSL(hex) {
                    const r = parseInt(hex.substring(1, 3), 16) / 255;
                    const g = parseInt(hex.substring(3, 5), 16) / 255;
                    const b = parseInt(hex.substring(5, 7), 16) / 255;

                    let max = Math.max(r, g, b);
                    let min = Math.min(r, g, b);

                    const luminance = (max + min) / 2;

                    let hue = 0;
                    let saturation = 0;

                    if (max !== min) {
                        let delta = max - min;

                        saturation = luminance > 0.5 ? delta / (2 - max - min) : delta / (max + min);

                        switch (max) {
                            case r:
                                hue = ((g - b) / delta) + (g < b ? 6 : 0);
                                break;
                            case g:
                                hue = ((b - r) / delta) + 2;
                                break;
                            case b:
                                hue = ((r - g) / delta) + 4;
                                break;
                        }
                    }

                    hue *= 60;

                    return { hue, saturation, luminance };
                }

                let primaryColor = sort[0][0];
                let secondaryColor = sort[1][0];
                let thirdColor = sort[2][0];
                let fourthColor = '';

                for (let i = 0; i < sort.length; i++) {
                    const color = sort[i][0];
                    const hsl = hexToHSL(color);

                    if (hsl.saturation > 0.6 && hsl.luminance > 0.6) {
                        if (colorDist(color, primaryColor) > 50 && colorDist(color, secondaryColor) > 50 && colorDist(color, thirdColor) > 50) {
                            fourthColor = color;
                            break;
                        }
                    }
                }

                data.physical.primary_color = primaryColor;
                data.physical.secondary_color = secondaryColor;
                data.physical.tertiary_color = thirdColor;
                data.physical.quaternary_color = fourthColor || sort[3][0];

                resolve();
            }
        });
    }
};

export { PokeAPI };