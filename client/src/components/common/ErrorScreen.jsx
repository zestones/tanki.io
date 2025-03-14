import React from 'react';

export default function ErrorScreen({ error }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
            <div className="text-center bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md border border-red-500/30">
                <div className="w-20 h-20 mx-auto mb-6 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">Connection Failed</h2>
                <p className="text-red-400 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
}