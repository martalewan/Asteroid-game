import { createGame } from "./createGame";

export function createGameApp(canvas: HTMLCanvasElement) {
    let game: any = null;

    function init() {
        game = createGame(canvas);
        game.reset();
    }

    function start() {
        if (!game) init();
        game.start();
    }

    function stop() {
        game?.stop();
    }

    function reset() {
        if (!game) return;

        game.stop();
        game.reset();
    }

    function getState() {
        return game?.getState();
    }

    return {
        init,
        start,
        stop,
        reset,
        getState,
    };
}