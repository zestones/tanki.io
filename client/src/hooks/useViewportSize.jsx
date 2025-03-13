import { useState, useEffect } from 'react';

export default function useViewportSize(containerRef) {
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateViewportSize = () => {
            if (!containerRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            setViewportSize({ width, height });
        };

        // Initial measurement after a short delay to ensure the container is rendered
        setTimeout(updateViewportSize, 100);

        // Update on window resize
        window.addEventListener('resize', updateViewportSize);

        return () => {
            window.removeEventListener('resize', updateViewportSize);
        };
    }, [containerRef]);

    return viewportSize;
}