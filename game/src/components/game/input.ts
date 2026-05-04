import type { KeyMap } from "./state";

export function createInput(): KeyMap & { bind: () => void } {
    const keys: KeyMap = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Space: false,
    };

    function onKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                keys.ArrowUp = true;
                break;
            case "ArrowLeft":
                keys.ArrowLeft = true;
                break;
            case "ArrowRight":
                keys.ArrowRight = true;
                break;
            case " ":
                keys.Space = true;
                break;
        }
    }

    function onKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                keys.ArrowUp = false;
                break;
            case "ArrowLeft":
                keys.ArrowLeft = false;
                break;
            case "ArrowRight":
                keys.ArrowRight = false;
                break;
        }
    }

    function bind() {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
    }

    return {
        ...keys,
        bind,
    };
}