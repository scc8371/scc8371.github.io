//holds information for the player object used in game.
class Player extends PIXI.AnimatedSprite{

    constructor(x=0, y=0, scale=1, sprites){
        super(sprites);
   
        this.width = width; 
        this.height = height;

        this.health = 100;
        this.maxHealth = this.health;
        
        
        //determines the effectiveness of gear
        this.dexterity = 0;
        //determines the rate of the player's attack
        this.speed = 0;
        //determines the cost-effectiveness of gear
        this.luck = 0;
        //determines the effectiveness of weapons
        this.strength = 0;
        //determines how much the player resists attacks
        this.resistance = 0;

        this.overallStats = [this.strength, this.dexterity, this.luck, this.speed, this.resistance];

        //Skill points and level --> when the player levels up, they
        //recieve more skill points!
        this.level = 1;
        this.skillPoints = 10;
        this.startingSkillPoints = this.skillPoints;

        this.name = "";

        this.healthBar = new Healthbar(20, 70, this.health);

        //anchors the sprite
        this.anchor.set(.5, .5);
        this.scale.set(scale);
        this.x = x;
        this.y = y;    
        
        super.play();
        super.loop = true;
        super.animationSpeed = 0.1;

        //effective stats using the skills listed above

        //formula for calculating effective strength
        this.eStrength = Math.round(this.damage + (Math.random() * this.strength));

        //effective luck will be done later when kill loot is updated

        //enemy stats
        this.enemiesKilled = 0;

        //animation
        this.isRunning = false;

        this.isCheering = false;
        this.isDamaged = false;

        this.isAttacking = false;

        this.isBlocking = false;

        this.isIdling = false;

    }

    //stops current animation.
    stopAnimation(){
        super.loop = false;
        super.stop();
    }

    //starts the player animation (if needed)
    startAnimation(){
        super.loop = true;
        super.play();
    }

    //plays the attack animation of the player.
    attackAnimation(){
        this.textures = createSprites(169, 7, 9, 28, 25, 2);
        this.play();
    }

    //updates list of stats
    updateStats(strength = 0, dexterity = 0, luck = 0, speed = 0, resistance = 0){
        this.strength = strength;
        this.dexterity = dexterity;
        this.luck = luck;
        this.speed = speed;
        this.resistance = resistance;
        
        this.overallStats  = [this.strength, this.dexterity, this.luck, this.speed, this.resistance];     
    }

    //plays the player block animation 
    block(){
        this.textures = createSprites(132, 7, 9, 28, 25.1, 1);
        this.play;

        block.volume(0.5);
        block.play();
    }

    //plays hurt animation
    hurt(){
        this.textures = createSprites(213, 9, 9, 28, 25.1, 1);
        this.play();
        
        playerDamaged.volume(0.3);
        playerDamaged.play();
    }
    
    
    //debug command to kill the player
    die(){
        player.health = 0;
    }

    //plays when the character defeats an enemy.
    cheer(){
        let numFrames = 1;
        //cheer sprite.
        this.textures = createSprites(92, 8, 9, 28, 25.1, 1);
        this.play();
        success.play();
    }

    //performs an idle animation
    idle(){
        this.textures = createSprites(9, 5, 9, 28, 25.1, 4);
        this.play();
        let numFrames = 4;
    }

    //attacks an enemy, reducing it's health.
    attack(enemy){
        let damageDealt = Math.max(parseInt((1 + weaponStrength) * Math.random() * 
        ((this.strength + 1) * (1 + weaponStrength))), 1);
        enemy.health -= parseInt(damageDealt);

        //ensures the enemy cant have negative health.
        if(enemy.health < 0){
            enemy.health = 0;
        }

        let eDamageText = new Label(gameScreen, `- ${damageDealt}`, 0, 200, 24);

        //plays sound effect
        if(damageDealt > enemy.maxHealth / 3){

            //also, queues a visual notification to the user.
            let eDamageText = new Label(gameScreen, `Critical Hit!`, 0, 175, 16);
            graphics.push(eDamageText);
            eDamageText.createGraphic(player.x - 12);

            criticalHit.volume(0.3);
            criticalHit.play();
            eDamageText.label.style.fill = 0xFF0000;
        }
        else{
            hit.volume(0.3);
            hit.play();
        }
        
        //updates health bar.
        enemy.healthBar.redrawEntire(enemy.health, enemy.maxHealth);

        let numFrames = 2;

        //visually shows how much damage was dealt
        
        graphics.push(eDamageText);
        eDamageText.createGraphic((enemy.x - 12) + 24 * Math.random());       
    }

    //plays walking animation
    walk(){
        this.textures = createSprites(50, 5, 9, 25, 25, 6);
        this.play();      
        let numFrames = 6;
    }

    //increases the stats of the player
    levelUp(strength, dexterity, luck, speed, resistance){
        let numFrames = 1;

        //increases stats!
        player.strength = parseInt(strength);
        player.dexterity = parseInt(dexterity);
        player.luck = parseInt(luck);
        player.speed = parseInt(speed);
        player.resistance = parseInt(resistance);
    }
}