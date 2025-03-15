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
        range: "Medium",
        skills: [
            { name: "Evasive Maneuvers", level: 3, description: "Balanced movement patterns to avoid incoming fire" },
            { name: "Resource Management", level: 4, description: "Efficient use of ammunition and fuel resources" }
        ],
        equipment: [
            { name: "Reinforced Hull", type: "Armor", effect: "Provides all-around protection against various threats" },
            { name: "Multi-terrain Tracks", type: "Mobility", effect: "Adaptable to different terrain conditions" }
        ]
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
        range: "Short",
        skills: [
            { name: "Shield Mastery", level: 5, description: "Expert control of energy shield systems" },
            { name: "Team Protection", level: 4, description: "Ability to extend shields to nearby allies" }
        ],
        equipment: [
            { name: "Energy Projector", type: "Weapon", effect: "Medium damage output with shield penetration capabilities" },
            { name: "Shield Generator", type: "Special", effect: "Projects energy barriers that absorb incoming damage" }
        ]
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
        range: "Medium",
        skills: [
            { name: "Sustained Fire", level: 4, description: "Ability to maintain continuous fire on targets" },
            { name: "Tactical Movement", level: 4, description: "Fast repositioning during combat engagements" }
        ],
        equipment: [
            { name: "Gatling Cannon", type: "Weapon", effect: "High rate of fire with increasing accuracy" },
            { name: "Composite Armor", type: "Armor", effect: "Lightweight protection optimized for mobility" },
        ]
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
        range: "Long",
        skills: [
            { name: "Heavy Weapons Expert", level: 5, description: "Mastery of high-caliber artillery systems" },
            { name: "Armor Breaker", level: 5, description: "Specialized in penetrating enemy defenses" },
        ],
        equipment: [
            { name: "Siege Cannon", type: "Weapon", effect: "Extremely high damage with longer reload times" },
            { name: "Reinforced Superstructure", type: "Armor", effect: "Massive armor plating with impact resistance" },
        ]
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
        range: "Variable",
        skills: [
            { name: "Recon Specialist", level: 4, description: "Enhanced awareness of battlefield conditions" },
            { name: "Electronic Warfare", level: 5, description: "Disruption of enemy systems and communications" }
        ],
        equipment: [
            { name: "Tesla Cannon", type: "Weapon", effect: "Electric-based weapon that can chain to nearby targets" },
            { name: "EMP Generator", type: "Special", effect: "Disables enemy systems within a certain radius" }
        ]
    },
];
