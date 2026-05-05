export function Overlay({
    open,
    title,
    actionLabel,
    onAction,
}: {
    open: boolean;
    title: string;
    actionLabel: string;
    onAction: () => void;
}) {
    if (!open) return null;

    return (
        <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-xl flex items-center justify-center">

            <div className="bg-black/60 border border-white/10 rounded-3xl px-10 py-8 text-center space-y-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">

                <h1 className="text-3xl font-semibold tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                    {title}
                </h1>

                <div className="w-16 h-px bg-white/20 mx-auto" />

                <button
                    onClick={onAction}
                    className="px-8 py-3 bg-white text-black font-semibold rounded-xl 
                               hover:bg-white/90 active:scale-95 transition-all duration-150
                               shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                    {actionLabel}
                </button>

            </div>
        </div>
    );
}