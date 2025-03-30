import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { scanLineAnimation } from '../animations/variants';

function BackgroundEffects({ selectedTank, isChanging }) {
    return (
        <>
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
                <div className="absolute w-full h-0.5" style={{
                    backgroundColor: selectedTank.color,
                    transform: "rotate(45deg)",
                    transformOrigin: "center"
                }}></div>
                <div className="absolute w-full h-0.5" style={{
                    backgroundColor: selectedTank.color,
                    transform: "rotate(-45deg)",
                    transformOrigin: "center"
                }}></div>
                <div className="absolute w-0.5 h-full left-1/2 ml-[-1px]" style={{
                    backgroundColor: selectedTank.color
                }}></div>
                <div className="absolute w-full h-0.5 top-1/2 mt-[-1px]" style={{
                    backgroundColor: selectedTank.color
                }}></div>
            </motion.div>

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
        </>
    );
}

BackgroundEffects.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired
    }).isRequired,
    isChanging: PropTypes.bool.isRequired
};

export default BackgroundEffects;
