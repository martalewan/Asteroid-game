import { config } from "./config";
import type { Vec2, KeyMap } from "./game.types";

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
        this.radius = config.SHIP.BODY_RADIUS;

        this.exploding = false;
        this.explosionStartTime = null;
    }

    reset(position: Vec2) {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0;

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
        ctx.arc(this.position.x, this.position.y, config.SHIP.BODY_RADIUS, 0, config.MATH.FULL_CIRCLE);
        ctx.fillStyle = "#ff66b2";
        ctx.fill();
        ctx.closePath();

        // =====================
        // EYES (FIXED COLOR)
        // =====================
        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.arc(
            this.position.x - config.SHIP.EYE_OFFSET_X,
            this.position.y - config.SHIP.EYE_OFFSET_Y,
            config.SHIP.EYE_RADIUS,
            0,
            config.MATH.FULL_CIRCLE
        );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(
            this.position.x + config.SHIP.EYE_OFFSET_X,
            this.position.y - config.SHIP.EYE_OFFSET_Y,
            config.SHIP.EYE_RADIUS,
            0,
            config.MATH.FULL_CIRCLE
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
            this.position.y + config.SHIP.MOUTH_OFFSET_Y,
            config.SHIP.MOUTH_RADIUS,
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
            this.position.x + config.SHIP.GUN_OFFSET_X,
            this.position.y - config.SHIP.GUN_HEIGHT / 2,
            config.SHIP.GUN_WIDTH,
            config.SHIP.GUN_HEIGHT
        );
        ctx.fill();
        ctx.closePath();

        // =====================
        // BARREL
        // =====================
        ctx.strokeStyle = "red";
        ctx.lineWidth = config.SHIP.GUN_BARREL_WIDTH;

        ctx.beginPath();
        ctx.moveTo(this.position.x + config.SHIP.GUN_BARREL_OFFSET_X, this.position.y);
        ctx.lineTo(
            this.position.x + config.SHIP.GUN_BARREL_OFFSET_X + config.SHIP.GUN_BARREL_WIDTH,
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
            this.velocity.x = Math.cos(this.rotation) * config.SHIP.VELOCITY_SPEED;
            this.velocity.y = Math.sin(this.rotation) * config.SHIP.VELOCITY_SPEED;
        } else {
            this.velocity.x *= config.SHIP.VELOCITY_SLOWING;
            this.velocity.y *= config.SHIP.VELOCITY_SLOWING;
        }

        // ROTATION
        if (input.ArrowRight) this.rotation += config.SHIP.ROTATION_SPEED;
        if (input.ArrowLeft) this.rotation -= config.SHIP.ROTATION_SPEED;

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
            ctx.moveTo(-config.SHIP.FLAME_OFFSET, -config.SHIP.FLAME_HEIGHT / 2);
            ctx.lineTo(-config.SHIP.FLAME_OFFSET - config.SHIP.FLAME_LENGTH, 0);
            ctx.lineTo(-config.SHIP.FLAME_OFFSET, config.SHIP.FLAME_HEIGHT / 2);
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
            const radius = this.radius + (elapsed / config.SHIP.EXPLODE_DURATION) * 60;

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
            ctx.arc(this.position.x, this.position.y, radius, 0, config.MATH.FULL_CIRCLE);
            ctx.fillStyle = gradient;
            ctx.fill();

            if (elapsed > config.SHIP.EXPLODE_DURATION) {
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