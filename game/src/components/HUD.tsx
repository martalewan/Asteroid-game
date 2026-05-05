type HUDProps = {
    asteroidsKilled: number;
    lives: number;
};

export function HUD({ asteroidsKilled, lives }: HUDProps) {
    return (
        <div className="absolute top-6 right-6 z-10">
            <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-5 shadow-[0_0_40px_rgba(0,0,0,0.7)]">

                <div className="text-[10px] uppercase tracking-[0.35em] text-white/40 mb-5">
                    GAME STATUS
                </div>

                <div className="space-y-5 min-w-[160px]">

                    <div className="flex items-end justify-between">
                        <span className="text-xs tracking-widest text-white/50">
                            ASTEROIDS
                        </span>
                        <span className="text-lg font-semibold text-white tabular-nums leading-none">
                            {asteroidsKilled}
                        </span>
                    </div>

                    <div className="flex items-end justify-between">
                        <span className="text-xs tracking-widest text-white/50">
                            LIVES
                        </span>
                        <span className="text-lg font-semibold text-white tabular-nums leading-none">
                            {lives}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}