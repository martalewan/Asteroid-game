import { useEffect, useState } from "react";

export function HUD({ game }: { game: any }) {
    const [state, setState] = useState(game.gameState);

    useEffect(() => {
        return game.subscribe(() => {
            setState({ ...game.gameState });
        });
    }, [game]);

    return (
        <div style={{ position: "absolute", top: 20, right: 20, color: "white" }}>
            <div>ASTEROIDS DESTROYED: {state.asteroidsKilled}</div>
            <div>LOST LIVES: {state.lostLives}</div>
        </div>
    );
}