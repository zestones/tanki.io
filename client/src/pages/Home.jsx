import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            // Store username in sessionStorage
            sessionStorage.setItem('username', username.trim());
            navigate('/tanki.io/controller');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2">TANK.IO</h1>
                    <p className="text-gray-300 text-lg">Dominate the battlefield!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                            COMMANDER NAME
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105 shadow-lg"
                    >
                        DEPLOY TANK
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/game" className="text-sm text-indigo-300 hover:text-indigo-200 underline">
                        Open Game Screen (Spectator Mode)
                    </a>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6">
                    <h3 className="text-gray-300 font-semibold mb-2">How to Play:</h3>
                    <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Enter your name and hit DEPLOY TANK</li>
                        <li>• Control your tank using the arrow buttons</li>
                        <li>• Press the SHOOT button to fire</li>
                        <li>• Hit enemy tanks to reduce their HP</li>
                        <li>• Last tank standing wins!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 