import type { Asteroid } from "../entities/Asteroid";
import type { Bullet } from "../entities/Bullet";
import type { Ship } from "../entities/Ship";

export type Vec2 = { x: number; y: number };

export type InputState = {
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    Space: boolean;
};

export type GameState = {
    bullets: Bullet[];
    asteroids: Asteroid[];
    killed: number;
    lives: number;
};

export type GameStateData = {
    asteroidsKilled: number;
    lostLives: number;
};

export type GameStateStore = {
    getState: () => GameStateData;
    subscribe: (listener: () => void) => () => void;
    addKill: () => void;
    addLifeLost: () => void;
    reset: () => void;
};

export type GameEngineParams = {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    ship: Ship;
    bullets: Bullet[];
    asteroids: Asteroid[];
    gameStore: GameStateStore;
    damageState: { canTakeDamage: boolean };

    updateShip: () => void;
    updateBullets: (bullets: Bullet[], canvas: HTMLCanvasElement) => void;
    updateAsteroids: (
        asteroids: Asteroid[],
        ship: Ship,
        bullets: Bullet[],
        gameState: GameStateStore,
        damageState: { canTakeDamage: boolean }
    ) => void;
};

export type Listener = () => void;

export type GameActions = {
    addKill: () => void;
    addLifeLost: () => void;
};

export type DamageState = {
    canTakeDamage: boolean;
};
