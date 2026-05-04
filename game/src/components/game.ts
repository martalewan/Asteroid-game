import { Asteroid } from "./game/Asteroid";
import { Bullet } from "./game/Bullet";
import { isObjectCollision } from "./game/collision";
import { createInput } from "./game/input";
import { Ship } from "./game/Ship";

export function startGame(canvas: HTMLCanvasElement) {
    // =========================
    // CONSTANTS
    // =========================
    const gameState = {
        asteroidsKilled: 0,
        lostLives: 0,
    };
    const listeners: (() => void)[] = [];
    let canTakeDamage = true;

    const VELOCITY_SLOWING = 0.9;
    const VELOCITY_SPEED = 8;
    const ROTATION_SPEED = 0.2;

    // =========================
    // STATE
    // =========================
    const bullets: any[] = [];
    const asteroids: any[] = [];

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
    // GAME LOGIC (RESTORE THIS)
    // =========================

    const ship = new Ship({
        ctx,
        canvas,
        input,
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
    function notify() {
        listeners.forEach((l) => l());
    }
    function addKill() {
        gameState.asteroidsKilled++;
        notify();
    }

    function addLifeLost() {
        gameState.lostLives++;
        notify();
    }

    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        handleKeyPressEvents();
        ship.update();
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

            if (isObjectCollision(ship, asteroids[i]) && canTakeDamage) {
                ship.exploding = true;
                addLifeLost();

                canTakeDamage = false;

                setTimeout(() => {
                    canTakeDamage = true;
                }, 1000);
            }

            // BULLET COLLISION
            for (let j = bullets.length - 1; j >= 0; j--) {
                if (isObjectCollision(bullets[j], asteroids[i])) {
                    bullets.splice(j, 1);

                    if (asteroids[i].radius > 40) {
                        asteroids[i].split();
                    } else {
                        addKill();
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

        const index = Math.floor(Math.random() * 4) + 1;
        const coords = createAsteroidCoordinate(index, asteroidRadius);

        asteroids.push(
            new Asteroid({
                ctx,
                canvas,
                asteroidsRef: asteroids,
                position: { x: coords.x, y: coords.y },
                velocity: {
                    x: coords.vx * Math.random() * 1.3,
                    y: coords.vy * Math.random() * 1.3,
                },
                radius: asteroidRadius,
            })
        );
    }, 2500);

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

    return {
        gameState,
        subscribe(listener: () => void) {
            listeners.push(listener);

            return () => {
                const index = listeners.indexOf(listener);
                if (index !== -1) listeners.splice(index, 1);
            };
        }
    }
}