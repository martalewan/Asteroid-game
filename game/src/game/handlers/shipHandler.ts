import { Bullet } from "../Bullet";

export function updateShip({
    ship,
    input,
    bullets,
    ctx,
}: any) {
    if (ship.exploding) return;

    if (input.Space) {
        bullets.push(
            new Bullet({
                ctx,
                position: {
                    x: ship.position.x + Math.cos(ship.rotation) * 30,
                    y: ship.position.y + Math.sin(ship.rotation) * 30,
                },
                velocity: {
                    x: Math.cos(ship.rotation) * 8,
                    y: Math.sin(ship.rotation) * 8,
                },
            })
        );

        input.Space = false;
    }
}