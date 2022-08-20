"use strict";

//manages updating all of the player stats showcased in the "player information tab"

//paragraph info from the DOM that displays valuable information to the player.
let dRange;
let regen;

let loot;
let encounterRate;

let atkChance;
let dodgeChance;

let resisted;

let factoriesOwnedLabel;

//updates a menu item given a prompt.
function updateLabels(){

    //sets strength notifier
    if(player.strength < 2 && weaponStrength == 0){
        dRange.innerHTML = `Damage: 1`
    }
    else{
        dRange.innerHTML = `Damage range: 1-${Math.round((1 + weaponStrength) * 1 * 
            ((player.strength + 1) * (1 + weaponStrength)))}`;  
    }      

    //sets regeneration notifier
    if(player.dexterity == 0){
        regen.innerHTML = `Regeneration: 0 HP per kill`;
    }
    else{
        regen.innerHTML = `Regeneration: 0-${Math.round((player.dexterity * 2))} HP per kill`;
    }   

    //sets loot notifier
    if(enemy != null){
        loot.innerHTML = `Loot: 
        ${enemy.maxHealth + ((player.dexterity + 1) * (player.luck + 1)) * lootMultiplier} caps<br>`
    }
    else{
        loot.innerHTML = `Loot: 0 caps<br>`;
    }

    loot.innerHTML += `Dodge Chance: ${(1/(200 - player.luck) * 100).toFixed(2)}%<br>`;

    //set as a basis (to avoid infinitely many prompts being added)
    let baseText = loot.innerHTML;

    //sets encounter chance
    if(enemy == null){
        loot.innerHTML = baseText + `Encounter rate: ${((10 / (500 - 
            (player.luck + player.speed) - enemyIterations)) * 100).toFixed(4)}%`;
    }
    else{
        loot.innerHTML = baseText + "Encounter in progress!";
    }

    let attackChance = ((50 / parseInt((300 - 
        ((player.speed + 1) + (player.luck + 1))))) * 100).toFixed(2);

    if(attackChance < 0 || attackChance > 100){
        attackChance = 100;
    }

    //sets attack chance
    atkChance.innerHTML = `Attack Chance: ${attackChance}% <br>
    Time per attack: ${parseInt(500 - (player.speed / 2))} ms<br>
    `;

    //sets resistance
    resisted.innerHTML = `Resist: ${parseInt((player.resistance) * (1 + armorResistance))} damage`;

    //sets factories owned
    factoriesOwnedLabel.innerHTML = `Factories Owned: ${factoriesOwned}`;
}