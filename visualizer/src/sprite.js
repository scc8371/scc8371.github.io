import * as utils from './utils.js';

let canvas = document.querySelector('canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

class Sprite{
    constructor(path, x, y, width, height){
        this.path = path;

        //makes a new image based on the path given to the constructor
        this.image = new Image();
        this.image.src = path;
        
        this.x = x;
        this.y = y;

        this.rotation = 0;
        this.scale = 0;

        this.width = width;
        this.height = height;
        this.globalAlpha = 1;
        this.velocityX = 0;
        this.velocityY = 0;

        this.updatePosition();
    }

    update(audioData){
        //Come back here later and make some improvements!
        this.scale = utils.scale(audioData);

        //take the average of the audio data and use it to rotate the sprite, divide it by 2550 to get a smaller number so it doesnt rotate too fast
        this.rotation += utils.average(audioData) / 2550;
        this.globalAlpha =  0.1 + utils.average(audioData) / 50;

        //update position based on velocity/angle
        this.x += this.velocityX;
        this.y += this.velocityY;

        if(this.x < -50 || this.x > canvasWidth + 50 || this.y < -50 || this.y > canvasHeight + 50){
            this.updatePosition();
        }

    }

    draw(ctx){
        ctx.save();
        ctx.globalAlpha = this.globalAlpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

        
    }

    updatePosition(){
        this.randomPos();
        this.generateTrajectory();
    }

    randomPos(){
        //gets a new random position for the sprite outside of the canvas
        this.x = Math.random() < 0.5 ? -50 : canvasWidth + 50;
        this.y = Math.random() < 0.5 ? -50 : canvasHeight + 50;
    }

    generateTrajectory(){
        //generates a random angle and speed for the sprite to move towards the center of the canvas
        let angle = Math.random() * 60 - 30;
        let speed = Math.random() * 5 + 1;
        this.velocityX = Math.cos(angle * Math.PI / 180) * speed;
        this.velocityY = Math.sin(angle * Math.PI / 180) * speed;
        //if the sprite is to the right of the canvas, reverse the x velocity
        if(this.x > canvasWidth/2){
            this.velocityX *= -1;
        }
        //if the sprite is below the canvas, reverse the y velocity
        if(this.y > canvasHeight/2){
            this.velocityY *= -1;
        }
    }
}

export {Sprite};