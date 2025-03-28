import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { withOpacity } from '../utils/colorUtils';

import AuthModal from '../components/mobile/menu/AuthModal';

import PropTypes from 'prop-types';
import MenuOptions from '../components/mobile/menu/MenuOptions';

function Home({ themeColor = "#3498db" }) {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orientation, setOrientation] = useState(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const rootRef = useRef(null);

    // Check if user is already authenticated
    useEffect(() => {
        const savedUsername = sessionStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
            setIsAuthenticated(true);
        }

        // Focus on input when component mounts
        if (inputRef.current && !isAuthenticated) {
            inputRef.current.focus();
        }

        // Handle orientation changes
        const handleOrientationChange = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        window.addEventListener('resize', handleOrientationChange);
        return () => window.removeEventListener('resize', handleOrientationChange);
    }, [isAuthenticated]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            sessionStorage.setItem('username', username.trim());
            setIsAuthenticated(true);
        }
    };

    const handleMenuOption = (option) => {
        switch (option) {
            case 'play':
                navigate('/tanki.io/tank-selection');
                break;
            case 'tutorial':
                console.log('Tutorial clicked');
                // Implement tutorial navigation
                break;
            case 'spectate':
                navigate('/tanki.io/game');
                break;
            case 'quit':
                console.log('Quit clicked');
                sessionStorage.removeItem('username');
                setIsAuthenticated(false);
                setUsername('');
                break;
            default:
                break;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: { ease: "easeInOut" }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div ref={rootRef} className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Background with hexagonal grid pattern */}
            <div className="absolute inset-0 bg-[#141418] z-0">
                {/* Hexagonal grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwNDAiIHN0cm9rZS13aWR0aD0iMC44IiBkPSJNMjUsMSBMMSwyMSBMMSw2MSBMMjUsODEgTDQ5LDYxIEw0OSwyMSBMMjUsMSIgLz48L3N2Zz4=')] opacity-10"></div>

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${withOpacity(themeColor, 0.15)}, transparent 70%)` }}></div>

                {/* Animated grid lines */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={`h-${i}`}
                            className="absolute w-full h-px bg-blue-400"
                            style={{
                                top: `${i * 10}%`,
                                backgroundImage: `linear-gradient(90deg, transparent, ${withOpacity(themeColor, 0.5)}, transparent)`,
                                animation: `scanline ${3 + i * 0.5}s linear infinite`
                            }}
                        ></div>
                    ))}
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={`v-${i}`}
                            className="absolute h-full w-px bg-blue-400"
                            style={{
                                left: `${i * 10}%`,
                                backgroundImage: `linear-gradient(0deg, transparent, ${withOpacity(themeColor, 0.5)}, transparent)`,
                                animation: `scanlineVertical ${3 + i * 0.5}s linear infinite`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Top navigation bar */}
            <div className="relative z-10 bg-black bg-opacity-70 border-b border-gray-800 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-3 h-3 mr-2" style={{ backgroundColor: themeColor }}></div>
                    <h1 className="text-lg font-bold tracking-wider">TANKI.IO</h1>
                </div>
                <div className="flex items-center">
                    <div className="text-xs font-mono text-gray-400">SYSTEM v2.5</div>
                    <div className="ml-2 h-2 w-2 rounded-full animate-pulse bg-green-500"></div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-grow flex flex-col relative z-10">
                {!isAuthenticated ? (
                    <AuthModal
                        containerVariants={containerVariants}
                        itemVariants={itemVariants}
                        themeColor={themeColor}
                        onLogin={handleSubmit}
                        inputRef={inputRef}
                        username={username}
                        setUsername={setUsername}
                    />
                ) : (
                    <MenuOptions
                        containerVariants={containerVariants}
                        itemVariants={itemVariants}
                        username={username}
                        themeColor={themeColor}
                        handleMenuOption={handleMenuOption}
                    />
                )}
            </div>

            {/* Scanlines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.02)_50%)] bg-[length:100%_2px] pointer-events-none z-20"></div>

            {/* Global CSS for animations */}
            <style jsx="true">{`
                @keyframes scanline {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes scanlineVertical {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            `}</style>
        </div>
    );
}


Home.propTypes = {
    themeColor: PropTypes.string
};

export default Home;