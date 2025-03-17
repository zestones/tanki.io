import { AnimatePresence, motion } from 'framer-motion';
import { Info, Shield, Target, Zap } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function TankDetails({ selectedTank, animateIn }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isChanging, setIsChanging] = useState(false);

    // Handle tank change animation sequence
    useEffect(() => {
        if (animateIn) {
            const timer = setTimeout(() => {
                setIsChanging(false);
            }, 300);
            return () => clearTimeout(timer);
        }
        setIsChanging(true);
    }, [selectedTank, animateIn]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    // Tab switching animations with glitch effect
    const tabVariants = {
        hidden: {
            opacity: 0,
            x: -30,
            filter: 'blur(5px)',
            transition: { duration: 0.2 }
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.08
            }
        },
        exit: {
            opacity: 0,
            x: 30,
            filter: 'blur(5px)',
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    // Animation for individual items with a staggered effect
    const itemVariants = {
        hidden: { opacity: 0, y: 15, skewX: '-5deg' },
        visible: {
            opacity: 1,
            y: 0,
            skewX: '0deg',
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    // Glitch animation effect for selected tab highlight
    const glitchAnimation = {
        x: [0, -2, 3, -1, 0],
        opacity: [1, 0.8, 0.9, 0.7, 1],
        transition: {
            duration: 0.4,
            repeat: 0,
            ease: "easeInOut"
        }
    };

    // Scanning line animation
    const scanLineAnimation = {
        y: [0, 300],
        opacity: [0.3, 0, 0.3],
        transition: {
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop"
        }
    };

    return (
        <motion.div
            className="bg-black bg-opacity-80 h-full overflow-y-auto relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Scanner line effect */}
            <motion.div
                className="absolute inset-0 w-full h-2 bg-gradient-to-b from-transparent via-opacity-30 to-transparent pointer-events-none z-10"
                style={{ backgroundColor: selectedTank.color, opacity: 0.2 }}
                animate={scanLineAnimation}
            />

            {/* Border with tank color */}
            <motion.div
                className="border-t border-b border-opacity-50"
                style={{ borderColor: selectedTank.color }}
                initial={{ scaleX: 0 }}
                animate={{
                    scaleX: 1,
                    transition: { duration: 0.4, ease: "easeOut" }
                }}
            />

            {/* Tab navigation */}
            <div className="flex border-b border-gray-800">
                {['profile', 'skills', 'equipment'].map((tab) => (
                    <motion.div
                        key={`tab-${tab}`}
                        className={`px-4 py-2 text-xs font-medium uppercase cursor-pointer relative ${activeTab === tab ? '' : 'text-gray-500'}`}
                        onClick={() => handleTabChange(tab)}
                        whileHover={{
                            color: selectedTank.color,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-0.5"
                                style={{ backgroundColor: selectedTank.color }}
                                initial={{ width: "0%" }}
                                animate={{
                                    ...glitchAnimation,
                                    width: "100%",
                                    transition: { duration: 0.3 }
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="p-4 space-y-4 relative">
                {/* Geometric accent element */}
                <motion.div
                    className="absolute top-2 right-2 w-16 h-16 pointer-events-none"
                    initial={{ opacity: 0, rotate: -20 }}
                    animate={{
                        opacity: 0.07,
                        rotate: 0,
                        transition: { duration: 0.6, ease: "easeOut" }
                    }}
                >
                    <div className="absolute w-full h-0.5" style={{ backgroundColor: selectedTank.color, transform: "rotate(45deg)", transformOrigin: "center" }}></div>
                    <div className="absolute w-full h-0.5" style={{ backgroundColor: selectedTank.color, transform: "rotate(-45deg)", transformOrigin: "center" }}></div>
                    <div className="absolute w-0.5 h-full left-1/2 ml-[-1px]" style={{ backgroundColor: selectedTank.color }}></div>
                    <div className="absolute w-full h-0.5 top-1/2 mt-[-1px]" style={{ backgroundColor: selectedTank.color }}></div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile-tab"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="transition-all duration-300"
                                style={{ opacity: isChanging ? 0 : 1 }}
                            >
                                <div className="flex items-center mb-2">
                                    <motion.div
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, duration: 0.3 }}
                                    >
                                        <Info size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                    </motion.div>
                                    <motion.h3
                                        className="text-xs uppercase tracking-wider text-gray-400"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.15, duration: 0.3 }}
                                    >
                                        Description
                                    </motion.h3>
                                </div>

                                <motion.div
                                    className="relative overflow-hidden border-l-2 pl-2"
                                    style={{ borderColor: `${selectedTank.color}40` }}
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <p className="text-sm text-gray-300">{selectedTank.description}</p>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="transition-all duration-300"
                                style={{ opacity: isChanging ? 0 : 1 }}
                            >
                                <div className="flex items-center mb-2">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                    >
                                        <Target size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                    </motion.div>
                                    <motion.h3
                                        className="text-xs uppercase tracking-wider text-gray-400"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                    >
                                        Combat Attributes
                                    </motion.h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <motion.div
                                            className="flex justify-between text-xs"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className="text-gray-500">RANGE</span>
                                            <span className="text-white">{selectedTank.range}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex justify-between text-xs mt-2"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <span className="text-gray-500">SPECIALTY</span>
                                            <span className="text-white">{selectedTank.stats.specialty}</span>
                                        </motion.div>
                                    </div>

                                    <div>
                                        <motion.div
                                            className="text-xs text-gray-500 mb-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            ABILITIES
                                        </motion.div>
                                        <motion.ul className="text-xs text-white">
                                            {selectedTank.abilities.map((ability, index) => (
                                                <motion.li
                                                    key={`ability-${ability}`}
                                                    className="flex items-center"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 + (index * 0.05) }}
                                                >
                                                    <motion.span
                                                        className="inline-block w-1 h-1 mr-1"
                                                        style={{ backgroundColor: selectedTank.color }}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.4 + (index * 0.05) }}
                                                    />
                                                    {ability}
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'skills' && (
                        <motion.div
                            key="skills-tab"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex items-center mb-3">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Zap size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                </motion.div>
                                <motion.h3
                                    className="text-xs uppercase tracking-wider text-gray-400"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Tank Skills
                                </motion.h3>
                            </div>

                            <div className="space-y-4">
                                {selectedTank.skills.map((skill, index) => (
                                    <motion.div
                                        key={'skill-' + index}
                                        className="border-t border-gray-800 pt-3 first:border-0 first:pt-0"
                                        variants={itemVariants}
                                        custom={index}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <motion.h4
                                                className="text-sm font-medium text-white relative pl-2"
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                            >
                                                <motion.span
                                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full"
                                                    style={{ backgroundColor: selectedTank.color }}
                                                    initial={{ scaleY: 0 }}
                                                    animate={{ scaleY: 1 }}
                                                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                                                />
                                                {skill.name}
                                            </motion.h4>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{
                                                            scale: 1,
                                                            opacity: 1,
                                                            transition: { delay: 0.3 + (index * 0.1) + (i * 0.05) }
                                                        }}
                                                        className="w-2 h-2 ml-1 rounded-sm"
                                                        style={{
                                                            backgroundColor: i < skill.level ? selectedTank.color : 'rgba(255,255,255,0.2)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <motion.p
                                            className="text-xs text-gray-400"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1) }}
                                        >
                                            {skill.description}
                                        </motion.p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'equipment' && (
                        <motion.div
                            key="equipment-tab"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex items-center mb-3">
                                <motion.div
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Shield size={12} className="mr-2" style={{ color: selectedTank.color }} />
                                </motion.div>
                                <motion.h3
                                    className="text-xs uppercase tracking-wider text-gray-400"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Equipped Items
                                </motion.h3>
                            </div>

                            <div className="space-y-4">
                                {selectedTank.equipment.map((item, index) => (
                                    <motion.div
                                        key={'equipment-' + index}
                                        className="border-t border-gray-800 pt-3 first:border-0 first:pt-0"
                                        variants={itemVariants}
                                        custom={index}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <motion.h4
                                                className="text-sm font-medium text-white relative"
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + (index * 0.1) }}
                                            >
                                                {item.name}
                                            </motion.h4>
                                            <motion.span
                                                initial={{ opacity: 0, x: 10, skewX: "-10deg" }}
                                                animate={{ opacity: 1, x: 0, skewX: "0deg" }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="text-xs px-2 py-1 rounded relative overflow-hidden"
                                                style={{
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    border: `1px solid ${selectedTank.color}40`,
                                                    color: selectedTank.color
                                                }}
                                            >
                                                <motion.span
                                                    className="absolute inset-0 w-full h-full opacity-20"
                                                    style={{ backgroundColor: selectedTank.color }}
                                                    initial={{ x: "-100%" }}
                                                    animate={{ x: "100%" }}
                                                    transition={{
                                                        duration: 1.5,
                                                        ease: "easeInOut",
                                                        delay: 0.5 + (index * 0.2),
                                                        repeat: Infinity,
                                                        repeatDelay: 5
                                                    }}
                                                />
                                                {item.type}
                                            </motion.span>
                                        </div>
                                        <motion.p
                                            className="text-xs text-gray-400"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1) }}
                                        >
                                            {item.effect}
                                        </motion.p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Code-like background lines for futuristic effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={'line-' + i}
                        className="absolute h-px w-full bg-white"
                        style={{ top: `${i * 10}%` }}
                        initial={{ scaleX: 0, transformOrigin: i % 2 === 0 ? "0% 0%" : "100% 0%" }}
                        animate={{
                            scaleX: 1,
                            transition: {
                                delay: i * 0.05,
                                duration: 0.7,
                                ease: "easeOut"
                            }
                        }}
                    />
                ))}
            </div>

            {/* Tank color overlay effect on tab change */}
            <AnimatePresence>
                {isChanging && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{ backgroundColor: selectedTank.color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15, transition: { duration: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

TankDetails.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        range: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            specialty: PropTypes.string.isRequired
        }).isRequired,
        abilities: PropTypes.arrayOf(PropTypes.string).isRequired,
        skills: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                level: PropTypes.number.isRequired,
                description: PropTypes.string.isRequired
            })
        ).isRequired,
        equipment: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                effect: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    animateIn: PropTypes.bool.isRequired,
};

export default TankDetails;