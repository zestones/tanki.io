import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundEffects, CornerDecorations, SidePanels } from './mobile/utils/VisualEffects';

import PropTypes from 'prop-types';

function IntroAnimation({ onLoadComplete }) {
    const [loadingStage, setLoadingStage] = useState(0);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [logoTransitioning, setLogoTransitioning] = useState(false);

    const loadingStages = [
        { text: 'INITIALIZING NEURAL NETWORK...', threshold: 20 },
        { text: 'ACCESSING TACTICAL DATABASE...', threshold: 40 },
        { text: 'CALCULATING BATTLEFIELD PARAMETERS...', threshold: 60 },
        { text: 'ESTABLISHING ORIGINIUM RESONANCE...', threshold: 80 },
        { text: 'CALIBRATING COMBAT SYSTEMS...', threshold: 95 },
        { text: 'DEPLOYMENT READY', threshold: 100 }
    ];

    const glitchRef = useRef(null);
    const [currentTime, setCurrentTime] = useState('');

    // Update time display
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            setCurrentTime(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Glitch effect
    useEffect(() => {
        if (!glitchRef.current) return;

        const applyGlitch = () => {
            if (!glitchRef.current) return;
            glitchRef.current.classList.add('glitch-effect');
            setTimeout(() => {
                if (glitchRef.current) glitchRef.current.classList.remove('glitch-effect');
            }, 200);
        };

        const glitchInterval = setInterval(applyGlitch, 3000);
        return () => clearInterval(glitchInterval);
    }, []);

    // Progress through loading stages
    useEffect(() => {
        const currentStageData = loadingStages[loadingStage];

        if (loadingProgress >= currentStageData.threshold && loadingStage < loadingStages.length - 1) {
            setLoadingStage(loadingStage + 1);
        }
    }, [loadingProgress, loadingStage]);

    const handleLoadingComplete = () => {
        setLogoTransitioning(true);
        setTimeout(() => {
            setAnimationComplete(true);
            onLoadComplete();
        }, 1200);
    };

    // Simulate loading progress with a smoother transition into the Home screen
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(handleLoadingComplete, 700);
                    return 100;
                }
                const increment = prev > 80 ? Math.random() * 1.5 : Math.random() * 4 + 1;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onLoadComplete]);

    return (
        <div className={`fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 overflow-hidden ${animationComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* Apply visual effects using imported components */}
            <BackgroundEffects />
            <CornerDecorations />

            {/* Top HUD elements */}
            <div className="fixed top-0 left-0 right-0 flex justify-between p-4 text-blue-300 font-mono text-xs opacity-70">
                <div>
                    <div>TACTICAL WARFARE SYSTEM v2.6.3</div>
                    <div>RHINE LAB TECHNOLOGY</div>
                </div>
                <div className="text-right">
                    <div>{currentTime}</div>
                    <div>NEURAL LINK: ESTABLISHED</div>
                </div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-2xl px-6">
                <motion.div
                    className={`relative transition-all duration-1000 ${logoTransitioning ? 'transform -translate-y-32 scale-90' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative">
                        <div className="absolute -left-3 -top-3 w-6 h-6 border-l-2 border-t-2 border-blue-400"></div>
                        <div className="absolute -right-3 -top-3 w-6 h-6 border-r-2 border-t-2 border-blue-400"></div>
                        <div className="absolute -left-3 -bottom-3 w-6 h-6 border-l-2 border-b-2 border-blue-400"></div>
                        <div className="absolute -right-3 -bottom-3 w-6 h-6 border-r-2 border-b-2 border-blue-400"></div>

                        {/* Decorative frame lines */}
                        <div className="absolute -left-8 top-1/4 w-5 h-px bg-blue-400/70"></div>
                        <div className="absolute -right-8 top-1/4 w-5 h-px bg-blue-400/70"></div>
                        <div className="absolute -left-8 bottom-1/4 w-5 h-px bg-blue-400/70"></div>
                        <div className="absolute -right-8 bottom-1/4 w-5 h-px bg-blue-400/70"></div>

                        {/* Main title with glitch effect */}
                        <div ref={glitchRef} className="glitch-container py-4 px-6 bg-gray-900/50 border border-blue-900/30">
                            <h1 className="text-6xl font-bold text-white tracking-wider mb-1 font-mono text-center">TANKI.IO</h1>
                            <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                            <p className="text-center text-blue-300 mt-2 text-sm tracking-widest uppercase">TACTICAL ARMORED OPERATIONS</p>
                        </div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {!logoTransitioning && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="mt-12 w-full"
                        >
                            {/* Status message */}
                            <motion.div
                                key={loadingStage}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-3"
                            >
                                <div className="flex items-center mb-1">
                                    <div className="h-3 w-3 bg-blue-500 animate-pulse mr-2"></div>
                                    <span className="text-sm text-blue-400 font-mono tracking-wider">{loadingStages[loadingStage].text}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-1 ml-5 text-xs text-gray-400 font-mono">
                                    <div>OPERATOR STATUS: STANDBY</div>
                                    <div>WEAPONS: CALIBRATED</div>
                                    <div>REACTOR: ONLINE</div>
                                    <div>SENSOR ARRAY: ACTIVE</div>
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="relative h-1.5 bg-gray-800/70 rounded-sm overflow-hidden border border-gray-700">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"
                                        style={{ width: `${loadingProgress}%` }}
                                        transition={{ type: "spring", stiffness: 30 }}
                                    />

                                    {loadingStages.map((stage, index) => (
                                        <div
                                            key={'stage-' + index}
                                            className={`absolute top-0 bottom-0 w-0.5 ${loadingProgress >= stage.threshold ? 'bg-blue-300' : 'bg-gray-600'}`}
                                            style={{ left: `${stage.threshold}%` }}
                                        ></div>
                                    ))}
                                </div>

                                {/* Percentage indicators */}
                                <div className="flex justify-between mt-1 text-xs text-blue-300/70 font-mono">
                                    <span>0%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                    <span>75%</span>
                                    <span>{loadingProgress.toFixed(0)}%</span>
                                </div>
                            </div>

                            {/* System diagnostics section */}
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={'diag-' + i} className="border border-blue-900/30 bg-gray-900/30 p-2">
                                        <div className="text-xs text-gray-400 font-mono mb-1">
                                            {(() => {
                                                switch (i) {
                                                    case 0: return 'ARMOR INTEGRITY';
                                                    case 1: return 'AMMO SYSTEMS';
                                                    default: return 'ENGINE OUTPUT';
                                                }
                                            })()}
                                        </div>
                                        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: loadingProgress >= 50 ? "100%" : `${loadingProgress * 2}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom infographic elements */}
                <div className="absolute -bottom-20 left-0 right-0">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

                    <div className="flex justify-between text-xs text-blue-300/50 font-mono mt-4">
                        <div>RHODES ISLAND TACTICAL SYSTEMS</div>
                        <div>EXPERIMENTAL DESIGN DIVISION</div>
                    </div>
                </div>
            </div>

            {/* Add side panels using imported component */}
            <SidePanels />

            {/* Bottom HUD elements */}
            <div className="fixed bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between text-blue-300/70 font-mono text-xs">
                    <div>
                        <div>TANK MODEL: T-90 URSUS</div>
                        <div>CREW: 1 OPERATOR</div>
                    </div>
                    <div className="text-right">
                        <div>CONNECTION: SECURE</div>
                        <div>SIGNAL INTEGRITY: 98.7%</div>
                    </div>
                </div>
            </div>

            {/* Animated notification - appears when loading is complete */}
            <AnimatePresence>
                {loadingProgress >= 100 && !logoTransitioning && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-500/20 border border-blue-400/50 px-6 py-2"
                    >
                        <div className="text-center text-blue-100 font-mono text-sm">
                            <span className="animate-pulse">▶</span> TANK DEPLOYMENT READY
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

IntroAnimation.propTypes = {
    onLoadComplete: PropTypes.func.isRequired
};

export default IntroAnimation;