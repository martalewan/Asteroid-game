import { createGameEngine } from "../core/engine";
import type { Listener } from "../core/game.types";
import type { Asteroid } from "../entities/Asteroid";
import type { Bullet } from "../entities/Bullet";
import { Ship } from "../entities/Ship";
import { updateAsteroids } from "../handlers/asteroidHandler";
import { createAsteroidSpawner } from "../handlers/asteroidSpawnerHandler";
import { updateBullets } from "../handlers/bulletHandler";
import { bindInput } from "../handlers/inputHandler";
import { updateShip } from "../handlers/shipHandler";
import { createGameStore } from "../gameStore";
import { createInputState } from "../utils/inputState";

export function createGame(canvas: HTMLCanvasElement) {
    const gameStore = createGameStore();

    const bullets: Bullet[] = [];
    const asteroids: Asteroid[] = [];

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

    const spawner = createAsteroidSpawner({
        ctx,
        canvas,
        asteroids,
    });

    const engine = createGameEngine({
        ctx,
        canvas,
        ship,
        bullets,
        asteroids,
        gameStore,
        damageState: { canTakeDamage: true },
        updateShip: () =>
            updateShip({ ship, input, bullets, ctx }),
        updateBullets,
        updateAsteroids,
    });

    let started = false;

    function start() {
        if (started) return;
        started = true;

        engine.start();
        spawner.start(2500);
    }

    function stop() {
        if (!started) return;
        started = false;

        engine.stop();
        spawner.stop?.();
    }

    function reset() {
        stop();

        bullets.length = 0;
        asteroids.length = 0;
        gameStore.reset?.();
        ship.reset({
            x: canvas.width / 2,
            y: canvas.height / 2,
        });
        engine.renderOnce();
    }

    return {
        start,
        stop,
        reset,
        getState: () => gameStore,
        subscribe: (l: Listener) => gameStore.subscribe(l),
    };
}