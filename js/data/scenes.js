const scenes = {
    'foyer': {
      title: 'Laboratory Foyer',
      description: 'The foyer is dimly lit, metal doors line the walls, and a low hum of equipment reverberates through the concrete floor. A faint smell of antiseptic hangs in the air.',
      nav: [
        { text: 'Kitchen', action: "goToScene('kitchen', 30)" },
        { text: 'Lounge', action: "goToScene('lounge', 30)" },
        { text: 'Bathroom', action: "goToScene('bathroom', 30)" },
        { text: 'Private Room', action: "goToScene('private_room', 30)" },
        { text: 'Visit the Tailor', action: "goToTailorHub()" },
        { text: 'Visit Body Art Studio', action: "openBodyArtStudio()" },
        {
          text: 'Check in with Leah',
          action: "goToScene('leah_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Leah', operator: '>=', value: 50 }
        },
        {
          text: 'Check in with Amir',
          action: "goToScene('amir_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Amir', operator: '>=', value: 50 }
        },
        {
          text: 'Check in with Toby',
          action: "goToScene('toby_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Toby', operator: '>=', value: 50 }
        }
      ],
      randomEvents: [
        { chance: 0.2, scene: 'random_foyer_1' }
      ]
    },
    'kitchen': {
      title: 'Kitchen',
      description: 'Stainless steel counters glint under harsh fluorescent lights. A coffee maker gurgles, and a half-eaten sandwich rests on a plate. The scent of stale coffee lingers. The fridge hums softly, casting a faint blue glow across the tiled floor.',
      nav: [
        { text: 'Back to Foyer', action: "goToScene('foyer', 30)" }
      ],
      randomEvents: [
        { chance: 0.2, scene: 'random_kitchen_1' },
        {
          chance: 0.3, // 30% chance when conditions are met
          scene: 'parasite_craving_event',
          condition: { type: 'parasite_pregnancy' }
        }
      ]
    },
    'private_room': {
      title: 'Private Room',
      description: 'This is a small, quiet room off the main foyer. It seems to be unused, containing little more than a simple cot and a small desk. There is a strange, organic-looking structure in the corner.',
      nav: [
        { text: 'Back to Foyer', action: "goToScene('foyer', 30)" },
        { text: 'Manage Piercings', action: "openManagePiercings()", condition: { type: 'has_piercings' } },
        {
          text: 'Approach the Nest',
          action: "goToScene('nest', 0)",
          condition: { type: 'parasite_impregnate_enabled' }
        }
      ]
    },
    'nest': {
      title: 'The Nest',
      description: 'The structure is a grotesque, pulsating mass of organic tissue, clearly of alien origin. It seems to be... waiting. You feel a strange pull towards it, a primal urge to settle within its strange embrace.',
      nav: [
        { text: 'Leave the nest', action: "goToScene('private_room', 0)" },
        {
          text: 'Deliver the alien worms',
          action: "deliverWorms()",
          condition: { type: 'worms_ready_to_birth' }
        }
      ]
    },
    'birth_results': {
        title: 'Delivery',
        description: 'After a grueling and bizarre ordeal, you have delivered the alien worms into the nest. You feel a sense of relief, but also a deep violation. The nest pulses gently, seeming to nurture its new inhabitants.',
        nav: [
            { text: 'Leave the area', action: "finishBirthing()" }
        ]
    },
    'lounge': {
      title: 'Lounge',
      description: 'Plush chairs face a wall-mounted screen playing calming nature footage. Shelves hold scientific journals and a few well-worn novels. Soft ambient music drifts.',
      nav: [
        { text: 'Back to Foyer', action: "goToScene('foyer', 30)" },
        { text: 'Relax', action: "goToScene('relaxing', 0)" },
        { text: 'Rest for the day', action: "passDayInLounge()" },
        { text: 'Test Sex Scene with Toby', action: "startSexScene(['player', 'Toby'])" },
        { text: 'Test Sex Scene with Leah', action: "startSexScene(['player', 'Leah'])" }
      ],
      randomEvents: [
        { chance: 0.2, scene: 'random_lounge_1' }
      ]
    },
    'bathroom': {
      title: 'Bathroom',
      description: 'White tiles line the walls, a single sink flickers with a weak bulb. The mirror fogs slightly as warm air circulates. A small cabinet holds basic toiletries.',
      nav: [
        { text: 'Back to Foyer', action: "goToScene('foyer', 30)" },
        { text: 'Take a shower', action: "goToScene('showering', 0)" }
      ],
      randomEvents: [
        { chance: 0.2, scene: 'random_bathroom_1' },
        {
          chance: 0.4, // 40% chance when conditions are met
          scene: 'morning_sickness_event',
          condition: { type: 'human_pregnancy_early' }
        }
      ]
    },
    'showering': {
      title: 'Shower',
      description: 'You undress and take a shower.',
      nav: [
        { text: 'Finish', action: "finishShower()" }
      ]
    },
    'relaxing': {
      title: 'Relaxing',
      description: 'You sit back and relax for a while.',
      nav: [
        { text: 'Finish', action: "finishRelaxing()" }
      ]
    },
    'random_foyer_1': {
      title: 'A Glimmer',
      description: 'You notice a strange glimmer near the air vent, but it vanishes as you approach.',
      nav: [
        { text: 'Continue', action: "goToScene('foyer', 0)" }
      ]
    },
    'random_kitchen_1': {
      title: 'A Strange Smell',
      description: 'A strange, sickly sweet smell emanates from the drain. You make a mental note to get it checked out.',
      nav: [
        { text: 'Continue', action: "goToScene('kitchen', 0)" }
      ]
    },
    'random_lounge_1': {
      title: 'A Flicker on the Screen',
      description: 'For a brief moment, the calming nature footage on the screen is replaced by a flash of static and what looks like alien text.',
      nav: [
        { text: 'Continue', action: "goToScene('lounge', 0)" }
      ]
    },
    'random_bathroom_1': {
      title: 'A Puddle',
      description: 'You notice a small, iridescent puddle forming under the sink, but it evaporates before you can get a closer look.',
      nav: [
        { text: 'Continue', action: "goToScene('bathroom', 0)" }
      ]
    },
    'leah_love_event': {
      title: 'A Moment with Leah',
      description: 'Placeholder text for a special moment with Leah.',
      nav: [
        { text: 'Return to Foyer', action: "goToScene('foyer', 0)" }
      ]
    },
'tailor_hub': {
    title: 'The Tailor',
    description: 'The tailor is a mysterious figure who can create any clothing you desire, for a price. What would you like to create?',
    nav: [] // This will be populated dynamically
},
    'amir_love_event': {
      title: 'A Moment with Amir',
      description: 'Placeholder text for a special moment with Amir.',
      nav: [
        { text: 'Return to Foyer', action: "goToScene('foyer', 0)" }
      ]
    },
    'toby_love_event': {
      title: 'A Moment with Toby',
      description: 'Placeholder text for a special moment with Toby.',
      nav: [
        { text: 'Return to Foyer', action: "goToScene('foyer', 0)" }
      ]
    },
    'stress_collapse_event': {
      title: 'Overwhelmed',
      description: 'The weight of everything becomes too much. The world spins and fades to black as you collapse from the stress.',
      nav: [
        { text: 'Wake up later...', action: "recoverFromStressCollapse()" }
      ]
    },
    'arousal_max_event': {
      title: 'Overcome',
      description: 'A wave of intense pleasure washes over you, so powerful it leaves you breathless and trembling on the floor.',
      nav: [
        { text: 'Recover...', action: "recoverFromArousalMax()" }
      ]
    },
    'morning_sickness_event': {
      title: 'Morning Sickness',
      description: 'A wave of nausea hits you suddenly, and you barely make it to the nearest receptacle before you\'re sick. The feeling passes after a few moments, leaving you feeling drained and miserable.',
      nav: [
        { text: 'Pull yourself together.', action: "handleMorningSickness()" }
      ]
    },
    'parasite_craving_event': {
      title: 'Unusual Hunger',
      description: 'A sudden, ravenous hunger grips you. It\'s not for anything normal. You find yourself craving the taste of metal, the texture of plastic, anything to satisfy the strange gnawing in your gut. You manage to resist the urge, but it leaves you feeling shaken and disturbed.',
      nav: [
        { text: 'This is not my body...', action: "handleParasiteCraving()" }
      ]
    },
    'human_water_breaking_event': {
      title: 'A Sudden Gush',
      description: 'You feel a sudden, warm gush between your legs. Your water has broken. It seems the time is near.',
      nav: [
        { text: 'Prepare for what comes next...', action: "goToScene('human_birth_event', 0)" }
      ]
    },
    'human_birth_event': {
      title: 'Birth',
      description: 'After a long and exhausting labor, you give birth to a healthy baby. [This is a placeholder event.]',
      nav: [
        { text: 'A new chapter begins.', action: "completeHumanBirth()" }
      ]
    },
    'parasite_takeover_event': {
      title: 'A Vicious Change',
      description: 'A sudden, sharp pain lances through your abdomen, far more intense than any cramp you\'ve felt before. You double over, gasping, as a strange, cold sensation spreads from your womb. The subtle warmth of the life you were carrying vanishes, replaced by an alien chill. Something is terribly wrong.',
      nav: [
        { text: 'Endure it...', action: "endTakeoverEvent()" }
      ]
    },
    'human_pregnancy_discovery': {
      title: 'A New Possibility',
      description: 'You\'ve been feeling off for a couple of weeks now—unusually tired, a bit nauseous in the mornings. Looking at the calendar, a sudden thought strikes you. Could you be... pregnant?',
      nav: [
        { text: 'A wave of uncertainty washes over you.', action: "endDiscoveryEvent()" }
      ]
    },
    'parasite_hatch_event': {
      title: 'A New Horror',
      description: 'A sharp, agonizing pain rips through your abdomen. It feels like something tearing its way out from the inside. The sensation is brief but terrifying, leaving you weak, trembling, and with the sickening knowledge that something has just hatched inside you.',
      nav: [
        { text: 'Oh god, what was that...', action: "handleEggHatching()" }
      ]
    },
    'sex_cleanup': {
      title: 'Gathering Yourself',
      description: 'You take a moment to fix your clothes and compose yourself before continuing.',
      nav: [
        { text: 'Continue', action: "returnFromSexScene()" }
      ]
    }
  }
};

// This line will be added in main.js to merge the scenes into the state
// Object.assign(state.scenes, scenes);
