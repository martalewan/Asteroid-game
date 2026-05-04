import { Asteroid } from "./game/Asteroid";
import { updateAsteroids } from "./game/handlers/asteroidHandler";
import { updateBullets } from "./game/handlers/bulletHandler";
import { bindInput } from "./game/handlers/inputHandler";
import { updateShip } from "./game/handlers/shipHandler";
import { createInputState } from "./game/inputState";
import { Ship } from "./game/Ship";
import { createGameState } from "./game/state";

export function startGame(canvas: HTMLCanvasElement) {
    const gameState = createGameState();

    const damageState = {
        canTakeDamage: true,
    };
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

        updateBullets(bullets, canvas);

        updateAsteroids(
            asteroids,
            ship,
            bullets,
            gameState,
            damageState
        );
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