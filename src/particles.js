

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
        this.preScrollX = x;
        this.preScrollY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = particleColor;
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

function changeParticleColor(color) {
    particleColor = color;
}

function init() {

    if (isMobile.any()) return;

    particles = [];

    let numParticles = 50 + (canvas.height * canvas.width) / 5000;

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
    if (isMobile.any()) return;
    requestAnimationFrame(anim);
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
                let color = hexToRGB(particleColor, opacity);
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);



                ctx.closePath();

                ctx.stroke();
            }
        }
    }
}

init();
anim();

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export { changeParticleColor };