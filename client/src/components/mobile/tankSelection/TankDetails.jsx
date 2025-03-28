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

    return (
        <motion.div
            className="bg-black bg-opacity-80 h-full overflow-y-auto relative"
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
            />

            <div className="p-4 space-y-4 relative">
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
};

export default TankDetails;