export function createGameControls(game: any) {
    function onKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case "Enter":
                game.start();
                break;

            case "Escape":
                game.togglePause?.();
                break;

            case "KeyR":
                game.reset();
                break;
        }
    }

    function enable() {
        window.addEventListener("keydown", onKeyDown);
    }

    function disable() {
        window.removeEventListener("keydown", onKeyDown);
    }

    return { enable, disable };
}