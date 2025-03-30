import { Layer, Stage } from 'react-konva';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import useResponsiveUtils from '../../../hooks/useResponsiveUtils';

import PropTypes from 'prop-types';

function TankPreview({ selectedTank, tankRotation, animateIn, onNext, onPrev, TankComponent, layoutSize }) {
    const { isVerySmallScreen, utils } = useResponsiveUtils();

    // Get the tank preview size from our utility functions
    const size = utils.getTankPreviewSize(layoutSize || (isVerySmallScreen ? 'xs' : 'sm'));

    // Get appropriate button and corner sizes based on screen size
    const buttonSize = utils.getButtonSize('sm');
    const buttonClass = buttonSize.split(' ')[0]; // Extract only the padding part
    const iconSize = utils.getIconSize('sm');

    // Determine corner decoration sizes
    const cornerSize = isVerySmallScreen ? "w-6 h-6" : "w-10 h-10";

    return (
        <div className={`relative flex items-center justify-center ${utils.getPadding(isVerySmallScreen ? 'xs' : 'sm', 'y')}`}>
            <div className={`transition-all duration-300 transform ${animateIn ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <Stage width={size.width} height={size.height}>
                    <Layer>
                        <TankComponent
                            x={size.width / 2}
                            y={size.height / 2}
                            rotation={tankRotation}
                            hp={100}
                            username={selectedTank.name}
                            isDead={false}
                        />
                    </Layer>
                </Stage>
            </div>

            <button
                onClick={onPrev}
                className={`absolute left-0 z-10 ${buttonClass} bg-black bg-opacity-20 text-white focus:outline-none`}
                style={{ borderRight: `2px solid ${selectedTank.color}` }}
            >
                <ChevronLeft size={iconSize} />
            </button>
            <button
                onClick={onNext}
                className={`absolute right-0 z-10 ${buttonClass} bg-black bg-opacity-20 text-white focus:outline-none`}
                style={{ borderLeft: `2px solid ${selectedTank.color}` }}
            >
                <ChevronRight size={iconSize} />
            </button>

            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 left-0 ${cornerSize} border-t-2 border-l-2 border-gray-700 opacity-70`}></div>
                <div className={`absolute top-0 right-0 ${cornerSize} border-t-2 border-r-2 border-gray-700 opacity-70`}></div>
                <div className={`absolute bottom-0 left-0 ${cornerSize} border-b-2 border-l-2 border-gray-700 opacity-70`}></div>
                <div className={`absolute bottom-0 right-0 ${cornerSize} border-b-2 border-r-2 border-gray-700 opacity-70`}></div>
            </div>
        </div>
    );
}

TankPreview.propTypes = {
    selectedTank: PropTypes.shape({
        stats: PropTypes.shape({
            defense: PropTypes.number.isRequired
        }).isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    }).isRequired,
    tankRotation: PropTypes.number.isRequired,
    animateIn: PropTypes.bool.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    TankComponent: PropTypes.elementType.isRequired,
    layoutSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
};

export default TankPreview;
