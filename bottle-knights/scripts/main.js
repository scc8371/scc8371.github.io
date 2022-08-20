"use strict";

let game;

//width and height values
let width;
let height;

//FSM game states
let gameScreen;
let nameScreen;
let startScreen;
let endScreen;
let victoryScreen;

let instructionsScreen;
let nextButton;
let continueButton;

let statTutorialScreen;

//player display name
let plrName;

//hero name input
let warning;

//ground sprite
let ground;

//PIXI window
let gameWindow;

//texture sheet for player animationns
let playerTextureSheet;

//texture sheet for enemies
let enemyTextureSheet;

//texture sheet for El Capo
let bossTextureSheet;

//buttons area (used to assign new controls as the game progresses)
let buttonArea;

let submitButton;

//game stats, tracks the player, the active enemy,
//and the number of bottle caps the player has (currency).
let player;
let enemy = null;

//name input area for the player's name.
let nameArea;

//prompt div to obtain user information/stats!
let promptArea;

//upgrade area-- DOM elements present in the main game!
let upgradeArea;

//skill point selectors 
let strengthSelector;
let dexteritySelector;
let luckSelector;
let speedSelector;
let resistanceSelector;

//specific elements that are switched on and off
let upgradeButton;
let generateButton;
let plrStatsButton;
let shopButton;

let tabs;
let generator;
let upgrades;
let playerStats;
let shop;

//displays available skill points
let pointPrompt;
let statSelectors = [];
let bottlecaps = 0;

//describes how many bottle caps the user gets per click
let clickInfo;

//rate of change to determine if the number of caps per click label needs to be changed.
let capROC = 1;

//bottle caps per frame (used when generating caps)
let bpf = 0;

//button that increases bottle caps.
let bottlecapButton;

//tracks time elapsed;
let timeElapsed = 0;

//shop variables
let passiveIncome = 0;
let armorResistance = 0;
let weaponStrength = 0;

let shopButtons;
let shopDescs;

//bottlecap indicator in game
let capIcon;
let capLabel;

//determines the loot multiplier -- the user will buy upgrades for this to upgrade
//the total loot given by enemies.
let lootMultiplier = 1;

let buyLootMultiplierButton;
let lootMultiplierNotif;

//sound effects
let hit;
let playerDamaged;
let criticalHit;
let error;
let success;
let mainTheme;
let cap;
let block;
let bossTheme;
let lowHealth;

let firstInit = true;

//stat information
let statInformationButton;

//background information --> Derived from Professor Chin's PIXI.JS tutorial series.
let bg;
let far;
let near;
let fg;

let bgX = 0;
let bgSpeed = 0.5;

//label to display the increase of bottlecaps to the player
let capIncreaseLabel;

window.addEventListener("load", init);

//initializes many of the critical properties of the game.
function init(){

    buttonArea = document.querySelector("div[class='buttons']");

    //decreases the height of the button area temporarily.
    buttonArea.style.height = "0%";
    //initializes the game window
    gameWindow = new PIXI.Application({
        width: 650,
        height: 300,
    });

    //init sound effects
    hit = new Howl({
        src: ['soundeffects/hurt.wav']
    });

    playerDamaged = new Howl({
        src: ['soundeffects/damage.wav']
    });

    error = new Howl({
        src: ['soundeffects/error.wav']
    });

    criticalHit = new Howl({
        src: ['soundeffects/critical.wav']
    });

    success = new Howl({
        src: ['soundeffects/success.mp3']
    });

    mainTheme = new Howl({
        src: ['soundeffects/main.mp3']
    });

    cap = new Howl({
        src: ['soundeffects/button.wav']
    });
    
    block = new Howl({
        src: ['soundeffects/block.wav']
    });

    bossTheme = new Howl({
        src: ['soundeffects/boss.mp3']
    });

    lowHealth = new Howl({
        src: ['soundeffects/low_health.wav']
    });

    //retrieves upgrade DOM elements, and main to temporarily
    //remove this section.
    upgradeArea = document.querySelector("div[id='main_controls']");

    let allButtons = Array.from(document.querySelectorAll("button"));

    allButtons.forEach(button=>{
        button.addEventListener("click", playButtonClick);
    })

    //button for upgrading
    buyLootMultiplierButton = document.querySelector("button[id='upgrader']");
    buyLootMultiplierButton.dataset.cost = "10000";
    buyLootMultiplierButton.dataset.multiplier = "1";

    //shop buttons init
    shopButtons = document.querySelectorAll("button[class='shop_button']");
    shopDescs = document.querySelectorAll("p[class='shop_desc']");
    initShopButtons();

    //text that shows the current loot multiplier.
    lootMultiplierNotif = document.querySelector("p[id='loot_num']");

    //information paragraphs about player stats
    dRange = document.querySelector("p[id='range']");
    regen = document.querySelector("p[id='regenerationRate']");

    loot = document.querySelector("p[id='lootRate']");
    encounterRate = document.querySelector("p[id='encounterRate']");

    atkChance = document.querySelector("p[id='attackChance']");

    resisted = document.querySelector("p[id='resistRate']");

    factoriesOwnedLabel = document.querySelector("p[id='factoriesOwned']");

    dodgeChance = document.querySelector("p[id='dodgeChance']");

    //initiates the boss button
    bossButton = document.querySelector("button[id='boss']");
    bossButton.onclick = onBossClick;   

    //removes the upgrade area TEMPORARILY.
    buttonArea.removeChild(upgradeArea);

    //tracks loading times 
    gameWindow.loader.onComplete.add(startGame);
    gameWindow.loader.baseUrl = "textures";
    gameWindow.loader
        .add("background", "bg.png")
        .add("hero", "Esquire.png")
        .add("farBuildings", "farBuildings.png")
        .add("foreground", "foreground.png")
        .add("nearBuildings", "nearBuildings.png")
        .add("enemies", "recycle_items.png")
        .add("cap", "cap.png")
        .add("slash", "slash.svg");
    gameWindow.loader.load();       
}

//creates the labels and buttons present on the instructions screen
function createInstructions(){
    let introduction = new Label(instructionsScreen, "Welcome to Bottle Knights!", width/2 - 35, 20, 30);
    introduction.createHeading();

    //objective text
    let objectiveText = new Label(instructionsScreen, "Your objective is to defeat the boss of all caps, El Capo.",
     10, 100, 30);
     objectiveText.createDescription();

     //description of task
     let task = new Label(instructionsScreen, "You will do so by strengthening your hero through\n his lackeys!",
     30, 150, 30);
     task.createDescription();

     continueButton = new Button(instructionsScreen, width/2 + 75, 250, "Continue");
     continueButton.assignEvent(goToStatTutorial);
     continueButton.assignEvent(playClick);
}

//explains the purposes of stats to the player.
function createStatDescriptions(){
    //heading to introduce stats
    let statIntroduction = new Label(statTutorialScreen, "Player Stats", width/2 + 70, 20, 30);
    statIntroduction.createHeading();

    //strength stat description
    let strengthNotif = new Label(statTutorialScreen, 
        "Strength: Increases damage dealt to enemies!", 90, 75, 20);
    strengthNotif.createDescription();

    //dexterity information
    let dexterityNotif = new Label(statTutorialScreen, 
        "Dexterity: Increases regeneration and kill loot!", 90, 105, 20);
    dexterityNotif.createDescription();

    //luck information
    let luckNotif = new Label(statTutorialScreen, 
        "Luck: Increases overall loot, dodge, and encounter chances!", 90, 140, 20);
    luckNotif.createDescription();

    //speed information
    let speedNotif = new Label(statTutorialScreen,
        "Speed: Increases hero's rate of attack!", 90, 170, 20);
    speedNotif.createDescription();

    //resistance information
    let resistanceNotif = new Label(statTutorialScreen,
        "Resistance: reduces incoming damage to the hero!", 90, 200, 20);
    resistanceNotif.createDescription();

    nextButton = new Button(statTutorialScreen, width/2 + 75, 250, "Onwards!");
    nextButton.assignEvent(checkName);
    nextButton.assignEvent(playClick);
}

//initializes mechanics present in the main portion of the game,
//such as the player information, DOM elements, and various logic pieces.
function mainInitialization(){
    if(gameScreen.visible){
        
        bossFightStarted = false;

        buttonArea.style.height = "75%";
        
        //resets indicators that linger after death.
        graphics.forEach(graphic => {
            graphic.removeLabel(gameScreen);
        })
        graphics = [];

        //pre -- remove unneccesary function execution
        gameWindow.ticker.remove(checkForStatIncreases);

        capIcon = PIXI.Sprite.from("textures/cap.png");
        capIcon.width = 50;
        capIcon.height = 50;
        capIcon.x = 5;
        capIcon.y = 130;
        gameScreen.addChild(capIcon);

        capLabel = new Label(gameScreen, " : 0", 50, 135, 30);
        capLabel.createDescription();

        //pre -- give the player values selected from skill points.
        player.updateStats(parseInt(strengthSelector.value),
            parseInt(dexteritySelector.value),
            parseInt(luckSelector.value),
            parseInt(speedSelector.value),
            parseInt(resistanceSelector.value));

        //pre -- add ground and player.
        gameWindow.stage.addChild(ground);
        gameScreen.addChild(player);
        player.x = 200;
        player.y = 250;

        //0 -- Instantiate UI elements in PIXI
        plrName = new Label(gameScreen, `${player.name}`,
                                    10, 15, 25);
        plrName.createHeading();
        player.healthBar.addtoSection(gameScreen);                         

        //1 -- Instantiate DOM elements
        buttonArea.appendChild(upgradeArea);

        //assigns values to the dynamic elements
    
        if(firstInit){
            //tab buttons
            upgradeButton = buttonArea.querySelector("button[id='bUpgrade']");
            generateButton = buttonArea.querySelector("button[id='bGenerate']");
            plrStatsButton = buttonArea.querySelector("button[id='bPlrStats']");
            shopButton = buttonArea.querySelector("button[id='bShop']");

            //generator elements
            bottlecapButton = document.querySelector("button[id='generator']");
            bottlecapButton.addEventListener("click", changeCapCount);

            clickInfo = document.querySelector("p[id='click_num']");

            //generator section that houses controls for the "generate" tab.
            generator = document.querySelector("div[id='generator_section']");
            upgrades = document.querySelector("div[id='character_upgrade']");    
            playerStats = document.querySelector("div[id='plrStats']");
            shop = document.querySelector("div[id='shop']");

            tabs = document.querySelector("div[id='tabs']");

            upgradeButton.addEventListener("click", switchModule);
            generateButton.addEventListener("click", switchModule);
            plrStatsButton.addEventListener("click", switchModule);
            shopButton.addEventListener("click", switchModule);
        }
        

        //updates the text for the multiplier upgrade
        updateUpgrader();
        //can the multiplier be upgraded?
        buyLootMultiplierButton.addEventListener("click", canUpgrade);

        initializeMenu();

        //enemy texture
        enemyTextureSheet = createSprites(2, 17, 0, 15, 60, 1, "textures/recycle_items.png");
        bossTextureSheet = createSprites(19, 17, 0, 40, 60, 1, "textures/recycle_items.png");
               
        //end -- go to game loop!
        gameWindow.ticker.add(gameLoop);

        mainTheme.play();
        mainTheme.loop(true);
        mainTheme.volume(0.15);
        
        

        firstInit = false;
    }

    updateAllButtons();
}

//runs code that initiates the
//game window
function startGame(e){

    width = gameWindow.view.width/2;
    height = gameWindow.view.height;

    game = gameWindow.stage;

    let gameArea = document.querySelector("div[id='game-place']");

    gameArea.appendChild(gameWindow.view);

    //initializes start screen
    startScreen = new PIXI.Container();
    game.addChild(startScreen);

    nameScreen = new PIXI.Container();
    nameScreen.visible = false;
    game.addChild(nameScreen);

    //initializes game screen
    gameScreen = new PIXI.Container();
    gameScreen.visible = false;
    game.addChild(gameScreen);

    //initializes game over scene
    endScreen = new PIXI.Container();
    endScreen.visible = false;
    game.addChild(endScreen);

    victoryScreen = new PIXI.Container();
    victoryScreen.visible = false;
    game.addChild(victoryScreen);

    instructionsScreen = new PIXI.Container();
    instructionsScreen.visible = false;
    game.addChild(instructionsScreen);

    statTutorialScreen = new PIXI.Container();
    statTutorialScreen.visible = false;
    game.addChild(statTutorialScreen);

    //loads web fonts
    WebFont.load({
        google: {
            families: ['Balthazar', 'MedievalSharp']
        }
    });
        
    createMainMenu();    
    createNameSelection();   
    createGameOver();
    createVictory();
    createInstructions();
    createStatDescriptions();

    gameWindow.stage.sortableChildren = true;
    //init background
    bg = createBackground(gameWindow.loader.resources["background"].texture);
    bg.zIndex = -99;

    far = createBackground(gameWindow.loader.resources["farBuildings"].texture);
    far.zIndex = -98;

    near = createBackground(gameWindow.loader.resources["nearBuildings"].texture);
    near.zIndex = -97;

    fg = createBackground(gameWindow.loader.resources["foreground"].texture);
    fg.zIndex = -96;
    
    gameWindow.ticker.add(doParallax);
}

//creates visuals present on the name selection
function createNameSelection(){
    
    let namePrompt = new Label(nameScreen, 
        "Customize your hero!", width/2 - 35, 50);
    namePrompt.createDescription();
    
    pointPrompt = new Label(nameScreen,
        `Available Skill Points: ${player.skillPoints}`, width/2 + 50, 200, 25);
    pointPrompt.createDescription();
}

//creates visuals present on the main menu.
function createMainMenu(){

    //creates the ground where the player stands on
    ground = new PIXI.Graphics();
 
    ground.beginFill(0x696969);
    ground.lineStyle(5, 0x00000, 1);
    ground.drawRect(-5, 0, 1000, 200);
    ground.endFill();
    ground.x = 0;
    ground.y = 245;
   
    gameWindow.stage.addChild(ground);
    ground.zIndex = -95;


    //creates player object
    player = new Player(100, 250, 2,
        createSprites(50, 5
            , 9, 25, 25, 6));
        startScreen.addChild(player);
    
    let gameLogo = new Label(startScreen, "Bottle Knights!", width/2, 50);
    gameLogo.createHeading();

    let startbutton = 
    new Button(startScreen, 
        width/2 + 40, 150, "Press to start!");
    
    startbutton.assignEvent(goToTutorial);
}  

//links the main screen to the tutorial screen
function goToTutorial(){
    
    gameWindow.ticker.remove(doParallax);
    startScreen.visible = false;
    instructionsScreen.visible = true;
}

//goes to the stats tutorial from the introduction
function goToStatTutorial(){
    instructionsScreen.visible = false;
    statTutorialScreen.visible = true;
}

//creates the game over screen when the player dies.
function createGameOver(){
    let gameOverText = new Label(endScreen, "Game Over", width/2 + 30, 25);
    gameOverText.createHeading();


    let slainMessage = new Label(endScreen, `Your hero was slain....`, width/2 + 15, 125, 35);
    slainMessage.createDescription();
    let tryAgain = new Button(endScreen, width/2 + 75, 175, "Try Again");
    tryAgain.assignEvent(checkName);
    tryAgain.assignEvent(playClick);
    player.healthBar.removeFromSection(gameScreen);
}

//creates victory screen assets.
function createVictory(){
    let victoryText = new Label(victoryScreen, "Victory!", width/2 + 75, 100);
    victoryText.createHeading();

    let tryAgain = new Button(victoryScreen, width/2 + 75, 175, "Try Again");
    tryAgain.assignEvent(checkName);
    tryAgain.assignEvent(playClick);
}

//resets all variables used in the run
function resetVariables(){
    bottlecaps = 0;
}

//checks if the user's name is accurate (will not take away
//unused skill points, which can be used later...)
function checkName(){
    statTutorialScreen.visible = false;
    buttonArea.style.height = "100%";
 
    endScreen.visible = false;
    victoryScreen.visible = false;

    gameWindow.ticker.add(checkForStatIncreases);

    //creates player object (resets from game over)
    player = new Player(100, 250, 2,
        createSprites(50, 5
            , 9, 25, 25, 6));
        startScreen.addChild(player);

    
    if(promptArea == null){
        //DOM elements created to allow the user to enter their character's name!
        promptArea = document.querySelector("div[id='confirm']");
        warning = promptArea.querySelector("h2");
    }
    else{
        resetDisplay(buttonArea);
        buttonArea.appendChild(promptArea);
    }

    warning.innerHTML = "Enter your hero's name!"
    warning.style.color = "black";

    promptArea.style.visibility = "visible";
    //adds the player to this screen
    nameScreen.addChild(player);

    //repositions the player
    player.x = width + 13;
    player.y = height / 2;

    //creates a new animation for the player.
    player.idle();
    startScreen.visible = false;
    nameScreen.visible = true;

    if(submitButton == null){
        
        submitButton = document.querySelector("button[id='confirm_button']");
        nameArea = document.querySelector("input[id='name_area']");

        //establishes information for skill selectors,
        //adds themm to an array so they can be modified easily
        strengthSelector = document.querySelector("input[id='strength']");
        strengthSelector.addEventListener("change", playClick);
        statSelectors.push(strengthSelector);

        dexteritySelector = document.querySelector("input[id='dexterity']");
        dexteritySelector.addEventListener("change", playClick);
        statSelectors.push(dexteritySelector);

        luckSelector = document.querySelector("input[id='luck']");
        luckSelector.addEventListener("change", playClick);
        statSelectors.push(luckSelector);

        speedSelector = document.querySelector("input[id='speed']");
        speedSelector.addEventListener("change", playClick);
        statSelectors.push(speedSelector);

        resistanceSelector = document.querySelector("input[id='resistance']");
        resistanceSelector.addEventListener("change", playClick);
        statSelectors.push(resistanceSelector);

        submitButton.addEventListener("click", submitName);
    }   
}

//runs every frame (on the player creation screen)
//to ensure the player only uses the skill points they have.
function checkForStatIncreases(){
    let total = 0;
    statSelectors.forEach(stat => {  
        total += parseInt(stat.value);   
    })

    //if total is reached, do not allow the user
    //to go over.
    if(total == player.startingSkillPoints){
        statSelectors.forEach(stat =>{
            stat.setAttribute("max", stat.value);
        })
    }
    else{
        statSelectors.forEach(stat =>
            stat.setAttribute("max", player.startingSkillPoints));
    }
        
    player.skillPoints = parseInt(player.startingSkillPoints-total);

    pointPrompt.resetText(`Available Skill Points: ${player.skillPoints}`); 
}

//checks if the user submitted a correct name!
function submitName(e){
    let name = `${nameArea.value}`;
    if(name.length > 0){
        player.name = nameArea.value;
        nameScreen.visible = false;
        gameScreen.visible = true;

        //removes prompts from the button area
        resetDisplay(buttonArea);
        mainInitialization();
    }
    //something was wrong with the user's name!
    else{
        cap.stop();
        error.play();

        warning.innerHTML = "Invalid name!";
        warning.style.color = "red";
    }
}

//creates the idle sprites, which are passed into 
//the player as the base animateion
function createSprites(x, y, yStep = 9, texWidth, texHeight,
    numFrames, spriteLocation = "textures/Esquire.png"){
      
    let baseTexture = PIXI.BaseTexture.from(spriteLocation);
    let sprites = [];   

    //loads textures (stored in columns)
    for(let i=0; i < numFrames; i++){
        let frame = new PIXI.Texture(baseTexture, 
            new PIXI.Rectangle(x, i * ((y + texHeight)), texWidth, texHeight));
        sprites.push(frame);
    }

    return sprites;
} 
    
//removes ALL children of an element
function resetDisplay(display){
    //resets the display.
    while(display.firstChild != undefined){
        display.removeChild(display.firstChild)
    } 
}

//generates bottle caps for the player to use.
function generateCaps(){
    if(player.enemiesKilled % 2 == 0){
        let newROC = 1 + 5*player.enemiesKilled;
        capROC = newROC;       
    }
    clickInfo.innerHTML = "Number of caps per click: " + capROC * lootMultiplier;  
}

//changes the number of caps in the user's possession
//after they click the generate caps button
function changeCapCount(){
    bottlecaps += capROC * lootMultiplier;
    capIncreaseLabel = new Label(gameScreen, `+${capROC * lootMultiplier}`, 100, 120, 30);
    graphics.push(capIncreaseLabel);
    capIncreaseLabel.createGraphic(capIcon.x + 10);
    capIncreaseLabel.label.zIndex = 1000000000;
}

//plays a clicking sound effect when the user presses a button
function playButtonClick(){
    cap.play();
}

//creates the background seen in game.
function createBackground(texture){
    let tiling = new PIXI.TilingSprite(texture, 800, 300);
    tiling.position.set(0,0);   
    gameWindow.stage.addChild(tiling);
    tiling.height = 300;
    tiling.tileScale.y = 2.35;
    return tiling;
}
//scrolls tbe parallax background to simulate the player moving
function doParallax(){
    bgX = (bgX - bgSpeed);
    fg.tilePosition.x = bgX;
    near.tilePosition.x = bgX/2;
    far.tilePosition.x = bgX/4;
    bg.tilePosition.x = bgX/8;
}

//plays a clicking sound effect when something is selected
function playClick(e){
    cap.play();
}