import React from 'react';

function Leaderboard({ players }) {
    const getPositionColor = (index) => {
        if (index === 0) return 'bg-yellow-500';
        if (index === 1) return 'bg-gray-400';
        if (index === 2) return 'bg-amber-700';
        return 'bg-gray-700';
    };

    // Convert Map to array, sort by score (highest first), and take top 5
    const topPlayers = Array.from(players.entries())
        .map(([sessionId, player]) => ({
            id: sessionId,
            username: player.username || `Player ${sessionId.substr(0, 4)}`,
            score: player.score || 0
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return (
        <div className="absolute top-20 right-4 rounded-lg p-4 text-white shadow-lg w-64 border border-gray-800/50">
            <h3 className="text-sm uppercase tracking-wider text-indigo-400 font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Top Players
            </h3>

            <div className="space-y-2">
                {topPlayers.map((player, index) => (
                    <div
                        key={player.id}
                        className="flex items-center justify-between py-1 border-b border-gray-700/30 last:border-0"
                    >
                        <div className="flex items-center">
                            <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 
                                ${getPositionColor(index)}`}
                            >
                                {index + 1}
                            </div>
                            <span className="truncate max-w-[120px]" title={player.username}>
                                {player.username}
                            </span>
                        </div>
                        <span className="font-medium text-indigo-300">
                            {player.score}
                        </span>
                    </div>
                ))}

                {topPlayers.length === 0 && (
                    <div className="text-center text-gray-500 py-2">
                        No players yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;