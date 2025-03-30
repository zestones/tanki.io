import PropTypes from 'prop-types';

function TabNavigation({ activeTab, handleTabChange, tankColor, isSmallScreen = false }) {
    const tabs = [
        { id: 'profile', label: 'PROFILE' },
        { id: 'skills', label: 'SKILLS' },
        { id: 'equipment', label: 'EQUIP' }
    ];

    // Use shorter labels on small screens
    const getTabLabel = (tab) => {
        if (isSmallScreen) {
            switch (tab.id) {
                case 'profile': return 'PROF';
                case 'skills': return 'SKILL';
                case 'equipment': return 'EQUIP';
                default: return tab.label;
            }
        }
        return tab.label;
    };

    return (
        <div className="flex border-b border-gray-800">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 py-2 ${isSmallScreen ? 'text-xs' : 'text-sm'} font-semibold relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}
                >
                    {getTabLabel(tab)}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: tankColor }}></div>
                    )}
                </button>
            ))}
        </div>
    );
}

TabNavigation.propTypes = {
    activeTab: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    tankColor: PropTypes.string.isRequired,
    isSmallScreen: PropTypes.bool
};

export default TabNavigation;
