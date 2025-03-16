/**
 * Lightens or darkens a color by a specified percentage
 * 
 * @param {string} color - Hex color code (e.g., "#FF0000")
 * @param {number} percent - Percentage to lighten (positive) or darken (negative)
 * @returns {string} Modified hex color
 */
export function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.max(0, R).toString(16).padStart(2, '0');
    G = Math.max(0, G).toString(16).padStart(2, '0');
    B = Math.max(0, B).toString(16).padStart(2, '0');

    return `#${R}${G}${B}`;
}


/**
 * Function to apply opacity to color
 * @param {string} color - Hex, rgb, or rgba color code
 * @param {number} opacity - Opacity value between 0 and 1
 * @returns 
 */
export function withOpacity(color, opacity) {
    // Check if color is already in rgba format
    if (color.startsWith('rgba')) {
        return color.replace(/rgba\((.+?),\s*[\d.]+\)/, `rgba($1, ${opacity})`);
    }
    // Check if color is in hex format
    else if (color.startsWith('#')) {
        // Convert hex to rgb
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // Handle rgb format
    else if (color.startsWith('rgb')) {
        return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    }
    return color;
};