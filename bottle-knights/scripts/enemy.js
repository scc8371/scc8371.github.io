
//enemy object that is pitted against the player!
class Enemy extends PIXI.Sprite{
    constructor(x, y, scale, sprite){
        super(sprite);
        this.x = x;
        this.y = y;

        //levels up enemies after every 3 enemies defeated.
        this.level = Math.round(Math.max((player.enemiesKilled / 2), 1));
        this.scale.set(scale);
        this.anchor.set(.5, .5);

        if(!bossFightStarted){      

        //health scales with level!
        this.health = Math.round(Math.pow((10 * parseInt(this.level)), 1.20));
        this.maxHealth = this.health;

        this.damage = (this.level * 2) + 1;

        this.nameTitle = new Label(gameScreen, `Bottle  - LVL ${this.level}`, 500, 20, 20);
        this.nameTitle.createHeading();
        
        }

        //boss battle is active! load boss stats!
        else{
            this.health = 3500;
            this.maxHealth = this.health;
            this.damage = 65;
            this.nameTitle = new Label(gameScreen, `El Capo`, 525, 20, 20);
            this.nameTitle.createHeading();
        }

        //used to animate the enemy
        this.animStep = 0;

        this.healthBar = new Healthbar(520, 70, this.health);
        
    }

    //bobs the enemy up and down
    bobAnim(){

        this.y += 0.1 * Math.sin(this.animStep);
        this.x += 0.5 * Math.cos(this.animStep);
        this.animStep += 0.05;

        //resets animation y step if it gets too big.
        if(this.animStep >= 100){
            this.animStep = 0;
        }
    }

    //removes the enemy from the screen, sets the active enemy to null.
    die(){
        gameScreen.removeChild(this);
        this.healthBar.removeFromSection(gameScreen);
        this.nameTitle.removeLabel(gameScreen);
        enemy = null;
    }

    //attacks the player..
    //HOWEVER, the player has a small chance to dodge the attack!
    attack(player){

        let dodgeChance = (Math.random() * 200 - player.luck);

        if(dodgeChance <= 1){
            player.isBlocking = true;
            player.block();
            
            let dodgedText = new Label(gameScreen, "Dodged!", 0, 200, 16);
            graphics.push(dodgedText);
            dodgedText.createGraphic((player.x - 12) + 24 * Math.random());

            return 0;
        }
        else{
            //applies player resistance in taking damage.
            let totalDamage = parseInt(this.damage - ((player.resistance) * (1 + armorResistance)));

            let pDamageText = new Label(gameScreen, `- ${totalDamage}`, 0, 200, 24);
            graphics.push(pDamageText);

            if(totalDamage < 1){
                totalDamage = 0;
                player.isBlocking = true;
                player.block();

                let shieldedText = new Label(gameScreen, "Shielded!", 0, 200, 16);
                graphics.push(shieldedText);
                shieldedText.createGraphic((player.x - 12) + 24 * Math.random());
                return 0;
            }

            player.health -= totalDamage;
            pDamageText.createGraphic((player.x - 12) + 24 * Math.random())

            //puts the player's health to 0 if it is less than 0
            if(player.health < 0){
                player.health = 0;
            }

            player.hurt();
            player.healthBar.redrawEntire(player.health, player.maxHealth);
            return totalDamage;
        }
        
    }
}