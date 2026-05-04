import { Bullet } from "../Bullet";
import { config } from "../config";

export function updateShip({
    ship,
    input,
    bullets,
    ctx,
    canvas,
}: any) {
    if (ship.exploding) return;

    if (input.ArrowUp) {
        ship.velocity.x = Math.cos(ship.rotation) * config.VELOCITY_SPEED;
        ship.velocity.y = Math.sin(ship.rotation) * config.VELOCITY_SPEED;

        if (ship.position.x < 0) ship.position.x = canvas.width;
        if (ship.position.x > canvas.width) ship.position.x = 0;
        if (ship.position.y < 0) ship.position.y = canvas.height;
        if (ship.position.y > canvas.height) ship.position.y = 0;
    } else {
        ship.velocity.x *= config.VELOCITY_SLOWING;
        ship.velocity.y *= config.VELOCITY_SLOWING;
    }

    if (input.ArrowRight) ship.rotation += config.ROTATION_SPEED;
    if (input.ArrowLeft) ship.rotation -= config.ROTATION_SPEED;

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