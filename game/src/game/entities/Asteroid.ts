import { config } from "../core/config";
import type { Vec2 } from "../core/game.types";

export class Asteroid {
    ctx: CanvasRenderingContext2D;
    position: Vec2;
    velocity: Vec2;
    radius: number;

    sides: number;
    angle: number;
    jag: number;
    offset: number[];

    canvas: HTMLCanvasElement;
    asteroidsRef: Asteroid[];

    constructor(params: {
        ctx: CanvasRenderingContext2D;
        position: Vec2;
        velocity: Vec2;
        radius: number;
        canvas: HTMLCanvasElement;
        asteroidsRef: Asteroid[];
    }) {
        this.ctx = params.ctx;
        this.position = params.position;
        this.velocity = params.velocity;
        this.radius = params.radius;

        this.canvas = params.canvas;
        this.asteroidsRef = params.asteroidsRef;

        this.sides = Math.floor(Math.random() * (config.ASTEROID.MAX_SIDES - config.ASTEROID.MIN_SIDES + 1)) + config.ASTEROID.MIN_SIDES;
        this.angle = Math.random() * config.MATH.FULL_CIRCLE;
        this.jag = Math.random();
        this.offset = this.createOffsetArray(this.jag);
    }

    createOffsetArray(jag: number): number[] {
        const offset: number[] = [];

        for (let i = 0; i < this.sides; i++) {
            offset.push(Math.random() * jag * 2 + 1 - jag);
        }

        return offset;
    }

    draw(): void {
        this.ctx.beginPath();

        const startX =
            this.position.x +
            Math.cos(this.angle) * this.radius * this.offset[0];

        const startY =
            this.position.y +
            Math.sin(this.angle) * this.radius * this.offset[0];

        this.ctx.moveTo(startX, startY);

        for (let i = 1; i < this.sides; i++) {
            const x =
                this.position.x +
                Math.cos(this.angle + (i * config.MATH.FULL_CIRCLE) / this.sides) *
                this.radius *
                this.offset[i];

            const y =
                this.position.y +
                Math.sin(this.angle + (i * config.MATH.FULL_CIRCLE) / this.sides) *
                this.radius *
                this.offset[i];

            this.ctx.lineTo(x, y);
        }

        this.ctx.closePath();
        this.ctx.strokeStyle = config.ASTEROID.STROKE_COLOR;
        this.ctx.stroke();
    }

    update(): void {
        // WRAP SCREEN
        if (this.position.x < -this.radius)
            this.position.x = this.canvas.width + this.radius;

        if (this.position.x > this.canvas.width + this.radius)
            this.position.x = -this.radius;

        if (this.position.y < -this.radius)
            this.position.y = this.canvas.height + this.radius;

        if (this.position.y > this.canvas.height + this.radius)
            this.position.y = -this.radius;

        this.draw();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    split(): void {
        for (let i = 0; i < 2; i++) {
            this.asteroidsRef.push(
                new Asteroid({
                    ctx: this.ctx,
                    position: { ...this.position },
                    velocity: {
                        x: Math.random() * 2 - 1,
                        y: Math.random() * 2 - 1,
                    },
                    radius: this.radius / 2,
                    canvas: this.canvas,
                    asteroidsRef: this.asteroidsRef,
                })
            );
        }
    }
}