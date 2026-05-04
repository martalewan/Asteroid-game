import { Asteroid } from "./game/Asteroid";
import { isObjectCollision } from "./game/collision";
import { bindInput } from "./game/handlers/inputHandler";
import { updateShip } from "./game/handlers/shipHandler";
import { createInputState } from "./game/inputState";
import { Ship } from "./game/Ship";
import { createGameState } from "./game/state";

export function startGame(canvas: HTMLCanvasElement) {
    const gameState = createGameState();

    let canTakeDamage = true;
    const bullets: any[] = [];
    const asteroids: any[] = [];

    const input = createInputState();
    bindInput(input);

    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ship = new Ship({
        ctx,
        canvas,
        input,
        position: { x: canvas.width / 2, y: canvas.height / 2 },
        velocity: { x: 0, y: 0 },
    });

    function animate() {
        requestAnimationFrame(animate);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateShip({
            ship,
            input,
            bullets,
            ctx,
            canvas,
        }); ship.update();

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

        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].update();

            if (isObjectCollision(ship, asteroids[i]) && canTakeDamage) {
                ship.exploding = true;
                gameState.addLifeLost();

                canTakeDamage = false;

                setTimeout(() => {
                    canTakeDamage = true;
                }, 3000);
            }

            for (let j = bullets.length - 1; j >= 0; j--) {
                if (isObjectCollision(bullets[j], asteroids[i])) {
                    bullets.splice(j, 1);

                    if (asteroids[i].radius > 40) {
                        asteroids[i].split();
                    } else {
                        gameState.addKill();
                    }

                    asteroids.splice(i, 1);
                    break;
                }
            }
        }
    }

    // ASTEROID SPAWN
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
        let x = 0,
            y = 0,
            vx = 0,
            vy = 0;

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

    return gameState;
}