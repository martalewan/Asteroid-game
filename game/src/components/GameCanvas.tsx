import { useEffect, useRef, useState } from "react";
import { startGame } from "./startGame";

export function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<any>(null);

    const [hud, setHud] = useState({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        const game = startGame(canvasRef.current);
        gameRef.current = game;

        const unsubscribe = game.subscribe(() => {
            setHud({ ...game.getState() });
        });

        return () => unsubscribe();
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <canvas ref={canvasRef} />

            {/* HUD LAYER */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "white",
                    fontFamily: "Arial",
                }}
            >
                <div>ASTEROIDS: {hud.asteroidsKilled}</div>
                <div>LIVES: {hud.lostLives}</div>
            </div>
        </div>
    );
}