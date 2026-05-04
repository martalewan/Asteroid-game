type GameEngineParams = {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    ship: any;
    bullets: any[];
    asteroids: any[];
    gameState: any;
    damageState: { canTakeDamage: boolean };

    updateShip: () => void;
    updateBullets: (bullets: any[], canvas: HTMLCanvasElement) => void;
    updateAsteroids: (
        asteroids: any[],
        ship: any,
        bullets: any[],
        gameState: any,
        damageState: { canTakeDamage: boolean }
    ) => void;
};
export function createGameEngine(params: GameEngineParams) {
    const {
        ctx,
        canvas,
        ship,
        bullets,
        asteroids,
        gameState,
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
            gameState,
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
            gameState,
            damageState
        );
    }

    return {
        start,
        stop,
        renderOnce,
    };
}