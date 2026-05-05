import type { Vec2 } from "../core/game.types";

export function isObjectCollision(
    obj1: { position: Vec2; radius: number },
    obj2: { position: Vec2; radius: number }
) {
    const dx = obj1.position.x - obj2.position.x;
    const dy = obj1.position.y - obj2.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= obj1.radius + obj2.radius;
}