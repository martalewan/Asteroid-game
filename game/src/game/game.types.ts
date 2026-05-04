export type Vec2 = { x: number; y: number };

export type KeyMap = {
    ArrowUp: boolean;
    ArrowDown: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    Space?: boolean;
};

export type GameState = {
    bullets: any[];
    asteroids: any[];
    killed: number;
    lives: number;
};