import { useEffect, useRef, useState } from "react";
import { startGame } from "./game";

export function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<any>(null);

    const [state, setState] = useState({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        gameRef.current = startGame(canvasRef.current);

        console.log("[REACT] game started", gameRef.current);

        const unsubscribe = gameRef.current.subscribe(() => {
            console.log("[REACT] subscribe triggered");
            console.log("[REACT] gameState from engine:", gameRef.current.gameState);

            setState({ ...gameRef.current.gameState });

            console.log("[REACT] state updated in React:", gameRef.current.gameState);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("[REACT] render state:", state);
    }, [state]);

    return (
        <div>
            <div style={{ position: "absolute", color: "white" }}>
                Kills: {state.asteroidsKilled} <br />
                Lives: {state.lostLives}
            </div>

            <canvas ref={canvasRef} />
        </div>
    );
}