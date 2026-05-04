import { startGame } from "./startGame";

export function createGameApp(canvas: HTMLCanvasElement) {
    let gameInstance: any = null;

    function init() {
        gameInstance = startGame(canvas);
    }

    function start() {
        if (!gameInstance) init();
        gameInstance.start?.();
    }

    function stop() {
        gameInstance?.stop?.();
    }

    function reset() {
        stop();

        // IMPORTANT: re-create everything cleanly
        gameInstance = startGame(canvas);
        gameInstance.start?.();
    }

    function getState() {
        return gameInstance?.getState?.();
    }

    return {
        init,
        start,
        stop,
        reset,
        getState,
    };
}