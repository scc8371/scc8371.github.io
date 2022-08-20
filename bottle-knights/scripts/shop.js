//Manages and holds functions pertaining to the functionalities of the in game shop
//Some information of the shop, just for future reference.


//FACTORIES ---------------------------

//Factories generate passive income over time without the need for the player
//to click the generate caps button. This is to encourage the player to play on 
//to unlock automation, and stop pressing a single button over and over again.

//-------------------------------------

//ARMOR--------------------------------

//Armor reduces the incoming damage to the player by a given percent. This feature
//is mostly useful in late game, as enemies gain tremendous power at that level.

//-------------------------------------

//SWORD--------------------------------

//Sword increases the outgoing damage by the player by a given percent.

//-------------------------------------

//POTION-------------------------------

//Potions increase the health of the player by 50 health. The price of this increases
//each time it is bought to discourage the continual use of it. Health is naturally
//generated from the player's dexterity, and it is encouraged to use that as the
//main source of health.

//--------------------------------------

//initializes all shop buttons, giving them their values and such.

let incomeTimer = 0.1;
let factoriesOwned = 0;

function initShopButtons(){
    let buttonArr = Array.from(shopButtons);

    buttonArr.forEach(button =>{
        button.dataset.cost = 100;
    });

    //potions should be significantly less to begin with, as 
    //they are not as valuable as the rest
    buttonArr[buttonArr.length - 1].dataset.cost = "10";

    buttonArr.forEach(button =>{
        updateButtonLabel(button);
        button.addEventListener("click", purchaseShopItem);
    });

    updateDescs();
}

//updates labels of the buttons to show the player.
function updateButtonLabel(button){
    button.innerHTML = `${button.title}<br>Cost: ${button.dataset.cost}`;
}

//updates descriptions of each shop item.
function updateDescs(){
    shopDescs[0].innerHTML = `Passive Income:
     ${parseInt(passiveIncome * 1/incomeTimer) * lootMultiplier} caps/sec`;
    shopDescs[1].innerHTML = `Current Armor Resistance:
     ${parseInt(Math.round(armorResistance * 100))}%`;
     shopDescs[2].innerHTML = `Current Weapon Strength:
      ${parseInt(Math.round(weaponStrength * 100))}%`;
}

//generates x caps every second.
function capGenerator(){
    if(capTimeElapsed > incomeTimer){
        bottlecaps += passiveIncome * lootMultiplier;
        capTimeElapsed = 0;
    }
}

//checks if the user can purchase a shop item. If so, purcnases it and
//updates the buttons
function purchaseShopItem(e){
    if(bottlecaps >= e.target.dataset.cost){
        bottlecaps -= parseInt(e.target.dataset.cost);

        switch(e.target.id){
            case "factory":
                passiveIncome = passiveIncome * 5 + 2;
                incomeTimer -= 0.001;
                factoriesOwned++;
            break;

            case "sword":
                weaponStrength += 0.1;
            break;

            case "armor":
                armorResistance += 0.1;
            break;

            case "potion":
                //fully restores the player's health
                player.health = player.maxHealth;
                player.healthBar.redrawEntire(player.health, player.maxHealth);
            break;
        }

        //increases the cost by tenfold.
        e.target.dataset.cost = `${parseInt(e.target.dataset.cost) * 10}`;   
        updateButtonLabel(e.target);   
        updateDescs();
    }
    else{
        cap.stop();
        error.play();
    }
}