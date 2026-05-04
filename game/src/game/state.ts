type Listener = () => void;

export function createGameState() {
    const state = {
        asteroidsKilled: 0,
        lostLives: 0,
    };

    const listeners: Listener[] = [];

    function notify() {
        listeners.forEach((l) => l());
    }

    function addKill() {
        state.asteroidsKilled++;
        notify();
    }

    function addLifeLost() {
        state.lostLives++;
        notify();
    }

    function getState() {
        return state;
    }

    function subscribe(listener: Listener) {
        listeners.push(listener);

        return () => {
            const i = listeners.indexOf(listener);
            if (i !== -1) listeners.splice(i, 1);
        };
    }

    function reset() {
        state.asteroidsKilled = 0;
        state.lostLives = 0;
        notify();
    }

    return {
        getState,
        subscribe,
        addKill,
        addLifeLost,
        reset
    };
}