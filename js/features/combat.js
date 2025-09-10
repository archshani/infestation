class CombatManager {
    constructor() {
        this.generator = new ActionGenerator();
        this.effects = new ActionEffects();
    }

    startCombat(participantIds) {
        const combat = window.state.combat;
        combat.isActive = true;
        combat.log = ['A new encounter begins.'];
        combat.actors = participantIds.map(id => this.createCombatActor(id));
        combat.turn = combat.actors[0].id;
        this.renderScene();
    }

    createCombatActor(id) {
        const actor = {
            id: id,
            bodyParts: {
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
            },
            skills: {},
            stats: {},
            clothing: {}
        };

        if (id === 'player') {
            Object.assign(actor.skills, window.state.skills);
            Object.assign(actor.stats, window.state.stats);
            actor.clothing = JSON.parse(JSON.stringify(window.state.equipment));
        } else if (window.state.npcs[id]) {
            const npcData = window.state.npcs[id];
            Object.assign(actor.stats, {
                trust: npcData.trust || 0,
                dominance: npcData.dominance || 0,
                anger: npcData.anger || 0,
            });
        }
        return actor;
    }

    renderScene() {
        const combat = window.state.combat;
        if (!combat.isActive) return;

        const mainArea = document.getElementById('mainArea');
        mainArea.innerHTML = '';

        const container = document.createElement('div');
        container.id = 'combat-container';

        const logContainer = document.createElement('div');
        logContainer.id = 'combat-log';
        logContainer.innerHTML = combat.log.map(msg => `<p>${msg}</p>`).join('');
        container.appendChild(logContainer);

        if (combat.turn === 'player') {
            const actionsContainer = document.createElement('div');
            actionsContainer.id = 'combat-actions';

            const availableActions = this.generator.getAvailableActions('player');

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
        if (window.state.combat.turn !== 'player') return;
        const targetId = window.state.combat.actors.find(a => a.id !== 'player')?.id;
        this.effects.execute(actionId, 'player', targetId);
        window.state.combat.turn = targetId;
        this.renderScene();
    }

    npcTurn() {
        const combat = window.state.combat;
        if (combat.turn === 'player' || !combat.isActive) return;

        const npcId = combat.turn;
        this.effects.execute('rest_left_arm', npcId, 'player'); // Simple placeholder action

        combat.turn = 'player';
        this.renderScene();
    }

    endCombat() {
        window.state.combat.isActive = false;
        console.log("Combat has ended.");
    }
}

// Global instances
const combatManager = new CombatManager();
window.combatManager = combatManager;

function startCombat(participantIds) {
    window.combatManager.startCombat(participantIds);
}
