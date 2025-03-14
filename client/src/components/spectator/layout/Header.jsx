import React from 'react';

export default function Header({ playersCount, bulletsCount, showStats, onToggleStats }) {
    return (
        <div className="w-full bg-black/60 backdrop-blur-md border-b border-indigo-500/20 shadow-lg z-10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">TANK.IO</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="px-3 py-1 bg-indigo-500/20 backdrop-blur-sm rounded-md border border-indigo-500/30 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-indigo-300 font-medium">
                                Players: <span className="text-white">{playersCount}</span>
                            </span>
                        </div>

                        <div className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm rounded-md border border-orange-500/30 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-orange-300 font-medium">
                                Bullets: <span className="text-white">{bulletsCount}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center mr-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-green-300 text-sm">Spectator Mode</span>
                    </div>

                    <button
                        onClick={onToggleStats}
                        className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-md transition-colors duration-200 flex items-center gap-1 backdrop-blur-sm border border-gray-600/30"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                </div>
            </div>
        </div>
    );
}