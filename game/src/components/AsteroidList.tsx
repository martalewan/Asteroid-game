import { useEffect, useState } from "react";
import { fetchAsteroids } from "../services/asteroidService";

export function AsteroidList() {
    const [asteroids, setAsteroids] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchAsteroids().then((data) => {
            setAsteroids(data);
        });
    }, []);

    return (
        <div className="absolute top-4 left-4 z-50 text-white">
            <button
                onClick={() => setOpen((v) => !v)}
                onKeyDown={(e) => e.stopPropagation()}
                className="mb-2 px-3 py-1 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-md transition"
            >
                {open ? "Hide NASA Panel" : "Show NASA Data"}
            </button>

            {open && (
                <div className="w-80 bg-black/50 border border-white/10 rounded-xl p-3 backdrop-blur-md">
                    {/* HEADER */}
                    <div className="mb-3">
                        <h2 className="text-sm uppercase tracking-[0.25em] text-white/70">
                            NASA — Near Earth Objects
                        </h2>
                        <p className="text-xs text-white/40">
                            Asteroid tracking feed (mock + API)
                        </p>
                    </div>

                    <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
                        {asteroids.slice(0, 10).map((a: any) => {
                            const size =
                                a?.estimated_diameter?.meters
                                    ?.estimated_diameter_max;

                            return (
                                <div
                                    key={a.id}
                                    className="p-2 bg-white/5 border border-white/10 rounded-lg"
                                >
                                    <div className="text-sm font-semibold">
                                        {a.name}
                                    </div>

                                    <div className="text-xs text-white/60 flex justify-between mt-1">
                                        <span>ID: {a.id}</span>
                                        <span>
                                            {size
                                                ? `${Math.round(size)} m`
                                                : "unknown size"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-2 text-[10px] text-white/30 uppercase tracking-widest">
                        NASA JPL dataset
                    </div>
                </div>
            )}
        </div>
    );
}