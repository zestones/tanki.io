import useConnectionManager from '../../../hooks/useConnectionManager';
import { tankComponentMap } from '../../../utils/tankComponentMap';
import TankVisualization from './TankVisualization';

function TankStatsModal({ isVisible }) {
    const {
        tank,
        score,
        username
    } = useConnectionManager();

    if (!isVisible) return null;

    const tankColor = tank?.color ?? '#ff8c00';
    const TankComponent = tankComponentMap[tank?.codeName];

    return (
        <TankVisualization
            TankComponent={TankComponent}
            tankColor={tankColor}
            stats={tank?.stats}
            username={username}
        />
    )
}

export default TankStatsModal;