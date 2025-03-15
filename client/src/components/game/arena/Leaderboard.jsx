import React from 'react';

function Leaderboard({ players }) {
    // Convert Map to array, sort by score (highest first), and take top 5
    const topPlayers = Array.from(players.entries())
        .map(([sessionId, player]) => ({
            id: sessionId,
            username: player.username || `Player ${sessionId.substr(0, 4)}`,
            score: player.score || 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    // Generate clip-path for Arknights-style angular container
    const clipPathStyle = "polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%, 5% 50%)";

    return (
        <div
            className="absolute top-20 right-4 p-4 text-white shadow-lg w-64 border-l-2 border-white bg-[#1a1a20]/80 overflow-hidden"
            style={{ clipPath: clipPathStyle }}
        >
            {/* Arknights-style overlay patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>

            {/* Diagonal border accent */}
            <div className="absolute top-0 right-0 w-[40%] h-1 bg-white/50"></div>
            <div className="absolute bottom-0 left-0 w-[40%] h-1 bg-white/50"></div>

            <h3 className="text-white font-mono uppercase tracking-wider text-sm mb-3 flex items-center z-10 relative">
                <span className="border border-white/30 px-2 py-0.5 mr-2">R-01</span>
                TACTICAL DATA // RANKING
            </h3>

            <div className="space-y-2 z-10 relative">
                {topPlayers.map((player, index) => (
                    <div
                        key={player.id}
                        className={`flex items-center justify-between py-1.5 
                            ${index !== topPlayers.length - 1 ? "border-b border-white/10" : ""}`}
                    >
                        <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center mr-2 relative">
                                {/* Hexagonal rank indicator */}
                                <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                                    <polygon
                                        points="50,0 100,25 100,75 50,100 0,75 0,25"
                                        fill={index === 0 ? "rgba(255, 255, 255, 0.8)" : "#1a1a20"}
                                        stroke={index === 0 ? "white" : "rgba(255, 255, 255, 0.3)"}
                                        strokeWidth="3"
                                    />
                                </svg>
                                <span className={`z-10 font-mono font-bold ${index === 0 ? "text-black" : "text-white"}`}>
                                    {index + 1}
                                </span>
                            </div>
                            <span className="truncate max-w-[120px] font-mono" title={player.username}>
                                {player.username}
                            </span>
                        </div>
                        <span className="font-mono text-white bg-white/10 px-1 border border-white/20">
                            {player.score}
                        </span>
                    </div>
                ))}

                {topPlayers.length === 0 && (
                    <div className="text-center text-white/40 py-2 font-mono border border-white/10">
                        --NO DATA AVAILABLE--
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
    );
};

export default Leaderboard;