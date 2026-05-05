import type { Asteroid } from "../entities/Asteroid";
import type { Bullet } from "../entities/Bullet";
import { isObjectCollision } from "../collision";
import type { DamageState, GameActions } from "../core/game.types";
import type { Ship } from "../entities/Ship";

export function updateAsteroids(
    asteroids: Asteroid[],
    ship: Ship,
    bullets: Bullet[],
    gameActions: GameActions,
    damageState: DamageState
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
            if (isObjectCollision(bullets[j], asteroid)) {
                bullets.splice(j, 1);

                if (asteroid.radius > 40) {
                    asteroid.split();
                } else {
                    gameActions.addKill();
                }

                asteroids.splice(i, 1);
                break;
            }
        }
    }
}