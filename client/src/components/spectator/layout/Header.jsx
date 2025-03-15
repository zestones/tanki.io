import React from 'react';

export default function Header({ playersCount, bulletsCount, showStats, onToggleStats }) {
    return (
        <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/20 shadow-lg z-10 relative overflow-hidden">
            {/* Hexagonal grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwNDAiIHN0cm9rZS13aWR0aD0iMC44IiBkPSJNMjUsMSBMMSwyMSBMMSw2MSBMMjUsODEgTDQ5LDYxIEw0OSwyMSBMMjUsMSIgLz48L3N2Zz4=')] opacity-5"></div>

            {/* Angular corner decoration - top right */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 0L0 0L0 12L52 12L52 64L64 64L64 0Z" fill="rgba(255, 255, 255, 0.1)" style={{ transform: 'scale(-1, 1)' }} />
                    <path d="M64 0L4 0L4 2L62 2L62 60L64 60L64 0Z" fill="rgba(255, 255, 255, 0.15)" style={{ transform: 'scale(-1, 1)' }} />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between relative">
                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        {/* Logo with angular polygon background */}
                        <div className="w-10 h-10 relative mr-3">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                                <polygon points="50,0 95,25 95,75 50,100 5,75 5,25" fill="#1a1a20" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white font-mono tracking-wider">TANK.IO</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {/* Angular player counter */}
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center"
                            style={{ clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-white/70 font-mono">
                                PLAYERS: <span className="text-white">{playersCount}</span>
                            </span>
                        </div>

                        {/* Angular bullet counter */}
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center"
                            style={{ clipPath: "polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-white/70 font-mono">
                                BULLETS: <span className="text-white">{bulletsCount}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Spectator mode indicator with hexagonal pulse */}
                    <div className="flex items-center mr-2 bg-white/5 border border-white/10 px-2 py-1">
                        <div className="relative w-4 h-4 mr-2">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="rgba(0, 255, 128, 0.5)" fill="transparent" strokeWidth="10" className="animate-pulse" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-white/80 text-sm font-mono">SPECTATOR MODE</span>
                    </div>

                    {/* Stats toggle button */}
                    <button
                        onClick={onToggleStats}
                        className="px-3 py-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors duration-200 flex items-center gap-1 backdrop-blur-sm"
                        style={{ clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-mono">{showStats ? 'HIDE STATS' : 'SHOW STATS'}</span>
                    </button>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
    );
}