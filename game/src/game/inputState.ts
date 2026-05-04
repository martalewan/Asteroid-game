import type { InputState } from "./game.types";

export function createInputState(): InputState {
    return {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };
}