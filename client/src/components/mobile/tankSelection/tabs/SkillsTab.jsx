import { motion } from 'framer-motion';
import { Zap, Shield, Heart, ArrowUp, Activity, Disc } from 'lucide-react';
import PropTypes from 'prop-types';
import { tabVariants, itemVariants } from '../animations/variants';

// Helper function to get appropriate icon based on effect type
const getEffectIcon = (type) => {
    switch (type.toLowerCase()) {
        case 'heal': return <Heart size={14} />;
        case 'shield': return <Shield size={14} />;
        case 'damage_boost': return <ArrowUp size={14} />;
        case 'aoe': return <Disc size={14} />;
        case 'disable': return <Activity size={14} />;
        default: return <Zap size={14} />;
    }
};

// Helper function to format effect values based on type
const formatEffectValue = (key, value, effectType) => {
    if (key === 'intensity') {
        if (['heal', 'shield', 'disable'].includes(effectType.toLowerCase())) {
            return `${(value * 100).toFixed(0)}%`;
        } else if (effectType.toLowerCase() === 'damage_boost') {
            return `+${((value - 1) * 100).toFixed(0)}%`;
        }
        return `${(value * 100).toFixed(0)}%`;
    }

    if (key === 'radius') {
        return `${value}m`;
    }

    return value.toString();
};

// Helper for effect display label
const getEffectTypeLabel = (type) => {
    switch (type.toLowerCase()) {
        case 'heal': return 'HEALING';
        case 'shield': return 'PROTECTION';
        case 'damage_boost': return 'DAMAGE BOOST';
        case 'aoe': return 'AREA DAMAGE';
        case 'disable': return 'DISRUPTION';
        default: return type.toUpperCase();
    }
};

function SkillsTab({ selectedTank }) {
    const effectType = selectedTank.skill.effect.type.toLowerCase();

    return (
        <motion.div
            key="skills-tab"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative"
        >
            {/* Background hexagonal pattern */}
            <motion.div
                className="absolute inset-0 opacity-5 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.5v35L30 60 0 43.5v-35L30 0zm0 5.625L5.625 19.375v31.25L30 54.375l24.375-13.75v-31.25L30 5.625z' fill='${selectedTank.color.replace('#', '%23')}' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Header */}
            <div className="flex items-center mb-4 relative z-10">
                <motion.div
                    className="flex items-center justify-center w-6 h-6 rounded-full mr-2"
                    style={{ background: `linear-gradient(135deg, ${selectedTank.color}40, transparent)`, border: `1px solid ${selectedTank.color}80` }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <Zap size={12} style={{ color: selectedTank.color }} />
                </motion.div>
                <motion.h3
                    className="text-xs uppercase tracking-wider"
                    style={{ color: selectedTank.color }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    Special Tactical Ability
                </motion.h3>
            </div>

            {/* Skill Card */}
            <motion.div
                className="border border-gray-800 rounded-lg p-4 bg-black bg-opacity-70 backdrop-blur-sm relative z-10 overflow-hidden"
                variants={itemVariants}
                style={{ boxShadow: `0 0 20px ${selectedTank.color}20` }}
            >
                {/* Decorative corner */}
                <motion.div
                    className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute top-0 right-0 h-[2px] w-8" style={{ backgroundColor: selectedTank.color }}></div>
                    <div className="absolute top-0 right-0 w-[2px] h-8" style={{ backgroundColor: selectedTank.color }}></div>
                </motion.div>
                <motion.div
                    className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute bottom-0 left-0 h-[2px] w-8" style={{ backgroundColor: selectedTank.color }}></div>
                    <div className="absolute bottom-0 left-0 w-[2px] h-8" style={{ backgroundColor: selectedTank.color }}></div>
                </motion.div>

                {/* Skill Name and Type */}
                <div className="flex justify-between items-center mb-4">
                    <motion.div
                        className="flex flex-col"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center">
                            <motion.span
                                className="w-1 h-4 mr-2 rounded-sm"
                                style={{ backgroundColor: selectedTank.color }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            />
                            <h4 className="text-base font-medium text-white">
                                {selectedTank.skill.name}
                            </h4>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-3">
                            {selectedTank.skill.description}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10, skewX: "-10deg" }}
                        animate={{ opacity: 1, x: 0, skewX: "0deg" }}
                        transition={{ delay: 0.3 }}
                        className="text-xs px-3 py-1 rounded-md relative overflow-hidden"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            border: `1px solid ${selectedTank.color}60`,
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
                                delay: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                        />
                        <div className="flex items-center">
                            {getEffectIcon(effectType)}
                            <span className="ml-1">{getEffectTypeLabel(effectType)}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Effect Visualization */}
                <motion.div
                    className="mb-5 relative h-20 bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: `radial-gradient(circle, ${selectedTank.color} 0%, transparent 70%)`,
                            transform: 'scale(0.8)'
                        }}
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 0.8, opacity: 0.3 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    />

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                    >
                        <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center border-2"
                                style={{ borderColor: selectedTank.color }}>
                                {getEffectIcon(effectType)}
                            </div>
                            <div className="text-xs mt-1 font-medium" style={{ color: selectedTank.color }}>
                                {effectType === 'heal' && `+${selectedTank.skill.effect.intensity * 100}% HP`}
                                {effectType === 'shield' && `${selectedTank.skill.effect.intensity * 100}% Protection`}
                                {effectType === 'damage_boost' && `+${(selectedTank.skill.effect.intensity - 1) * 100}% DMG`}
                                {effectType === 'aoe' && `${selectedTank.skill.effect.intensity * 100}% AOE DMG`}
                                {effectType === 'disable' && `${selectedTank.skill.effect.intensity * 100}% Disruption`}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Skill Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <motion.div
                        className="bg-black bg-opacity-50 p-3 rounded-md border border-gray-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-xs text-gray-400 mb-2">COOLDOWN TIME</div>
                        <div className="flex items-center">
                            <div className="relative flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-3">
                                <motion.div
                                    className="absolute h-full rounded-full"
                                    style={{ backgroundColor: selectedTank.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                />
                            </div>
                            <span className="text-sm font-mono" style={{ color: selectedTank.color }}>
                                {(selectedTank.skill.cooldown / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-black bg-opacity-50 p-3 rounded-md border border-gray-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="text-xs text-gray-400 mb-2">ACTIVE DURATION</div>
                        <div className="flex items-center">
                            <div className="relative flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-3">
                                <motion.div
                                    className="absolute h-full rounded-full"
                                    style={{ backgroundColor: selectedTank.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                />
                            </div>
                            <span className="text-sm font-mono" style={{ color: selectedTank.color }}>
                                {(selectedTank.skill.duration / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Effect Properties */}
                <motion.div
                    className="mt-4 border-t border-gray-800 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="flex items-center mb-3">
                        <div className="w-1 h-3 mr-2 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                        <div className="text-xs text-gray-400">ABILITY SPECIFICATIONS</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedTank.skill.effect).map(([key, value], i) =>
                            key !== 'type' && (
                                // Only show radius for AoE and Disable effect types
                                (key !== 'radius' || ['aoe', 'disable', 'shield'].includes(effectType)) && (
                                    <motion.div
                                        key={key}
                                        className="bg-black bg-opacity-40 p-2 rounded border border-gray-800 flex items-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                    >
                                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: selectedTank.color }}></div>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 uppercase">{key}</div>
                                            <div className="text-sm font-medium" style={{ color: selectedTank.color }}>
                                                {formatEffectValue(key, value, effectType)}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            )
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

SkillsTab.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        skill: PropTypes.shape({
            name: PropTypes.string.isRequired,
            cooldown: PropTypes.number.isRequired,
            duration: PropTypes.number.isRequired,
            effect: PropTypes.shape({
                type: PropTypes.string.isRequired,
                // Other effect properties can vary
            }).isRequired,
            description: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default SkillsTab;
