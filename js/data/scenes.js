const scenes = {

    'tailor_hub': {
      title: 'The Tailor',
      description: 'The tailor is a mysterious figure who can create any clothing you desire, for a price. What would you like to create?',
      nav: [] // This will be populated dynamically
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
    'showering': {
      title: 'Showering',
      description: 'You strip naked and take a shower.',
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
    'sleeping': {
      title: 'Sleeping',
      description: 'You go to sleep for a while.',
      nav: [
        { text: 'Sleep for 2 hours', action: "sleepFor(2)" },
        { text: 'Sleep for 3 hours', action: "sleepFor(3)" },
        { text: 'Sleep for 4 hours', action: "sleepFor(4)" },
        { text: 'Sleep for 5 hours', action: "sleepFor(5)" },
        { text: 'Sleep for 6 hours', action: "sleepFor(6)" },
        { text: 'Sleep for 7 hours', action: "sleepFor(7)" },
        { text: 'Sleep for 8 hours', action: "sleepFor(8)" },
        { text: 'Sleep for 9 hours', action: "sleepFor(9)" },
        { text: 'Sleep for 10 hours', action: "sleepFor(10)" },
        { text: 'Sleep for 11 hours', action: "sleepFor(11)" },
        { text: 'Sleep for 12 hours', action: "sleepFor(12)" }
      ]
    },

    // Maya's Home scenes
    'home': {
      title: 'Main hall',
      description: 'This is your home, you are in the main hall of the apartment, not much to see here, just some shoes and coats around.',
      nav: [
        { text: 'Kitchen', action: "goToScene('kitchen', 30)" },
        { text: 'Bedroom', action: "goToScene('bedroom', 30)" },
        { text: 'Bathroom', action: "goToScene('bathroom', 30)" },
        { text: 'Living Room', action: "goToScene('livingRoom', 30)" },
        { text: 'Go outside', action: "goToScene('outsideHome', 180)" },
        { text: 'nestTest', action: "goToScene('nestHome', 0)", condition: { type: 'parasite_impregnate_enabled' } }
      ]
    },
    'kitchen': {
      title: 'Your kitchen',
      description: 'This is your kitchen, it looks clean, pretty much what you\'d expect from a kitchen.',
      nav: [
        { text: 'Make Food', action: "goToScene('kitchen', 0)" },
        { text: 'Grab Beer', action: "goToScene('kitchen', 0)" },
        { text: 'Go back.', action: "goToScene('home', 30)" }
      ]
    },
    'bedroom': {
      title: 'Your bedroom',
      description: 'This is your bedroom This is where you sleep .',
      nav: [
        { text: 'Go Sleep', action: "startSleeping()" },
        { text: 'Wardrobe', action: "openWardrobe()" },
        { text: 'Manage Piercings', action: "openManagePiercings()", condition: { type: 'has_piercings' } },
        { text: 'Go back.', action: "goToScene('home', 30)" }
      ]
    },
    'bathroom': {
      title: 'bathroom',
      description: '...',
      nav: [
        { text: 'Take a shower', action: "startShowering()" },
        { text: 'Mirror', action: "goToScene('bathroom', 0)" },
        { text: 'Go back.', action: "goToScene('home', 30)" }
      ]
    },
    'livingRoom': {
      title: 'Living Room',
      description: '...',
      nav: [
        { text: 'Relax for a bit...', action: "startRelaxing()" },
        { text: 'Go back.', action: "goToScene('home', 30)" }
      ]
    },
    'outsideHome': {
      title: 'You are outside...',
      description: '...',
      nav: [
        { text: 'Go Home.', action: "goToScene('home', 180)" }
      ]
    },
    'nestHome': {
      title: '<span style=\"color:#99009F;\">The Nest</span>',
      description: '...',
      nav: [
        { text: 'Go back.', action: "goToScene('home', 0)" },
        {
          text: '<span style=\"color:#99009F;\">Attempt to birth worms...</span>',
          action: "deliverWorms()",
          condition: { type: 'worms_ready_to_birth' }
        }
      ]
    },

//    DEV ROOMS BELLOW
    'foyer': {
      title: 'devRoom',
      description: 'This is the dev room, what are you doing here?',
      nav: [
        { text: 'kitchen', action: "goToScene('kitchenDev', 30)" },
        { text: 'lounge', action: "goToScene('loungeDev', 30)" },
        { text: 'bathroom', action: "goToScene('bathroomDev', 30)" },
        { text: 'privateRoom', action: "goToScene('private_roomDev', 30)" },
        { text: 'tailorHub', action: "goToTailorHub()" },
        { text: 'bodyArtStudio', action: "openBodyArtStudio()" },
        {
          text: 'leahTestEvent',
          action: "goToScene('leah_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Leah', operator: '>=', value: 50 }
        },
        {
          text: 'amirTestEvent',
          action: "goToScene('amir_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Amir', operator: '>=', value: 50 }
        },
        {
          text: 'TobyTestEvent',
          action: "goToScene('toby_love_event', 0)",
          condition: { type: 'npc_relationship', npc: 'Toby', operator: '>=', value: 50 }
        }
      ],
      randomEvents: [
        { chance: 0.02, scene: 'random_foyer_1' }
      ]
    },
    'kitchenDev': {
      title: 'kitchen',
      description: '...',
      nav: [
        { text: 'back', action: "goToScene('foyer', 30)" }
      ],
      randomEvents: [
        { chance: 0.02, scene: 'random_kitchen_1' }
      ]
    },
    'private_roomDev': {
      title: 'privateRoom',
      description: '...',
      nav: [
        { text: 'back', action: "goToScene('foyer', 30)" },
        { text: 'managePiercings', action: "openManagePiercings()", condition: { type: 'has_piercings' } },
        { text: 'Wardrobe', action: "openWardrobe()" },
        {
          text: 'nestBirthingPlace',
          action: "goToScene('nestDev', 0)",
          condition: { type: 'parasite_impregnate_enabled' }
        }
      ]
    },
    'nestDev': {
      title: 'nest',
      description: '...',
      nav: [
        { text: 'back', action: "goToScene('private_roomDev', 0)" },
        {
          text: 'birthWorms',
          action: "deliverWorms()",
          condition: { type: 'worms_ready_to_birth' }
        }
      ]
    },
    'birth_results': {
        title: 'birth',
        description: '...',
        nav: [
            { text: 'back', action: "finishBirthing()" }
        ]
    },
    'loungeDev': {
      title: 'lounge',
      description: '...',
      nav: [
        { text: 'back', action: "goToScene('foyer', 30)" },
        { text: 'passTime', action: "startRelaxing()" },
        { text: 'passDay', action: "passDay()" },
        { text: 'combatTestToby', action: "startCombat(['Maya', 'Toby'])" },
        { text: 'combatTestLeah', action: "startCombat(['Maya', 'Leah'])" }
      ],
      randomEvents: [
        { chance: 0.02, scene: 'random_lounge_1' }
      ]
    },
    'bathroomDev': {
      title: 'bathroom',
      description: '...',
      nav: [
        { text: 'back', action: "goToScene('foyer', 30)" },
        { text: 'showerTest', action: "startShowering()" }
      ],
      randomEvents: [
        { chance: 0.02, scene: 'random_bathroom_1' },
        {
          chance: 0.4, // 40% chance when conditions are met
          scene: 'morning_sickness_event',
          condition: { type: 'human_pregnancy_early' }
        }
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
        { text: 'Continue', action: "goToScene('kitchenDev', 0)" }
      ]
    },
    'random_lounge_1': {
      title: 'A Flicker on the Screen',
      description: 'For a brief moment, the calming nature footage on the screen is replaced by a flash of static and what looks like alien text.',
      nav: [
        { text: 'Continue', action: "goToScene('loungeDev', 0)" }
      ]
    },
    'random_bathroom_1': {
      title: 'A Puddle',
      description: 'You notice a small, iridescent puddle forming under the sink, but it evaporates before you can get a closer look.',
      nav: [
        { text: 'Continue', action: "goToScene('bathroomDev', 0)" }
      ]
    },
    'leah_love_event': {
      title: 'A Moment with Leah',
      description: 'Placeholder text for a special moment with Leah.',
      nav: [
        { text: 'Return to Foyer', action: "goToScene('foyer', 0)" }
      ]
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
    'morning_sickness_event': {
      title: 'Morning Sickness',
      description: 'A wave of nausea hits you suddenly, and you barely make it to the nearest receptacle before you\'re sick. The feeling passes after a few moments, leaving you feeling drained and miserable.',
      nav: [
        { text: 'Pull yourself together.', action: "handleMorningSickness()" }
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
  };

// This line will be added in main.js to merge the scenes into the state
// Object.assign(state.scenes, scenes);
