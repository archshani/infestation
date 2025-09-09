/* Advance time by a given number of seconds and refresh the header */
function checkEventCondition(condition) {
    if (!condition) return true; // No condition means it can always trigger

    switch (condition.type) {
        case 'human_pregnancy_early':
            return state.pregnancy.isPregnant &&
                   state.pregnancy.type === 'human' &&
                   state.pregnancy.days >= 7 &&
                   state.pregnancy.days <= 35;
        case 'parasite_pregnancy':
            return state.parasite.eggs.length > 0;
        case 'has_piercings':
            const hasEquipped = Object.values(state.playerBody).some(p => p.piercings && p.piercings.length > 0);
            const hasStored = state.unequippedPiercings.length > 0;
            return hasEquipped || hasStored;
        // Future condition types can be added here
        default:
            return false;
    }
}

function advanceTime(seconds, updateUI = true) {
  if (typeof seconds !== 'number' || seconds < 0) return;

  const initialDay = Math.floor(state.currentTime.getTime() / (1000 * 60 * 60 * 24));

  const needs = state.needs;
  const ranges = state.ranges;

  // --- CALCULATE DECREASES ---

  // Fatigue (tiredness) decreases over time. 10000 points over 24 hours (86400s)
  const fatigueDecrease = seconds * (10000 / 86400);
  needs.tiredness = Math.max(0, needs.tiredness - fatigueDecrease);

  // Stress recovers over time: 1 point every 30 seconds
  const stressDecrease = seconds * (1 / 30);
  needs.stress = Math.max(0, needs.stress - stressDecrease);

  // Trauma recovers very slowly: 1 point every hour (3600s)
  const traumaDecrease = seconds * (1 / 3600);
  needs.trauma = Math.max(0, needs.trauma - traumaDecrease);

  // Alcohol metabolizes: 12 points every hour (3600s)
  const alcoholDecrease = seconds * (12 / 3600);
  needs.alcohol = Math.max(0, needs.alcohol - alcoholDecrease);

  // Drugs wear off: 6 points every hour (3600s)
  const drugsDecrease = seconds * (6 / 3600);
  needs.drugs = Math.max(0, needs.drugs - drugsDecrease);

  // Arousal has two-tier decay
  const arousal50PctMark = ranges.arousal / 2;
  if (needs.arousal >= arousal50PctMark) {
    // Rate for >=50%: 500 points over 10 mins (600s)
    const arousalDecrease = seconds * (500 / 600);
    needs.arousal = Math.max(arousal50PctMark, needs.arousal - arousalDecrease);
  } else {
    // Rate for <50%: 500 points over 5 mins (300s)
    const arousalDecrease = seconds * (500 / 300);
    needs.arousal = Math.max(0, needs.arousal - arousalDecrease);
  }

  state.currentTime = new Date(state.currentTime.getTime() + (seconds * 1000));

  const finalDay = Math.floor(state.currentTime.getTime() / (1000 * 60 * 60 * 24));
  const daysPassed = finalDay - initialDay;

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      advanceDay();
    }
  }

  if (updateUI) {
    forceGlobalUIRefresh();
  }

  // New Hatching Logic
  if (!state.storyEventActive && state.parasite.eggs.some(egg => state.currentTime.getTime() >= egg.hatchAtTime)) {
      state.storyEventActive = true;
      state.locationBeforeEvent = state.currentLocation;
      renderScene('parasite_hatch_event');
      return; // Exit advanceTime to prevent other triggers
  }

  checkStatTriggers();
}
