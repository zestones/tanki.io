import React from 'react';
import { config } from '../../../config/config';

export default function Footer() {
    return (
        <div className="w-full bg-black/60 backdrop-blur-md border-t border-white/20 py-3 px-4 relative overflow-hidden">
            {/* Hexagonal grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwNDAiIHN0cm9rZS13aWR0aD0iMC44IiBkPSJNMjUsMSBMMSwyMSBMMSw2MSBMMjUsODEgTDQ5LDYxIEw0OSwyMSBMMjUsMSIgLz48L3N2Zz4=')] opacity-5"></div>

            {/* Angular corners */}
            <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleY(-1)' }}>
                    <path d="M0 0L64 0L64 12L12 12L12 64L0 64L0 0Z" fill="rgba(255, 255, 255, 0.1)" />
                    <path d="M0 0L60 0L60 2L2 2L2 60L0 60L0 0Z" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(-1, -1)' }}>
                    <path d="M0 0L64 0L64 12L12 12L12 64L0 64L0 0Z" fill="rgba(255, 255, 255, 0.1)" />
                    <path d="M0 0L60 0L60 2L2 2L2 60L0 60L0 0Z" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center relative">
                <div className="flex items-center bg-white/5 border border-white/20 px-4 py-1"
                    style={{ clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)" }}>
                    <div className="border border-white/30 px-2 py-0.5 mr-3">
                        <span className="text-white/70 font-mono text-xs">INFO</span>
                    </div>
                    <div className="text-sm text-white/80 font-mono">
                        JOIN BATTLE AT <span className="text-white font-bold">{config.clientUrl}</span>
                    </div>
                </div>
            </div>

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
        </div>
    );
}