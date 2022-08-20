//Manages everything that has to do with the boss of the game.

let bossButton;
let bossFightStarted = false;

//prompts the user if they really want to start the boss fight
function onBossClick(){

    let popupBoss = createPopup();

    resetDisplay(popupBoss);

    appendHelpPopup("Are you sure you want to start the boss fight?<br>Warning: this fight is not easy.", "description");
    let yes = createButton("Yes", startBoss, "yes");
    let no = createButton("No", returnToGame, "no");
    gameWindow.ticker.remove(gameLoop);

    no.addEventListener("click", playClick);
    yes.addEventListener("click", playClick);
   
}

//starts the boss battle!
function startBoss(){
    bossButton.disabled = true;
    destroyPopup();
    mainTheme.stop();
    bossTheme.play();
    bossTheme.loop(true);
    bossTheme.volume(0.2);

    //creates boss object
    if(enemy != null){
        enemy.die();
    }

    bossFightStarted = true;

    enemy = new Enemy(450, 240, 1, bossTextureSheet[0]);

    gameScreen.addChild(enemy);
    enemy.healthBar.addtoSection(gameScreen);
    enemyIterations = 0;
    mercyTime = 1.5;

    gameWindow.ticker.add(gameLoop);    

    
}

//returns to the game
function returnToGame(){
    destroyPopup();
    gameWindow.ticker.add(gameLoop);
}