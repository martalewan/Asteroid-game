import { bindInput } from "../game/handlers/inputHandler";
import { updateShip } from "../game/handlers/shipHandler";
import { updateBullets } from "../game/handlers/bulletHandler";
import { updateAsteroids } from "../game/handlers/asteroidHandler";
import { createInputState } from "../game/inputState";
import { Ship } from "../game/Ship";
import { createGameState } from "../game/state";
import { createGameEngine } from "../game/gameEngine";
import { createAsteroidSpawner } from "./handlers/asteroidSpawnerHandler";

export function startGame(canvas: HTMLCanvasElement) {
    const gameState = createGameState();

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

    // -------------------------
    // SPAWNER
    // -------------------------
    const spawner = createAsteroidSpawner({
        ctx,
        canvas,
        asteroids,
    });

    spawner.start(2500);

    // -------------------------
    // ENGINE
    // -------------------------
    const engine = createGameEngine({
        ctx,
        canvas,
        ship,
        bullets,
        asteroids,
        gameState,

        damageState: { canTakeDamage: true },

        updateShip: () =>
            updateShip({
                ship,
                input,
                bullets,
                ctx,
                canvas,
            }),

        updateBullets,
        updateAsteroids,
    });

    engine.start();

    return {
        start: () => {
            engine.start();
            spawner.start(2500);
        },

        stop: () => {
            engine.stop();
            spawner.stop?.();
        },

        reset: () => {
            engine.stop();
            spawner.stop?.();

            bullets.length = 0;
            asteroids.length = 0;

            gameState.getState().asteroidsKilled = 0;
            gameState.getState().lostLives = 0;

            engine.start();
            spawner.start(2500);
        },

        getState: () => gameState,

        subscribe: (listener: any) => gameState.subscribe(listener),
    };
}