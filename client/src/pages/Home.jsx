import { AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFullscreenContext } from '../contexts/FullscreenContext';
import FullscreenModal from '../components/ui/FullscreenModal';

export default function Home() {
    const [username, setUsername] = useState('');
    const [animateIn, setAnimateIn] = useState(false);
    const [showFullscreenModal, setShowFullscreenModal] = useState(false);
    const navigate = useNavigate();

    const rootRef = useRef(null);
    const { isFullscreen, enterFullscreen } = useFullscreenContext();

    useEffect(() => {
        setAnimateIn(true);

        // TODO : add this in prod if needed !localStorage.getItem('fullscreenDismissed')
        if (!isFullscreen) {
            setShowFullscreenModal(true);
        }
    }, [isFullscreen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            // Store username in sessionStorage
            sessionStorage.setItem('username', username.trim());
            navigate('/tanki.io/tank-selection');
        }
    };

    // Request fullscreen using the context
    const enableFullscreen = () => {
        enterFullscreen(document.documentElement); // Using document.documentElement for full page
        setShowFullscreenModal(false);

        // Store fullscreen preference
        sessionStorage.setItem('preferFullscreen', 'true');
    };

    // Dismiss fullscreen modal and remember choice
    const dismissFullscreenModal = () => {
        localStorage.setItem('fullscreenDismissed', 'true');
        setShowFullscreenModal(false);
    };

    // Theme color
    const themeColor = "#3498db";

    return (
        <div ref={rootRef} className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Top navigation bar */}
            <div className="bg-black bg-opacity-70 py-2 px-4 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center">
                    <div className="w-1 h-5 mr-2" style={{ backgroundColor: themeColor }}></div>
                    <h1 className="text-sm font-light tracking-widest">
                        TANKI.IO
                    </h1>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    SYSTEM v2.5
                </div>
            </div>

            {/* Main content */}
            <div className="flex-grow flex flex-col">
                {/* Header with animated entry */}
                <div className={`px-4 pt-8 pb-2 transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-1">
                            <h1 className="text-3xl font-bold text-white tracking-wider">TANKI.IO</h1>
                            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                        </div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Tactical Tank Combat System</p>
                    </div>
                </div>

                {/* Hexagonal frame decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-4 w-10 h-10 border-t-2 border-l-2 border-gray-700 opacity-70"></div>
                    <div className="absolute top-20 right-4 w-10 h-10 border-t-2 border-r-2 border-gray-700 opacity-70"></div>
                </div>

                {/* Login form with animated entry */}
                <div className={`px-6 transition-all duration-700 delay-300 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <div className="flex items-center mb-2">
                                <div className="w-1 h-4 mr-2" style={{ backgroundColor: themeColor }}></div>
                                <label htmlFor="username" className="text-xs uppercase tracking-wider text-gray-300">
                                    Commander Identification
                                </label>
                            </div>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                placeholder="Enter tactical callsign"
                                required
                                style={{ boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)" }}
                            />
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <Info size={10} className="mr-1" />
                                <span>Required for battlefield identification</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Unit statistics preview section */}
                <div className={`px-6 mt-8 transition-all duration-700 delay-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="flex items-center mb-4">
                        <div className="w-1 h-4 mr-2" style={{ backgroundColor: themeColor }}></div>
                        <h2 className="text-xs uppercase tracking-wider text-gray-300">Combat Operation Status</h2>
                    </div>

                    <div className="bg-black bg-opacity-50 border border-gray-800 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                <span className="text-xs text-green-400">OPERATION ACTIVE</span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">ID: TK-274</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Active Units</span>
                                <span className="text-white font-mono">6</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Battlefield Status</span>
                                <span className="text-white font-mono">CONTESTED</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Operation Time</span>
                                <span className="text-white font-mono">01:32:47</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deploy button and options */}
                <div className={`flex-grow flex flex-col justify-end transition-all duration-700 delay-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    {/* How to play section */}
                    <div className="px-6 mb-4">
                        <div className="flex items-center mb-2">
                            <AlertTriangle size={12} className="mr-2 text-yellow-500" />
                            <h3 className="text-xs uppercase tracking-wider text-yellow-500">Mission Briefing</h3>
                        </div>

                        <ul className="text-xs text-gray-300 space-y-1 pl-2">
                            <li className="flex">
                                <span className="text-gray-500 mr-2">•</span>
                                <span>Deploy your tank and engage hostiles</span>
                            </li>
                            <li className="flex">
                                <span className="text-gray-500 mr-2">•</span>
                                <span>Use tactical controls for navigation</span>
                            </li>
                            <li className="flex">
                                <span className="text-gray-500 mr-2">•</span>
                                <span>Execute firing sequence on enemies</span>
                            </li>
                            <li className="flex">
                                <span className="text-gray-500 mr-2">•</span>
                                <span>Secure battlefield dominance</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action buttons */}
                    <div className="bg-black bg-opacity-80 p-6 border-t border-gray-800">
                        <button
                            onClick={handleSubmit}
                            disabled={!username.trim()}
                            className={`w-full py-3 mb-3 flex items-center justify-center ${username.trim() ? 'opacity-100' : 'opacity-50'}`}
                            style={{
                                backgroundColor: themeColor,
                                boxShadow: username.trim() ? `0 0 20px ${themeColor}80` : 'none'
                            }}
                        >
                            <span className="font-bold tracking-wider mr-2">DEPLOY</span>
                            <ArrowRight size={16} />
                        </button>

                        <button
                            onClick={() => navigate('/tanki.io/game')}
                            className="w-full py-3 border border-gray-700 bg-transparent flex items-center justify-center"
                        >
                            <span className="text-sm tracking-wider text-gray-400">SPECTATE OPERATION</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal Component */}
            {showFullscreenModal && (
                <FullscreenModal
                    onEnable={enableFullscreen}
                    onDismiss={dismissFullscreenModal}
                    themeColor={themeColor}
                />
            )}
        </div>
    );
}