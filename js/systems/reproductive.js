function initMenstrualCycle() {
    // Randomize cycle and period length for variety
    state.menstrualCycle.cycleLength = Math.floor(Math.random() * 11) + 25; // 25-35 days
    state.menstrualCycle.periodLength = Math.floor(Math.random() * 4) + 4;   // 4-7 days
    state.menstrualCycle.currentDayInCycle = Math.floor(Math.random() * state.menstrualCycle.cycleLength) + 1;
}

function addSemen(location, volume, fatherId = 'unknown') {
    if (!state.bodyFluids[location]) {
        console.error(`Invalid semen location: ${location}`);
        return;
    }

    // For now, we'll just add it. Later we can consolidate entries from the same father.
    state.bodyFluids[location].semen.push({ fatherId, volume });

    // For backward compatibility with older save logic and simple checks
    if (location === 'vagina') {
        state.womb.semenVolume += volume;
    }
}

function isFertile() {
    if (state.parasite.canImpregnate) {
        return true; // Parasite makes host always receptive to its own eggs
    }
    const day = state.menstrualCycle.currentDayInCycle;
    // Simple fertility window model: Day 11 to 18
    return day >= 11 && day <= 18;
}

function calculateConception() {
    if (state.pregnancy.isPregnant) return; // Already pregnant

    // Human pregnancy logic (parasite logic is now in advanceDay)
    if (state.menstrualCycle.isFertile && state.womb.semenVolume > 0) {
        const conceptionChance = Math.min(1, state.womb.semenVolume / 10) * 0.33; // Max 33% chance
        if (Math.random() < conceptionChance) {
            state.pregnancy.isPregnant = true;
            state.pregnancy.type = 'human';
            state.pregnancy.days = 0;
            state.pregnancy.eggCount = 0;
            state.pregnancy.discoveryEventTriggered = false;
        }
    }

    // Semen is absorbed/cleared after one cycle, regardless of conception
    state.womb.semenVolume = 0;
}

function addParasiteEgg() {
    const now = state.currentTime.getTime();
    const hatchDelay = (8 + Math.random() * 2) * 60 * 60 * 1000; // 8-10 hours in ms
    const birthReadyDelay = (24 + Math.random() * 48) * 60 * 60 * 1000; // 1-3 days in ms

    const newEgg = {
        id: `egg_${now}_${Math.random()}`,
        laidAtTime: now,
        hatchAtTime: now + hatchDelay,
        birthReadyTime: now + hatchDelay + birthReadyDelay, // 1-3 days *after* hatching
        isDiscovered: false // This property may no longer be needed but is kept for safety.
    };

    state.parasite.eggs.push(newEgg);
}

function layParasiteEggs() {
    if (!state.parasite.canImpregnate) return;

    // 1. Lay the first egg (100% chance)
    addParasiteEgg();

    // 2. Loop for additional eggs with halving probability
    let chance = 0.5;
    while (Math.random() < chance) {
        addParasiteEgg();
        chance /= 2;
    }
}

function advanceDay() {
    // This function is called for each day that passes.
    if (state.parasite.canImpregnate) {
        // Disable menstrual cycle and lay eggs
        state.menstrualCycle.isFertile = true;
        layParasiteEggs();
    } else {
        state.menstrualCycle.currentDayInCycle++;
        if (state.menstrualCycle.currentDayInCycle > state.menstrualCycle.cycleLength) {
            state.menstrualCycle.currentDayInCycle = 1;
        }
        state.menstrualCycle.isFertile = isFertile();
    }

    if (state.pregnancy.isPregnant) {
        // PARASITE TAKEOVER LOGIC
        if (state.pregnancy.type === 'human' && state.parasite.canImpregnate && !state.storyEventActive) {
            // Add a chance for parasite to overwrite a human pregnancy (15% chance per day)
            if (Math.random() < 0.15) {
                // Abort human pregnancy
                state.pregnancy.isPregnant = false;
                state.pregnancy.type = null;
                state.pregnancy.days = 0;
                state.pregnancy.discoveryEventTriggered = false;

                // Trigger the story event
                state.storyEventActive = true;
                state.locationBeforeEvent = state.currentLocation;
                goToScene('parasite_takeover_event', 0);
                // The new egg laying logic will run in advanceDay on subsequent days
                return; // Stop processing for this day
            }
        }

        // PREGNANCY DISCOVERY EVENT
        if (!state.pregnancy.discoveryEventTriggered && state.pregnancy.days >= 14 && !state.storyEventActive) {
            state.pregnancy.discoveryEventTriggered = true; // Set flag so it only happens once
            state.storyEventActive = true;
            state.locationBeforeEvent = state.currentLocation;

            if (state.pregnancy.type === 'human') {
                goToScene('human_pregnancy_discovery', 0);
            }
            return; // Stop processing for this day
        }

        state.pregnancy.days++;
        // Add a cumulative fatigue effect during pregnancy
        state.needs.tiredness = Math.max(0, state.needs.tiredness - 150);

        // Check for birth event trigger
        if (state.pregnancy.type === 'human' && state.pregnancy.days > 40 && !state.storyEventActive) {
            const chance = (state.pregnancy.days - 40) * 0.1; // 10% chance per day after day 40
            if (Math.random() < chance) {
                state.storyEventActive = true;
                state.locationBeforeEvent = state.currentLocation;
                goToScene('human_water_breaking_event', 0);
                return; // Stop further processing for this day as an event is triggered
            }
        }
    }

    // Check for recurring reminders
    const today = state.currentTime;
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentDay = today.getDate();

    if (state.journal.recurringReminders) {
        state.journal.recurringReminders.forEach(reminder => {
            if (reminder.month === currentMonth && reminder.day === currentDay) {
                // To prevent duplicates, create a unique reminder text for the current year
                const reminderTextForYear = `${reminder.text} (${today.getFullYear()})`;
                const alreadyExists = state.journal.reminders.some(r => r.text === reminderTextForYear);

                if (!alreadyExists) {
                    state.journal.reminders.push({
                        date: today.toISOString().split('T')[0], // 'YYYY-MM-DD'
                        text: reminderTextForYear
                    });
                }
            }
        });
    }

    calculateConception();
}

function completeHumanBirth() {
    // Reset pregnancy state
    state.pregnancy.isPregnant = false;
    state.pregnancy.type = null;
    state.pregnancy.days = 0;
    state.pregnancy.eggCount = 0;
    state.pregnancy.discoveryEventTriggered = false;

    // End the event and return to the previous location after 1 hour
    state.storyEventActive = false;
    goToScene(state.locationBeforeEvent, 3600);
}

function endTakeoverEvent() {
    state.storyEventActive = false;
    goToScene(state.locationBeforeEvent, 3600); // 1 hour penalty for the ordeal
}

function endDiscoveryEvent() {
    state.storyEventActive = false;
    // No time penalty for just a realization.
    goToScene(state.locationBeforeEvent, 0);
}

function handleEggHatching() {
    const now = state.currentTime.getTime();
    const eggsToHatch = state.parasite.eggs.filter(egg => now >= egg.hatchAtTime);
    const numHatched = eggsToHatch.length;

    if (numHatched === 0) {
        // This case should ideally not be reached if called correctly, but it's a safeguard.
        state.storyEventActive = false;
        goToScene(state.locationBeforeEvent, 0);
        return;
    }

    // Create new worms from the eggs that are hatching
    eggsToHatch.forEach(egg => {
        const newWorm = {
            id: `worm_${egg.id}`,
            birthReadyTime: egg.birthReadyTime,
        };
        state.parasite.worms.push(newWorm);
    });

    // Remove the eggs that have hatched
    state.parasite.eggs = state.parasite.eggs.filter(egg => now < egg.hatchAtTime);

    // Apply stat penalties for each egg that hatched
    state.needs.stress = Math.min(state.ranges.stress, state.needs.stress + (50 * numHatched));
    state.needs.trauma = Math.min(state.ranges.trauma, state.needs.trauma + (25 * numHatched));
    state.needs.happiness = Math.max(0, state.needs.happiness - (40 * numHatched));
    state.needs.tiredness = Math.max(0, state.needs.tiredness - (1000 * numHatched));

    state.storyEventActive = false;
    forceGlobalUIRefresh(); // Update UI immediately to reflect changes
    goToScene(state.locationBeforeEvent, 3600); // 1-hour time penalty for the ordeal
}

function deliverWorms() {
    const now = state.currentTime.getTime();
    const wormsToDeliver = state.parasite.worms.filter(worm => now >= worm.birthReadyTime);
    const numToDeliver = wormsToDeliver.length;

    if (numToDeliver === 0) {
        // This should not be possible if the link is hidden, but it's a safeguard.
        return;
    }

    let totalTimeInSeconds = 0;
    for (let i = 0; i < numToDeliver; i++) {
        totalTimeInSeconds += (10 + Math.random() * 10) * 60; // 10-20 minutes in seconds
    }

    // Block the player and advance time
    state.storyEventActive = true;
    advanceTime(totalTimeInSeconds);

    // Remove the delivered worms from the state
    state.parasite.worms = state.parasite.worms.filter(worm => now < worm.birthReadyTime);

    // Update the result scene's description and go to it
    state.scenes.birth_results.description = `After a grueling and bizarre ordeal, you have delivered ${numToDeliver} alien worms into the nest. You feel a sense of relief, but also a deep violation. The nest pulses gently, seeming to nurture its new inhabitants.`;
    goToScene('birth_results', 0);
}

function finishBirthing() {
    state.storyEventActive = false;
    goToScene('private_room', 0);
}
