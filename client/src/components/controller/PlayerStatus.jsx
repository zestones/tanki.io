export default function PlayerStatus({ username, health, score = 0 }) {
    // Calculate health percentage for progress bar
    // TODO : make the 3 match the max health in the server
    const healthPercentage = Math.max(0, Math.min(100, (health / 3) * 100));

    return (
        <div className="bg-black/30 backdrop-blur-md rounded-lg border border-indigo-500/30 shadow-lg shadow-indigo-500/20 p-3 text-white flex items-center justify-between w-full max-w-md mx-auto relative overflow-hidden">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-cyan-400/5 animate-pulse" />

            {/* Diagonal lines overlay for tech feel */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_95%,rgba(99,102,241,0.3)_100%)] bg-[length:6px_6px]" />

            <div className="flex items-center z-10">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl w-10 h-10 flex items-center justify-center mr-3 shadow-md shadow-indigo-500/50 border border-indigo-400/30">
                    <span className="font-bold text-white text-shadow">{username.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <span className="font-medium tracking-wide text-cyan-50">{username}</span>
                    <div className="text-xs text-cyan-300/70 mt-0.5 font-mono">ACTIVE</div>
                </div>
            </div>

            <div className="flex items-center gap-5 z-10">
                {/* Health with modern progress bar */}
                <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                        {/* Modern heart icon */}
                        <svg className="h-4 w-4 text-red-400 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                fill="rgba(248, 113, 113, 0.5)" />
                        </svg>
                        <span className="text-sm font-mono">{health}</span>
                    </div>
                    <div className="w-16 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full"
                            style={{ width: `${healthPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Score with better star icon */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                        <span className="text-sm font-mono mr-1">{score}</span>
                        {/* Modern star icon */}
                        <svg className="h-4 w-4 text-amber-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"
                                fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="text-xs text-amber-300/70 font-mono">POINTS</div>
                </div>
            </div>
        </div>
    );
}