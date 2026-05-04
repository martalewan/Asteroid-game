import { useEffect, useRef } from "react";
import { startGame } from "./game";

export default function GameCanvas() {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        startGame(ref.current);
    }, []);

    return (
        <canvas
            ref={ref}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ display: "block", background: "black" }}
        />
    );
}