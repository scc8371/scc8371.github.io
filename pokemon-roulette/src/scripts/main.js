import { PokeAPI } from "./pokeAPI.js";
import { PokemonPopup } from "./pokemonPopup.js";

let roundNr = 1;

let api = new PokeAPI();

let rows = document.querySelectorAll(".pokeRow");
let loading = document.querySelector(".loading");

let generatedPokemon = [];

let tooltip = document.querySelector('.tooltiptext');
let col = document.querySelectorAll('.col');

let selectedPokemon = null;

col.forEach(c => c.addEventListener('click', e => {
    try {
        let pokemon = generatedPokemon[Array.from(col).indexOf(c)];
        let a = new Audio(pokemon.cry);
        a.play();
    }
    catch (error) {
        console.log(error);
    }
}));

col.forEach(c => c.addEventListener('mouseover', (e) => {
    tooltip.style.visibility = "visible";

    try {
        let pokemon = generatedPokemon[Array.from(col).indexOf(c)];
        console.log(pokemon);

        let typeImg = [];

        pokemon.general.types.forEach(type => {
            let img = new Image();
            img.src = `resources/${type}.png`
            typeImg.push(img);
        });

        tooltip.innerHTML = `
        ${Array.from(col).indexOf(c) + 1} - ${pokemon.name}
        `;

        selectedPokemon = pokemon;

        let imgHTML = '';
        for (let i = 0; i < typeImg.length; i++) {
            imgHTML += `<img src=${typeImg[i].src}>` + " ";
        }

        if (pokemon.evo.is_baby) tooltip.innerHTML += ` (Baby Pokémon) `;
        else if (pokemon.evo.is_legendary) tooltip.innerHTML += ` (Legendary Pokémon) `;
        else if (pokemon.evo.is_mythical) tooltip.innerHTML += ` (Mythical Pokémon) `;

        if (pokemon.evo.variant != '') tooltip.innerHTML += ` (${pokemon.evo.variant} Form)`;

        tooltip.innerHTML += `<hr><span id="pokemonGenHeight"><span id="dexNum">Pokémon #${pokemon.pokedex_num}</span><span id="pkmnHeight">Height: ${pokemon.physical.height}</span></span>`;
        tooltip.innerHTML += `<span id="pokemonGenWeight"><span id="dexNum">Generation ${pokemon.special_questions.generation}</span><span id="pkmnHeight">Weight: ${pokemon.physical.weight}</span></span>`;
        tooltip.innerHTML += `<span id="pokemonGenTypes">${imgHTML}</span>`;
        tooltip.innerHTML += `The ${pokemon.special_questions.classification}<br>`
        tooltip.innerHTML += `<p>${pokemon.special_questions.pokedex_info}</p>`;



        tooltip.innerHTML += `<hr>Evolution Chain<br>`;

        let pokemonIndex = 0;

        switch (pokemon.evo.stage_of_evolution) {
            case "Middle":
                pokemonIndex = 1;
                break;

            case "Final":
                break;
        }

        for (let i = 0; i < pokemon.evo.evolution_chain.length; i++) {
            let pokemonName = pokemon.evo.evolution_chain[i];
            let firstLetter = pokemonName.charAt(0).toUpperCase();
            let remainingLetters = pokemonName.slice(1);

            pokemonName = firstLetter + remainingLetters;
            let element = document.createElement("span");
            element.innerHTML = pokemonName;
            if (pokemonName.toLowerCase().includes(pokemon.name.toLowerCase()) && pokemon.evo.variant != "Mega") {
                element.style.color = "lime";
            }

            tooltip.appendChild(element);
            if (i < pokemon.evo.evolution_chain.length - 1) tooltip.innerHTML += " -> ";
            console.log(pokemon.name.toLowerCase(), pokemonName.toLowerCase());
        }

        if (pokemon.evo.has_mega) {
            let pokemonName = pokemon.evo.evolution_chain[pokemon.evo.evolution_chain.length - 1];
            let firstLetter = pokemonName.charAt(0).toUpperCase();
            let remainingLetters = pokemonName.slice(1);

            pokemonName = firstLetter + remainingLetters;
            tooltip.innerHTML += ' -> ';
            let element = document.createElement("span");
            element.innerHTML = `${"Mega "} ` + pokemonName;
            if (pokemon.evo.variant == "Mega") {
                element.style.color = "lime";
            }

            tooltip.appendChild(element);
        }

        tooltip.innerHTML += "<hr>"

        tooltip.innerHTML += `
            <div class="statDisplay">
                <div class="label">HP</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="health">${pokemon.stats[0]}</div>
                </div>
            </div>

            <div class="statDisplay">
                <div class="label">ATK</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="attack">${pokemon.stats[1]}</div>
                </div>
            </div>

            <div class="statDisplay">
                <div class="label">DEF</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="defense">${pokemon.stats[2]}</div>
                </div>
            </div>

            <div class="statDisplay">
                <div class="label">SPATK</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="spattack">${pokemon.stats[3]}</div>
                </div>
            </div>

            <div class="statDisplay">
                <div class="label">SPDEF</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="spdefense">${pokemon.stats[4]}</div>
                </div>
            </div>

            <div class="statDisplay">
                <div class="label">SPD</div>
                    <div class="progressBarOuter">
                    <div class="progressBarInner" id="speed">${pokemon.stats[5]}</div>
                </div>
            </div>
            
        `;

        tooltip.innerHTML += "<hr>"

        let statChangers = document.querySelectorAll(".progressBarInner");

        for (let i = 0; i < statChangers.length; i++) {
            let percentage = (pokemon.stats[i] / 252) * 100;
            statChangers[i].style.width = `${percentage}%`;

            if (pokemon.stats[i] === Math.max(...pokemon.stats)) {
                statChangers[i].style.backgroundColor = `lime`;
            }
            else if (pokemon.stats[i] === Math.min(...pokemon.stats)) {
                statChangers[i].style.backgroundColor = `red`;
            }
            else {
                statChangers[i].style.backgroundColor = `cyan`;
            }
        }
    }
    catch (error) {
        console.log(error);
    }

}));

col.forEach(col => col.addEventListener('mouseout', (e) => {
    tooltip.style.visibility = "hidden";
}));



document.addEventListener('mousemove', (e => {
    switch (e.pageX > window.outerWidth / 2) {
        case true:
            tooltip.style.left = e.pageX - (tooltip.offsetWidth) + 'px';

            break;
        case false:
            tooltip.style.left = e.pageX + 'px';
            break;
    }

    switch (e.pageY > window.outerHeight / 2) {
        case true:
            tooltip.style.top = e.pageY - (tooltip.offsetHeight + 1) + 'px';
            break;

        case false:
            tooltip.style.top = e.pageY + 'px';
            break;
    }
}));

document.addEventListener("keydown", async function (e) {
    if (e.key == 'r') {
        hidePokemon();
        displayPokemonInfo(await api.generatePokemon(12));
    }

    if (e.key == 's' && selectedPokemon != null) {
        console.log("pressed s on pokemon: " + selectedPokemon.name);

        const xhr = new XMLHttpRequest();

        xhr.open('GET', selectedPokemon.cry, true);
        xhr.responseType = 'blob';

        xhr.onload = () => {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cry.ogg';
                a.click();
                URL.revokeObjectURL(url);
            }else{
                console.error("File download failed: " + xhr.status);
            }
        }

        xhr.send();
    }
});

displayPokemonInfo(await api.generatePokemon(12));


function displayPokemonInfo(gen) {
    generatedPokemon = gen;

    let cols = document.querySelectorAll(".col");

    for (let i = 0; i < cols.length; i++) {

        while (cols[i].firstChild) {
            cols[i].removeChild(cols[i].firstChild);
        }

        let img = new Image;
        img.src = generatedPokemon[i].image;
        img.classList.add("pkmnImg");

        let index = i;

        cols[i].appendChild(img);

        let imgContainer = document.createElement("div");

        generatedPokemon[i].general.types.forEach(type => {
            let img = new Image();
            img.src = `resources/${type}.png`
            img.style.padding = "0.1rem";
            imgContainer.appendChild(img);
        });

        cols[i].appendChild(imgContainer);
        cols[i].style.display = "flex";
        cols[i].style.flexDirection = "column";

        let primary = generatedPokemon[i].physical.primary_color;
        let secondary = generatedPokemon[i].physical.secondary_color;
        let tertiary = generatedPokemon[i].physical.tertiary_color;
        let quaternary = generatedPokemon[i].physical.quaternary_color;

        const gradient = `linear-gradient(
            to bottom right,
            ${primary} 0%, 
            ${primary} 20%, 
            ${secondary} 20%, 
            ${secondary} 40%, 
            ${tertiary} 40%, 
            ${tertiary} 60%, 
            ${quaternary} 60%, 
            ${quaternary} 80%, 
            ${primary} 80%
        )`;

        cols[i].style.background = `
        linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
        ${gradient}`;

        revealPokemon();
    }
}

function revealPokemon() {
    rows.forEach(row => row.style.visibility = 'visible');
    loading.style.visibility = 'hidden';
}

function hidePokemon() {
    rows.forEach(row => row.style.visibility = 'hidden');
    loading.style.visibility = 'visible';

    let pkmnImg = document.querySelectorAll(".pkmnImg");

    pkmnImg.forEach(img => img.parentNode.removeChild(img));
}