import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import useResponsiveUtils from '../../../../hooks/useResponsiveUtils';

import TankPreview from '../TankPreview';
import TankStats from '../TankStats';
import TankDetails from '../TankDetails';

function PortraitLayout({
    selectedTank,
    tankRotation,
    animateIn,
    tanksData,
    selectedIndex,
    goNext,
    goPrev,
    handleSelect,
    TankComponent
}) {
    const { isVerySmallScreen, isSmallScreen, layoutSpacing, utils } = useResponsiveUtils();

    // Determine appropriate layout size based on screen size
    const getResponsiveLayoutSize = () => {
        if (isVerySmallScreen) return 'xs';
        if (isSmallScreen) return 'sm';
        return 'md';
    };

    // Use different percentage splits based on screen size
    const getHeightDistribution = () => {
        return { topHeight: '60%', bottomHeight: '40%' };
    };

    const { topHeight, bottomHeight } = getHeightDistribution();

    return (
        <div className="flex-grow flex flex-col overflow-hidden">
            {/* Top section - Tank info, preview, and stats */}
            <div className="flex flex-col" style={{ height: topHeight }}>
                <div className={`${utils.getPadding(isVerySmallScreen ? 'xs' : 'sm', 'x')} ${layoutSpacing.header} transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-baseline">
                        <h2 className={`${utils.getFontSize('xl')} font-bold`}>{selectedTank.name}</h2>
                        <span className="ml-2 text-xs font-mono text-gray-400">{selectedTank.codeName}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <div className="w-2 h-2 mr-2 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                        <span className="text-xs font-medium" style={{ color: selectedTank.color }}>
                            {selectedTank.classification}
                        </span>
                    </div>
                </div>

                <TankPreview
                    selectedTank={selectedTank}
                    tankRotation={tankRotation}
                    animateIn={animateIn}
                    onNext={goNext}
                    onPrev={goPrev}
                    TankComponent={TankComponent}
                    layoutSize={getResponsiveLayoutSize()}
                />

                <div className="flex justify-center space-x-1.5 mb-1.5">
                    {tanksData.map((tank, index) => (
                        <div
                            key={tank.codeName}
                            className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-6' : 'w-3 bg-gray-700'}`}
                            style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                        ></div>
                    ))}
                </div>

                <TankStats
                    selectedTank={selectedTank}
                    spacing={layoutSpacing.section}
                />
            </div>

            {/* Bottom section - Tank details */}
            <div className="border-t border-gray-800 flex flex-col overflow-hidden" style={{ height: bottomHeight }}>
                <div className="flex-grow flex flex-col overflow-hidden">
                    <TankDetails
                        selectedTank={selectedTank}
                        animateIn={animateIn}
                        isLandscape={false}
                    />
                </div>

                {/* Action button */}
                <div className="bg-black bg-opacity-80 border-t border-gray-800">
                    <button
                        onClick={handleSelect}
                        className={`w-full ${utils.getButtonSize('md')} flex items-center justify-center transition-all duration-300 transform`}
                        style={{
                            backgroundColor: selectedTank.color,
                            boxShadow: `0 0 20px ${selectedTank.color}80`
                        }}
                    >
                        <span className="font-bold tracking-wider mr-2">DEPLOY</span>
                        <ArrowRight size={utils.getIconSize('sm')} />
                    </button>
                </div>
            </div>
        </div>
    );
}

PortraitLayout.propTypes = {
    selectedTank: PropTypes.object.isRequired,
    tankRotation: PropTypes.number.isRequired,
    animateIn: PropTypes.bool.isRequired,
    tanksData: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    goNext: PropTypes.func.isRequired,
    goPrev: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    TankComponent: PropTypes.elementType.isRequired
};

export default PortraitLayout;
