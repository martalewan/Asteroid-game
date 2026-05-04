import { createInput } from "./game/input";
import type { KeyMap, Vec2 } from "./game/state";

export function startGame(canvas: HTMLCanvasElement) {
    // =========================
    // CONSTANTS
    // =========================
    const FULL_CIRCLE_RADIANS = 2 * Math.PI;

    // SHIP
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

    // ASTEROID
    const MIN_SIDES = 5;
    const MAX_SIDES = 10;
    const STROKE_COLOR = "white";

    // BULLET
    const BULLET_RADIUS = 3;
    const HEART_SIZE = 10;
    const HEART_COLOR = "white";

    // =========================
    // STATE
    // =========================
    const bullets: any[] = [];
    const asteroids: any[] = [];

    let asteroidsKilled = 0;
    let lostLives = 0;

    const input = createInput();
    input.bind();

    // =========================
    // CANVAS
    // =========================
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // =========================
    // SHIP
    // =========================
    class Ship {
        position: Vec2;
        velocity: Vec2;
        rotation: number;
        radius: number;
        exploding: boolean;
        explosionStartTime: number | null;

        constructor({ position, velocity }: { position: Vec2; velocity: Vec2 }) {
            this.position = position;
            this.velocity = velocity;
            this.rotation = 0;
            this.radius = SHIP_BODY_RADIUS;
            this.exploding = false;
            this.explosionStartTime = null;
        }

        draw(): void {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this.position.x, -this.position.y);

            // BODY
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, SHIP_BODY_RADIUS, 0, FULL_CIRCLE_RADIANS);
            ctx.fillStyle = "#ff66b2";
            ctx.fill();
            ctx.closePath();

            // EYES
            ctx.beginPath();
            ctx.arc(this.position.x - EYE_OFFSET_X, this.position.y - EYE_OFFSET_Y, EYE_RADIUS, 0, FULL_CIRCLE_RADIANS);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.position.x + EYE_OFFSET_X, this.position.y - EYE_OFFSET_Y, EYE_RADIUS, 0, FULL_CIRCLE_RADIANS);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();

            // MOUTH
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y + MOUTH_OFFSET_Y, MOUTH_RADIUS, 0, Math.PI);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            // 🔥 GUN
            ctx.beginPath();
            ctx.rect(this.position.x + GUN_OFFSET_X, this.position.y - GUN_HEIGHT / 2, GUN_WIDTH, GUN_HEIGHT);
            ctx.fillStyle = "gray";
            ctx.fill();
            ctx.closePath();

            // 🔥 BARREL
            ctx.beginPath();
            ctx.moveTo(this.position.x + GUN_BARREL_OFFSET_X, this.position.y);
            ctx.lineTo(this.position.x + GUN_BARREL_OFFSET_X + GUN_BARREL_WIDTH, this.position.y);
            ctx.lineWidth = GUN_BARREL_WIDTH;
            ctx.strokeStyle = "red";
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        }

        update(): void {
            this.draw();

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // 🔥 FLAME
            if (input.ArrowUp) {
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.rotation);

                ctx.beginPath();
                ctx.moveTo(-FLAME_OFFSET, -FLAME_HEIGHT / 2);
                ctx.lineTo(-FLAME_OFFSET - FLAME_LENGTH, 0);
                ctx.lineTo(-FLAME_OFFSET, FLAME_HEIGHT / 2);
                ctx.closePath();

                ctx.fillStyle = "orange";
                ctx.fill();
                ctx.restore();
            }

            // 💥 EXPLOSION
            if (this.exploding) {
                if (!this.explosionStartTime) {
                    this.explosionStartTime = Date.now();
                }

                this.velocity.x = 0;
                this.velocity.y = 0;

                const elapsed = Date.now() - this.explosionStartTime;
                const radius = this.radius + (elapsed / SHIP_EXPLODE_DURATION) * 60;

                const gradient = ctx.createRadialGradient(
                    this.position.x, this.position.y, 0,
                    this.position.x, this.position.y, radius
                );

                gradient.addColorStop(0, "yellow");
                gradient.addColorStop(0.5, "red");
                gradient.addColorStop(1, "transparent");

                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, radius, 0, FULL_CIRCLE_RADIANS);
                ctx.fillStyle = gradient;
                ctx.fill();

                if (elapsed > SHIP_EXPLODE_DURATION) {
                    this.exploding = false;
                    this.explosionStartTime = null;

                    // ✅ RESET POSITION (IMPORTANT FIX)
                    this.position.x = canvas.width / 2;
                    this.position.y = canvas.height / 2;
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                }
            }
        }
    }

    // =========================
    // ASTEROID
    // =========================
    class Asteroid {
        ctx: CanvasRenderingContext2D;
        position: Vec2;
        velocity: Vec2;
        radius: number;
        sides: number;
        angle: number;
        jag: number;
        offset: number[];

        constructor({ ctx, position, velocity, radius }: any) {
            this.ctx = ctx;
            this.position = position;
            this.velocity = velocity;
            this.radius = radius;
            this.sides = Math.floor(Math.random() * (MAX_SIDES - MIN_SIDES + 1)) + MIN_SIDES;
            this.angle = Math.random() * FULL_CIRCLE_RADIANS;
            this.jag = Math.random();
            this.offset = this.createOffsetArray(this.jag);
        }

        createOffsetArray(jag: number): number[] {
            const offset: number[] = [];
            for (let i = 0; i < this.sides; i++) {
                offset.push(Math.random() * jag * 2 + 1 - jag);
            }
            return offset;
        }

        draw(): void {
            this.ctx.beginPath();

            const startX = this.position.x + Math.cos(this.angle) * this.radius * this.offset[0];
            const startY = this.position.y + Math.sin(this.angle) * this.radius * this.offset[0];

            this.ctx.moveTo(startX, startY);

            for (let i = 1; i < this.sides; i++) {
                const x =
                    this.position.x +
                    Math.cos(this.angle + (i * FULL_CIRCLE_RADIANS) / this.sides) *
                    this.radius *
                    this.offset[i];

                const y =
                    this.position.y +
                    Math.sin(this.angle + (i * FULL_CIRCLE_RADIANS) / this.sides) *
                    this.radius *
                    this.offset[i];

                this.ctx.lineTo(x, y);
            }

            this.ctx.closePath();
            this.ctx.strokeStyle = STROKE_COLOR;
            this.ctx.stroke();
        }

        update(): void {
            if (this.position.x < -this.radius) this.position.x = canvas.width + this.radius;
            if (this.position.x > canvas.width + this.radius) this.position.x = -this.radius;
            if (this.position.y < -this.radius) this.position.y = canvas.height + this.radius;
            if (this.position.y > canvas.height + this.radius) this.position.y = -this.radius;
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }

        split(): void {
            for (let i = 0; i < 2; i++) {
                asteroids.push(
                    new Asteroid({
                        ctx,
                        position: { ...this.position },
                        velocity: {
                            x: Math.random() * 2 - 1,
                            y: Math.random() * 2 - 1,
                        },
                        radius: this.radius / 2,
                    })
                );
            }
        }
    }

    // =========================
    // BULLET
    // =========================
    class Bullet {
        ctx: CanvasRenderingContext2D;
        position: Vec2;
        velocity: Vec2;
        radius: number;

        constructor({ ctx, position, velocity }: any) {
            this.ctx = ctx;
            this.position = position;
            this.velocity = velocity;
            this.radius = BULLET_RADIUS;
        }

        draw(): void {
            const x = this.position.x;
            const y = this.position.y;
            const s = HEART_SIZE;

            this.ctx.beginPath();

            this.ctx.moveTo(x, y);

            this.ctx.bezierCurveTo(
                x - s / 2, y - s / 2,
                x - s, y + s / 3,
                x, y + s
            );

            this.ctx.bezierCurveTo(
                x + s, y + s / 3,
                x + s / 2, y - s / 2,
                x, y
            );

            this.ctx.closePath();
            this.ctx.fillStyle = HEART_COLOR;
            this.ctx.fill();
        }

        update(): void {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    // =========================
    // GAME LOGIC (RESTORE THIS)
    // =========================

    const ship = new Ship({
        position: { x: canvas.width / 2, y: canvas.height / 2 },
        velocity: { x: 0, y: 0 },
    });

    function handleKeyPressEvents() {
        if (ship.exploding) return;

        if (input.ArrowUp) {
            ship.velocity.x = Math.cos(ship.rotation) * VELOCITY_SPEED;
            ship.velocity.y = Math.sin(ship.rotation) * VELOCITY_SPEED;

            if (ship.position.x < 0) ship.position.x = canvas.width;
            if (ship.position.x > canvas.width) ship.position.x = 0;
            if (ship.position.y < 0) ship.position.y = canvas.height;
            if (ship.position.y > canvas.height) ship.position.y = 0;
        } else {
            ship.velocity.x *= VELOCITY_SLOWING;
            ship.velocity.y *= VELOCITY_SLOWING;
        }

        if (input.ArrowRight) ship.rotation += ROTATION_SPEED;
        if (input.ArrowLeft) ship.rotation -= ROTATION_SPEED;

        if (input.Space) {
            bullets.push(new Bullet({
                ctx,
                position: {
                    x: ship.position.x + Math.cos(ship.rotation) * 30,
                    y: ship.position.y + Math.sin(ship.rotation) * 30
                },
                velocity: {
                    x: Math.cos(ship.rotation) * 8,
                    y: Math.sin(ship.rotation) * 8
                }
            }));
            input.Space = false;
        }
    }

    function drawKilledAsteroidsText(n: number) {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "right";
        ctx.fillText("ASTEROIDS DESTROYED: " + n, canvas.width - 30, 30);
    }

    function drawLostLivesText(n: number) {
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "right";
        ctx.fillText("LOST LIVES: " + n, canvas.width - 30, 55);
    }

    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        handleKeyPressEvents();
        ship.update();
        drawKilledAsteroidsText(asteroidsKilled);
        drawLostLivesText(lostLives);
        // BULLETS
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();

            if (
                bullets[i].position.x < 0 ||
                bullets[i].position.x > canvas.width ||
                bullets[i].position.y < 0 ||
                bullets[i].position.y > canvas.height
            ) {
                bullets.splice(i, 1);
            }
        }

        // ASTEROIDS
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].update();

            // SHIP COLLISION
            if (isObjectCollision(ship, asteroids[i])) {
                ship.exploding = true;
                lostLives++;
            }

            // BULLET COLLISION
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (isObjectCollision(bullets[j], asteroids[i])) {
                    bullets.splice(j, 1);

                    if (asteroids[i].radius > 40) {
                        asteroids[i].split();
                    } else {
                        asteroidsKilled++;
                    }

                    asteroids.splice(i, 1);
                    break;
                }
            }
        }
    }

    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
                input.ArrowUp = true;
                break;
            case "ArrowLeft":
                input.ArrowLeft = true;
                break;
            case "ArrowRight":
                input.ArrowRight = true;
                break;
            case " ":
                input.Space = true;
                break;
        }
    });

    document.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "ArrowUp":
                input.ArrowUp = false;
                break;
            case "ArrowLeft":
                input.ArrowLeft = false;
                break;
            case "ArrowRight":
                input.ArrowRight = false;
                break;
        }
    });

    setInterval(() => {
        const asteroidRadius = Math.random() * 50 + 20;

        const index = Math.floor(Math.random() * 4) + 1; // FIXED
        const coords = createAsteroidCoordinate(index, asteroidRadius);

        asteroids.push(new Asteroid({
            ctx,
            position: { x: coords.x, y: coords.y },
            velocity: {
                x: coords.vx * Math.random() * 1.3,
                y: coords.vy * Math.random() * 1.3
            },
            radius: asteroidRadius
        }));
    }, 2500);

    function isObjectCollision(obj1: any, obj2: any) {
        if (!obj1 || !obj2 || ship.exploding) return false;

        const dx = obj1.position.x - obj2.position.x;
        const dy = obj1.position.y - obj2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= obj1.radius + obj2.radius;
    }

    function createAsteroidCoordinate(index: number, radius: number) {
        let x = 0, y = 0, vx = 0, vy = 0;

        switch (index) {
            case 1:
                x = -radius;
                y = Math.random() * canvas.height;
                vx = 3;
                break;
            case 2:
                x = canvas.width + radius;
                y = Math.random() * canvas.height;
                vx = -3;
                break;
            case 3:
                x = Math.random() * canvas.width;
                y = -radius;
                vy = 3;
                break;
            case 4:
                x = Math.random() * canvas.width;
                y = canvas.height + radius;
                vy = -3;
                break;
        }

        return { x, y, vx, vy };
    }
    animate();
}