import { withOpacity } from "../../../utils/colorUtils";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function AuthModal({ containerVariants, itemVariants, themeColor, onLogin, inputRef, username, setUsername }) {
    const [orientation, setOrientation] = useState(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    );

    // Handle orientation changes
    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        window.addEventListener('resize', handleOrientationChange);
        return () => window.removeEventListener('resize', handleOrientationChange);
    }, []);

    return (
        <motion.div
            className="flex-grow flex flex-col justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            {/* Login interface with fixed positioning */}
            <motion.div
                variants={itemVariants}
                className="bg-black bg-opacity-70 border border-gray-800 p-5 max-w-md w-full mx-auto relative"
                style={{ boxShadow: `0 0 20px ${withOpacity(themeColor, 0.2)}` }}
            >
                {/* Authentication badge - moved inside the container with proper z-index */}
                <div className="absolute -top-3 left-0 transform -translate-y-full flex items-center">
                    <div
                        className="px-2 py-1 bg-black border-t border-l border-r"
                        style={{ borderColor: withOpacity(themeColor, 0.5) }}
                    >
                        <div className="text-xs text-blue-400 font-mono tracking-wider flex items-center">
                            <span className="h-2 w-2 rounded-full animate-pulse mr-2" style={{ backgroundColor: themeColor }}></span>
                            |AUTHENTICATION REQUIRED|
                        </div>
                    </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: themeColor }}></div>

                <div className="relative mb-6 pt-1">
                    <h2 className={`${orientation === 'portrait' ? 'text-xl' : 'text-lg'} font-bold mb-3`} style={{ color: themeColor }}>
                        TACTICAL COMMANDER INTERFACE
                    </h2>
                    <div className="h-1 w-16 mb-3" style={{ backgroundColor: themeColor }}></div>

                    <p className={`text-gray-300 mb-4 ${orientation === 'landscape' ? 'text-sm' : ''}`}>
                        Enter your tactical callsign to access the command network.
                    </p>
                </div>

                <form onSubmit={onLogin}>
                    {/* Fixed input group with properly positioned label */}
                    <div className="relative mb-6 group">
                        {/* Label positioned with proper z-index and background */}
                        <div className="absolute -top-2.5 left-3 z-10 px-1 bg-black">
                            <label
                                htmlFor="username"
                                className="text-xs text-gray-400 group-focus-within:text-blue-400"
                            >
                                COMMANDER CALLSIGN
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                ref={inputRef}
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black bg-opacity-70 border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-blue-500"
                                style={{ boxShadow: `inset 0 0 10px ${withOpacity(themeColor, 0.2)}` }}
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                            <div
                                className="absolute left-0 bottom-0 h-0.5 transition-all duration-300"
                                style={{
                                    width: username ? '100%' : '0%',
                                    backgroundColor: themeColor,
                                    boxShadow: `0 0 10px ${withOpacity(themeColor, 0.7)}`
                                }}
                            ></div>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={!username.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full ${orientation === 'landscape' ? 'py-2' : 'py-3'} font-bold tracking-wider relative overflow-hidden`}
                        style={{
                            backgroundColor: username.trim() ? themeColor : withOpacity(themeColor, 0.3),
                            cursor: username.trim() ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <span className="relative z-10">
                            {orientation === 'landscape' ? 'CONNECT' : 'ESTABLISH CONNECTION'}
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-white opacity-20"
                            initial={{ x: "-100%" }}
                            animate={{ x: username.trim() ? "100%" : "-100%" }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                    </motion.button>
                </form>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="text-center mt-4 text-sm text-gray-400"
            >
                <p>TACTICAL NETWORK STATUS: <span className="text-green-400">ONLINE</span></p>
                <p className="mt-1">ENCRYPTED CONNECTION ACTIVE</p>
            </motion.div>
        </motion.div>
    );
}

AuthModal.propTypes = {
    containerVariants: PropTypes.object.isRequired,
    itemVariants: PropTypes.object.isRequired,
    themeColor: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    inputRef: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired
};

export default AuthModal;