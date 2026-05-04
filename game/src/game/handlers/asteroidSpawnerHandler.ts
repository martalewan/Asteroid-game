import { Asteroid } from "../Asteroid";

type AsteroidSpawnerParams = {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    asteroids: any[];
};

export function createAsteroidSpawner(params: AsteroidSpawnerParams) {
    const { ctx, canvas, asteroids } = params;

    let intervalId: ReturnType<typeof setInterval> | null = null;

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

    function spawn() {
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
    }

    function start(interval = 2500) {
        if (intervalId) return;

        intervalId = setInterval(spawn, interval);
    }

    function stop() {
        if (!intervalId) return;

        clearInterval(intervalId);
        intervalId = null;
    }

    return {
        start,
        stop,
        spawn,
    };
}