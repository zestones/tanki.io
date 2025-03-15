import { useEffect } from 'react';
import { useFullscreenContext } from '../../../contexts/FullscreenContext';

const FullscreenStateManager = () => {
    const { isFullscreen, enterFullscreen } = useFullscreenContext();

    useEffect(() => {
        const preferFullscreen = sessionStorage.getItem('preferFullscreen') === 'true';

        // If user prefers fullscreen but we're not in fullscreen mode
        if (preferFullscreen && !isFullscreen) {
            // Short timeout to ensure this happens after component mount
            const timer = setTimeout(() => {
                enterFullscreen(document.documentElement);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isFullscreen, enterFullscreen]);

    // This is a utility component with no UI
    return null;
};

export default FullscreenStateManager;