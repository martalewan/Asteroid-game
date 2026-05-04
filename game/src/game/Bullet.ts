import type { Vec2 } from "./game.types";

const HEART_SIZE = 10;
const HEART_COLOR = "white";
const BULLET_RADIUS = 3;

export class Bullet {
    ctx: CanvasRenderingContext2D;
    position: Vec2;
    velocity: Vec2;
    radius: number;

    constructor(params: {
        ctx: CanvasRenderingContext2D;
        position: Vec2;
        velocity: Vec2;
    }) {
        this.ctx = params.ctx;
        this.position = params.position;
        this.velocity = params.velocity;
        this.radius = BULLET_RADIUS;
    }

    draw(): void {
        const x = this.position.x;
        const y = this.position.y;
        const s = HEART_SIZE;

        this.ctx.beginPath();

        this.ctx.moveTo(x, y);

        this.ctx.bezierCurveTo(
            x - s / 2, y - s / 2,
            x - s, y + s / 3,
            x, y + s
        );

        this.ctx.bezierCurveTo(
            x + s, y + s / 3,
            x + s / 2, y - s / 2,
            x, y
        );

        this.ctx.closePath();
        this.ctx.fillStyle = HEART_COLOR;
        this.ctx.fill();
    }

    update(): void {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}