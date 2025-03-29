//CONSTANTS
//GENERAL
const FULL_CIRCLE_RADIANS = 2 * Math.PI
//SHIP
const SHIP_BODY_RADIUS = 20;
const EYE_RADIUS = 4;
const EYE_OFFSET_X = 8;
const EYE_OFFSET_Y = 5;
const MOUTH_RADIUS = 9;
const MOUTH_OFFSET_Y = 5;
const GUN_WIDTH = 15;
const GUN_HEIGHT = 10;
const GUN_OFFSET_X = 20;
const GUN_BARREL_WIDTH = 3;
const GUN_BARREL_OFFSET_X = 31;
const FLAME_LENGTH = 30;
const FLAME_HEIGHT = 15;
const FLAME_OFFSET = 35;
const VELOCITY_SLOWING = 0.9;
const VELOCITY_SPEED = 8;
const ROTATION_SPEED = 0.2;
const SHIP_EXPLODE_DURATION = 3000;

//ASTEROID
const MIN_SIDES = 5;
const MAX_SIDES = 10;
const STROKE_COLOR = "white";

//BULLET
const BULLET_RADIUS = 3;
const HEART_SIZE = 10;
const HEART_COLOR = "white";

const bullets = []
const asteroids = []
let asteroidsKilled = 0
let lostLives = 0

const isKeyPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
}

//CANVAS DEFINITION
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height)

// CLASS COMPONENTS DEFINITION
class Ship {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.rotation = 0;
        this.radius = SHIP_BODY_RADIUS;
        this.exploding = false;
        this.explosionStartTime = null;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x, -this.position.y);

        // body
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, SHIP_BODY_RADIUS, 0, FULL_CIRCLE_RADIANS);
        ctx.fillStyle = "#ff66b2";
        ctx.fill();
        ctx.closePath();

        // Left eye
        ctx.beginPath();
        ctx.arc(this.position.x - EYE_OFFSET_X, this.position.y - EYE_OFFSET_Y, EYE_RADIUS, 0, FULL_CIRCLE_RADIANS);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        // Right eye
        ctx.beginPath();
        ctx.arc(this.position.x + EYE_OFFSET_X, this.position.y - EYE_OFFSET_Y, EYE_RADIUS, 0, FULL_CIRCLE_RADIANS);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        // Mouth
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y + MOUTH_OFFSET_Y, MOUTH_RADIUS, 0, Math.PI);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Gun
        ctx.beginPath();
        ctx.rect(this.position.x + GUN_OFFSET_X, this.position.y - GUN_HEIGHT / 2, GUN_WIDTH, GUN_HEIGHT);
        ctx.fillStyle = "gray";
        ctx.fill();
        ctx.closePath();

        // Gun barrel
        ctx.beginPath();
        ctx.moveTo(this.position.x + GUN_BARREL_OFFSET_X, this.position.y);
        ctx.lineTo(this.position.x + GUN_BARREL_OFFSET_X + GUN_BARREL_WIDTH, this.position.y);
        ctx.lineWidth = GUN_BARREL_WIDTH;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // draw a flame when ArrowUp is pressed
        if (isKeyPressed.ArrowUp) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.moveTo(-FLAME_OFFSET, -FLAME_HEIGHT / 2);
            ctx.lineTo(-FLAME_OFFSET - FLAME_LENGTH, 0);
            ctx.lineTo(-FLAME_OFFSET, FLAME_HEIGHT / 2);
            ctx.lineTo(-FLAME_OFFSET, -FLAME_HEIGHT / 2);
            ctx.closePath();
            ctx.fillStyle = "orange";
            ctx.fill();
            ctx.restore();
        }

        if (ship.exploding) {
            if (!this.explosionStartTime) {
                this.explosionStartTime = Date.now();
            }
            //STOP SHIP
            this.velocity.x = 0
            this.velocity.y = 0;

            //DRAW EXPLOSION
            const elapsedTime = Date.now() - this.explosionStartTime;
            const initialRadius = this.radius + 40;
            const maxRadius = this.radius + 40;
            const currentRadius = initialRadius + (elapsedTime / SHIP_EXPLODE_DURATION) * maxRadius;
            const alpha = 1 - (elapsedTime / SHIP_EXPLODE_DURATION);

            const gradient = ctx.createRadialGradient(
                this.position.x, this.position.y, 0,
                this.position.x, this.position.y, currentRadius
            );
            gradient.addColorStop(0, `rgba(255, 255, 0, 1)`);
            gradient.addColorStop(0.5, `rgba(255, 0, 0, 1)`);
            gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, currentRadius, 0, FULL_CIRCLE_RADIANS);
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.closePath();

            if (Date.now() - this.explosionStartTime > SHIP_EXPLODE_DURATION) {
                this.exploding = false;
                this.explosionStartTime = null;
            }
        }
    }
}

class Asteroid {
    constructor({ctx, position, velocity, radius}) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.sides = Math.floor((Math.random() * (MAX_SIDES - MIN_SIDES + 1)) + MIN_SIDES);
        this.angle = Math.random() * FULL_CIRCLE_RADIANS;
        this.jag = Math.random();
        this.offset = this.createOffsetArray(this.jag);
    }

    createOffsetArray(jag) {
        const offset = [];
        for (let i = 0; i < this.sides; i++) {
            offset.push(Math.random() * jag * 2 + 1 - jag);
        }
        return offset;
    }

    draw() {
        const startX = this.position.x + Math.cos(this.angle) * this.radius * this.offset[0];
        const startY = this.position.y + Math.sin(this.angle) * this.radius * this.offset[0];
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        for (let i = 1; i < this.sides; i++) {
            const x = this.position.x + Math.cos(this.angle + i * (FULL_CIRCLE_RADIANS / this.sides)) * this.radius * this.offset[i];
            const y = this.position.y + Math.sin(this.angle + i * (FULL_CIRCLE_RADIANS / this.sides)) * this.radius * this.offset[i];
            ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = STROKE_COLOR;
        this.ctx.stroke();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Wrap around the canvas edges
        if (this.position.x < -this.radius) this.position.x = canvas.width + this.radius;
        if (this.position.x > canvas.width + this.radius) this.position.x = -this.radius;
        if (this.position.y < -this.radius) this.position.y = canvas.height + this.radius;
        if (this.position.y > canvas.height + this.radius) this.position.y = -this.radius;
    }
    split() {
        for (let i = 0; i < 2; i++) {
            const asteroid = new Asteroid({
                ctx,
                position: {x: this.position.x, y: this.position.y},
                velocity: {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1},
                radius: this.radius / 2
            })
            asteroids.push(asteroid)
        }

    }
}

class Bullet {
    constructor({ctx, position, velocity }) {
        this.ctx = ctx;
        this.position = position;
        this.velocity = velocity;
        this.radius = BULLET_RADIUS;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.bezierCurveTo(
            this.position.x - HEART_SIZE / 2, this.position.y - HEART_SIZE / 2,
            this.position.x - HEART_SIZE, this.position.y + HEART_SIZE / 3,
            this.position.x, this.position.y + HEART_SIZE
        );
        this.ctx.bezierCurveTo(
            this.position.x + HEART_SIZE, this.position.y + HEART_SIZE / 3,
            this.position.x + HEART_SIZE / 2, this.position.y - HEART_SIZE / 2,
            this.position.x, this.position.y
        );
        this.ctx.closePath();
        this.ctx.fillStyle = HEART_COLOR;
        this.ctx.fill();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//GAME LOGIC
const ship = new Ship({
    ctx,
    position: {x: canvas.width / 2, y: canvas.height / 2},
    velocity: {x: 0, y: 0},
})

function handleKeyPressEvents() {
    if (ship.exploding) return
    if (isKeyPressed.ArrowUp) {
        ship.velocity.x = Math.cos(ship.rotation) * VELOCITY_SPEED
        ship.velocity.y = Math.sin(ship.rotation) * VELOCITY_SPEED

        //Move ship to other side if out of canvas
        if (ship.position.x < 0) ship.position.x = canvas.width
        if (ship.position.x > canvas.width) ship.position.x = 0
        if (ship.position.y < 0) ship.position.y = canvas.height
        if (ship.position.y > canvas.height) ship.position.y = 0

    } else if (!isKeyPressed.ArrowUp) {
        ship.velocity.x *= VELOCITY_SLOWING
        ship.velocity.y *= VELOCITY_SLOWING
    }
    if (isKeyPressed.ArrowRight) ship.rotation += ROTATION_SPEED
    if (isKeyPressed.ArrowLeft) ship.rotation -= ROTATION_SPEED
    if (isKeyPressed.Space) {
        bullets.push(new Bullet({
            ctx,
            position: {x: ship.position.x + Math.cos(ship.rotation) * 30, y: ship.position.y + Math.sin(ship.rotation) * 30},
            velocity: {x: Math.cos(ship.rotation) * 8, y: Math.sin(ship.rotation) * 8}
        }))
        isKeyPressed.Space = false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawKilledAsteroidsText(asteroidsKilled)
    drawLostLivesText(lostLives)
    handleKeyPressEvents()

    ship.update()

    for(let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update()

        //Remove bullets that are out of canvas
        if (bullets[i].position.x < 0
            || bullets[i].position.x > canvas.width
            || bullets[i].position.y < 0
            || bullets[i].position.y > canvas.height) {
            bullets.splice(i, 1)
        }
    }

    for(let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update()
        //ON SHIP COLLISION
        if(isObjectCollision(ship, asteroids[i])) {
            if (ship.exploding) return
            ship.velocity.x = 0
            ship.exploding = true
            lostLives++
            setTimeout(() => {
                ship.exploding = false;
            }, 3000)
        }

        for(let j = bullets.length - 1; j >= 0; j--) {
            //ON SHOT ASTEROID WITH BULLET
            if (isObjectCollision(bullets[j], asteroids[i])) {
                bullets.splice(j, 1)
                if (asteroids[i].radius > 40) {
                    asteroids[i].split()
                } else {
                    asteroidsKilled++
                }
                asteroids.splice(i, 1)
            }
        }

        if (!asteroids[i]) return
    }
}

animate()
ship.draw()

//EVENTS
const intervalId = window.setInterval(() => {
    const asteroidRadius =  (Math.random() + 50) + 20
    const asteroidCoordinates = createAsteroidCoordinate(Math.floor(Math.random() * 4), asteroidRadius)
    const asteroid = new Asteroid({
        ctx,
        position: {
            x: asteroidCoordinates.x,
            y: asteroidCoordinates.y
        },
        velocity: {
            x: asteroidCoordinates.vx * Math.random() * 1.3,
            y: asteroidCoordinates.vy * Math.random() * 1.3
        },
        radius: asteroidRadius
    })
    asteroids.push(asteroid)
},2500)
document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "ArrowUp":
            isKeyPressed.ArrowUp = true
            break;
        case "ArrowLeft":
            isKeyPressed.ArrowLeft = true
            break;
        case "ArrowRight":
            isKeyPressed.ArrowRight= true
            break;
        case " ":
            isKeyPressed.Space= true
            break;
    }
});
document.addEventListener("keyup", (event) => {
    switch(event.key) {
        case "ArrowUp":
            isKeyPressed.ArrowUp = false
            break;
        case "ArrowLeft":
            isKeyPressed.ArrowLeft = false
            break;
        case "ArrowRight":
            isKeyPressed.ArrowRight= false
            break;
    }
});

function createAsteroidCoordinate (index, asteroidRadius){
    let x, y
    let vx, vy
    switch(index) {
        case 1: //left to right
            x = 0 - asteroidRadius
            y = Math.random() * canvas.height
            vx = 3
            vy = 0
            break;
        case 2: //right to left
            x = canvas.width + asteroidRadius
            y = Math.random() * canvas.height
            vx = -3
            vy = 0
            break;
        case 3: //top to bottom
            x = Math.random() * canvas.width
            y = 0 - asteroidRadius
            vx = 0
            vy = 3
            break;
        case 4: //bottom to top
            x = Math.random() * canvas.width
            y = canvas.height + asteroidRadius
            vx = 0
            vy = -3
            break;
    }
    return {x, y, vx, vy}
}

//COLLISION DETECTION
function isObjectCollision(obj1, obj2) {
    if (!obj1 || !obj2 || ship.exploding) {
        return false
    }
    const xDistance = obj1.position.x - obj2.position.x
    const yDistance = obj1.position.y - obj2.position.y
    const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
    if (distance <= obj1.radius + obj2.radius) {
        return true
    }
}

//TEXT HELPERS
function drawGameOverText() {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game over", canvas.width / 2, canvas.height / 2);
}

function drawKilledAsteroidsText(numOfAsteroids) {
    const killedAsteroidsString = numOfAsteroids.toString() || "0"
    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.textAlign = "right"
    ctx.fillText("ASTEROIDS DESTROYED: " + killedAsteroidsString, canvas.width - 30,  30);
}

function drawLostLivesText(numOfLostLifes) {
    const numOfLostLivesString = numOfLostLifes.toString() || "0"
    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.textAlign = "right"
    ctx.fillText("LOST LIVES: " + numOfLostLivesString , canvas.width - 30,  55);
}