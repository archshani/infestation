const sexActions = {
    'kiss': {
        name: 'Kiss',
        bodypart: 'mouth',
        category: 'meek',
        description: "You lean in and share a gentle, affectionate kiss with {target}.",
        show_if: (actor, target) => ['main', 'hand_in_panties'].includes(state.sexScene.currentState),
        effect: (actor, target) => {
            if (actor.id === 'player') {
                state.needs.arousal = Math.min(state.ranges.arousal, state.needs.arousal + 5);
                target.arousal = Math.min(target.maxArousal, target.arousal + 10);
            } else {
                actor.arousal = Math.min(actor.maxArousal, actor.arousal + 5);
                state.needs.arousal = Math.min(state.ranges.arousal, state.needs.arousal + 10);
            }
            if (target.id !== 'player') {
                state.npcs[target.id].trust = Math.min(100, (state.npcs[target.id].trust || 0) + 5);
            }
        }
    },
    'whisper_seductively': {
        name: 'Whisper Seductively',
        bodypart: 'mouth',
        category: 'assertive',
        description: "You lean in close and whisper something seductive in {target}'s ear.",
        show_if: (actor, target) => ['main', 'vaginal_sex', 'anal_sex'].includes(state.sexScene.currentState),
        effect: (actor, target) => {
            if (actor.id === 'player') {
                state.needs.arousal = Math.min(state.ranges.arousal, state.needs.arousal + 10);
                target.arousal = Math.min(target.maxArousal, target.arousal + 15);
            } else {
                actor.arousal = Math.min(actor.maxArousal, actor.arousal + 10);
                state.needs.arousal = Math.min(state.ranges.arousal, state.needs.arousal + 15);
            }
            if (target.id !== 'player') {
                state.npcs[target.id].trust = Math.min(100, (state.npcs[target.id].trust || 0) + 2);
            }
        }
    },
    'remove_top': {
        name: 'Remove Top',
        bodypart: ['left_hand', 'right_hand'],
        category: 'neutral',
        description: "This should not be seen.",
        show_if: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor) return false;
            const equipment = targetActor.equipment;
            return equipment.upper.outer || equipment.upper.middle || equipment.upper.skin;
        },
        effect: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor) return "Nothing happens.";

            const equipment = targetActor.equipment;
            let itemRemoved = null;

            if (equipment.upper.outer) {
                itemRemoved = equipment.upper.outer;
                equipment.upper.outer = null;
            } else if (equipment.upper.middle) {
                itemRemoved = equipment.upper.middle;
                equipment.upper.middle = null;
            } else if (equipment.upper.skin) {
                itemRemoved = equipment.upper.skin;
                equipment.upper.skin = null;
            }

            if (itemRemoved) {
                targetActor.inventory.push(itemRemoved);
                const targetName = (target.id === 'player') ? 'your' : `${target.id}'s`;
                if (actor.id === 'player') {
                    return `<b>You remove ${targetName} ${itemRemoved.name}.</b>`;
                } else {
                    return `<b>${actor.id} removes ${targetName} ${itemRemoved.name}.</b>`;
                }
            }
            return `<i>${actor.id} tries to remove clothing from ${target.id}, but there's nothing there.</i>`;
        }
    },
    'remove_bottom': {
        name: 'Remove Bottoms',
        bodypart: ['left_hand', 'right_hand'],
        category: 'neutral',
        description: "This should not be seen.",
        show_if: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor) return false;
            const equipment = targetActor.equipment;
            return equipment.lower.outer || equipment.lower.middle || equipment.lower.skin;
        },
        effect: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor) return "Nothing happens.";

            const equipment = targetActor.equipment;
            let itemRemoved = null;

            if (equipment.lower.outer) {
                itemRemoved = equipment.lower.outer;
                equipment.lower.outer = null;
            } else if (equipment.lower.middle) {
                itemRemoved = equipment.lower.middle;
                equipment.lower.middle = null;
            } else if (equipment.lower.skin) {
                itemRemoved = equipment.lower.skin;
                equipment.lower.skin = null;
            }

            if (itemRemoved) {
                targetActor.inventory.push(itemRemoved);
                const targetName = (target.id === 'player') ? 'your' : `${target.id}'s`;
                if (actor.id === 'player') {
                    return `<b>You remove ${targetName} ${itemRemoved.name}.</b>`;
                } else {
                    return `<b>${actor.id} removes ${targetName} ${itemRemoved.name}.</b>`;
                }
            }
            return `<i>${actor.id} tries to remove clothing from ${target.id}, but there's nothing there.</i>`;
        }
    },
    'caress_breasts': {
        name: 'Caress Breasts',
        bodypart: ['left_hand', 'right_hand'],
        category: 'meek',
        description: "{actor} gently caresses {target}'s breasts, teasing their nipples.",
        show_if: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor || target.id !== 'player') return false; // For now, only player can be targeted
            const equipment = targetActor.equipment;
            return !equipment.upper.outer && !equipment.upper.middle && !equipment.upper.skin;
        },
        effect: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (actor.id === 'player') {
                state.needs.arousal += 10;
                targetActor.arousal += 15;
            } else {
                actor.arousal += 10;
                state.needs.arousal += 15;
            }
            if (target.id !== 'player') {
                state.npcs[target.id].trust += 3;
            }
        }
    },
    'perform_oral': {
        name: 'Perform Oral',
        bodypart: 'mouth',
        category: 'meek',
        description: "{actor} kneels down and begins to pleasure {target} with their mouth.",
        show_if: (actor, target) => {
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!targetActor) return false;
            const equipment = targetActor.equipment;
            return !equipment.lower.outer && !equipment.lower.middle && !equipment.lower.skin;
        },
        effect: (actor, target) => {
            state.sexScene.currentState = 'oral_sex';
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (actor.id === 'player') {
                state.needs.arousal += 5;
                targetActor.arousal += 25;
                state.stats.oralSexGivenCount++;
            } else {
                actor.arousal += 5;
                state.needs.arousal += 25;
                state.stats.oralSexReceivedCount++;
            }
        }
    },
    'penetrate_vagina': {
        name: 'Penetrate Vagina',
        bodypart: 'groin',
        category: 'assertive',
        description: "{actor} moves between {target}'s legs and penetrates their vagina.",
        show_if: (actor, target) => {
            if (actor.id === 'player') return false;
            const actorActor = state.sexScene.actors.find(a => a.id === actor.id);
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!actorActor || !targetActor) return false;
            const actorEquipment = actorActor.equipment;
            const targetEquipment = targetActor.equipment;
            const actorGroinExposed = !actorEquipment.lower.outer && !actorEquipment.lower.middle && !actorEquipment.lower.skin;
            const targetVaginaExposed = !targetEquipment.lower.outer && !targetEquipment.lower.middle && !targetEquipment.lower.skin;
            return actorGroinExposed && targetVaginaExposed && state.sexScene.currentState === 'main';
        },
        effect: (actor, target) => {
            state.sexScene.currentState = 'vaginal_sex';
            const actorActor = state.sexScene.actors.find(a => a.id === actor.id);
            if (actor.id !== 'player') {
                state.stats.vaginalSexCount++;
                actorActor.arousal += 15;
                state.needs.arousal += 20;
            }
        }
    },
    'penetrate_anus': {
        name: 'Penetrate Anus',
        bodypart: 'groin',
        category: 'assertive',
        description: "{actor} positions themselves behind {target} and penetrates their anus.",
        show_if: (actor, target) => {
            if (actor.id === 'player') return false;
            const actorActor = state.sexScene.actors.find(a => a.id === actor.id);
            const targetActor = state.sexScene.actors.find(a => a.id === target.id);
            if (!actorActor || !targetActor) return false;
            const actorEquipment = actorActor.equipment;
            const targetEquipment = targetActor.equipment;
            const actorGroinExposed = !actorEquipment.lower.outer && !actorEquipment.lower.middle && !actorEquipment.lower.skin;
            const targetAnusExposed = !targetEquipment.lower.outer && !targetEquipment.lower.middle && !targetEquipment.lower.skin;
            return actorGroinExposed && targetAnusExposed && state.sexScene.currentState === 'main';
        },
        effect: (actor, target) => {
            state.sexScene.currentState = 'anal_sex';
            const actorActor = state.sexScene.actors.find(a => a.id === actor.id);
            if (actor.id !== 'player') {
                state.stats.analSexCount++;
                actorActor.arousal += 15;
                state.needs.arousal += 20;
            }
        }
    }
};
