window.setup = window.setup || {};

setup.skills = {
    fitness: { name: "Fitness", parent: null, maxLevel: 20 },
    strength: { name: "Strength", parent: null, maxLevel: 20 },
    intellect: { name: "Intellect", parent: null, maxLevel: 20 },
    charisma: { name: "Charisma", parent: null, maxLevel: 20 },
    melee: { name: "Melee", parent: "strength", maxLevel: 20 },
    ranged: { name: "Ranged", parent: "fitness", maxLevel: 20 },
    sneaking: { name: "Sneaking", parent: "fitness", maxLevel: 20 },
    crafting: { name: "Crafting", parent: "intellect", maxLevel: 20 },
    seduction: { name: "Seduction", parent: "charisma", maxLevel: 20 }
};

setup.traits = [
    {
        id: "strong",
        name: "Strong",
        description: "Increased physical power and carry weight.",
        cost: 6,
        bonuses: { strength: 2, melee: 1 },
        multipliers: { strength: 1.2 }
    },
    {
        id: "athletic",
        name: "Athletic",
        description: "Excellent physical conditioning.",
        cost: 6,
        bonuses: { fitness: 2, ranged: 1 },
        multipliers: { fitness: 1.2 }
    },
    {
        id: "genius",
        name: "Genius",
        description: "A naturally high intellect.",
        cost: 8,
        bonuses: { intellect: 3, crafting: 2 },
        multipliers: { intellect: 1.5 }
    },
    {
        id: "weak",
        name: "Weak",
        description: "Lacking in physical power.",
        cost: -4,
        bonuses: { strength: -2 },
        multipliers: { strength: 0.8 }
    },
    {
        id: "out_of_shape",
        name: "Out of Shape",
        description: "Poor physical conditioning.",
        cost: -4,
        bonuses: { fitness: -2 },
        multipliers: { fitness: 0.8 }
    },
    {
        id: "charismatic",
        name: "Charismatic",
        description: "Naturally likable and persuasive.",
        cost: 4,
        bonuses: { charisma: 2, seduction: 1 },
        multipliers: { charisma: 1.2 }
    }
];

setup.getInitialSkills = function() {
    const skills = {};
    for (const id in setup.skills) {
        skills[id] = {
            id: id,
            level: 0,
            xp: 0,
            multiplier: 1.0
        };
    }
    return skills;
};
