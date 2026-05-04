import { useEffect, useState } from "react";

export function useGame(game: any) {
    const [state, setState] = useState(game.gameState);

    useEffect(() => {
        return game.subscribe(() => {
            setState({ ...game.gameState });
        });
    }, [game]);

    return state;
}