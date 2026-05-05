import { useRef, useEffect } from "react";

export function GameCanvas({
    onMount,
}: {
    onMount: (canvas: HTMLCanvasElement) => void;
}) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (ref.current) onMount(ref.current);
    }, [onMount]);

    return <canvas ref={ref} className="w-full h-full absolute inset-0 z-0" />;
}