import { useState, useCallback, useRef } from "react";
import { createGameApp } from "../game/runtime/createGameApp";
import { GameShell } from "./GameShell";
import { GameCanvas } from "./GameCanvas";
import { HUD } from "./HUD";
import { Overlay } from "./Overlay";
import { ControlsHint } from "./ControlsHint";
import { AsteroidList } from "./AsteroidList";
import type { GameStatus } from "../game/core/game.types";

export default function GameScreen() {
    const [state, setState] = useState<GameStatus>("menu");
    const [hud, setHud] = useState({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    const appRef = useRef<any>(null);

    const mountCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const instance = createGameApp(canvas);
        instance.init();

        const store = instance.getState();

        if (!store) return;
        store.subscribe(() => {
            const s = store.getState();

            setHud({
                asteroidsKilled: s.asteroidsKilled,
                lostLives: s.lostLives,
            });

            setState(s.status);
        });

        appRef.current = instance;
    }, []);

    return (
        <GameShell>
            <GameCanvas onMount={mountCanvas} />

            <div className="z-10">
                <AsteroidList />
                <HUD
                    asteroidsKilled={hud.asteroidsKilled}
                    lives={hud.lostLives}
                />
                <ControlsHint />
            </div>

            {/* MENU */}
            <Overlay
                open={state === "menu"}
                title="ASTEROID SURVIVAL"
                actionLabel="START GAME"
                onAction={() => appRef.current?.start()}
            />

            {/* GAME OVER */}
            <Overlay
                open={state === "gameover"}
                title="GAME OVER"
                actionLabel="RESTART"
                onAction={() => {
                    appRef.current?.reset();
                    appRef.current?.start();
                }}
            />

            {/* PAUSE */}
            {state === "paused" && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-50">
                    PAUSED
                </div>
            )}
        </GameShell>
    );
}