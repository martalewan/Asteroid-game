import type { KeyMap } from "./game.types";

export function createInputState(): KeyMap {
    return {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };
}