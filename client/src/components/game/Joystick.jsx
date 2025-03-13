import { useState, useRef, useEffect } from 'react';

function Joystick({ onMove, onStop }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastDirection, setLastDirection] = useState(0);

    const baseRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const lastPositionRef = useRef({ degrees: 0, isMoving: false });

    // TODO: make it match the server update rate
    const UPDATE_RATE = 16; // ~60fps (1000ms / 60 = 16.67ms) 

    useEffect(() => {
        if (isDragging) {
            updateIntervalRef.current = setInterval(() => {
                if (lastPositionRef.current.isMoving) {
                    onMove(lastPositionRef.current.degrees, lastPositionRef.current.isMoving);
                }
            }, UPDATE_RATE);
        } else {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
                updateIntervalRef.current = null;
            }
        }

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
                updateIntervalRef.current = null;
            }
        };
    }, [isDragging, onMove]);

    const handleStart = (clientX, clientY) => {
        if (!baseRef.current) return;

        setIsDragging(true);
        const baseRect = baseRef.current.getBoundingClientRect();
        const baseCenterX = baseRect.left + baseRect.width / 2;
        const baseCenterY = baseRect.top + baseRect.height / 2;

        handleMove(clientX, clientY, baseCenterX, baseCenterY);
    };

    const handleMove = (clientX, clientY, baseCenterX, baseCenterY) => {
        if (!isDragging || !baseRef.current) return;

        // Calculate centers if not provided
        if (!baseCenterX || !baseCenterY) {
            const baseRect = baseRef.current.getBoundingClientRect();
            baseCenterX = baseRect.left + baseRect.width / 2;
            baseCenterY = baseRect.top + baseRect.height / 2;
        }

        // Calculate deltas
        let deltaX = clientX - baseCenterX;
        let deltaY = -(clientY - baseCenterY); // Invert Y for correct controls

        // Calculate distance and angle
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        // Convert to degrees (0-360)
        let degrees = (angle * 180 / Math.PI) % 360;
        if (degrees < 0) degrees += 360;

        setLastDirection(degrees);

        // Limit joystick movement radius
        const maxDistance = 50;
        const clampedDistance = Math.min(maxDistance, distance);

        // Update visual position (don't invert Y here for visual feedback)
        setPosition({
            x: Math.cos(Math.atan2(clientY - baseCenterY, clientX - baseCenterX)) * clampedDistance,
            y: Math.sin(Math.atan2(clientY - baseCenterY, clientX - baseCenterX)) * clampedDistance
        });

        // Only trigger movement if joystick is moved beyond threshold
        const currentIsMoving = distance > 5;

        // Store the current values for use in the interval
        lastPositionRef.current = { degrees, isMoving: currentIsMoving };
    };

    const handleEnd = () => {
        setIsDragging(false);
        setPosition({ x: 0, y: 0 });
        onStop(lastDirection);

        // Clear the update interval
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
        }
    };

    // Event handlers for mouse
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        handleEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Event handlers for touch
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (!isDragging) return;
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        handleEnd();
    };

    useEffect(() => {
        const element = baseRef.current;
        if (!element) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    return (
        <div
            ref={baseRef}
            className="relative w-48 h-48 bg-black/40 backdrop-blur-sm rounded-full border-2 border-indigo-600/30 shadow-lg flex items-center justify-center"
            onMouseDown={handleMouseDown}
        >
            {/* Visual guides */}
            <div className="absolute w-full h-full rounded-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-indigo-500/20 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-indigo-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-1 bg-indigo-500/20 rounded-full"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-1 bg-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-[16px] border-indigo-500/10 rounded-full"></div>
            </div>

            {/* Joystick handle */}
            <div
                className="absolute w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full shadow-md cursor-grab active:cursor-grabbing transform-gpu will-change-transform"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
            >
                <div className="absolute inset-2 rounded-full bg-indigo-600 flex items-center justify-center">
                    <div className="w-1/2 h-1/2 rounded-full bg-indigo-400/30"></div>
                </div>
            </div>
        </div>
    );
}

export default Joystick;