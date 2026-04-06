setup.initPlayer = function () {
	State.variables.player = {
		skills: {
			fitness: { level: 0, xp: 0, modifier: 1.0 },
			strength: { level: 0, xp: 0, modifier: 1.0 },
			intellect: { level: 0, xp: 0, modifier: 1.0 },
			charm: { level: 0, xp: 0, modifier: 1.0 }
		},
		traits: []
	};
};
