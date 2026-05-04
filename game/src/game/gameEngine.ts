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
        damageState, // ✅ FIX: you forgot this
        updateShip,
        updateBullets,
        updateAsteroids,
    } = params;

    let running = false;

    function loop() {
        if (!running) return;

        requestAnimationFrame(loop);

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
        start() {
            running = true;
            loop();
        },

        stop() {
            running = false;
        },
    };
}