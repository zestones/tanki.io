import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import PropTypes from 'prop-types';
import { tabVariants, itemVariants } from '../animations/variants';

function EquipmentTab({ selectedTank }) {
    return (
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
    );
}

EquipmentTab.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        equipment: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                effect: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired
};

export default EquipmentTab;
