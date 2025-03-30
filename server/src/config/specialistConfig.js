export default {
    "ST-N01": {
        name: "Healing Zone",
        cooldown: 40000,
        duration: 2000,
        effect: {
            type: "heal",
            radius: 70,    // for display purposes only
            intensity: 0.4 // 40% healing rate
        },
        description: "Creates a regenerative zone that restores health to allies"
    },
    "GD-N02": {
        name: "Energy Shield",
        cooldown: 45000,
        duration: 5000,
        effect: {
            type: "shield",
            radius: 100,   // for display purposes only
            intensity: 1.0 // 100% damage reduction or effect strength
        },
        description: "Deploys a protective energy shield that covers a wide area"
    },
    "SH-N03": {
        "name": "Heavy Bullets",
        "cooldown": 40000,
        "duration": 5000,
        "effect": {
            "type": "damage_boost",
            "radius": 70,    // for display purposes only
            "intensity": 2.0 // 200% damage increase
        },
        "description": "Enhances bullets within the zone, increasing their damage for a short duration."
    },
    "JG-N04": {
        name: "Orbital Strike",
        cooldown: 50000,
        duration: 2000,
        effect: {
            type: "aoe",
            radius: 150,
            intensity: 0.7 // 70% damage or effect strength
        },
        description: "Calls down a devastating area-of-effect strike from orbit"
    },
    "TB-N05": {
        name: "Electromagnetic Pulse",
        cooldown: 55000,
        duration: 3000,
        effect: {
            type: "disable",
            radius: 130,
            intensity: 1.0 // 100% disable effect
        },
        description: "Releases an EMP that disrupts electronic systems in the area"
    }
}