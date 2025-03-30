import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// Import animations
import { containerVariants } from './animations/variants';

// Import UI components
import TabNavigation from './ui/TabNavigation';
import BackgroundEffects from './ui/BackgroundEffects';

// Import tabs
import ProfileTab from './tabs/ProfileTab';
import SkillsTab from './tabs/SkillsTab';
import EquipmentTab from './tabs/EquipmentTab';

function TankDetails({ selectedTank, animateIn, isLandscape }) {
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

    return (
        <motion.div
            className={`bg-black bg-opacity-80 relative flex flex-col overflow-hidden h-full`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <BackgroundEffects selectedTank={selectedTank} isChanging={isChanging} />

            <TabNavigation
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                tankColor={selectedTank.color}
                className="sticky top-0 z-10 flex-shrink-0"
            />

            <div className="overflow-y-auto flex-1">
                <div className="p-4 space-y-4">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <ProfileTab selectedTank={selectedTank} isChanging={isChanging} />
                        )}

                        {activeTab === 'skills' && (
                            <SkillsTab selectedTank={selectedTank} />
                        )}

                        {activeTab === 'equipment' && (
                            <EquipmentTab selectedTank={selectedTank} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
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
        skill: PropTypes.shape({
            name: PropTypes.string.isRequired,
            cooldown: PropTypes.number.isRequired,
            duration: PropTypes.number.isRequired,
            effect: PropTypes.shape({
                type: PropTypes.string.isRequired,
                // Other effect properties can vary
            }).isRequired,
            description: PropTypes.string.isRequired
        }).isRequired,
        equipment: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                effect: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    animateIn: PropTypes.bool.isRequired,
    isLandscape: PropTypes.bool
};

TankDetails.defaultProps = {
    isLandscape: false
};

export default TankDetails;