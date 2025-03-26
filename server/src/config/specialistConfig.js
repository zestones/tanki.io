export default {
    "ST-N01": {
        name: "Energy Shield",
        cooldown: 45000,
        duration: 5000,
        effect: {
            type: "shield",
            radius: 100,
            intensity: 0.8 // 80% damage reduction or effect strength
        },
        description: "Deploys a protective energy shield that covers a wide area"
    },
    "SH-N02": {
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
    "TB-N03": {
        name: "Smoke Screen",
        cooldown: 40000,
        duration: 6000,
        effect: {
            type: "obscure",
            radius: 120,
            intensity: 0.6 // 60% visibility reduction
        },
        description: "Creates a dense smoke screen that blocks vision and confuses enemies"
    },
    "JG-N04": {
        name: "Electromagnetic Pulse",
        cooldown: 55000,
        duration: 3000,
        effect: {
            type: "disable",
            radius: 130,
            intensity: 0.5 // 50% effectiveness of disabling effects
        },
        description: "Releases an EMP that disrupts electronic systems in the area"
    },
    "GD-N05": {
        name: "Healing Zone",
        cooldown: 60000,
        duration: 4000,
        effect: {
            type: "heal",
            radius: 110,
            intensity: 0.4 // 40% healing rate
        },
        description: "Creates a regenerative zone that restores health to allies"
    }
}