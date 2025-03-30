import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting screen orientation and size
 * @returns {Object} Orientation, size categories, and responsive dimensions
 */
function useResponsiveLayout() {
    // Screen dimensions state
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Derived state values
    const isLandscape = dimensions.width > dimensions.height;
    const orientation = isLandscape ? 'landscape' : 'portrait';

    // Screen size categories
    const isVerySmallScreen = dimensions.width <= 360 || dimensions.height <= 640;
    const isSmallScreen = dimensions.width <= 390 || dimensions.height <= 700;
    const isMediumScreen = dimensions.width <= 768 || dimensions.height <= 1024;

    // Pixel density (for higher resolution screens)
    const pixelRatio = window.devicePixelRatio || 1;
    const isHighDensity = pixelRatio >= 2;

    // Update dimensions on resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate standard spacing values based on screen size
    const spacing = {
        xs: isVerySmallScreen ? 1 : 2,
        sm: isVerySmallScreen ? 2 : isSmallScreen ? 3 : 4,
        md: isSmallScreen ? 4 : 6,
        lg: isSmallScreen ? 6 : 8
    };

    // Font size adjustments
    const fontSize = {
        xs: isVerySmallScreen ? 'text-[10px]' : 'text-xs',
        sm: isVerySmallScreen ? 'text-xs' : 'text-sm',
        base: isVerySmallScreen ? 'text-sm' : 'text-base',
        lg: isSmallScreen ? 'text-base' : 'text-lg',
        xl: isSmallScreen ? 'text-lg' : 'text-xl',
        '2xl': isSmallScreen ? 'text-xl' : 'text-2xl'
    };

    // Common content sections spacing
    const layoutSpacing = {
        header: isVerySmallScreen ? 'py-1' : isSmallScreen ? 'py-2' : 'py-3',
        content: isVerySmallScreen ? 'p-2' : isSmallScreen ? 'p-3' : 'p-4',
        section: isVerySmallScreen ? 'mb-2' : isSmallScreen ? 'mb-3' : 'mb-4',
        item: isVerySmallScreen ? 'mb-1 py-1' : isSmallScreen ? 'mb-2 py-2' : 'mb-3 py-2',
        card: isVerySmallScreen ? 'p-2' : isSmallScreen ? 'p-3' : 'p-4',
        gap: isVerySmallScreen ? 'gap-1' : isSmallScreen ? 'gap-2' : 'gap-3'
    };

    // Component-specific measurements
    const componentSizes = {
        // Tank preview sizes
        tankPreview: {
            xs: { width: isLandscape ? 160 : 180, height: isLandscape ? 120 : 180 },
            sm: { width: isLandscape ? 180 : 220, height: isLandscape ? 180 : 220 },
            md: { width: isLandscape ? 220 : 260, height: isLandscape ? 220 : 260 },
            lg: { width: 280, height: 280 }
        },

        // Icon sizes
        icon: {
            xs: isVerySmallScreen ? 12 : 14,
            sm: isVerySmallScreen ? 14 : 16,
            md: isSmallScreen ? 16 : 20,
            lg: 24
        },

        // Button sizes
        button: {
            xs: isVerySmallScreen ? 'p-1 text-xs' : 'p-1.5 text-xs',
            sm: isVerySmallScreen ? 'p-1.5 text-xs' : 'p-2 text-sm',
            md: isSmallScreen ? 'p-2 text-sm' : 'p-3 text-base',
            lg: 'p-3 text-base'
        }
    };

    // Responsive grid layouts
    const gridLayouts = {
        portrait: {
            singleColumn: 'grid-cols-1',
            twoColumns: isSmallScreen ? 'grid-cols-1' : 'grid-cols-2',
            threeColumns: isSmallScreen ? 'grid-cols-1' : isMediumScreen ? 'grid-cols-2' : 'grid-cols-3'
        },
        landscape: {
            singleColumn: 'grid-cols-1',
            twoColumns: 'grid-cols-2',
            threeColumns: isSmallScreen ? 'grid-cols-2' : 'grid-cols-3'
        }
    };

    return {
        // Basic screen properties
        orientation,
        isLandscape,
        isPortrait: !isLandscape,
        dimensions,
        isVerySmallScreen,
        isSmallScreen,
        isMediumScreen,
        isHighDensity,

        // Responsive design helpers
        spacing,
        fontSize,
        layoutSpacing,
        componentSizes,
        gridLayouts
    };
}

export default useResponsiveLayout;
