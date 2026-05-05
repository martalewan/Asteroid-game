export function GameShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen bg-black overflow-hidden relative font-mono">
            {children}
        </div>
    );
}