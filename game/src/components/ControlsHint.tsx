export function ControlsHint() {
    return (
        <div className="absolute bottom-4 left-4 z-10 text-white/60 text-xs font-mono space-y-1">
            <div><span className="text-white">Enter</span> → Start</div>
            <div><span className="text-white">Esc</span> → Pause / Resume</div>
            <div><span className="text-white">R</span> → Reset</div>
            <div><span className="text-white">Arrow Keys</span> → Move</div>
            <div><span className="text-white">Space</span> → Shoot</div>
        </div>
    );
}