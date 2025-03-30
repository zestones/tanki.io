import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaPlay, FaBook, FaEye, FaPowerOff } from 'react-icons/fa';
import CommandOption from '../buttons/CommandOption';
import PropTypes from 'prop-types';

function MenuOptions({ username, themeColor, handleMenuOption, containerVariants, itemVariants }) {
    const [orientation, setOrientation] = useState(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    );
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Handle orientation and screen size changes
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setOrientation(height > width ? 'portrait' : 'landscape');
            setScreenSize({ width, height });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // More precise screen size detection
    const isVerySmallScreen = screenSize.width <= 360 || screenSize.height <= 640

;
    const isSmallScreen = screenSize.width <= 390 || screenSize.height <= 700;

    // Determine username display format based on available space
    const displayedUsername = isVerySmallScreen
        ? username.length > 8 ? `${username.substring(0, 6)}..` : username
        : username;

    // Adapt layout for different orientations
    const layoutClasses = orientation === 'landscape'
        ? "flex-row overflow-hidden"
        : "flex-col";

    return (
        <motion.div
            className={`flex-grow flex ${layoutClasses}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
        >
            {orientation === 'landscape' ? (
                // Landscape layout: Side-by-side sections (optimized for small screens)
                <>
                    {/* Left panel with user info and status - reduced size for small screens */}
                    <motion.div
                        variants={itemVariants}
                        className={`${isVerySmallScreen ? 'w-2/5 p-2' : 'w-1/3 p-3'} border-r border-gray-800 bg-black bg-opacity-40 flex flex-col`}
                    >
                        <div className="mb-1">
                            <h2 className={`${isVerySmallScreen ? 'text-base' : 'text-lg'} font-bold`} style={{ color: themeColor }}>
                                COMMAND TERMINAL
                            </h2>
                            <div className="h-0.5 w-12 my-1" style={{ backgroundColor: themeColor }}></div>
                        </div>

                        <div className="flex items-center mb-2">
                            <div className={`${isVerySmallScreen ? 'p-1 mr-1.5' : 'p-1.5 mr-2'} border-2`} style={{ borderColor: themeColor }}>
                                <div className="text-base font-bold" style={{ color: themeColor }}>
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`${isVerySmallScreen ? 'text-xs' : 'text-sm'} truncate`}>
                                    CMD <span className="font-bold" style={{ color: themeColor }}>{displayedUsername}</span>
                                </div>
                                <div className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-gray-400 font-mono`}>
                                    ACCESS GRANTED
                                </div>
                            </div>
                        </div>

                        {/* Status indicators - vertical in landscape */}
                        <div className="flex-grow flex flex-col space-y-1">
                            {['SYSTEMS', 'NETWORK', 'SECURITY'].map((system, index) => (
                                <div key={system} className={`bg-black bg-opacity-60 ${isVerySmallScreen ? 'p-1' : 'p-1.5'} text-center border border-gray-800 flex items-center`}>
                                    <div className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-gray-400 flex-1 text-left`}>{system}</div>
                                    <div className="flex items-center">
                                        <div className="h-1.5 w-1.5 rounded-full animate-pulse mr-1"
                                            style={{
                                                backgroundColor: index === 2 ? '#fbbf24' : '#10b981',
                                                animationDelay: `${index * 0.3}s`
                                            }}></div>
                                        <span className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'}`} style={{ color: index === 2 ? '#fbbf24' : '#10b981' }}>
                                            {index === 2 ? 'ALERT' : 'OK'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* System info at bottom */}
                        <div className="mt-auto pt-1 border-t border-gray-800">
                            <div className="flex items-center justify-between text-[10px] text-gray-400">
                                <div className="flex items-center">
                                    <div className="h-1 w-1 animate-ping rounded-full mr-1" style={{ backgroundColor: themeColor }}></div>
                                    <span>{isVerySmallScreen ? 'LINK ON' : 'LINK ACTIVE'}</span>
                                </div>
                                <div className="font-mono">v2.4.7</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right panel with menu options */}
                    <motion.div
                        variants={itemVariants}
                        className={`${isVerySmallScreen ? 'w-3/5 p-2' : 'w-2/3 p-3'} flex flex-col overflow-y-auto`}
                    >
                        <div className="text-xs text-gray-400 mb-1 font-mono">|SELECT|</div>
                        <div className="grid grid-cols-1 gap-1.5 overflow-y-auto flex-grow">
                            <CommandOption
                                icon={<FaPlay />}
                                title="DEPLOY TANK"
                                description={isVerySmallScreen ? "Enter battlefield" : "Enter battlefield with your selected vehicle"}
                                onClick={() => handleMenuOption('play')}
                                themeColor={themeColor}
                                delay={0}
                                compact={true}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaBook />}
                                title="TRAINING"
                                description={isVerySmallScreen ? "Learn tactics" : "Learn combat tactics and strategies"}
                                onClick={() => handleMenuOption('tutorial')}
                                themeColor={themeColor}
                                delay={0.1}
                                compact={true}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaEye />}
                                title="SPECTATE"
                                description={isVerySmallScreen ? "Monitor operations" : "Monitor active operations"}
                                onClick={() => handleMenuOption('spectate')}
                                themeColor={themeColor}
                                delay={0.2}
                                compact={true}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaPowerOff />}
                                title="DISCONNECT"
                                description={isVerySmallScreen ? "Terminate session" : "Terminate command session"}
                                onClick={() => handleMenuOption('quit')}
                                themeColor={themeColor}
                                isQuit={true}
                                delay={0.3}
                                compact={true}
                                veryCompact={isVerySmallScreen}
                            />
                        </div>
                    </motion.div>
                </>
            ) : (
                // Portrait layout: Stacked sections (optimized for small screens)
                <>
                    {/* Header section - minimal for small screens */}
                    <motion.div
                        variants={itemVariants}
                        className={`px-${isVerySmallScreen ? '2' : '4'} py-${isVerySmallScreen ? '2' : '3'}`}
                    >
                        <div className="relative mb-1">
                            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-2"></div>
                            <div className="flex justify-between items-center">
                                <h2 className={`${isVerySmallScreen ? 'text-lg' : isSmallScreen ? 'text-xl' : 'text-2xl'} font-bold`} style={{ color: themeColor }}>
                                    COMMAND TERMINAL
                                </h2>
                                <div className="flex items-center">
                                    <div className="h-1.5 w-1.5 rounded-full animate-pulse mr-1 bg-green-500"></div>
                                    <span className="text-xs text-green-500 font-mono">ON</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mb-2">
                            <div className={`${isVerySmallScreen ? 'p-1.5' : 'p-2'} border mr-2`} style={{ borderColor: themeColor }}>
                                <div className={`${isVerySmallScreen ? 'text-base' : 'text-xl'} font-bold`} style={{ color: themeColor }}>
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className={`${isVerySmallScreen ? 'text-sm' : isSmallScreen ? 'text-base' : 'text-lg'} truncate`}>
                                    Commander <span className="font-bold" style={{ color: themeColor }}>{displayedUsername}</span>
                                </div>
                                <div className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-gray-400 font-mono truncate`}>
                                    {isVerySmallScreen ? "ACCESS GRANTED" : "CLEARANCE LEVEL: ALPHA | ACCESS GRANTED"}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Status indicators - horizontal in portrait, more compact for small screens */}
                    <motion.div
                        variants={itemVariants}
                        className={`grid grid-cols-3 gap-1 px-${isVerySmallScreen ? '2' : '4'} mb-${isVerySmallScreen ? '2' : '3'}`}
                    >
                        {['SYSTEMS', 'NETWORK', 'SECURITY'].map((system, index) => (
                            <div key={system} className="bg-black bg-opacity-50 py-1 px-1.5 text-center border border-gray-800">
                                <div className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-gray-400`}>{system}</div>
                                <div className="flex items-center justify-center mt-0.5">
                                    <div className="h-1.5 w-1.5 rounded-full animate-pulse mr-0.5"
                                        style={{
                                            backgroundColor: index === 2 ? '#fbbf24' : '#10b981',
                                            animationDelay: `${index * 0.3}s`
                                        }}></div>
                                    <span className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'}`} style={{ color: index === 2 ? '#fbbf24' : '#10b981' }}>
                                        {index === 2 ? 'ALERT' : 'OK'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Main menu options - more compact for small screens */}
                    <motion.div
                        variants={itemVariants}
                        className={`flex-grow px-${isVerySmallScreen ? '2' : '4'} pb-${isVerySmallScreen ? '2' : '4'} flex flex-col`}
                    >
                        <div className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-1 font-mono`}>|SELECT OPERATION|</div>
                        <div className={`grid gap-${isVerySmallScreen ? '1.5' : '2'} grid-cols-1 flex-grow`}>
                            <CommandOption
                                icon={<FaPlay />}
                                title="DEPLOY TANK"
                                description={isVerySmallScreen ? "Enter battlefield" : "Enter battlefield with your selected vehicle"}
                                onClick={() => handleMenuOption('play')}
                                themeColor={themeColor}
                                delay={0}
                                compact={isSmallScreen}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaBook />}
                                title={isVerySmallScreen ? "TRAINING" : "TRAINING GROUNDS"}
                                description={isVerySmallScreen ? "Learn tactics" : "Learn combat tactics and strategies"}
                                onClick={() => handleMenuOption('tutorial')}
                                themeColor={themeColor}
                                delay={0.1}
                                compact={isSmallScreen}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaEye />}
                                title="SPECTATE"
                                description={isVerySmallScreen ? "Monitor operations" : "Monitor battlefield operations"}
                                onClick={() => handleMenuOption('spectate')}
                                themeColor={themeColor}
                                delay={0.2}
                                compact={isSmallScreen}
                                veryCompact={isVerySmallScreen}
                            />
                            <CommandOption
                                icon={<FaPowerOff />}
                                title="DISCONNECT"
                                description={isVerySmallScreen ? "Terminate session" : "Terminate command session"}
                                onClick={() => handleMenuOption('quit')}
                                themeColor={themeColor}
                                isQuit={true}
                                delay={0.3}
                                compact={isSmallScreen}
                                veryCompact={isVerySmallScreen}
                            />
                        </div>

                        {/* Bottom status bar - minimized for small screens */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-black bg-opacity-80 border-t border-gray-800 py-1.5 px-2 flex justify-between text-[10px] text-gray-400 mt-auto"
                        >
                            <div className="flex items-center">
                                <div className="h-1 w-1 animate-ping rounded-full mr-1" style={{ backgroundColor: themeColor }}></div>
                                <span>{isVerySmallScreen ? 'LINK ACTIVE' : 'TACTICAL LINK ACTIVE'}</span>
                            </div>
                            <div className="font-mono">SYS.VER 2.4.7</div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}

MenuOptions.propTypes = {
    username: PropTypes.string.isRequired,
    themeColor: PropTypes.string.isRequired,
    handleMenuOption: PropTypes.func.isRequired,
    containerVariants: PropTypes.object.isRequired,
    itemVariants: PropTypes.object.isRequired
};

export default MenuOptions;