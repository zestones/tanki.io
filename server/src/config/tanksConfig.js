import specialistData from "./specialistConfig.js";

export default {
    "ST-N01": {
        name: "SENTINEL",
        stats: {
            defense: 3,
            damage: 3,
            speed: 4,
            specialty: "Healer"
        },
        abilities: ["Healing Zone", "Balanced Systems"],
        color: "#2ecc71",
        classification: "BALANCED",
        range: "Medium",
        skill: specialistData["ST-N01"],
        equipment: [
            { name: "Reinforced Hull", type: "Armor", effect: "Provides all-around protection against various threats" },
            { name: "Multi-terrain Tracks", type: "Special", effect: "Adaptable to different terrain conditions" }
        ],
        description: "Standard tank with balanced stats and versatile combat capabilities."
    },
    "GD-N02": {
        name: "GUARDIAN",
        stats: {
            defense: 6,
            damage: 2,
            speed: 2,
            specialty: "Shield Projection"
        },
        abilities: ["Energy Shield", "Reactive Armor"],
        color: "#3498db",
        classification: "DEFENDER",
        range: "Short",
        skill: specialistData["GD-N02"],
        equipment: [
            { name: "Energy Projector", type: "Weapon", effect: "Medium damage output with shield penetration capabilities" },
            { name: "Shield Generator", type: "Special", effect: "Projects energy barriers that absorb incoming damage" }
        ],
        description: "Defensive specialist with reinforced plating and energy shield technology."
    },
    "SH-N03": {
        name: "SHREDDER",
        stats: {
            defense: 2,
            damage: 5,
            speed: 3,
            specialty: "Area Damage"
        },
        abilities: ["Rapid Fire", "Afterburner"],
        color: "#e74c3c",
        classification: "ASSAULT",
        range: "Medium",
        skill: specialistData["SH-N03"],
        equipment: [
            { name: "Gatling Cannon", type: "Weapon", effect: "High rate of fire with increasing accuracy" },
            { name: "Composite Armor", type: "Armor", effect: "Lightweight protection optimized for mobility" }
        ],
        description: "Assault-class tank with rapid-fire capabilities and high maneuverability."
    },
    "JG-N04": {
        name: "JUGGERNAUT",
        stats: {
            defense: 4,
            damage: 5,
            speed: 1,
            specialty: "Breakthrough"
        },
        abilities: ["Ramming Speed", "Heavy Artillery"],
        color: "#f1c40f",
        classification: "HEAVY",
        range: "Long",
        skill: specialistData["JG-N04"],
        equipment: [
            { name: "Siege Cannon", type: "Weapon", effect: "Extremely high damage with longer reload times" },
            { name: "Reinforced Superstructure", type: "Armor", effect: "Massive armor plating with impact resistance" }
        ],
        description: "Heavy assault vehicle with superior armor and devastating firepower."
    },
    "TB-N05": {
        name: "THUNDERBOLT",
        stats: {
            defense: 2,
            damage: 3,
            speed: 5,
            specialty: "EMP Strike"
        },
        abilities: ["Lightning Dash", "Static Field"],
        color: "#9b59b6",
        classification: "SCOUT",
        range: "Variable",
        skill: specialistData["TB-N05"],
        equipment: [
            { name: "Tesla Cannon", type: "Weapon", effect: "Electric-based weapon that can chain to nearby targets" },
            { name: "EMP Generator", type: "Special", effect: "Disables enemy systems within a certain radius" }
        ],
        description: "Tactical strike vehicle specialized in hit-and-run operations."
    }
};