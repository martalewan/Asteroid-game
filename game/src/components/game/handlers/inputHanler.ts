import type { KeyMap } from "../game.types";

export function bindInput(keys: KeyMap) {
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
            case " ":
                keys.Space = false;
                break;
        }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // optional cleanup (good practice)
    return function unbind() {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
    };
}