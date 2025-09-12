class CombatManager {
    constructor() {
        this.generator = new ActionGenerator();
        this.effects = new ActionEffects();
    }

    startCombat(participantIds) {
        const combat = state.combat;
        combat.isActive = true;
        combat.log = ['A new encounter begins.'];
        combat.actors = participantIds.map(id => this.createCombatActor(id));
        combat.turn = combat.actors[0].id;
        this.renderScene();
    }

    createCombatActor(id) {
        const actor = {
            id: id,
            bodyParts: {},
            skills: {},
            stats: {},
            clothing: {}
        };

        if (id === state.playerName) {
            if (Object.keys(state.playerBody).length > 0) {
                actor.bodyParts = JSON.parse(JSON.stringify(state.playerBody));
            } else {
                console.warn("Player body not found, using default combat body. This may indicate an issue with character creation or game loading.");
                actor.bodyParts = {
                    leftArm: { state: 'free', target: null },
                    rightArm: { state: 'free', target: null },
                    mouth: { state: 'free', target: null },
                    feet: { state: 'free', target: null },
                    legs: { state: 'free', target: null },
                    chest: { state: 'free', target: null },
                    thighs: { state: 'free', target: null },
                    penis: { state: 'free', target: null, target_part: null },
                    vagina: { state: 'free', penetratedBy: [] },
                    anus: { state: 'free', penetratedBy: [] },
                };
            }
            Object.assign(actor.skills, state.skills);
            Object.assign(actor.stats, state.stats);
            actor.clothing = JSON.parse(JSON.stringify(state.equipment));
        } else if (state.npcs[id]) {
            actor.bodyParts = createNpcBody(id); // Generate body parts based on sex
            const npcData = state.npcs[id];
            Object.assign(actor.stats, {
                trust: npcData.trust || 0,
                dominance: npcData.dominance || 0,
                anger: npcData.anger || 0,
            });
        }
        return actor;
    }

    renderScene() {
        const combat = state.combat;
        if (!combat.isActive) return;

        const mainArea = document.getElementById('mainArea');
        mainArea.innerHTML = '';

        const container = document.createElement('div');
        container.id = 'combat-container';

        const logContainer = document.createElement('div');
        logContainer.id = 'combat-log';
        logContainer.innerHTML = combat.log.map(msg => `<p>${msg}</p>`).join('');
        container.appendChild(logContainer);

        if (combat.turn === state.playerName) {
            const actionsContainer = document.createElement('div');
            actionsContainer.id = 'combat-actions';

            const availableActions = this.generator.getAvailableActions(state.playerName);

            for (const bodyPart in availableActions) {
                const partActions = availableActions[bodyPart];
                if (Object.keys(partActions).length > 0) {
                    const partContainer = document.createElement('div');
                    partContainer.className = 'action-part-container';

                    const title = document.createElement('h4');
                    title.innerText = bodyPart.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    partContainer.appendChild(title);

                    for (const actionName in partActions) {
                        const action = partActions[actionName];
                        const button = document.createElement('button');
                        button.innerText = actionName;
                        button.onclick = () => this.processPlayerAction(action.id);
                        partContainer.appendChild(button);
                    }
                    actionsContainer.appendChild(partContainer);
                }
            }
            container.appendChild(actionsContainer);
        } else {
            const waitingMessage = document.createElement('p');
            waitingMessage.innerText = `Waiting for ${combat.turn}...`;
            container.appendChild(waitingMessage);
            setTimeout(() => this.npcTurn(), 1000);
        }

        mainArea.appendChild(container);
    }

    processPlayerAction(actionId) {
        if (state.combat.turn !== state.playerName) return;
        const targetId = state.combat.actors.find(a => a.id !== state.playerName)?.id;
        this.effects.execute(actionId, state.playerName, targetId);
        state.combat.turn = targetId;
        this.renderScene();
    }

    npcTurn() {
        const combat = state.combat;
        if (combat.turn === state.playerName || !combat.isActive) return;

        const npcId = combat.turn;
        const player = combat.actors.find(a => a.id === state.playerName);
        const availableActions = this.generator.getAvailableActions(npcId);

        const categorizedActions = { grapple: [], sexual: [], defensive: [], neutral: [] };
        for (const bodyPart in availableActions) {
            for (const actionName in availableActions[bodyPart]) {
                const action = availableActions[bodyPart][actionName];
                categorizedActions[action.category].push(action.id);
            }
        }

        let chosenActionId = null;
        const isPlayerGrappled = Object.values(player.bodyParts).some(part => part.state === 'grappled' || part.state === 'bound');

        if (isPlayerGrappled && categorizedActions.sexual.length > 0) {
            chosenActionId = categorizedActions.sexual[Math.floor(Math.random() * categorizedActions.sexual.length)];
        } else if (!isPlayerGrappled && categorizedActions.grapple.length > 0) {
            chosenActionId = categorizedActions.grapple[Math.floor(Math.random() * categorizedActions.grapple.length)];
        } else {
            const allActions = [].concat(...Object.values(categorizedActions));
            if (allActions.length > 0) {
                chosenActionId = allActions[Math.floor(Math.random() * allActions.length)];
            }
        }

        if (chosenActionId) {
            this.effects.execute(chosenActionId, npcId, state.playerName);
        } else {
            combat.log.push(`${npcId} doesn't know what to do.`);
        }

        combat.turn = state.playerName;
        this.renderScene();
    }

    endCombat() {
        state.combat.isActive = false;
        console.log("Combat has ended.");
    }
}

// Global instances
const combatManager = new CombatManager();
window.combatManager = combatManager;

function startCombat(participantIds) {
    window.combatManager.startCombat(participantIds);
}
