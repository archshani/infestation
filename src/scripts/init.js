// Initialize game state
Config.history.maxStates = 10;
Config.saves.autoload = "prompt";

// Game State Setup
setup.initPlayer = function() {
    return {
        skills: {
            fitness: { level: 0, xp: 0, xpModifier: 1.0 },
            strength: { level: 0, xp: 0, xpModifier: 1.0 },
            intellect: { level: 0, xp: 0, xpModifier: 1.0 }, // Changed from Intelligence to Intellect
            charm: { level: 0, xp: 0, xpModifier: 1.0 }
        },
        traits: []
    };
};

// XP System logic
setup.getExpForLevel = function(level) {
    // Formula for XP required for next level
    return Math.floor(100 * Math.pow(1.5, level));
};

setup.addSkillExp = function(skillName, amount) {
    const skill = State.variables.player.skills[skillName];
    if (!skill) return;

    skill.xp += Math.round(amount * skill.xpModifier);

    while (skill.xp >= setup.getExpForLevel(skill.level)) {
        skill.xp -= setup.getExpForLevel(skill.level);
        skill.level++;
        console.log(`Level up! ${skillName} is now level ${skill.level}`);
    }
};

// Trait impact on skills
setup.applyTraitModifiers = function() {
    const player = State.variables.player;
    // Reset modifiers before reapplying
    for (let skill in player.skills) {
        player.skills[skill].xpModifier = 1.0;
    }

    player.traits.forEach(trait => {
        if (trait.modifiers) {
            for (let skill in trait.modifiers) {
                if (player.skills[skill]) {
                    player.skills[skill].xpModifier += trait.modifiers[skill];
                }
            }
        }
    });
};

// Example trait definitions
setup.traits = {
    "athlete": {
        name: "Athlete",
        description: "Naturally fit and strong.",
        modifiers: {
            fitness: 0.5, // +50% XP
            strength: 0.3
        }
    },
    "scholar": {
        name: "Scholar",
        description: "Sharp mind and quick learning.",
        modifiers: {
            intellect: 0.5
        }
    },
    "charismatic": {
        name: "Charismatic",
        description: "A natural leader.",
        modifiers: {
            charm: 0.5
        }
    }
};
