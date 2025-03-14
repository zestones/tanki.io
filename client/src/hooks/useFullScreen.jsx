import { useState, useEffect } from 'react';

function useFullscreen(ref) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!(
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement
            ));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const enterFullscreen = () => {
        console.log("enterFullscreen");
        if (!ref.current) return;

        const element = ref.current;
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

    return { isFullscreen, enterFullscreen, exitFullscreen };
};

export { useFullscreen };