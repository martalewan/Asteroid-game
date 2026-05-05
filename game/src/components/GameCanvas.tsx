import { useEffect, useRef, useState } from "react";
import { createGameApp } from "../game/runtime/createGameApp";

export function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<ReturnType<typeof createGameApp> | null>(null);

    const [hud, setHud] = useState({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    useEffect(() => {
        if (!canvasRef.current) return;

        const app = createGameApp(canvasRef.current);
        appRef.current = app;

        app.init();

        const unsubscribe = app.getState().subscribe(() => {
            setHud({ ...app.getState().getState() });
        });

        return () => {
            unsubscribe();
            app.stop();
        };
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <canvas ref={canvasRef} />

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

                {/* CONTROLS */}
                <div style={{ marginTop: 10, display: "flex", gap: 5 }}>
                    <button onClick={() => appRef.current?.start()}>
                        Start
                    </button>

                    <button onClick={() => appRef.current?.stop()}>
                        Stop
                    </button>

                    <button onClick={() => appRef.current?.reset()}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}