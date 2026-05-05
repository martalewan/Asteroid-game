import type { Asteroid } from "../entities/Asteroid";
import type { Bullet } from "../entities/Bullet";
import type { DamageState, GameActions } from "../core/game.types";
import type { Ship } from "../entities/Ship";
import { isObjectCollision } from "../utils/collision";

export function updateAsteroids(
    asteroids: Asteroid[],
    ship: Ship,
    bullets: Bullet[],
    gameActions: GameActions,
    damageState: DamageState
) {
    if (!Array.isArray(asteroids)) return;

    let hitThisFrame = false;

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];

        if (!asteroid || typeof asteroid.update !== "function") {
            asteroids.splice(i, 1);
            continue;
        }

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
            gameActions.addLifeLost();

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
            const bullet = bullets[j];

            if (isObjectCollision(bullet, asteroid)) {
                bullets.splice(j, 1);

                if (asteroid.radius > 40) {
                    asteroid.split?.();
                } else {
                    gameActions.addKill();
                }

                asteroids.splice(i, 1);
                break;
            }
        }
    }
}