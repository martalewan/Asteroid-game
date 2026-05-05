import { useEffect, useRef, useState } from "react";
import { createGameApp } from "../game/runtime/createGameApp";

type HUDState = {
    asteroidsKilled: number;
    lostLives: number;
};

export function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const appRef = useRef<ReturnType<typeof createGameApp> | null>(null);

    const [hud, setHud] = useState<HUDState>({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const app = createGameApp(canvas);
        appRef.current = app;

        app.init();

        const store = app.getState();

        const unsubscribe = store.subscribe(() => {
            setHud({ ...store.getState() });
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