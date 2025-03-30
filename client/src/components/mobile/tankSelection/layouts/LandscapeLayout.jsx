import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import useResponsiveUtils from '../../../../hooks/useResponsiveUtils';

import TankPreview from '../TankPreview';
import TankStats from '../TankStats';
import TankDetails from '../TankDetails';

function LandscapeLayout({
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
    const { isVerySmallScreen, utils } = useResponsiveUtils();

    return (
        <div className="flex-grow flex flex-row overflow-hidden">
            {/* Left section - Tank preview and stats */}
            <div className={`${isVerySmallScreen ? 'w-[60%]' : 'w-[55%]'} flex flex-col`}>
                <div className={`${utils.getPadding('xs')} transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-baseline">
                        <h2 className={`${utils.getFontSize('lg')} font-bold`}>{selectedTank.name}</h2>
                        <span className="ml-1.5 text-xs font-mono text-gray-400">{selectedTank.codeName}</span>
                    </div>
                    <div className="flex items-center mt-0.5">
                        <div className="w-1.5 h-1.5 mr-1.5 rounded-sm" style={{ backgroundColor: selectedTank.color }}></div>
                        <span className="text-xs font-medium" style={{ color: selectedTank.color }}>
                            {selectedTank.classification}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col justify-center flex-1">
                    <TankPreview
                        selectedTank={selectedTank}
                        tankRotation={tankRotation}
                        animateIn={animateIn}
                        onNext={goNext}
                        onPrev={goPrev}
                        TankComponent={TankComponent}
                        layoutSize={isVerySmallScreen ? 'xs' : 'sm'}
                    />

                    <div className="flex justify-center space-x-1.5 my-1">
                        {tanksData.map((tank, index) => (
                            <div
                                key={tank.codeName}
                                className={`h-1 transition-all duration-300 ${selectedIndex === index ? 'w-5' : 'w-2.5 bg-gray-700'}`}
                                style={selectedIndex === index ? { backgroundColor: tank.color } : {}}
                            ></div>
                        ))}
                    </div>
                </div>
                <TankStats
                    selectedTank={selectedTank}
                    spacing={utils.getPadding('xs')}
                />
            </div>

            {/* Right section - Tank details */}
            <div className={`${isVerySmallScreen ? 'w-[40%]' : 'w-[45%]'} border-l border-gray-800 overflow-hidden flex flex-col`}>
                <TankDetails
                    selectedTank={selectedTank}
                    animateIn={animateIn}
                    isSmallScreen={true}
                    isLandscape={true}
                    isVerySmallScreen={isVerySmallScreen}
                />

                {/* Action button - positioned at the bottom in landscape */}
                <div className="pb-2 px-3 border-t border-gray-800 bg-black bg-opacity-50 mt-auto">
                    <button
                        onClick={handleSelect}
                        className={`w-full ${utils.getButtonSize('sm')} flex items-center justify-center transition-all duration-300 transform`}
                        style={{
                            backgroundColor: selectedTank.color,
                            boxShadow: `0 0 15px ${selectedTank.color}80`
                        }}
                    >
                        <span className="font-bold tracking-wider mr-2 text-sm">DEPLOY</span>
                        <ArrowRight size={utils.getIconSize('xs')} />
                    </button>
                </div>
            </div>
        </div>
    );
}

LandscapeLayout.propTypes = {
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

export default LandscapeLayout;
