class ActionEffects {
    constructor() {}

    execute(actionId, actorId, targetId) {
        const combat = state.combat;
        const actor = combat.actors.find(a => a.id === actorId);
        const target = targetId ? combat.actors.find(a => a.id === targetId) : null;
        const methodName = `_${actionId}`;

        if (typeof this[methodName] === 'function') {
            this[methodName](actor, target);
        } else {
            combat.log.push(`Action "${actionId}" is not yet implemented.`);
            console.warn(`Action "${actionId}" is not yet implemented.`);
        }
    }

    _modifyArousal(target, amount) {
        if (!target) return;

        if (target.id === 'player') {
            state.needs.arousal = Math.min(state.needs.arousal + amount, state.ranges.arousal);
        } else if (state.npcs[target.id]) {
            const npc = state.npcs[target.id];
            npc.arousal = Math.min((npc.arousal || 0) + amount, (npc.maxArousal || 100));
        }
    }

    // --- Left Arm ---
    _rest_left_arm(actor, target) { state.combat.log.push(`${actor.id} rests their left arm.`); }
    _grab_arms_left(actor, target) {
        if (target) {
            actor.bodyParts.leftArm.state = 'grappling';
            actor.bodyParts.leftArm.target = target.id;
            target.bodyParts.leftArm.state = 'grappled';
            target.bodyParts.rightArm.state = 'grappled';
            state.combat.log.push(`${actor.id} grabs ${target.id}'s arms with their left hand.`);
        } else { state.combat.log.push(`${actor.id} grabs at nothing.`); }
    }
    _hold_on_left(actor, target) {
        if (target) {
            state.combat.log.push(`${actor.id} holds on tightly to ${target.id}'s arms.`);
        }
    }
    _let_go_left(actor, target) {
        if (target) {
            actor.bodyParts.leftArm.state = 'free';
            actor.bodyParts.leftArm.target = null;
            target.bodyParts.leftArm.state = 'free';
            target.bodyParts.rightArm.state = 'free';
            state.combat.log.push(`${actor.id} lets go of ${target.id}.`);
        }
    }
    _tease_left_arm(actor, target) {
        if (target) {
            this._modifyArousal(target, 10);
            state.combat.log.push(`${actor.id} teases ${target.id} with their left hand.`);
        }
    }
    _struggle_left_arm(actor, target) {
        state.combat.log.push(`${actor.id} struggles with their left arm!`);
        if (Math.random() > 0.5) {
            actor.bodyParts.leftArm.state = 'free';
            state.combat.log.push(`${actor.id} breaks free!`);
        } else { state.combat.log.push(`${actor.id} fails to break free.`); }
    }
    _work_shaft_left(actor, target) {
        if (target) {
            this._modifyArousal(target, 15);
            state.combat.log.push(`${actor.id} works ${target.id}'s shaft.`);
        }
    }
    _rub_clit_left(actor, target) {
        if (target) {
            this._modifyArousal(target, 15);
            state.combat.log.push(`${actor.id} rubs ${target.id}'s clit.`);
        }
    }
    _stop_left_arm(actor, target) {
        actor.bodyParts.leftArm.state = 'free';
        actor.bodyParts.leftArm.target = null;
        state.combat.log.push(`${actor.id} stops using their left arm.`);
    }

    // --- Right Arm ---
    _rest_right_arm(actor, target) { state.combat.log.push(`${actor.id} rests their right arm.`); }
    _grab_right_arm(actor, target) {
        if (target) {
            actor.bodyParts.rightArm.state = 'holding_vagina';
            actor.bodyParts.rightArm.target = target.id;
            state.combat.log.push(`${actor.id} grabs ${target.id}'s groin with their right hand.`);
        } else { state.combat.log.push(`${actor.id} grabs at nothing.`); }
    }
    _tease_right_arm(actor, target) {
        if (target) {
            this._modifyArousal(target, 10);
            state.combat.log.push(`${actor.id} teases ${target.id} with their right hand.`);
        }
    }
    _struggle_right_arm(actor, target) {
        state.combat.log.push(`${actor.id} struggles with their right arm!`);
        if (Math.random() > 0.5) {
            actor.bodyParts.rightArm.state = 'free';
            state.combat.log.push(`${actor.id} breaks free!`);
        } else { state.combat.log.push(`${actor.id} fails to break free.`); }
    }
    _work_shaft_right(actor, target) {
        if (target) {
            this._modifyArousal(target, 15);
            state.combat.log.push(`${actor.id} works ${target.id}'s shaft.`);
        }
    }
    _rub_clit_right(actor, target) {
        if (target) {
            this._modifyArousal(target, 15);
            state.combat.log.push(`${actor.id} rubs ${target.id}'s clit.`);
        }
    }
    _stop_right_arm(actor, target) {
        actor.bodyParts.rightArm.state = 'free';
        actor.bodyParts.rightArm.target = null;
        state.combat.log.push(`${actor.id} stops using their right arm.`);
    }

    // --- Mouth ---
    _rest_mouth(actor, target) { state.combat.log.push(`${actor.id} rests their mouth.`); }
    _kiss_mouth(actor, target) {
        if (target) {
            actor.bodyParts.mouth.state = 'kissing';
            actor.bodyParts.mouth.target = target.id;
            target.bodyParts.mouth.state = 'kissing';
            target.bodyParts.mouth.target = actor.id;
            state.combat.log.push(`${actor.id} kisses ${target.id}.`);
        }
    }
    _suck_penis_mouth(actor, target) {
        if (target) {
            this._modifyArousal(target, 20);
            state.combat.log.push(`${actor.id} sucks ${target.id}'s penis.`);
        }
    }

    // --- Penis ---
    _penetrate_penis(actor, target) {
        if (target) {
            const targetPart = actor.bodyParts.penis.target_part;
            actor.bodyParts.penis.state = 'penetrating';
            target.bodyParts[targetPart].state = 'penetrated';
            target.bodyParts[targetPart].penetratedBy.push(actor.id);
            state.combat.log.push(`${actor.id}'s penis penetrates ${target.id}'s ${targetPart}.`);
            this._modifyArousal(actor, 10);
            this._modifyArousal(target, 20);
        }
    }
    _thrust_penis(actor, target) {
        if (target) {
            const targetPart = actor.bodyParts.penis.target_part;
            state.combat.log.push(`${actor.id} thrusts into ${target.id}'s ${targetPart}.`);
            this._modifyArousal(actor, 15);
            this._modifyArousal(target, 15);
        }
    }
    _pull_out_penis(actor, target) {
        if (target) {
            const targetPart = actor.bodyParts.penis.target_part;
            actor.bodyParts.penis.state = 'free';
            actor.bodyParts.penis.target = null;
            actor.bodyParts.penis.target_part = null;
            target.bodyParts[targetPart].state = 'free';
            target.bodyParts[targetPart].penetratedBy = target.bodyParts[targetPart].penetratedBy.filter(id => id !== actor.id);
            state.combat.log.push(`${actor.id} pulls out of ${target.id}.`);
        }
    }

    // --- Vagina ---
    _accept_penetration_vagina(actor, target) {
        if (target) {
            target.bodyParts.penis.state = 'penetrating';
            actor.bodyParts.vagina.state = 'penetrated';
            actor.bodyParts.vagina.penetratedBy.push(target.id);
            state.combat.log.push(`${actor.id} accepts ${target.id}'s penis.`);
            this._modifyArousal(actor, 20);
            this._modifyArousal(target, 10);
        }
    }
    _reject_penetration_vagina(actor, target) {
        if (target) {
            target.bodyParts.penis.state = 'free';
            state.combat.log.push(`${actor.id} rejects ${target.id}'s advance.`);
        }
    }
    _ride_vagina(actor, target) {
        const penetratorId = actor.bodyParts.vagina.penetratedBy[0];
        if (penetratorId) {
            const penetrator = state.combat.actors.find(a => a.id === penetratorId);
            state.combat.log.push(`${actor.id} rides ${penetrator.id}'s penis.`);
            this._modifyArousal(actor, 15);
            this._modifyArousal(penetrator, 15);
        }
    }
    _clench_vagina(actor, target) {
        const penetratorId = actor.bodyParts.vagina.penetratedBy[0];
        if (penetratorId) {
            const penetrator = state.combat.actors.find(a => a.id === penetratorId);
            state.combat.log.push(`${actor.id} clenches around ${penetrator.id}'s penis.`);
            this._modifyArousal(penetrator, 20);
        }
    }
}
