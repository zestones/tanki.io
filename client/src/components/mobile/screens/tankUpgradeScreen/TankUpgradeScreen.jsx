import { useState } from 'react';
import usePinchZoom from '../../../../hooks/usePinchZoom';

import ScanTechButton from '../../buttons/ScanTechButton';

import SchemaPointsDisplay from './display/SchemaPointsDisplay';
import TankDisplay from './display/TankDisplay';
import UpgradePointsDisplay from './display/UpgradePointsDisplay';

import BackgroundHexagon from './layout/BackgroundHexagon';
import CornerAccents from './layout/CornerAccents';
import GridOverlay from './layout/GridOverlay';

import PropTypes from 'prop-types';

function TankVisualization({ onClose, TankComponent, tankColor, stats: initialStats, username, onStatsChange }) {
    // Stats management
    const [stats, setStats] = useState(initialStats);
    const [upgradePoints, setUpgradePoints] = useState(5);
    const [upgradeEffect, setUpgradeEffect] = useState(null);

    const { scale, containerRef } = usePinchZoom();

    const handleUpgradeStat = (statName) => {
        if (upgradePoints <= 0 || stats[statName] >= 10) return;

        // Apply upgrade
        const newStats = {
            ...stats,
            [statName]: Math.min(stats[statName] + 1, 10)
        };

        setStats(newStats);
        setUpgradePoints(prev => prev - 1);

        // Trigger upgrade effect animation
        setUpgradeEffect(statName);
        setTimeout(() => setUpgradeEffect(null), 1000);

        // Notify parent component if provided
        if (onStatsChange) {
            onStatsChange(newStats);
        }
    };

    const schemaPoints = [
        {
            x: -120,
            y: -80,
            label: 'ARMOR PLATING',
            value: `${stats?.defense || 0}/10`,
            statKey: 'defense',
            upgradable: stats?.defense < 10 && upgradePoints > 0
        },
        {
            x: 120,
            y: -80,
            label: 'WEAPON SYSTEMS',
            value: `${stats?.damage || 0}/10`,
            statKey: 'damage',
            upgradable: stats?.damage < 10 && upgradePoints > 0
        },
        {
            x: -120,
            y: 80,
            label: 'ENGINE OUTPUT',
            value: `${stats?.speed || 0}/10`,
            statKey: 'speed',
            upgradable: stats?.speed < 10 && upgradePoints > 0
        },
        {
            x: 120,
            y: 80,
            label: 'SPECIALTY',
            value: stats?.specialty || 'N/A'
        }
    ];

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center touch-none"
        >
            <ScanTechButton
                onClose={onClose}
                text='CLOSE'
                color={tankColor}
                type="close"
                className='absolute top-4 left-4 z-20 focus:outline-none active:opacity-80 transition-opacity duration-100'
            />

            <BackgroundHexagon tankColor={tankColor} />
            <SchemaPointsDisplay
                points={schemaPoints}
                tankColor={tankColor}
                scale={scale}
                onUpgrade={handleUpgradeStat}
                upgradeEffect={upgradeEffect}
            />
            <TankDisplay
                TankComponent={TankComponent}
                scale={scale}
                username={username}
            />
            <GridOverlay tankColor={tankColor} />
            <CornerAccents tankColor={tankColor} />
            <UpgradePointsDisplay
                upgradePoints={upgradePoints}
                tankColor={tankColor}
            />

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 opacity-50">
                Pinch to zoom • Tap + to upgrade
            </div>
        </div>
    );
}

TankVisualization.propTypes = {
    onClose: PropTypes.func.isRequired,
    TankComponent: PropTypes.func,
    tankColor: PropTypes.string.isRequired,
    stats: PropTypes.shape({
        defense: PropTypes.number,
        damage: PropTypes.number,
        speed: PropTypes.number,
        specialty: PropTypes.string
    }),
    username: PropTypes.string.isRequired,
    onStatsChange: PropTypes.func
};

export default TankVisualization;
