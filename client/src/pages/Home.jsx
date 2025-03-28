import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaPlay, FaBook, FaEye, FaPowerOff } from 'react-icons/fa';

function Home({ themeColor = "#3498db" }) {
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [orientation, setOrientation] = useState(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Helper function to make colors semi-transparent
    const withOpacity = (color, opacity) => {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    };

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
                staggerChildren: 0.2
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
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Background with hexagonal grid pattern similar to Controller.jsx */}
            <div className="absolute inset-0 bg-[#141418] z-0">
                {/* Hexagonal grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDUwIDQzIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzMDMwNDAiIHN0cm9rZS13aWR0aD0iMC44IiBkPSJNMjUsMSBMMSwyMSBMMSw2MSBMMjUsODEgTDQ5LDYxIEw0OSwyMSBMMjUsMSIgLz48L3N2Zz4=')] opacity-10"></div>

                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-[#141418] opacity-70"></div>
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${withOpacity(themeColor, 0.15)}, transparent 70%)` }}></div>
            </div>

            {/* Corner decorations similar to Controller.jsx */}
            <div className="absolute top-4 left-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(themeColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(themeColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute top-4 right-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(themeColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(themeColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleY(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(themeColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(themeColor, 0.5)} />
                </svg>
            </div>
            <div className="absolute bottom-4 right-4 w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(-1)' }}>
                    <path d="M0 0L80 0L80 16L16 16L16 80L0 80L0 0Z" fill={withOpacity(themeColor, 0.2)} />
                    <path d="M0 0L70 0L70 3L3 3L3 70L0 70L0 0Z" fill={withOpacity(themeColor, 0.5)} />
                </svg>
            </div>

            {/* Center hexagon decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-15 pointer-events-none">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <polygon points="50,3 97,25 97,75 50,97 3,75 3,25" stroke={withOpacity(themeColor, 0.3)} strokeWidth="1" />
                    <polygon points="50,15 85,30 85,70 50,85 15,70 15,30" stroke={withOpacity(themeColor, 0.2)} strokeWidth="1" />
                    <polygon points="50,30 70,40 70,60 50,70 30,60 30,40" stroke={withOpacity(themeColor, 0.4)} strokeWidth="1" />
                </svg>
            </div>

            {/* Main content container */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-full max-w-md mx-auto px-4">
                    {!isAuthenticated ? (
                        <motion.div
                            className="auth-container"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={containerVariants}
                        >
                            {/* Username authentication UI */}
                            <div className="relative mb-8">
                                <div className="absolute -top-6 -left-2 text-xs text-blue-400 font-mono tracking-wider">
                                    |AUTHENTICATION REQUIRED|
                                </div>
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-6"></div>

                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col items-center justify-center"
                                >
                                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: themeColor }}>
                                        TACTICAL COMMANDER INTERFACE
                                    </h1>
                                    <div className="w-16 h-1 mb-4" style={{ backgroundColor: withOpacity(themeColor, 0.5) }}></div>
                                    <p className="text-gray-300 text-center mb-6">
                                        Commander, state your tactical callsign to join the warfare!
                                    </p>
                                </motion.div>

                                <motion.form
                                    variants={itemVariants}
                                    onSubmit={handleSubmit}
                                    className="w-full"
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-8" style={{ backgroundColor: withOpacity(themeColor, 0.7) }}></div>

                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter Tactical Callsign"
                                            className="w-full bg-black bg-opacity-50 border border-gray-800 text-white px-4 py-3 focus:outline-none"
                                            style={{ boxShadow: `inset 0 0 10px ${withOpacity(themeColor, 0.1)}` }}
                                        />

                                        <div
                                            className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
                                            style={{
                                                width: username ? '100%' : '0%',
                                                backgroundColor: themeColor,
                                                boxShadow: `0 0 10px ${withOpacity(themeColor, 0.5)}`
                                            }}
                                        ></div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={!username.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 font-bold tracking-wider relative overflow-hidden"
                                        style={{
                                            backgroundColor: username.trim() ? withOpacity(themeColor, 1) : withOpacity(themeColor, 0.3),
                                            cursor: username.trim() ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        <span className="relative z-10">ESTABLISH CONNECTION</span>
                                        <div className="absolute inset-0 flex items-center justify-start overflow-hidden">
                                            <div className="w-full h-full flex flex-nowrap opacity-20">
                                                {[...Array(20)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="h-10 w-10 -rotate-45 bg-white"
                                                        style={{
                                                            opacity: Math.max(0, 1 - i / 10),
                                                            transform: `translateX(${i * 10}px) rotate(-45deg)`
                                                        }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.button>
                                </motion.form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="menu-container"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={containerVariants}
                        >
                            {/* Main menu UI after authentication */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-8 text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="absolute -top-6 left-0 right-0 text-xs text-center text-blue-400 font-mono tracking-wider">
                                        |TACTICAL SYSTEMS ONLINE|
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-4"></div>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: themeColor }}>
                                    COMMAND TERMINAL
                                </h1>
                                <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: withOpacity(themeColor, 0.5) }}></div>

                                <p className="text-gray-200 text-lg">
                                    Welcome back, Commander <span className="font-bold" style={{ color: themeColor }}>{username}</span>
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Tactical Operations Interface v2.4.7 | <span className="text-green-500">ONLINE</span>
                                </p>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <MenuOption
                                    icon={<FaPlay />}
                                    title="DEPLOY"
                                    description="Enter the frontlines, Commander!"
                                    onClick={() => handleMenuOption('play')}
                                    themeColor={themeColor}
                                    delay={0}
                                />
                                <MenuOption
                                    icon={<FaBook />}
                                    title="TRAINING"
                                    description="Master tactical warfare protocols"
                                    onClick={() => handleMenuOption('tutorial')}
                                    themeColor={themeColor}
                                    delay={0.1}
                                />
                                <MenuOption
                                    icon={<FaEye />}
                                    title="SPECTATE"
                                    description="Monitor active battlefield operations"
                                    onClick={() => handleMenuOption('spectate')}
                                    themeColor={themeColor}
                                    delay={0.2}
                                />
                                <MenuOption
                                    icon={<FaPowerOff />}
                                    title="DISCONNECT"
                                    description="Terminate strategic command session"
                                    onClick={() => handleMenuOption('quit')}
                                    themeColor={themeColor}
                                    isQuit={true}
                                    delay={0.3}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scanlines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_2px] pointer-events-none z-20"></div>

            {/* Bottom line decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 z-20" style={{ background: `linear-gradient(to right, ${withOpacity(themeColor, 0.5)}, transparent, ${withOpacity(themeColor, 0.5)})` }}></div>
        </div>
    );
}

function MenuOption({ icon, title, description, onClick, themeColor, isQuit = false, delay = 0 }) {
    // Helper function to add opacity to colors
    const withOpacity = (color, opacity) => {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return color;
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay,
                duration: 0.3
            }
        }
    };

    const iconColor = isQuit ? "#ff5252" : themeColor;
    const borderColor = isQuit ? "rgba(180, 30, 30, 0.3)" : "rgba(40, 44, 52, 0.8)";
    const hoverBackground = isQuit ? "rgba(180, 30, 30, 0.15)" : withOpacity(themeColor, 0.15);

    return (
        <motion.div
            variants={buttonVariants}
            whileHover={{
                scale: 1.02,
                backgroundColor: hoverBackground,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="relative flex items-center p-4 cursor-pointer bg-black bg-opacity-40 border border-opacity-50 overflow-hidden"
            style={{
                borderColor: borderColor,
            }}
        >
            {/* Background effect */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-10"
                style={{
                    background: `radial-gradient(circle at 30% center, ${isQuit ? 'rgba(255,50,50,0.8)' : themeColor} 0%, transparent 60%)`
                }}
            ></div>

            {/* Animated corner */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 transition-all duration-300"
                style={{ borderColor: iconColor }}></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 transition-all duration-300"
                style={{ borderColor: iconColor }}></div>

            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 mr-4" style={{ color: iconColor }}>
                <div className="text-xl">{icon}</div>
            </div>

            {/* Text content */}
            <div className="flex-1">
                <h3 className="font-bold text-white tracking-wide mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>

            {/* Right indicator */}
            <div className="w-1 h-full absolute right-0 top-0" style={{ backgroundColor: iconColor }}></div>
        </motion.div>
    );
}

MenuOption.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    themeColor: PropTypes.string.isRequired,
    isQuit: PropTypes.bool,
    delay: PropTypes.number
};

Home.propTypes = {
    themeColor: PropTypes.string
};

export default Home;