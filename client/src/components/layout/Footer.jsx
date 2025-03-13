import React from 'react';
import { config } from '../../config/config';
export default function Footer() {
    return (
        <div className="w-full bg-black/40 backdrop-blur-sm border-t border-indigo-500/10 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center">
                <div className="text-sm text-gray-400">
                    Use your mobile device to join the game at <span className="text-indigo-400 font-medium">{config.clientUrl}</span>
                </div>
            </div>
        </div>
    );
}