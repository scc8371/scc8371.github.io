const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let scrollVel = 0;
let scrolling = false;
let prevY = window.scrollY;

let particles;

let mouse = {
    x: 0,
    y: 0,
    radius: (canvas.height / 120) * (canvas.width / 120)
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
})

window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 120) * (canvas.width / 120);
    init();
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;

})

window.addEventListener('scroll', (e) => {
    let scrollY = window.scrollY;

    let diff = prevY - scrollY;
    console.log(diff);
    scrollVel += diff / 500;
    scrolling = true;

    prevY = scrollY;

    clearTimeout(window.isScrollingTimeout)

    window.isScrollingTimeout = setTimeout(function() {
        scrolling = false;
    }, 1);
})


class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.preScrollX = x;
        this.preScrollY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FFFFF0';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        //check if the particle is still within the bounds of the canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        //circular collision detection with mouse cursor
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 1;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 1;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 1;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 1;
            }
        }

        //move other particles not being affected by the mouse
        this.x += this.directionX;
        this.y += this.directionY;


        for (let particle of particles) {
            particle.y -= scrollVel;
        }
        scrollVel *= 0.95;

        if (!scrolling) {
            if (Math.abs(this.preScrollY - this.y) < 3) {
                this.preScrollX = this.x;
                this.preScrollY = this.y;

            }

            else if (this.y != this.preScrollY) {
                this.x += (this.preScrollX - this.x) * 0.1;
                this.y += (this.preScrollY - this.y) * 0.1;
            }
            

        }


        this.draw();
    }
}

function init() {
    particles = [];

    let numParticles = (canvas.height * canvas.width) / 5000;

    //caps the num of particles to prevent lag at larger resolutions. 
    numParticles = Math.min(numParticles, 1000);

    for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

        let directionX = (Math.random() * 1) - .5;
        let directionY = (Math.random() * 1) - .5;

        let color = '#000000';

        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function anim() {
    requestAnimationFrame(anim);

    console.log(scrolling);

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    connect();
}

function connect() {
    let opacity = 1;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let dist = ((particles[i].x - particles[j].x) * (particles[i].x - particles[j].x))
                + ((particles[i].y - particles[j].y) * (particles[i].y - particles[j].y));

            if (dist < (canvas.width / 10) * (canvas.height / 15)) {
                opacity = 1 - (dist / 10000);
                ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();

            }
        }
    }
}

init();
anim();