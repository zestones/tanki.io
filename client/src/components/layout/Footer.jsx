import React from 'react';

export default function Footer() {
    return (
        <div className="w-full bg-black/40 backdrop-blur-sm border-t border-indigo-500/10 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
                <div className="text-sm text-gray-400">
                    Use your mobile device to join the game at <span className="text-indigo-400 font-medium">http://localhost:5173</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 md:mt-0">
                    © 2023 TANK.IO | Made with ❤️ by Your Team
                </div>
            </div>
        </div>
    );
}