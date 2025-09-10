const state = {
  /* -------------------- Time -------------------- */
  currentTime: new Date('2007-08-01T09:00:00'),   // start time (unchanged)
  calendarDate: null,

  /* -------------------- Money ------------------- */
  money: 0.00,

  /* -------------------- Intro events ------------ */
  eventIndex: 0,
  events: [
    {title:"Meet Maya",text:"Maya Alvarez, a marine biologist, woke up feeling a strange pressure in her abdomen. An alien worm‑like parasite has taken residence inside her, feeding off her nervous system."},
    {title:"Friend – Leah",text:"Leah Patel, Maya’s longtime friend, calls to check in. She senses something is off but Maya brushes it aside.", reveals: "Leah"},
    {title:"Friend – Amir",text:"Dr. Amir Khan, a neuro‑biology researcher, offers to run scans. He warns Maya about the risks of unknown pathogens.", reveals: "Amir"},
    {title:"Friend – Toby",text:"Toby, the lab’s tech specialist, jokes about “alien pets.” He hands Maya a bottle of energy drink.", reveals: "Toby"}
  ],

  /* -------------------- Needs ------------------- */
  needs: {
    tiredness: 10000,
    stress: 0,
    trauma: 0,
    happiness: 1000,
    arousal: 0,
    corruption: 0,
    alcohol: 0,
    drugs: 0
  },

  ranges: {
    tiredness: 10000,
    stress: 1000,
    trauma: 1000,
    happiness: 1000,
    arousal: 1000,
    corruption: 1000,
    alcohol: 100,
    drugs: 100
  },

  /* -------------------- Flags -------------------- */
  showCorruption: false,   // toggled from Cheats overlay
  cheatsEnabled: false,     // set by Settings → Enable Cheats
  storyEventActive: false, // disables stat-triggered events

  /* -------------------- Skills ------------------- */
  skills: {
    "PH skill 1": { level: 1, exp: 0 }, "PH skill 2": { level: 1, exp: 0 }, "PH skill 3": { level: 1, exp: 0 }, "PH skill 4": { level: 1, exp: 0 }, "PH skill 5": { level: 1, exp: 0 },
    "PH skill 6": { level: 1, exp: 0 }, "PH skill 7": { level: 1, exp: 0 }, "PH skill 8": { level: 1, exp: 0 }, "PH skill 9": { level: 1, exp: 0 }, "PH skill 10": { level: 1, exp: 0 },
    "PH skill 11": { level: 1, exp: 0 }, "PH skill 12": { level: 1, exp: 0 }, "PH skill 13": { level: 1, exp: 0 }, "PH skill 14": { level: 1, exp: 0 }, "PH skill 15": { level: 1, exp: 0 },
    "PH skill 16": { level: 1, exp: 0 }, "PH skill 17": { level: 1, exp: 0 }, "PH skill 18": { level: 1, exp: 0 }, "PH skill 19": { level: 1, exp: 0 }, "PH skill 20": { level: 1, exp: 0 },
    "PH skill 21": { level: 1, exp: 0 }, "PH skill 22": { level: 1, exp: 0 }, "PH skill 23": { level: 1, exp: 0 }, "PH skill 24": { level: 1, exp: 0 }, "PH skill 25": { level: 1, exp: 0 },
    "PH skill 26": { level: 1, exp: 0 }, "PH skill 27": { level: 1, exp: 0 }, "PH skill 28": { level: 1, exp: 0 }, "PH skill 29": { level: 1, exp: 0 }, "PH skill 30": { level: 1, exp: 0 },
    "PH skill 31": { level: 1, exp: 0 }, "PH skill 32": { level: 1, exp: 0 }, "PH skill 33": { level: 1, exp: 0 }, "PH skill 34": { level: 1, exp: 0 }, "PH skill 35": { level: 1, exp: 0 },
    "PH skill 36": { level: 1, exp: 0 }, "PH skill 37": { level: 1, exp: 0 }, "PH skill 38": { level: 1, exp: 0 }, "PH skill 39": { level: 1, exp: 0 }, "PH skill 40": { level: 1, exp: 0 },
    "PH skill 41": { level: 1, exp: 0 }, "PH skill 42": { level: 1, exp: 0 }, "PH skill 43": { level: 1, exp: 0 }, "PH skill 44": { level: 1, exp: 0 }, "PH skill 45": { level: 1, exp: 0 },
    "PH skill 46": { level: 1, exp: 0 }, "PH skill 47": { level: 1, exp: 0 }, "PH skill 48": { level: 1, exp: 0 }, "PH skill 49": { level: 1, exp: 0 }, "PH skill 50": { level: 1, exp: 0 }
  },

  /* -------------------- Character Physicality -------------------- */
  sex: 'female',
  playerBody: {}, // Will be populated by factory
  appearance: {
      birthDate: '1989-02-12',
      hairLength: 10, // Default value, maybe cm
      height: 170, // Default value, cm
      skinColor: { name: 'Pale', hex: '#F0D4C2' },
      hairColor: { name: 'Brown', hex: '#5C4033' },
      eyeColor: { name: 'Brown', hex: '#5C4033' }
  },
  equipment: {
    head: new EquipmentSlot('head', 'Head'),
    neck: new EquipmentSlot('neck', 'Neck'),
    upper: new EquipmentSlot('upper', 'Upper Body'),
    lower: new EquipmentSlot('lower', 'Lower Body'),
    waist: new EquipmentSlot('waist', 'Waist'),
    arms: new EquipmentSlot('arms', 'Arms'),
    hands: new EquipmentSlot('hands', 'Hands'),
    legs: new EquipmentSlot('legs', 'Legs'),
    feet: new EquipmentSlot('feet', 'Feet'),
    'hand-held': new HandHeldSlot('Hand-held'),
    back: new BackSlot('Back')
  },
  inventory: [],
  unequippedPiercings: [], // For the new management system

  /* -------------------- Stats -------------------- */
  stats: {
    timesSlept: 0,
    questsCompleted: 0,
    itemsCrafted: 0,
    distanceWalked: 0,
    timesCollapsedFromStress: 0,
    timesClimaxed: 0,
    // New Sex Stats
    vaginalSexCount: 0,
    analSexCount: 0,
    oralSexGivenCount: 0,
    oralSexReceivedCount: 0,
    vaginalCreampiesReceived: 0,
    analCreampiesReceived: 0,
    oralCreampiesReceived: 0,
    timesSwallowedSemen: 0,
    totalGirlCumExpelled: 0,
    uniqueSexualPartners: 0
  },

  /* -------------------- Reproductive System -------------------- */
  bodyFluids: {
    vagina: { semen: [] }, // Each entry: { fatherId: '...', volume: X }
    anus: { semen: [] },
    mouth: { semen: [] },
    body: { semen: [] } // For external coverage
  },
  womb: {
    semenVolume: 0 // in ml, to be deprecated but kept for save compatibility
  },
  menstrualCycle: {
    cycleLength: 28,
    periodLength: 5,
    currentDayInCycle: 1,
    isFertile: false
  },
  pregnancy: {
    isPregnant: false,
    type: null, // 'human' or 'parasite'
    days: 0,
    eggCount: 0,
    discoveryEventTriggered: false
  },
  parasite: {
      canImpregnate: false,
      eggs: [], // Each egg: {id, laidAtTime, hatchAtTime, birthReadyTime, isDiscovered}
      worms: [] // Each worm: { id, birthReadyTime }
  },

  /* -------------------- NPCs --------------------- */
  npcs: {
    "Leah": { sex: 'female', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "leah_semen_id", cumProduction: 5 },
    "Amir": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "amir_semen_id", cumProduction: 7 },
    "Toby": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "toby_semen_id", cumProduction: 10 }
  },

  /* -------------------- Journal ------------------ */
  journal: {
    quests: [
      { title: "Uncover the Truth", description: "Find out more about the alien parasite and its origins.", complete: false },
      { title: "Get some rest", description: "You were feeling exhausted, but you took a nap.", complete: true },
      { title: "A Hidden Quest", description: "This quest is hidden until its conditions are met.", complete: false, hidden: true }
    ],
    reminders: [{ date: '2007-08-07', text: 'Appointment with Dr. Amir at 2pm' }],
    recurringReminders: [
        { month: 2, day: 5, text: "It's my birthday next week!" }
    ],
    notes: "I can write my own notes here."
  },

  settings: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '1rem'
  },

  ui: {
    lastCharTab: 'status',
    lastCheatTab: 'general'
  },

  /* -------------------- Sex Scene State ------------------ */
  sexScene: {
      isActive: false,
      actors: [], // { id, arousal, maxArousal, hasClimaxed, clothing, initialClothing }
      turn: '',
      log: [],
      currentState: 'foreplay',
      initialPlayerClothing: null
  },

  /* -------------------- New Combat State ------------------ */
  combat: {
      isActive: false,
      actors: [], // { id, bodyParts: {...}, skills: {...}, etc. }
      turn: '',
      log: [],
      positions: {}
  },

  /* -------------------- Game Location ------------------ */
  currentLocation: 'event_intro',
  locationBeforeEvent: '',

  scenes: {}
};
