import GuardianTank from '../components/game/entities/tanks/types/GuardianTank';
import JuggernautTank from '../components/game/entities/tanks/types/JuggernautTank';
import SentinelTank from '../components/game/entities/tanks/types/SentinelTank';
import ShredderTank from '../components/game/entities/tanks/types/ShredderTank';
import ThunderboltTank from '../components/game/entities/tanks/types/ThunderboltTank';

export const tanks = [
    {
        name: "SENTINEL",
        codeName: "ST-N01",
        component: SentinelTank,
        description: "Standard tank with balanced stats and versatile combat capabilities.",
        stats: {
            health: 3,
            damage: 3,
            speed: 3,
            specialty: "Adaptive"
        },
        abilities: ["Armor Plating", "Adaptive Systems"],
        color: "#2ecc71",
        classification: "BALANCED",
        range: "Medium"
    },
    {
        name: "GUARDIAN",
        codeName: "GD-N02",
        component: GuardianTank,
        description: "Defensive specialist with reinforced plating and energy shield technology.",
        stats: {
            health: 5,
            damage: 2,
            speed: 3,
            specialty: "Shield Projection"
        },
        abilities: ["Energy Shield", "Reactive Armor"],
        color: "#3498db",
        classification: "DEFENDER",
        range: "Short"
    },
    {
        name: "SHREDDER",
        codeName: "SH-N03",
        component: ShredderTank,
        description: "Assault-class tank with rapid-fire capabilities and high maneuverability.",
        stats: {
            health: 3,
            damage: 5,
            speed: 4,
            specialty: "Area Damage"
        },
        abilities: ["Rapid Fire", "Afterburner"],
        color: "#e74c3c",
        classification: "ASSAULT",
        range: "Medium"
    },
    {
        name: "JUGGERNAUT",
        codeName: "JG-N04",
        component: JuggernautTank,
        description: "Heavy assault vehicle with superior armor and devastating firepower.",
        stats: {
            health: 4,
            damage: 5,
            speed: 2,
            specialty: "Breakthrough"
        },
        abilities: ["Ramming Speed", "Heavy Artillery"],
        color: "#f1c40f",
        classification: "HEAVY",
        range: "Long"
    },
    {
        name: "THUNDERBOLT",
        codeName: "TB-N05",
        component: ThunderboltTank,
        description: "Tactical strike vehicle specialized in hit-and-run operations.",
        stats: {
            health: 3,
            damage: 4,
            speed: 5,
            specialty: "EMP Strike"
        },
        abilities: ["Lightning Dash", "Static Field"],
        color: "#9b59b6",
        classification: "SCOUT",
        range: "Variable"
    },
];
