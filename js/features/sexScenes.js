function startSexScene(participantIds) {
    state.sexScene.isActive = true;
    state.sexScene.actors = participantIds.map(id => {
        const actor = {
            id: id,
            hasClimaxed: false,
            lastAction: null,
            equipment: {},
            inventory: [],
            initialEquipment: {}
        };

        if (id === 'player') {
            actor.equipment = JSON.parse(JSON.stringify(state.equipment));
            actor.initialEquipment = JSON.parse(JSON.stringify(state.equipment));
        } else {
            const npcClothing = createDefaultNpcClothing();
            actor.equipment = npcClothing;
            actor.initialEquipment = JSON.parse(JSON.stringify(npcClothing));
            actor.arousal = 0;
            actor.maxArousal = 100;
        }
        return actor;
    });

    state.sexScene.turn = participantIds[0];
    state.sexScene.currentState = 'main';
    state.sexScene.log = ['The scene begins. You are both fully clothed.'];

    state.storyEventActive = true;

    renderSexScene();
}

function processSexAction(actorId, actionBundle, targetId) {
    if (!state.sexScene.isActive || state.sexScene.turn !== actorId) {
        return;
    }
    const actor = state.sexScene.actors.find(a => a.id === actorId);
    const target = state.sexScene.actors.find(a => a.id === targetId);
    if (!actor || !target) { return; }

    actionBundle.forEach(action => {
        let logMessage;
        if (action.effect) {
            const effectResult = action.effect(actor, target);
            if (typeof effectResult === 'string') {
                logMessage = effectResult;
            }
        }

        if (!logMessage) {
            logMessage = action.description || `${actor.id} uses ${action.name} on ${target.id}.`;
        }

        logMessage = logMessage.replace(/{actor}/g, `<b>${actor.id}</b>`).replace(/{target}/g, `<b>${target.id}</b>`);
        state.sexScene.log.push(logMessage);

        actor.lastAction = action.name;
        checkForClimax(actorId);
        checkForClimax(targetId);
    });

    const currentIndex = state.sexScene.actors.findIndex(a => a.id === actorId);
    const nextIndex = (currentIndex + 1) % state.sexScene.actors.length;
    state.sexScene.turn = state.sexScene.actors[nextIndex].id;
}

function checkForClimax(actorId) {
    const actor = state.sexScene.actors.find(a => a.id === actorId);
    if (!actor || actor.hasClimaxed) return;

    let currentArousal, maxArousal;
    if (actorId === 'player') {
        currentArousal = state.needs.arousal;
        maxArousal = state.ranges.arousal;
    } else {
        currentArousal = actor.arousal;
        maxArousal = actor.maxArousal;
    }

    if (currentArousal >= maxArousal) {
        actor.hasClimaxed = true;
        state.sexScene.log.push(`<b>${actor.id} has climaxed!</b>`);

        if (actor.id === 'player') {
            state.stats.timesClimaxed++;
            state.needs.arousal = 0;
            state.stats.totalGirlCumExpelled += 10;
        } else {
            const npc = state.npcs[actor.id];
            if (npc) {
                let semenLocation = 'body';
                if (state.sexScene.currentState === 'vaginal_sex') {
                    semenLocation = 'vagina';
                    state.stats.vaginalCreampiesReceived++;
                } else if (state.sexScene.currentState === 'anal_sex') {
                    semenLocation = 'anus';
                    state.stats.analCreampiesReceived++;
                }
                addSemen(semenLocation, npc.cumProduction, npc.semenId);
            }
            actor.arousal = 0;
        }
    }
}

function rehydrateEquipment(equipmentData) {
    const hydratedEquipment = {};
    for (const slotId in equipmentData) {
        const loadedSlot = equipmentData[slotId];
        if (!loadedSlot) continue;

        if (loadedSlot.hasOwnProperty('skin')) { // EquipmentSlot
            const newSlot = new EquipmentSlot(loadedSlot.id, loadedSlot.name);
            ['skin', 'middle', 'outer'].forEach(layer => {
                if (loadedSlot[layer]) {
                    newSlot[layer] = new ClothingItem(loadedSlot[layer]);
                }
            });
            hydratedEquipment[slotId] = newSlot;
        } else if (loadedSlot.hasOwnProperty('left')) { // HandHeldSlot
            const newSlot = new HandHeldSlot(loadedSlot.name);
            if (loadedSlot.left) newSlot.left = new ClothingItem(loadedSlot.left);
            if (loadedSlot.right) newSlot.right = new ClothingItem(loadedSlot.right);
            hydratedEquipment[slotId] = newSlot;
        } else if (loadedSlot.hasOwnProperty('item')) { // BackSlot
            const newSlot = new BackSlot(loadedSlot.name);
            if (loadedSlot.item) newSlot.item = new ClothingItem(loadedSlot.item);
            hydratedEquipment[slotId] = newSlot;
        }
    }
    return hydratedEquipment;
}

function endSexScene() {
    // Restore player's clothing from the scene's initial state
    const playerActor = state.sexScene.actors.find(a => a.id === 'player');
    if (playerActor && playerActor.initialEquipment) {
        state.equipment = rehydrateEquipment(playerActor.initialEquipment);
        updateCharDesc();
    }

    // Reset the scene state completely
    state.sexScene = {
        isActive: false,
        actors: [],
        turn: '',
        log: [],
        currentState: 'main',
        initialPlayerClothing: null // This is now handled by actor.initialEquipment
    };

    state.storyEventActive = false;

    goToScene('sex_cleanup', 0);
}

function returnFromSexScene() {
    // Now we can clear the initial clothing backup
    state.sexScene.initialPlayerClothing = null;
    // Go back to the previous location after a short time penalty
    goToScene(state.locationBeforeEvent || 'foyer', 600);
}

function getArousalLabel(arousal, maxArousal) {
    const percentage = (arousal / maxArousal) * 100;
    if (percentage < 10) return { text: "Unstimulated", color: "#add8e6" }; // Light Blue
    if (percentage < 30) return { text: "Slightly Aroused", color: "#87ceeb" }; // Sky Blue
    if (percentage < 50) return { text: "Aroused", color: "#ffc0cb" }; // Pink
    if (percentage < 70) return { text: "Visibly Excited", color: "#ffb6c1" }; // Light Pink
    if (percentage < 90) return { text: "Highly Aroused", color: "#ff69b4" }; // Hot Pink
    return { text: "Ready to Burst", color: "#ff1493" }; // Deep Pink
}

function renderSexScene() {
    if (!state.sexScene.isActive) {
        goToScene(state.locationBeforeEvent || 'foyer', 0);
        return;
    }

    const c = document.getElementById('mainArea');
    c.innerHTML = ''; // Clear the area first

    const mainContainer = document.createElement('div');
    mainContainer.style.margin = 'auto';
    mainContainer.style.maxWidth = '900px';
    mainContainer.style.textAlign = 'center';

    mainContainer.innerHTML += '<h2 class="eventTitle">Sex Scene</h2>';
    const lastLog = state.sexScene.log[state.sexScene.log.length - 1];
    mainContainer.innerHTML += `<p><em>${lastLog || 'The scene begins...'}</em></p>`;

    const columnsContainer = document.createElement('div');
    columnsContainer.style.display = 'flex';
    columnsContainer.style.textAlign = 'left';
    columnsContainer.style.marginTop = '1.5rem';

    // --- Actor State Column (Left) ---
    const leftColumn = document.createElement('div');
    leftColumn.style.flex = '1';
    leftColumn.style.paddingRight = '1.5rem';

    const npc = state.sexScene.actors.find(a => a.id !== 'player');
    const player = state.sexScene.actors.find(a => a.id === 'player');

    if (npc) {
        const arousal = getArousalLabel(npc.arousal, npc.maxArousal);
        leftColumn.innerHTML = `<h4>${npc.id}'s State</h4>`;
        leftColumn.innerHTML += `<p>Arousal: <span style="color: ${arousal.color}; font-weight: bold;">${arousal.text}</span></p>`;
        // Display new stats
        leftColumn.innerHTML += `<p>Trust: ${npc.trust || 0}</p>`;
        leftColumn.innerHTML += `<p>Anger: ${npc.anger || 0}</p>`;

        if (npc.lastAction) {
            leftColumn.innerHTML += `<br><small>Last Action: ${npc.lastAction}</small>`;
        }
    }
    columnsContainer.appendChild(leftColumn);

    // --- Action Selection Column (Right) ---
    const rightColumn = document.createElement('div');
    rightColumn.style.flex = '3';

    if (state.sexScene.turn === 'player') {
        if (player && player.lastAction) {
            rightColumn.innerHTML += `<p style="margin-bottom: 0.5rem; font-style: italic;"><small>Your last action was: ${player.lastAction}</small></p>`;
        }
        rightColumn.innerHTML += '<h4>Your Action</h4>';

        const actionBodyparts = ['mouth', 'left_hand', 'right_hand']; // The parts the player can use

        actionBodyparts.forEach(part => {
            const partContainer = document.createElement('div');
            partContainer.style.marginBottom = '1rem';
            partContainer.innerHTML = `<h5>${part.replace(/_/g, ' ').replace(/\w/g, l => l.toUpperCase())}</h5>`;

            const availableActions = [];
            for (const actionId in sexActions) {
                const action = sexActions[actionId];
                // Check if the action can be performed by this body part
                const canPerform = Array.isArray(action.bodypart) ? action.bodypart.includes(part) : action.bodypart === part;

                if (canPerform) {
                    // Check if the action's conditions are met
                    if (action.show_if(player, npc)) {
                        availableActions.push({ id: actionId, ...action });
                    }
                }
            }

            // Add a "Do Nothing" option for this part
            const restRadio = document.createElement('label');
            restRadio.innerHTML = `<input type="radio" name="${part}-action" value="rest" checked> Do Nothing`;
            restRadio.style.marginRight = '1rem';
            partContainer.appendChild(restRadio);

            // Render radio buttons for available actions
            availableActions.forEach(action => {
                const actionRadio = document.createElement('label');
                // The value is the unique action ID
                actionRadio.innerHTML = `<input type="radio" name="${part}-action" value="${action.id}"> ${action.name}`;
                actionRadio.style.marginRight = '1rem';
                partContainer.appendChild(actionRadio);
            });

            rightColumn.appendChild(partContainer);
        });

        rightColumn.innerHTML += '<button id="submit-sex-action" class="overlayBtn" style="margin-top: 1rem;">Perform Action</button>';

    } else {
        rightColumn.innerHTML = `<h4>Waiting for ${npc.id}...</h4>`;
    }
    columnsContainer.appendChild(rightColumn);
    mainContainer.appendChild(columnsContainer);

    const endBtn = document.createElement('button');
    endBtn.id = 'end-sex-scene';
    endBtn.className = 'overlayBtn';
    endBtn.style.marginTop = '1.5rem';
    endBtn.textContent = 'End Scene';
    mainContainer.appendChild(endBtn);

    c.appendChild(mainContainer);

    if (state.sexScene.turn === 'player') {
        document.getElementById('submit-sex-action').onclick = handlePlayerAction;
    }
    document.getElementById('end-sex-scene').onclick = endSexScene;
}

function handlePlayerAction() {
    const actionBundle = [];
    const actionBodyparts = ['mouth', 'left_hand', 'right_hand'];

    actionBodyparts.forEach(part => {
        const selectedActionInput = document.querySelector(`input[name="${part}-action"]:checked`);
        if (selectedActionInput) {
            const actionId = selectedActionInput.value;
            if (actionId !== 'rest') {
                const action = sexActions[actionId];
                if (action) {
                    actionBundle.push(action);
                }
            }
        }
    });

    const targetId = state.sexScene.actors.find(a => a.id !== 'player')?.id;
    if (!targetId) {
        console.error("Could not find a target for the sex action.");
        return;
    }

    if (actionBundle.length === 0) {
        state.sexScene.log.push("You decide to wait and see what happens next.");
        const currentIndex = state.sexScene.actors.findIndex(a => a.id === 'player');
        const nextIndex = (currentIndex + 1) % state.sexScene.actors.length;
        state.sexScene.turn = state.sexScene.actors[nextIndex].id;
    } else {
        processSexAction('player', actionBundle, targetId);
    }

    renderSexScene();
    updateNeedsUI();

    if (state.sexScene.isActive && state.sexScene.turn !== 'player') {
        setTimeout(handleNpcTurn, 1000);
    }
}

function handleNpcTurn() {
    if (!state.sexScene.isActive) return;

    const npcId = state.sexScene.turn;
    const npcSceneData = state.sexScene.actors.find(a => a.id === npcId);
    const npcMainData = state.npcs[npcId];
    const player = state.sexScene.actors.find(a => a.id === 'player');
    const actionBodyparts = ['mouth', 'left_hand', 'right_hand', 'groin'];
    const actionBundle = [];

    // Helper for weighted random selection
    const weightedRandom = (actions) => {
        if (actions.length === 0) return null;
        const totalWeight = actions.reduce((sum, action) => sum + action.weight, 0);
        if (totalWeight <= 0) return actions[Math.floor(Math.random() * actions.length)].action; // Fallback for all zero weights
        let random = Math.random() * totalWeight;
        for (const action of actions) {
            if (random < action.weight) {
                return action.action;
            }
            random -= action.weight;
        }
        return null; // Should not be reached if weights are positive
    };

    actionBodyparts.forEach(part => {
        // 1. Get available actions for this body part
        const availableActions = [];
        for (const actionId in sexActions) {
            const action = sexActions[actionId];
            const canPerform = Array.isArray(action.bodypart) ? action.bodypart.includes(part) : action.bodypart === part;
            if (canPerform && action.show_if(npcSceneData, player)) {
                availableActions.push(action);
            }
        }

        if (availableActions.length > 0) {
            // 2. Score each action
            const weightedActions = availableActions.map(action => {
                let weight = 10; // base weight
                const trust = npcMainData.trust || 0;
                const anger = npcMainData.anger || 0;

                switch (action.category) {
                    case 'meek':
                        weight += trust * 0.2 - anger * 0.1;
                        break;
                    case 'assertive':
                        weight += anger * 0.2 - trust * 0.1;
                        break;
                    case 'neutral':
                    default:
                        // No change
                        break;
                }
                // Ensure weight is not negative
                return { action: action, weight: Math.max(0.1, weight) };
            });

            // 3. Decide whether to act at all
            const chanceToAct = 0.3 + (npcMainData.trust / 200) + (npcMainData.anger / 300); // Base 30% + modifiers
            if (Math.random() < chanceToAct) {
                 // 4. Choose an action using weighted random
                const chosenAction = weightedRandom(weightedActions);
                if(chosenAction) {
                    actionBundle.push(chosenAction);
                }
            }
        }
    });

    if (actionBundle.length > 0) {
        processSexAction(npcId, actionBundle, 'player');
    } else {
        state.sexScene.log.push(`<i>${npcId} considers their next move...</i>`);
        // Advance turn manually if NPC does nothing
        const currentIndex = state.sexScene.actors.findIndex(a => a.id === npcId);
        const nextIndex = (currentIndex + 1) % state.sexScene.actors.length;
        state.sexScene.turn = state.sexScene.actors[nextIndex].id;
    }

    renderSexScene();
    updateNeedsUI();
}
