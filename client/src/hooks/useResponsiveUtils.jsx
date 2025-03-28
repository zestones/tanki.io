import { useMemo } from 'react';
import useResponsiveLayout from './useResponsiveLayout';

/**
 * Custom hook that provides utility functions based on responsive layout
 * @returns {Object} Utility functions for responsive components
 */
function useResponsiveUtils() {
    const layoutInfo = useResponsiveLayout();
    const {
        isVerySmallScreen,
        isSmallScreen,
        isLandscape,
        orientation,
        fontSize,
        componentSizes
    } = layoutInfo;

    // Utility functions for responsive components
    const utils = useMemo(() => ({
        /**
         * Get appropriate content for responsive display
         * @param {*} fullContent - Content for larger screens
         * @param {*} compactContent - Content for smaller screens
         * @param {*} veryCompactContent - Content for very small screens
         * @returns {*} Content appropriate for the current screen size
         */
        getResponsiveContent: (fullContent, compactContent, veryCompactContent) => {
            if (isVerySmallScreen && veryCompactContent !== undefined) {
                return veryCompactContent;
            }
            if (isSmallScreen && compactContent !== undefined) {
                return compactContent;
            }
            return fullContent;
        },

        /**
         * Get appropriate padding classes
         * @param {string} size - Size category: xs, sm, md, lg
         * @param {string} [direction='all'] - Padding direction: all, x, y, t, r, b, l
         * @returns {string} Tailwind padding classes
         */
        getPadding: (size = 'md', direction = 'all') => {
            const sizeMap = {
                xs: isVerySmallScreen ? '1' : '2',
                sm: isVerySmallScreen ? '2' : isSmallScreen ? '3' : '4',
                md: isSmallScreen ? '4' : '5',
                lg: isSmallScreen ? '5' : '6'
            };

            const value = sizeMap[size] || sizeMap.md;

            switch (direction) {
                case 'x': return `px-${value}`;
                case 'y': return `py-${value}`;
                case 't': return `pt-${value}`;
                case 'r': return `pr-${value}`;
                case 'b': return `pb-${value}`;
                case 'l': return `pl-${value}`;
                default: return `p-${value}`;
            }
        },

        /**
         * Get responsive font size class
         * @param {string} size - Size category: xs, sm, base, lg, xl, 2xl
         * @returns {string} Tailwind font size class
         */
        getFontSize: (size = 'base') => {
            return fontSize[size] || fontSize.base;
        },

        /**
         * Get responsive icon size based on screen size
         * @param {string} size - Size category: xs, sm, md, lg
         * @returns {number} Icon size in pixels
         */
        getIconSize: (size = 'md') => {
            return componentSizes.icon[size] || componentSizes.icon.md;
        },

        /**
         * Get an appropriate tank preview size
         * @param {string} sizeCategory - Size category: xs, sm, md, lg
         * @returns {Object} Width and height values
         */
        getTankPreviewSize: (sizeCategory = 'md') => {
            return componentSizes.tankPreview[sizeCategory] || componentSizes.tankPreview.md;
        },

        /**
         * Get button sizing based on screen size
         * @param {string} size - Size category: xs, sm, md, lg
         * @returns {string} Button size class
         */
        getButtonSize: (size = 'md') => {
            return componentSizes.button[size] || componentSizes.button.md;
        },

        /**
         * Format text based on screen constraints
         * @param {string} text - Original text
         * @param {number} maxLength - Maximum length on small screens
         * @returns {string} Possibly truncated text
         */
        formatResponsiveText: (text, maxLength = 8) => {
            if (!text) return '';
            if (isVerySmallScreen && text.length > maxLength) {
                return `${text.substring(0, maxLength - 2)}..`;
            }
            return text;
        },

        /**
         * Get orientation-dependent grid column class
         * @param {string} columns - Column type: singleColumn, twoColumns, threeColumns
         * @returns {string} Grid column class
         */
        getGridColumns: (columns = 'singleColumn') => {
            const layoutKey = isLandscape ? 'landscape' : 'portrait';
            return layoutInfo.gridLayouts[layoutKey][columns] || layoutInfo.gridLayouts[layoutKey].singleColumn;
        }
    }), [
        isVerySmallScreen,
        isSmallScreen,
        isLandscape,
        orientation,
        fontSize,
        componentSizes,
        layoutInfo.gridLayouts
    ]);

    return {
        ...layoutInfo,
        utils
    };
}

export default useResponsiveUtils;
