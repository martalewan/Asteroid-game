import { useState, useCallback, useRef } from "react";
import { createGameApp } from "../game/runtime/createGameApp";
import { GameShell } from "./GameShell";
import { GameCanvas } from "./GameCanvas";
import { HUD } from "./HUD";
import { Overlay } from "./Overlay";
import { ControlsHint } from "./ControlsHint";

export default function GameScreen() {
    const [hud, setHud] = useState({
        asteroidsKilled: 0,
        lostLives: 0,
    });

    const [started, setStarted] = useState(false);

    const appRef = useRef<any>(null);
    const unsubscribeRef = useRef<null | (() => void)>(null);

    const mountCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const instance = createGameApp(canvas);
        instance.init();

        const store = instance.getState();

        unsubscribeRef.current?.();

        unsubscribeRef.current = store.subscribe(() => {
            setHud(store.getState());
        });

        appRef.current = instance;
    }, []);

    return (
        <GameShell>
            <GameCanvas onMount={mountCanvas} />

            <HUD
                asteroidsKilled={hud.asteroidsKilled}
                lives={hud.lostLives}
            />
            <ControlsHint />

            <Overlay
                open={!started}
                title="ASTEROID SURVIVAL"
                actionLabel="START GAME"
                onAction={() => {
                    setStarted(true);
                    appRef.current?.start();
                }}
            />
        </GameShell>
    );
}