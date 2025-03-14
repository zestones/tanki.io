import React from 'react';

export default function PlayerStatus({ username, health, score = 0 }) {
    return (
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white flex items-center justify-between w-full max-w-md mx-auto">
            <div className="flex items-center">
                <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    {username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{username}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{health}</span>
                </div>

                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{score}</span>
                </div>
            </div>
        </div>
    );
}