import type { GameEngineParams } from "./game.types";

export function createGameEngine(params: GameEngineParams) {
    const {
        ctx,
        canvas,
        ship,
        bullets,
        asteroids,
        gameStore,
        damageState,
        updateShip,
        updateBullets,
        updateAsteroids,
    } = params;

    let running = false;
    let rafId: number | null = null;

    function tick() {
        if (!running) return;

        rafId = requestAnimationFrame(tick);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateShip();
        ship.update();

        updateBullets(bullets, canvas);

        updateAsteroids(
            asteroids,
            ship,
            bullets,
            gameStore,
            damageState
        );
    }

    function start() {
        if (running) return;
        running = true;
        tick();
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    function renderOnce() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        updateShip();
        ship.update();

        updateBullets(bullets, canvas);

        updateAsteroids(
            asteroids,
            ship,
            bullets,
            gameStore,
            damageState
        );
    }

    return {
        start,
        stop,
        renderOnce,
    };
}