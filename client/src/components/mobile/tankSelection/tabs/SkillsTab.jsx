import { motion } from 'framer-motion';
import { Zap, Shield, Heart, ArrowUp, Activity, Disc, Clock, Timer, Maximize2, Percent } from 'lucide-react';
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

// Helper function to get icon for effect property
const getPropertyIcon = (key) => {
    switch (key.toLowerCase()) {
        case 'intensity': return <Percent size={14} />;
        case 'radius': return <Maximize2 size={14} />;
        case 'duration': return <Timer size={14} />;
        default: return <Zap size={14} />;
    }
};

// Helper function to format effect values based on type
const formatEffectValue = (key, value, effectType) => {
    if (key === 'intensity') {
        if (effectType.toLowerCase() === 'damage_boost') {
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
            {/* Main content container with backdrop blur */}
            <motion.div
                className="border border-gray-800 rounded-lg p-5 bg-black bg-opacity-70 backdrop-blur-sm relative"
                variants={itemVariants}
                style={{
                    boxShadow: `0 0 15px ${selectedTank.color}15`,
                    borderLeft: `2px solid ${selectedTank.color}`
                }}
            >
                {/* Header with ability name */}
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center justify-center w-7 h-7 rounded-md"
                            style={{ backgroundColor: `${selectedTank.color}20`, border: `1px solid ${selectedTank.color}60` }}
                        >
                            {getEffectIcon(effectType)}
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-wider font-bold" style={{ color: selectedTank.color }}>
                                Tactical Ability
                            </h3>
                            <div className="text-lg font-bold text-white">
                                {selectedTank.skill.name}
                            </div>
                        </div>
                    </div>

                    <div className="ml-9 mt-1 text-sm text-gray-400">
                        {selectedTank.skill.description}
                    </div>

                    <div
                        className="ml-9 mt-2 inline-flex items-center px-2 py-1 text-xs rounded"
                        style={{
                            backgroundColor: `${selectedTank.color}15`,
                            border: `1px solid ${selectedTank.color}40`,
                            color: selectedTank.color
                        }}
                    >
                        {getEffectTypeLabel(effectType)}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Cooldown */}
                    <div
                        className="bg-gray-900 bg-opacity-60 p-3 rounded-md border border-gray-800"
                        style={{ borderLeft: `2px solid ${selectedTank.color}` }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-400 uppercase font-mono">Cooldown</span>
                        </div>
                        <div className="flex items-center">
                            <div className="relative flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                                <div
                                    className="absolute h-full rounded-full"
                                    style={{
                                        width: '100%',
                                        background: `linear-gradient(90deg, ${selectedTank.color}, ${selectedTank.color}70)`
                                    }}
                                ></div>
                            </div>
                            <span
                                className="text-sm font-mono font-bold"
                                style={{ color: selectedTank.color }}
                            >
                                {(selectedTank.skill.cooldown / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div
                        className="bg-gray-900 bg-opacity-60 p-3 rounded-md border border-gray-800"
                        style={{ borderLeft: `2px solid ${selectedTank.color}` }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Timer size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-400 uppercase font-mono">Duration</span>
                        </div>
                        <div className="flex items-center">
                            <div className="relative flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                                <div
                                    className="absolute h-full rounded-full"
                                    style={{
                                        width: '100%',
                                        background: `linear-gradient(90deg, ${selectedTank.color}, ${selectedTank.color}70)`
                                    }}
                                ></div>
                            </div>
                            <span
                                className="text-sm font-mono font-bold"
                                style={{ color: selectedTank.color }}
                            >
                                {(selectedTank.skill.duration / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Effect Visualization */}
                <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 mb-4">
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase font-mono">Effect Type</span>
                                <div className="flex items-center mt-1">
                                    {getEffectIcon(effectType)}
                                    <span
                                        className="ml-2 font-bold"
                                        style={{ color: selectedTank.color }}
                                    >
                                        {getEffectTypeLabel(effectType)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="h-16 w-16 rounded-full flex items-center justify-center"
                                style={{
                                    border: `1px solid ${selectedTank.color}`,
                                    boxShadow: `0 0 15px ${selectedTank.color}40`,
                                    background: `radial-gradient(circle, ${selectedTank.color}20 0%, transparent 70%)`
                                }}
                            >
                                <div className="text-center">
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: selectedTank.color }}
                                    >
                                        {effectType === 'damage_boost'
                                            ? `+${(selectedTank.skill.effect.intensity - 1) * 100}%`
                                            : `${selectedTank.skill.effect.intensity * 100}%`
                                        }
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {effectType === 'heal' && 'HEAL'}
                                        {effectType === 'shield' && 'PROT'}
                                        {effectType === 'damage_boost' && 'DMG'}
                                        {effectType === 'aoe' && 'DMG'}
                                        {effectType === 'disable' && 'EFF'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Effect Parameters */}
                <div>
                    <div className="flex items-center mb-2">
                        <div className="w-1 h-3 mr-2 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                        <div className="text-xs text-gray-400 uppercase font-mono">Tactical Parameters</div>
                        <div className="flex-grow h-px ml-2" style={{ backgroundColor: `${selectedTank.color}40` }}></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(selectedTank.skill.effect).map(([key, value], i) =>
                            key !== 'type' && (
                                <div
                                    key={key}
                                    className="bg-gray-900 bg-opacity-50 p-2.5 rounded border border-gray-800 flex items-center"
                                    style={{ borderLeft: `2px solid ${selectedTank.color}` }}
                                >
                                    <div className="p-1.5 rounded bg-gray-800 mr-2.5 flex items-center justify-center">
                                        {getPropertyIcon(key)}
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 uppercase font-mono">{key}</div>
                                        <div
                                            className="text-sm font-medium"
                                            style={{ color: selectedTank.color }}
                                        >
                                            {formatEffectValue(key, value, effectType)}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
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
