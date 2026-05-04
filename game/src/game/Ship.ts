import type { Vec2, KeyMap } from "./game.types";

const FULL_CIRCLE = 2 * Math.PI;

// SHIP CONSTANTS
const SHIP_BODY_RADIUS = 20;
const EYE_RADIUS = 4;
const EYE_OFFSET_X = 8;
const EYE_OFFSET_Y = 5;
const MOUTH_RADIUS = 9;
const MOUTH_OFFSET_Y = 5;

const GUN_WIDTH = 15;
const GUN_HEIGHT = 10;
const GUN_OFFSET_X = 20;
const GUN_BARREL_WIDTH = 3;
const GUN_BARREL_OFFSET_X = 31;

const FLAME_LENGTH = 30;
const FLAME_HEIGHT = 15;
const FLAME_OFFSET = 35;

const VELOCITY_SLOWING = 0.9;
const VELOCITY_SPEED = 8;
const ROTATION_SPEED = 0.2;

const SHIP_EXPLODE_DURATION = 3000;

export class Ship {
    position: Vec2;
    velocity: Vec2;
    rotation: number;
    radius: number;

    exploding: boolean;
    explosionStartTime: number | null;

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    input: KeyMap;

    constructor(params: {
        ctx: CanvasRenderingContext2D;
        canvas: HTMLCanvasElement;
        input: KeyMap;
        position: Vec2;
        velocity: Vec2;
    }) {
        this.ctx = params.ctx;
        this.canvas = params.canvas;
        this.input = params.input;

        this.position = params.position;
        this.velocity = params.velocity;

        this.rotation = 0;
        this.radius = SHIP_BODY_RADIUS;

        this.exploding = false;
        this.explosionStartTime = null;
    }

    draw(): void {
        const ctx = this.ctx;

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);

        ctx.translate(-this.position.x, -this.position.y);

        // =====================
        // BODY
        // =====================
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, SHIP_BODY_RADIUS, 0, FULL_CIRCLE);
        ctx.fillStyle = "#ff66b2";
        ctx.fill();
        ctx.closePath();

        // =====================
        // EYES (FIXED COLOR)
        // =====================
        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.arc(
            this.position.x - EYE_OFFSET_X,
            this.position.y - EYE_OFFSET_Y,
            EYE_RADIUS,
            0,
            FULL_CIRCLE
        );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(
            this.position.x + EYE_OFFSET_X,
            this.position.y - EYE_OFFSET_Y,
            EYE_RADIUS,
            0,
            FULL_CIRCLE
        );
        ctx.fill();
        ctx.closePath();

        // =====================
        // MOUTH
        // =====================
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y + MOUTH_OFFSET_Y,
            MOUTH_RADIUS,
            0,
            Math.PI
        );
        ctx.stroke();
        ctx.closePath();

        // =====================
        // GUN
        // =====================
        ctx.fillStyle = "gray";

        ctx.beginPath();
        ctx.rect(
            this.position.x + GUN_OFFSET_X,
            this.position.y - GUN_HEIGHT / 2,
            GUN_WIDTH,
            GUN_HEIGHT
        );
        ctx.fill();
        ctx.closePath();

        // =====================
        // BARREL
        // =====================
        ctx.strokeStyle = "red";
        ctx.lineWidth = GUN_BARREL_WIDTH;

        ctx.beginPath();
        ctx.moveTo(this.position.x + GUN_BARREL_OFFSET_X, this.position.y);
        ctx.lineTo(
            this.position.x + GUN_BARREL_OFFSET_X + GUN_BARREL_WIDTH,
            this.position.y
        );
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    update(): void {
        this.draw();

        const input = this.input;

        // MOVE
        if (input.ArrowUp) {
            this.velocity.x = Math.cos(this.rotation) * VELOCITY_SPEED;
            this.velocity.y = Math.sin(this.rotation) * VELOCITY_SPEED;
        } else {
            this.velocity.x *= VELOCITY_SLOWING;
            this.velocity.y *= VELOCITY_SLOWING;
        }

        // ROTATION
        if (input.ArrowRight) this.rotation += ROTATION_SPEED;
        if (input.ArrowLeft) this.rotation -= ROTATION_SPEED;

        // POSITION
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // WRAP
        if (this.position.x < 0) this.position.x = this.canvas.width;
        if (this.position.x > this.canvas.width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = this.canvas.height;
        if (this.position.y > this.canvas.height) this.position.y = 0;

        // FLAME
        if (input.ArrowUp) {
            const ctx = this.ctx;

            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.rotation);

            ctx.fillStyle = "orange";

            ctx.beginPath();
            ctx.moveTo(-FLAME_OFFSET, -FLAME_HEIGHT / 2);
            ctx.lineTo(-FLAME_OFFSET - FLAME_LENGTH, 0);
            ctx.lineTo(-FLAME_OFFSET, FLAME_HEIGHT / 2);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        // EXPLOSION
        if (this.exploding) {
            if (!this.explosionStartTime) {
                this.explosionStartTime = Date.now();
            }

            this.velocity.x = 0;
            this.velocity.y = 0;

            const elapsed = Date.now() - this.explosionStartTime;
            const radius = this.radius + (elapsed / SHIP_EXPLODE_DURATION) * 60;

            const ctx = this.ctx;

            const gradient = ctx.createRadialGradient(
                this.position.x,
                this.position.y,
                0,
                this.position.x,
                this.position.y,
                radius
            );

            gradient.addColorStop(0, "yellow");
            gradient.addColorStop(0.5, "red");
            gradient.addColorStop(1, "transparent");

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, radius, 0, FULL_CIRCLE);
            ctx.fillStyle = gradient;
            ctx.fill();

            if (elapsed > SHIP_EXPLODE_DURATION) {
                this.exploding = false;
                this.explosionStartTime = null;

                this.position.x = this.canvas.width / 2;
                this.position.y = this.canvas.height / 2;
                this.velocity.x = 0;
                this.velocity.y = 0;
            }
        }
    }
}