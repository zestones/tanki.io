import React from 'react';
import useResponsiveUtils from '../../../hooks/useResponsiveUtils';

/**
 * Component to display current responsive layout information
 * Useful for debugging responsive behavior
 */
function ResponsiveDisplayInfo({ showDetailed = false }) {
    const {
        orientation,
        dimensions,
        isVerySmallScreen,
        isSmallScreen,
        isMediumScreen,
        isHighDensity,
        utils
    } = useResponsiveUtils();

    return (
        <div className="fixed bottom-0 right-0 bg-black bg-opacity-70 p-2 text-white text-xs z-50 max-w-[200px]">
            <div>
                <span className="text-gray-400">O:</span> {orientation}
            </div>
            <div>
                <span className="text-gray-400">S:</span> {
                    isVerySmallScreen ? "Very Small" : isSmallScreen ? "Small" : isMediumScreen ? "Medium" : "Large"
                }
            </div>
            <div>
                <span className="text-gray-400">D:</span> {dimensions.width}x{dimensions.height}
            </div>
            {showDetailed && (
                <>
                    <div>
                        <span className="text-gray-400">DPI:</span> {isHighDensity ? "High" : "Standard"}
                    </div>
                    <div>
                        <span className="text-gray-400">T:</span> {
                            utils.formatResponsiveText("This is a demonstration of text formatting", 8)
                        }
                    </div>
                    <div>
                        <span className="text-gray-400">FS:</span> {utils.getFontSize('base')}
                    </div>
                    <div>
                        <span className="text-gray-400">P:</span> {utils.getPadding('md')}
                    </div>
                </>
            )}
        </div>
    );
}

export default ResponsiveDisplayInfo;
