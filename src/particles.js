

const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let scrollVel = 0;
let scrolling = false;
let prevY = window.scrollY;

let particleColor = "#FFFFF0";
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
    scrollVel += diff / 500;
    scrolling = true;

    prevY = scrollY;

    clearTimeout(window.isScrollingTimeout)

    window.isScrollingTimeout = setTimeout(function () {
        scrolling = false;
    }, 1);
});

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.moveTo(this.x + this.size / 2, this.y);
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = particleColor;
    }

    //update fn for particles -- used to move randomly + repel from mouse.
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

        const REPEL_SPEED = 0.1;

        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += REPEL_SPEED;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= REPEL_SPEED;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += REPEL_SPEED;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= REPEL_SPEED;
            }
        }

        //move other particles not being affected by the mouse
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    //Doesn't render if we are on a mobile device -- for performance reasons.
    if (isMobile.any()) return;
    particles = [];
    let numParticles = 50 + (canvas.height * canvas.width) / 5000;
    //caps the num of particles to prevent lag at larger resolutions. 
    numParticles = Math.min(numParticles, 500);

    const WEIGHT = 5;

    for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * WEIGHT) + 1;
        let x = (Math.random() * ((innerWidth - size * WEIGHT) - (size * WEIGHT)) + size);
        let y = (Math.random() * ((innerHeight - size * WEIGHT) - (size * WEIGHT)) + size);

        let directionX = ((Math.random()) - .5) / 10;
        let directionY = ((Math.random()) - .5) / 10;

        let color = '#000000';

        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function anim() {
    if (isMobile.any()) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.beginPath();

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    ctx.fill();
    ctx.closePath();
}

init();
setInterval(anim, 10);
