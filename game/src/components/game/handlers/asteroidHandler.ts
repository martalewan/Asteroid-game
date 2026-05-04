import { isObjectCollision } from "../collision";

export function updateAsteroids(
    asteroids: any[],
    ship: any,
    bullets: any[],
    gameState: any,
    damageState: { canTakeDamage: boolean }
) {
    let hitThisFrame = false;

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];

        asteroid.update();

        // =========================
        // SHIP COLLISION
        // =========================
        if (
            !hitThisFrame &&
            isObjectCollision(ship, asteroid) &&
            damageState.canTakeDamage
        ) {
            ship.exploding = true;
            gameState.addLifeLost();

            damageState.canTakeDamage = false;
            hitThisFrame = true;

            setTimeout(() => {
                damageState.canTakeDamage = true;
            }, 3000);
        }

        // =========================
        // BULLET COLLISION
        // =========================
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (isObjectCollision(bullets[j], asteroid)) {
                bullets.splice(j, 1);

                if (asteroid.radius > 40) {
                    asteroid.split();
                } else {
                    gameState.addKill();
                }

                asteroids.splice(i, 1);
                break;
            }
        }
    }
}