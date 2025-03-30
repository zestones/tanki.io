import { motion } from 'framer-motion';
import { Info, Target } from 'lucide-react';
import PropTypes from 'prop-types';
import { tabVariants, itemVariants } from '../animations/variants';

function ProfileTab({ selectedTank, isChanging }) {
    return (
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
    );
}

ProfileTab.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        range: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            specialty: PropTypes.string.isRequired
        }).isRequired,
        abilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    isChanging: PropTypes.bool.isRequired
};

export default ProfileTab;
