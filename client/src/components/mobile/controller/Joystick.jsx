import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Joystick({ onMove, onStop, size = "w-48 h-48", type = "movement" }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastDirection, setLastDirection] = useState(0);

    const baseRef = useRef(null);
    const updateIntervalRef = useRef(null);
    const lastPositionRef = useRef({ degrees: 0, isMoving: false });
    const touchIdRef = useRef(null); // Store the touch identifier

    // TODO: make it match the server update rate
    const UPDATE_RATE = 16; // ~60fps (1000ms / 60 = 16.67ms) 

    useEffect(() => {
        if (isDragging) {
            updateIntervalRef.current = setInterval(() => {
                if (lastPositionRef.current.isMoving) {
                    onMove(lastPositionRef.current.degrees, lastPositionRef.current.isMoving, type);
                }
            }, UPDATE_RATE);
        } else if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
        }

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
                updateIntervalRef.current = null;
            }
        };
    }, [isDragging, onMove, type]);

    const handleStart = (clientX, clientY, touchId = null) => {
        if (!baseRef.current) return;

        touchIdRef.current = touchId; // Store the touch ID for multi-touch support
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
        onStop(lastDirection, type);
        touchIdRef.current = null; // Reset the touch ID

        // Clear the update interval
        if (updateIntervalRef.current) {
            clearInterval(updateIntervalRef.current);
            updateIntervalRef.current = null;
        }
    };

    // Event handlers for mouse
    const handleMouseDown = (e) => {
        // Check if we're already dragging (could happen with multiple input methods)
        if (isDragging) return;

        e.preventDefault();

        // Use window instead of document for better mouse capture
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        handleEnd();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Event handlers for touch
    const handleTouchStart = (e) => {
        // Check if we're already dragging with this joystick
        if (isDragging) return;

        const baseRect = baseRef.current.getBoundingClientRect();

        // Find a touch that's within this joystick's boundaries
        const touchWithinBounds = Array.from(e.touches).find(touch => {
            return (
                touch.clientX >= baseRect.left &&
                touch.clientX <= baseRect.right &&
                touch.clientY >= baseRect.top &&
                touch.clientY <= baseRect.bottom
            );
        });

        // If no touch is within this joystick's bounds, don't do anything
        if (!touchWithinBounds) return;

        // Very important: DO NOT prevent defaults or stop propagation globally
        // This would block other touch events on other elements

        // Store this touch for this joystick instance
        handleStart(touchWithinBounds.clientX, touchWithinBounds.clientY, touchWithinBounds.identifier);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || touchIdRef.current === null) return;

        // Find our specific touch by ID
        const touchIndex = Array.from(e.touches).findIndex(
            touch => touch.identifier === touchIdRef.current
        );

        if (touchIndex === -1) return;

        const touch = e.touches[touchIndex];
        handleMove(touch.clientX, touch.clientY);

        // DO NOT stop propagation - this would prevent other touch events
    };

    const handleTouchEnd = (e) => {
        // Check if our tracked touch has ended
        const isTouchActive = Array.from(e.touches).some(
            touch => touch.identifier === touchIdRef.current
        );

        if (!isTouchActive && isDragging) {
            handleEnd();
        }
    };

    useEffect(() => {
        const element = baseRef.current;
        if (!element) return;

        // Attach touch events to the specific joystick element
        element.addEventListener('touchstart', handleTouchStart, { passive: true });

        // But attach move and end handlers to document for better tracking outside the element
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isDragging]); // Re-attach listeners when isDragging changes

    // Determine colors based on joystick type
    const borderColor = type === "movement" ? "border-indigo-600/30" : "border-red-600/30";
    const guideColor = type === "movement" ? "bg-indigo-500/20" : "bg-red-500/20";
    const handleGradient = type === "movement"
        ? "from-indigo-500 to-indigo-700"
        : "from-red-500 to-red-700";
    const handleBg = type === "movement" ? "bg-indigo-600" : "bg-red-600";
    const handleInner = type === "movement" ? "bg-indigo-400/30" : "bg-red-400/30";
    const ringColor = type === "movement" ? "border-indigo-500/10" : "border-red-500/10";

    return (
        <div
            ref={baseRef}
            className={`relative ${size} bg-black/40 backdrop-blur-sm rounded-full border-2 ${borderColor} shadow-lg flex items-center justify-center`}
            onMouseDown={handleMouseDown}
        >
            {/* Visual guides */}
            <div className="absolute w-full h-full rounded-full">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 ${guideColor} rounded-full`}></div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 ${guideColor} rounded-full`}></div>
                <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-8 h-1 ${guideColor} rounded-full`}></div>
                <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-8 h-1 ${guideColor} rounded-full`}></div>
                <div className={`absolute inset-0 border-[16px] ${ringColor} rounded-full`}></div>
            </div>

            {/* Joystick handle */}
            <div
                className={`absolute w-20 h-20 bg-gradient-to-br ${handleGradient} rounded-full shadow-md cursor-grab active:cursor-grabbing transform-gpu will-change-transform`}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
            >
                <div className={`absolute inset-2 rounded-full ${handleBg} flex items-center justify-center`}>
                    <div className={`w-1/2 h-1/2 rounded-full ${handleInner}`}></div>
                </div>
            </div>
        </div>
    );
}


Joystick.propTypes = {
    onMove: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    size: PropTypes.string,
    type: PropTypes.oneOf(['movement', 'aiming'])
};

export default Joystick;