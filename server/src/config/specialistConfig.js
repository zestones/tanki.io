export default {
    "ST-N01": {
        name: "Turbo Dash",
        cooldown: 30000, // 30 seconds cooldown
        duration: 3000,  // 3 seconds active
        effect: {
            type: "dash",
            speedBoost: 5.0,
            invulnerable: true,
            shockwave: {
                radius: 100,
                damage: 40,
                knockback: 150
            }
        },
        description: "Dash forward at incredible speed, becoming invulnerable and creating a damaging shockwave on impact"
    },
    "GD-N02": {
        name: "Energy Shield",
        cooldown: 45000, // 45 seconds cooldown
        duration: 5000,  // 5 seconds active
        effect: {
            type: "shield",
            damageReduction: 1.0, // 100% damage reduction
            pulseRate: 500 // Shield visual pulsing effect interval in ms
        },
        description: "Deploys an impenetrable energy shield that blocks all damage"
    },
    "SH-N03": {
        name: "Homing Missiles",
        cooldown: 40000, // 40 seconds cooldown
        duration: 4000,  // 4 seconds active
        effect: {
            type: "homing",
            missileCount: 3,
            damage: 50,
            trackingSpeed: 0.8,
            visualEffect: "smoke-trail"
        },
        description: "Launches intelligent guided missiles that track and pursue enemy tanks"
    },
    "JG-N04": {
        name: "Hologram Decoys",
        cooldown: 50000, // 50 seconds cooldown
        duration: 8000,  // 8 seconds active
        effect: {
            type: "decoy",
            decoyCount: 3,
            decoyHealth: 30,
            decoyBehavior: "aggressive"
        },
        description: "Deploys holographic decoys that distract and confuse enemies"
    },
    "TB-N05": {
        name: "Orbital Strike",
        cooldown: 60000, // 60 seconds cooldown
        duration: 2000,  // 2 seconds active
        effect: {
            type: "aoe",
            radius: 150,
            damage: 80,
            visualEffect: "orbital-beam"
        },
        description: "Calls down a devastating orbital strike that damages all enemies in the target area"
    }
}
