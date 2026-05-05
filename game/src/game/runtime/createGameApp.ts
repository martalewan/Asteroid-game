import { createGame } from "./createGame";
import { createGameControls } from "./createGameControls";

export function createGameApp(canvas: HTMLCanvasElement) {
    let game: ReturnType<typeof createGame> | null = null;
    let controls: ReturnType<typeof createGameControls> | null = null;

    function init() {
        game = createGame(canvas);
        game.reset();
        controls = createGameControls(game);
        controls.enable();
    }

    function start() {
        if (!game) init();
        game.start();
    }

    function togglePause() {
        game?.togglePause?.();
    }

    function stop() {
        game?.reset();
        controls?.disable();
        game = null;
        controls = null;
    }

    function reset() {
        game?.reset();
    }

    function getState() {
        return game?.getState();
    }

    return {
        init,
        start,
        togglePause,
        stop,
        reset,
        getState,
    };
}