import type { KeyMap } from "./state";

export function createInput() {
    const keys: KeyMap = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };

    window.addEventListener("keydown", (e) => {
        if (e.key in keys) keys[e.key as keyof KeyMap] = true;
        if (e.key === " ") keys.Space = true;
    });

    window.addEventListener("keyup", (e) => {
        if (e.key in keys) keys[e.key as keyof KeyMap] = false;
        if (e.key === " ") keys.Space = false;
    });

    return keys;
}