import { Shield, Target, Zap } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

const MAX_STAT = 6;
function TankStats({ selectedTank, spacing }) {
    const [animatedStats, setAnimatedStats] = useState({
        health: false,
        damage: false,
        speed: false
    });

    const healthFillProps = useSpring({
        from: { height: '0%' },
        to: { height: `${Math.min((selectedTank.stats.health / MAX_STAT) * 100, 100)}%` },
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

    const healthWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: 'translateY(-3px)' },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.health,
    });

    const damageWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: 'translateY(-3px)' },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.damage,
    });

    const speedWaveProps = useSpring({
        from: { transform: 'translateY(0px)' },
        to: { transform: 'translateY(-3px)' },
        config: { duration: 1000, friction: 10 },
        loop: { reverse: true },
        pause: !animatedStats.speed,
    });

    // Start animation after mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedStats({
                health: true,
                damage: true,
                speed: true
            });
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    // Refactored renderHexStat to not use hooks directly
    const renderHexStat = (value, label, icon, fillProps, waveProps) => {
        return (
            <div className="flex flex-col items-center">
                <div className="relative w-12 h-14 mb-1">
                    {/* BASE HEXAGON */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-md transform rotate-45"></div>
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
                                    height: '8px',
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
                        {icon}
                    </div>
                </div>
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-bold text-white">{value}</span>
            </div>
        );
    };

    return (
        <div className={`flex justify-around px-8 ${spacing.tankStats} bg-gray-900 bg-opacity-70`}>
            {renderHexStat(
                selectedTank.stats.health,
                "HP",
                <Shield size={14} />,
                healthFillProps,
                healthWaveProps
            )}
            {renderHexStat(
                selectedTank.stats.damage,
                "DMG",
                <Target size={14} />,
                damageFillProps,
                damageWaveProps
            )}
            {renderHexStat(
                selectedTank.stats.speed,
                "SPD",
                <Zap size={14} />,
                speedFillProps,
                speedWaveProps
            )}
        </div>
    );
};

TankStats.propTypes = {
    selectedTank: PropTypes.shape({
        color: PropTypes.string.isRequired,
        stats: PropTypes.shape({
            health: PropTypes.number.isRequired,
            damage: PropTypes.number.isRequired,
            speed: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    spacing: PropTypes.object.isRequired
};

export default TankStats;