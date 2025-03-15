import GuardianTank from '../components/game/entities/tanks/types/GuardianTank';
import JuggernautTank from '../components/game/entities/tanks/types/JuggernautTank';
import SentinelTank from '../components/game/entities/tanks/types/SentinelTank';
import ShredderTank from '../components/game/entities/tanks/types/ShredderTank';
import ThunderboltTank from '../components/game/entities/tanks/types/ThunderboltTank';

export const tankComponentMap = {
    'ST-N01': SentinelTank,
    'GD-N02': GuardianTank,
    'SH-N03': ShredderTank,
    'JG-N04': JuggernautTank,
    'TB-N05': ThunderboltTank
};
