const state = {
  /* -------------------- Time -------------------- */
  currentTime: new Date('2007-06-30T09:00:00'),   // start time (unchanged)
  calendarDate: null,

  /* -------------------- Money ------------------- */
  money: 0.00,

  /* -------------------- Intro events ------------ */
  eventIndex: 0,
  events: [
    {title:"Hello World!",text:"Hi I'm _shani and I made this game!"},
    {title:"You wake up...",text:"DESCRIPTION"},
    {title:"Ordinary day...",text:"mourning routine"},
    {title:"lastDayAtSchool",text:"walk to school or something"},
    {title:"revealFriends",text:"DESCRIPTION", reveals: ["Leah", "Toby", "Amir"]},
    {title:"goToFamily",text:"DESCRIPTION"},
    {title:"familyTime",text:"DESCRIPTION"},
    {title:"fewNormalDays",text:"DESCRIPTION"},
    {title:"gottaLeaveMakeMoney",text:"DESCRIPTION"},
    {title:"whatWasThat",text:"DESCRIPTION"},
    {title:"thisIsWeird",text:"DESCRIPTION"},
    {title:"Right time, wrong place",text:"this will describe the worm parisite taking residence in her body"},
    {title:"That had to be a dream? Right?",text:"You wake up thinking \"<span style=\"color:#a5ff7f;\">What a weird dream.</span>\" you try to get up but a jolt of pain flies through your spine \"<span style=\"color:#a5ff7f;\">What the hell?!</span>\" you say out loud then you feel it stir inside of you, <span style=\"color:#a5ff7f;\">\"That <i>thing</i> did really crawl inside me didn't it? This is a </span><span style=\"color:#ff4d4d;\">nightmare</span><span style=\"color:#a5ff7f;\">...</span>\"<br><br>As you rub your eyes you can feel some wetness on the sheets, you slowly sit up and notice the lack of clothing on your bottom, you try to remember last night but all you get is just hazy fragments. <br>You decide to investigate and reach down with your hand to your slit and run your fingers thought, it is slick, but the liquid is very thick and... cold? As you touch yourself you can feel how sore you are from last night, but it doesn't hurt, \"<span style=\"color:#a5ff7f;\">This <i>slime</i>, or whatever it is, does it have some sort of 'painkiller' effects?</span>\" you say. Against your better judgement you move the sticky fingers to your face and give them a curious sniff. It has a sickly sweet smell. \"<span style=\"color:#a5ff7f;\">I better not taste it.</span>\" you think. Altought you can't help but wonder how it may taste... \"<span style=\"color:#a5ff7f;\">What am I supposed to do now?</span>\" you tell yourself. You slowly get up from your bed, at first a sharp pain grips you but quickly subsides, perhaps <i>it</i> does actually numb your pain. You grab fresh clothes and go take a <i>long hot shower</i>, now clean and fully clothed you head to the kitchen.<br><br>You nonchalantly prepare breakfast, trying to foget anything happened and keeping your mind from the <i>worm</i>. then it stirs, reminding you of its presence. <br>\"<span style=\"color:#a5ff7f;\">I should go see the doctor, maybe they can help me at the clinic?</span>\" you decide to call them and make an appointment. Couple minutes later and you've gotten yourself appointment! Next friday... <br><span style=\"color:#a5ff7f;\">Next friday huh? Not too thrilled about waiting that long, Should I look elsewhere that would be faster? Or perhaps it is not a good idea at all, what if I become a lab rat thanks to the 'guest'?</span>"}
  ],
//<span style=\"color:#;\"> </span>
//ff4d4d  red
//a5ff7f  maya
//        leah
//        Toby
//        Amir
//ff0000  Domi
//
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
      hairLength: 48, // Default value in cm
      height: 157, // Default value in cm
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
    "Leah": { sex: 'female', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "female_semen_id", cumProduction: 5 },
    "Amir": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "amir_semen_id", cumProduction: 7 },
    "Toby": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "toby_semen_id", cumProduction: 10 },
    "Domi": { sex: 'female', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "female_semen_id", cumProduction: 7 },
    "Evelyn": { sex: 'female', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
    "Something": { sex: 'male', relationship: 0, trust: 0, fear: 0, attraction: 0, anger: 0, hidden: true, semenId: "_semen_id", cumProduction: 7 },
  },

  /* -------------------- Journal ------------------ */
  journal: {
    quests: [
      { title: "Uncover the Truth", description: "Find out more about the alien parasite and its origins.", complete: false },
      { title: "Get some rest", description: "You were feeling exhausted, but you took a nap.", complete: true },
      { title: "A Hidden Quest", description: "This quest is hidden until its conditions are met.", complete: false, hidden: true }
    ],
    reminders: [{ date: '2007-07-06', text: 'Appointment with Dr. Amir at 2pm' }],
    recurringReminders: [
        { month: 2, day: 5, text: "It's my birthday next week!" }
    ],
    notes: "My notepad."
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
