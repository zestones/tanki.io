import { animated, useSpring } from '@react-spring/web';
import { Shield, Target, Zap } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useResponsiveUtils from '../../../hooks/useResponsiveUtils';

const MAX_STAT = 10;

function TankStats({ selectedTank, spacing = null }) {
    const {
        isVerySmallScreen,
        isSmallScreen,
        isLandscape,
        utils,
        layoutSpacing
    } = useResponsiveUtils();

    const [animatedStats, setAnimatedStats] = useState({
        defense: false,
        damage: false,
        speed: false
    });

    // Determine hex sizes based on screen size
    const hexSize = isVerySmallScreen ? 10 : isSmallScreen ? 11 : 12;
    const hexHeight = isVerySmallScreen ? 12 : isSmallScreen ? 13 : 14;

    // Get icon size from responsive utils
    const iconSize = utils.getIconSize('xs');

    // Get text sizes from responsive utils
    const labelTextSize = utils.getFontSize('xs');
    const valueTextSize = `${labelTextSize} font-bold`;

    const defenseFillProps = useSpring({
        from: { height: '0%' },
        to: { height: `${Math.min((selectedTank.stats.defense / MAX_STAT) * 100, 100)}%` },
        config: { mass: 1, tension: 180, friction: 24 },
        delay: 100,
    });

    const damageFillProps = useSpring({
        from: { height: '0%' },
        to: { height: `${Math.min((selectedTank.stats.damage / MAX_STAT) * 100, 100)}%` },
        config: { mass: 1, tension: 180, friction: 24 },
        delay: 100,
    });

    const speedFillProps = useSpring({
        from: { height: '0%' },
        to: { height: `${Math.min((selectedTank.stats.speed / MAX_STAT) * 100, 100)}%` },
        config: { mass: 1, tension: 180, friction: 24 },
        delay: 100,
    });

    // Wave animations - adjust intensity based on screen size
    const waveDistance = isVerySmallScreen ? -2 : -3;
    const waveHeight = isVerySmallScreen ? '6px' : '8px';

    const healthWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: `translateY(${waveDistance}px)` },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.defense,
    });

    const damageWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: `translateY(${waveDistance}px)` },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.damage,
    });

    const speedWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: `translateY(${waveDistance}px)` },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.speed,
    });

    // Start animation after mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedStats({
                defense: true,
                damage: true,
                speed: true
            });
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    // Render a hexagonal stat with liquid fill effect
    const renderHexStat = (value, label, icon, fillProps, waveProps) => {
        return (
            <div className="flex flex-col items-center">
                <div className={`relative w-${hexSize} h-${hexHeight} mb-1`}>
                    {/* BASE HEXAGON */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-${hexSize} h-${hexSize} bg-gray-800 rounded-md transform rotate-45`}></div>
                    </div>

                    {/* HEXAGON FILL - LIQUID EFFECT */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        style={{ clipPath: `polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)` }}>
                        <animated.div
                            style={{
                                ...fillProps,
                                width: '100%',
                                position: 'absolute',
                                bottom: 0,
                                backgroundColor: selectedTank.color,
                                opacity: 0.7,
                            }}
                        >
                            {/* Wave effect */}
                            <animated.div
                                className="absolute top-0 left-0 w-full"
                                style={{
                                    ...waveProps,
                                    height: waveHeight,
                                    background: `linear-gradient(to bottom, 
                                        ${selectedTank.color} 30%, 
                                        rgba(255,255,255,0.3) 50%, 
                                        rgba(255,255,255,0) 100%)`,
                                    boxShadow: `0 0 10px ${selectedTank.color}`,
                                    borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                                }}
                            />
                        </animated.div>
                    </div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        {React.cloneElement(icon, { size: iconSize })}
                    </div>
                </div>
                <span className={labelTextSize}>{label}</span>
                <span className={valueTextSize}>{value}</span>
            </div>
        );
    };

    // Determine container spacing and padding
    const containerSpacing = spacing ?
        (typeof spacing === 'string' ? spacing : spacing.tankStats) :
        layoutSpacing.section;

    const horizontalPadding = isLandscape ?
        (isVerySmallScreen ? 'px-3' : 'px-5') :
        (isVerySmallScreen ? 'px-4' : isSmallScreen ? 'px-6' : 'px-8');

    return (
        <div className={`flex justify-around ${horizontalPadding} ${containerSpacing} bg-gray-900 bg-opacity-70`}>
            {renderHexStat(
                selectedTank.stats.defense,
                "DFS",
                <Shield />,
                defenseFillProps,
                healthWaveProps
            )}
            {renderHexStat(
                selectedTank.stats.damage,
                "DMG",
                <Target />,
                damageFillProps,
                damageWaveProps
            )}
            {renderHexStat(
                selectedTank.stats.speed,
                "SPD",
                <Zap />,
                speedFillProps,
                speedWaveProps
            )}
        </div>
    );
}

TankStats.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            defense: PropTypes.number.isRequired,
            damage: PropTypes.number.isRequired,
            speed: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    spacing: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
};

export default TankStats;