import type { GameStatus } from "./core/game.types";

type GameState = {
    asteroidsKilled: number;
    lostLives: number;
    status: GameStatus;
};

export function createGameStore() {
    let state: GameState = {
        asteroidsKilled: 0,
        lostLives: 0,
        status: "menu",
    };

    const listeners: Function[] = [];

    function getState() {
        return state;
    }

    function setState(partial: Partial<GameState>) {
        state = { ...state, ...partial };
        listeners.forEach((l) => l(state));
    }

    function setStatus(status: GameStatus) {
        setState({ status });
    }

    function addKill() {
        setState({ asteroidsKilled: state.asteroidsKilled + 1 });
    }

    function addLifeLost() {
        state = {
            ...state,
            lostLives: state.lostLives + 1,
            status: state.lostLives + 1 >= 3 ? "gameover" : state.status,
        };

        listeners.forEach((l) => l(state));
    }

    function reset() {
        state = {
            asteroidsKilled: 0,
            lostLives: 0,
            status: "menu",
        };
        listeners.forEach((l) => l(state));
    }

    function subscribe(l: Function) {
        listeners.push(l);
        return () => {
            const i = listeners.indexOf(l);
            if (i >= 0) listeners.splice(i, 1);
        };
    }

    return {
        getState,
        setState,
        setStatus,
        addKill,
        addLifeLost,
        reset,
        subscribe,
    };
}