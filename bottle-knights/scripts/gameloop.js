"use strict";

//gets delta time
let deltaTime;

let playerProjectile;
let enemyProjectile;

//separate time tracker for cap generation.
let capTimeElapsed = 0;

let enemyTime = 0;

let iterations = 0;

//allows for some mercy time when an enemy spawns or
//when the player is hit.
let mercyTime = 0;

//mercy system for spawning enemies
let enemyIterations = 0;

let graphics = [];

let isLowHealth = false;

//file used to house the main game loop of the game --> isolated
//to maintain neatness, and to allow this to be found much easier.

function gameLoop(){
    
    //plays a low health sound effect and applies a filter when the player's health is low.
    if(player.health < player.maxHealth * 0.1 && player.health > 0){
        if(!isLowHealth){
            lowHealth.play();
            lowHealth.volume(0.2);
            lowHealth.loop(true);
            isLowHealth = true;
        }      
    }
    else{
        lowHealth.stop();
        isLowHealth = false;
    }

    //checks if any attacks need to happen
    if(playerProjectile != null){

        //Removes the player projectile if the player does not exist in
        //the scene
        if(player == null || enemy == null){
            gameScreen.removeChild(playerProjectile);
            playerProjectile = null;
            return;
        }

        playerProjectile.x += 2;

        if(playerProjectile.x >= enemy.x - 20){
            gameScreen.removeChild(playerProjectile);
            playerProjectile = null;

            player.attack(enemy);
        }
    }

    if(enemyProjectile != null){

        //removes the projectile if the enemy dies
        if(enemy == null || player == null){
            gameScreen.removeChild(enemyProjectile);
            enemyProjectile = null;
            return;
        }

        enemyProjectile.x -=2;
        enemyProjectile.rotation += Math.tan(deltaTime);

        //removes the enemy projectile, attacks the player.
        if(enemyProjectile.x <= player.x){
            gameScreen.removeChild(enemyProjectile);
            enemyProjectile = null;

            //attacks the player.
            let damage = enemy.attack(player);

                if(damage > 0){
                    player.hurt();
                    player.isIdling = false;
                    player.isDamaged = true;                   
                } 

            mercyTime = 1.5;   
        }
    }

    updateLabels();

    if(player.isRunning){
        gameWindow.ticker.addOnce(doParallax);
    }
    else{
        gameWindow.ticker.remove(doParallax);
    }
    getDeltaTime();

    //pre-- update bottlecap count.
    capGenerator();
    generateCaps();
    updateGraphics();

    capLabel.resetText(" : " + bottlecaps.toString());
    //1-- play player walking animation, handle parallax scrolling.

    if(enemy == null && !player.isRunning){

        //halts the walking animation to show the cheering animation.
        if(player.isCheering){
            if(timeElapsed >= .25 - (player.speed / 10000)){
                player.walk();
                player.isRunning = true; 
            }
        }
        else{
            player.walk();
            player.isRunning = true; 
        }      
    }
    else if(enemy != null){
        if(player.isRunning){
            player.isRunning = false;
            player.idle();
            player.isIdling = true;
        }   
    
        enemy.bobAnim();

        //mercy mechanic so the player isnt
        //hit many times over and over again
        //(happens rarely, but it is a problem).
        mercyTime -= deltaTime;
        
        if(mercyTime < 0){
            mercyTime = 0;
        }

        //determines if the enemy attacks

        if(enemyTime >= .5 - enemy.level / 1000 && mercyTime == 0 && enemyProjectile == null){
            //check if enemy attacks player.
            let attackChance = Math.max(Math.random() * 500 - (enemy.level > 50 ? 50:enemy.level), 1);
            if(attackChance < 50){ 

                //creates a new projectile
                enemyProjectile = new PIXI.Sprite.from("textures/cap.png");
                enemyProjectile.width = 25;
                enemyProjectile.height = 25;
                enemyProjectile.x = enemy.x + 10;
                enemyProjectile.y = enemy.y;

                gameScreen.addChild(enemyProjectile);                    
            }   
            enemyTime = 0;
        }
        //determines the attack chance where the player can hit the enemy.
        
        if(timeElapsed >= Math.max(.5 - ((player.speed / 2)/ 1000), 0)){

            let attackChance = Math.max((Math.random() * 300 - 
                ((player.speed + 1) + (player.luck + 1))), 1);

            if(attackChance < 50 && playerProjectile == null){
                //creates a player projectile, which is shot to the enemy.
                playerProjectile = new PIXI.Sprite.from("textures/slash.svg");

                playerProjectile.width = 50;
                playerProjectile.height = 50;
                playerProjectile.x = player.x + 10;
                playerProjectile.y = player.y - 15;

                gameScreen.addChild(playerProjectile);

                player.isIdling = false;
                player.isAttacking = true;
                player.attackAnimation();
            }
        
            if(enemy.health <= 0){
                
                //ends the game if the boss is defeated
                if(bossFightStarted){
                    gameScreen.visible = false;
                    gameWindow.ticker.remove(gameLoop);
                    bossTheme.stop();
                    victoryScreen.addChild(player);
                    player.cheer();
                    victoryScreen.visible = true;
                    resetGame();
                    return;
                }

                let numCaps = parseInt(enemy.maxHealth + ((player.dexterity + 1) * (player.luck + 1))) * lootMultiplier;

                capIncreaseLabel = new Label(gameScreen, `+${numCaps}`, 100, 120, 30);
                capIncreaseLabel.label.zIndex = -10000;
                graphics.push(capIncreaseLabel);
                capIncreaseLabel.createGraphic(capIcon.x + 10);

                parseInt(enemy.maxHealth + ((player.dexterity + 1) * (player.luck + 1))) * lootMultiplier

                //dexterity and luck have an effect on loot!
                bottlecaps += numCaps;
                
                let healthAmt = player.dexterity *2;

                if(healthAmt > 0){
                    //player regenerates health after killing an enemy, depends on dexterity!
                    player.health += healthAmt;

                    let healingText = new Label(gameScreen, `+${healthAmt} health!`, 0, 200, 16);
                    graphics.push(healingText);
                    healingText.createGraphic(player.x - 100);
            
                
                    if(player.health > player.maxHealth){
                        player.health = player.maxHealth;
                    }
                }
                
        
                player.healthBar.redrawEntire(player.health, player.maxHealth);
                
                //resets the time, prioritizes player anim.
                timeElapsed = 0;                
                enemy.die();
                
                player.enemiesKilled++; 
        
                if(player.enemiesKilled % 3 == 0){
                    player.maxHealth += 10;
                    player.health += 10;
                    player.healthBar.redrawEntire(player.health, player.maxHealth);

                    updateCosts();
                    generateDataValues();
                }  

                player.cheer();
                player.isCheering = true;
                timeElapsed = 0;
 
            }
            
            if(player.health <=0){
                //kills the player and the enemy, removes game loop from the active ticker
                player.die();
                endScreen.addChild(player);
                player.hurt();
                mainTheme.stop();
                bossTheme.stop();
                gameScreen.visible = false;
                gameWindow.ticker.remove(gameLoop);
                endScreen.visible = true;
                resetGame();
            }
        }
    }

    //tries to spawn a new enemy.
    if(enemy == null){
        if(timeElapsed > .5 - ((player.speed / 2) / 1000)){

            //determines the chance in which an enemy spawns for the playe
            let spawnChance = Math.round(300 * Math.random()) - 
            (player.luck + player.speed) - enemyIterations;
            
            //mercy system just in case the player is VERY unlucky!
            enemyIterations++;
            
            //checks if an enemy spawns
            if(spawnChance <= 10){
                enemy = new Enemy(450, 240, 1, enemyTextureSheet[0]);
                gameScreen.addChild(enemy);
                enemy.healthBar.addtoSection(gameScreen);
                enemyIterations = 0;
                mercyTime = 1.5;
            }  

            timeElapsed = 0;
            return;
        }
              
    }
    if(timeElapsed >= .5 - ((player.speed / 2) / 1000)){
        timeElapsed = 0;

        if(!player.isDamaged && !player.isAttacking &&!player.isBlocking){            
            player.idle();
            player.isIdling = true;
        }  

        if(iterations == 1){
            player.isDamaged = false;
            player.isAttacking = false;
            player.isBlocking = false;
            iterations = 0;
        }
        iterations++;
    }

    //OR, if an enemy is already present on screen, check if the player is able to attack it
        // if the player attacks, play attack animation, sound, and reduce the enemy's health
        //if the enemy DIES, play enemy death animation and give the player the number of bottlecaps
        //earned by killing the bottle


    //2-- Check if an enemy needs to spawn, spawn it if needed.

    //3 Handle enemy attacks, check conditional if they can or can not attack

    //4 check for player level up --> rewards skill points which can be redeemed for stat bonuses.
        //play level up animation and sound for 1 second or so? (maybe implement???? depends on time.)

    //5 update buttons to show correct values (bottle caps, etc.) (almost..)

    //more to come if need be...
}

//gets the delta time of the run time.
//code heavily inspired by circle blast hw
function getDeltaTime(){
    deltaTime = 1/gameWindow.ticker.FPS;
    //caps delta time.
    deltaTime > 1/12 ? deltaTime=1/12 : deltaTime;

    timeElapsed += deltaTime;
    capTimeElapsed += deltaTime;
    enemyTime += deltaTime;
}

//moves the graphics in a sinographic manner, used to display
//visual combat feedback
function updateGraphics(){
    graphics.forEach(graphic=>{
        graphic.uptime += deltaTime;
        graphic.changeTime += deltaTime;
        
        if(graphic.changeTime > 0.01){
            graphic.changeTime = 0;
            graphic.iterations += 0.01;
            graphic.label.y -= Math.cos(graphic.iterations / 10);
        }

        if(graphic.uptime > 0.5){
            graphic.removeLabel(gameScreen);
            graphic.isActive = false;
       
        }
    });

    //filters out inactive elements
    graphics = graphics.filter(element => element.isActive = true);
}

//resets all of the important variables in the game
function resetGame(){
    
    bossButton.disabled = false;
    resetDisplay(buttonArea);
    enemy.die();
    upgradeCosts = [0, 0, 0, 0, 0];

    if(enemyProjectile != null){
        gameScreen.removeChild(enemyProjectile);
        enemyProjectile = null;
    }

    if(playerProjectile != null){
        gameScreen.removeChild(playerProjectile);
        playerProjectile = null;
    }

    //resets shop stuff
    weaponStrength = 0;
    armorResistance = 0;
    passiveIncome = 0;
    incomeTimer = 0.1;
    initShopButtons();
    lowHealth.stop();

    //resets loot multiplier
                
    buyLootMultiplierButton.dataset.cost = "10000";
    buyLootMultiplierButton.dataset.multiplier = "1";
    lootMultiplier = 1;
    updateUpgrader();

    //resets bottlecap count
    bottlecaps = 0;

    player.healthBar.removeFromSection(gameScreen);
    plrName.removeLabel(gameScreen);

    //removes enemy and cap label.
    gameScreen.removeChild(player);
    gameScreen.removeChild(enemy);
    capLabel.removeLabel(gameScreen);
}
