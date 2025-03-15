import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FullscreenContext = createContext();

export function FullscreenProvider({ children }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Check fullscreen status on mount and when it changes
    useEffect(() => {
        const checkFullscreen = () => {
            const fullscreenElement =
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement;

            setIsFullscreen(!!fullscreenElement);
        };

        // Initial check
        checkFullscreen();

        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', checkFullscreen);
        document.addEventListener('webkitfullscreenchange', checkFullscreen);
        document.addEventListener('mozfullscreenchange', checkFullscreen);
        document.addEventListener('MSFullscreenChange', checkFullscreen);

        return () => {
            document.removeEventListener('fullscreenchange', checkFullscreen);
            document.removeEventListener('webkitfullscreenchange', checkFullscreen);
            document.removeEventListener('mozfullscreenchange', checkFullscreen);
            document.removeEventListener('MSFullscreenChange', checkFullscreen);
        };
    }, []);

    // Request fullscreen for an element
    const enterFullscreen = (element) => {
        if (!element) return;

        if (element.requestFullscreen) {
            element.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen().catch(err => console.error('Fullscreen error:', err));
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen().catch(err => console.error('Fullscreen error:', err));
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen().catch(err => console.error('Fullscreen error:', err));
        }
    };

    // Exit fullscreen
    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.error('Exit fullscreen error:', err));
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen().catch(err => console.error('Exit fullscreen error:', err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch(err => console.error('Exit fullscreen error:', err));
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen().catch(err => console.error('Exit fullscreen error:', err));
        }
    };

    const contextValue = React.useMemo(
        () => ({ isFullscreen, enterFullscreen, exitFullscreen }),
        [isFullscreen]
    );

    return (
        <FullscreenContext.Provider value={contextValue}>
            {children}
        </FullscreenContext.Provider>
    );
}

FullscreenProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useFullscreenContext = () => useContext(FullscreenContext);