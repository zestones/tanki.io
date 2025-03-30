import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { withOpacity } from '../../../utils/colorUtils';

function CommandOption({ icon, title, description, onClick, themeColor, isQuit = false, delay = 0, compact = false, veryCompact = false }) {
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

    // Progressive size adjustment based on screen size
    const iconSize = veryCompact ? 'w-8 h-8' : compact ? 'w-10 h-10' : 'w-12 h-12';
    const padding = veryCompact ? 'p-2' : compact ? 'p-3' : 'p-4';
    const marginRight = veryCompact ? 'mr-2' : 'mr-3';
    const cornerSize = veryCompact ? 'w-1.5 h-1.5' : compact ? 'w-2 h-2' : 'w-3 h-3';
    const textSize = veryCompact ? 'text-xs' : compact ? 'text-sm' : 'text-base';
    const descSize = veryCompact ? 'text-[10px]' : compact ? 'text-xs' : 'text-sm';
    const iconTextSize = veryCompact ? 'text-base' : compact ? 'text-lg' : 'text-xl';
    const indicatorHeight = veryCompact ? 'h-8' : compact ? 'h-10' : 'h-12';

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
            className={`relative flex items-center ${padding} cursor-pointer bg-black bg-opacity-40 border border-opacity-50`}
            style={{
                borderColor: borderColor,
            }}
        >
            {/* Corner decorations */}
            <div className={`absolute top-0 left-0 ${cornerSize} border-t border-l`} style={{ borderColor: iconColor }}></div>
            <div className={`absolute top-0 right-0 ${cornerSize} border-t border-r`} style={{ borderColor: iconColor }}></div>
            <div className={`absolute bottom-0 left-0 ${cornerSize} border-b border-l`} style={{ borderColor: iconColor }}></div>
            <div className={`absolute bottom-0 right-0 ${cornerSize} border-b border-r`} style={{ borderColor: iconColor }}></div>

            {/* Background effect */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-10"
                style={{
                    background: `radial-gradient(circle at 30% center, ${isQuit ? 'rgba(255,50,50,0.8)' : themeColor} 0%, transparent 70%)`
                }}
            ></div>

            {/* Icon - scaled based on screen size */}
            <div
                className={`flex items-center justify-center ${iconSize} ${marginRight} border-2 relative shrink-0`}
                style={{ borderColor: iconColor }}
            >
                <div className={iconTextSize} style={{ color: iconColor }}>{icon}</div>
                {!veryCompact && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border" style={{ backgroundColor: 'black', borderColor: iconColor }}></div>
                )}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-white tracking-wide mb-0.5 truncate ${textSize}`}>{title}</h3>
                <p className={`${descSize} text-gray-400 line-clamp-1`}>{description}</p>
            </div>

            {/* Right indicator - sized based on screen size */}
            <div className={`w-1 ${indicatorHeight} ml-1.5`} style={{ backgroundColor: iconColor }}></div>
        </motion.div>
    );
}

CommandOption.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    themeColor: PropTypes.string.isRequired,
    isQuit: PropTypes.bool,
    delay: PropTypes.number,
    compact: PropTypes.bool,
    veryCompact: PropTypes.bool
};

export default CommandOption;