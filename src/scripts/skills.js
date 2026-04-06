setup.skills = {
	gainXP: function (skillName, amount) {
		const player = State.variables.player;
		if (player && player.skills[skillName]) {
			const skill = player.skills[skillName];
			const modifiedAmount = amount * skill.modifier;
			skill.xp += modifiedAmount;

			// Simple leveling logic: level = floor(sqrt(xp / 100))
			const newLevel = Math.floor(Math.sqrt(skill.xp / 100));
			if (newLevel > skill.level) {
				skill.level = newLevel;
			}
		}
	},

	applyTrait: function (trait) {
		const player = State.variables.player;
		if (!player.traits.includes(trait.name)) {
			player.traits.push(trait.name);
			if (trait.modifiers) {
				for (const skill in trait.modifiers) {
					if (player.skills[skill]) {
						player.skills[skill].modifier += trait.modifiers[skill];
					}
				}
			}
		}
	}
};
