import { useState, useRef, useEffect } from 'react';

function usePinchZoom(initialScale = 1, minScale = 0.5, maxScale = 2) {
    const [scale, setScale] = useState(initialScale);
    const containerRef = useRef(null);
    const lastDistance = useRef(null);

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            // Calculate initial distance for zoom
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            lastDistance.current = distance;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];

            // Handle zoom
            const newDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            if (lastDistance.current) {
                const delta = newDistance / lastDistance.current;
                const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);
                setScale(newScale);
            }
            lastDistance.current = newDistance;
        }
    };

    const handleTouchEnd = () => {
        lastDistance.current = null;
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove);
            container.addEventListener('touchend', handleTouchEnd);

            return () => {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [scale]);

    return { scale, setScale, containerRef };
}

export default usePinchZoom;
