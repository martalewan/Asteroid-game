import type { InputState } from "../core/game.types";

export function createInputState(): InputState {
    return {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };
}