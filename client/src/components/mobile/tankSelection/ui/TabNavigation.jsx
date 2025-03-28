import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { glitchAnimation } from '../animations/variants';

function TabNavigation({ activeTab, handleTabChange, tankColor }) {
    const tabs = ['profile', 'skills', 'equipment'];

    return (
        <div className="flex border-b border-gray-800">
            {tabs.map((tab) => (
                <motion.div
                    key={`tab-${tab}`}
                    className={`px-4 py-2 text-xs font-medium uppercase cursor-pointer relative ${activeTab === tab ? '' : 'text-gray-500'}`}
                    onClick={() => handleTabChange(tab)}
                    whileHover={{
                        color: tankColor,
                        transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                        <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: tankColor }}
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
    );
}

TabNavigation.propTypes = {
    activeTab: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    tankColor: PropTypes.string.isRequired
};

export default TabNavigation;
