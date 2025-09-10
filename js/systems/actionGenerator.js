class ActionGenerator {
    constructor() {}

    getAvailableActions(actorId) {
        const actor = state.combat.actors.find(a => a.id === actorId);
        if (!actor) return {};

        const actions = {};
        if (actor.bodyParts.left_arm) actions.leftArm = this.getLeftArmActions(actor);
        if (actor.bodyParts.right_arm) actions.rightArm = this.getRightArmActions(actor);
        if (actor.bodyParts.mouth) actions.mouth = this.getMouthActions(actor);
        if (actor.bodyParts.penis) actions.penis = this.getPenisActions(actor);
        if (actor.bodyParts.vagina) actions.vagina = this.getVaginaActions(actor);
        if (actor.bodyParts.anus) actions.anus = this.getAnusActions(actor);

        return actions;
    }

    _createAction(name, id, category = 'neutral') {
        return { [name]: { id, category } };
    }

    getLeftArmActions(player) {
        const actions = {};
        const part = player.bodyParts.left_arm;
        const target = state.combat.actors.find(a => a.id === part.target);
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch (part.state) {
            case 'free':
                add('Rest', 'rest_left_arm', 'defensive');
                if (target) {
                    add(`Grab ${target.id}'s arms`, 'grab_arms_left', 'grapple');
                }
                add('Tease', 'tease_left_arm', 'sexual');
                break;
            case 'grappling': // New state for when the player is the one grappling
                if (target) add(`Hold on to ${target.id}'s arms`, 'hold_on_left', 'grapple');
                add('Let go', 'let_go_left', 'defensive');
                break;
            case 'grappled': // State for when the player is being grappled
                add('Rest', 'rest_left_arm', 'defensive');
                add('Struggle to break free', 'struggle_left_arm', 'defensive');
                break;
            case 'holding_penis':
                if (target) add(`Work ${target.id}'s shaft`, 'work_shaft_left', 'sexual');
                add('Stop', 'stop_left_arm', 'defensive');
                break;
            case 'holding_vagina':
                 if (target) add(`Rub ${target.id}'s clit`, 'rub_clit_left', 'sexual');
                 add('Stop', 'stop_left_arm', 'defensive');
                 break;
            default:
                break;
        }
        return actions;
    }

    getRightArmActions(player) {
        const actions = {};
        const part = player.bodyParts.right_arm;
        const target = state.combat.actors.find(a => a.id === part.target);
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch (part.state) {
            case 'free':
                add('Rest', 'rest_right_arm', 'defensive');
                add('Grab', 'grab_right_arm', 'grapple');
                add('Tease', 'tease_right_arm', 'sexual');
                break;
            case 'grappled':
                add('Rest', 'rest_right_arm', 'defensive');
                add('Struggle', 'struggle_right_arm', 'defensive');
                break;
            case 'holding_penis':
                if (target) add(`Work ${target.id}'s shaft`, 'work_shaft_right', 'sexual');
                add('Stop', 'stop_right_arm', 'defensive');
                break;
            case 'holding_vagina':
                if (target) add(`Rub ${target.id}'s clit`, 'rub_clit_right', 'sexual');
                add('Stop', 'stop_right_arm', 'defensive');
                break;
            default:
                break;
        }
        return actions;
    }

    getMouthActions(player) {
        const actions = {};
        const part = player.bodyParts.mouth;
        const target = state.combat.actors.find(a => a.id === part.target);
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch(part.state) {
            case 'free':
                add('Rest', 'rest_mouth', 'defensive');
                add('Kiss', 'kiss_mouth', 'sexual');
                break;
            case 'kissing':
                add('Kiss back', 'kiss_back_mouth', 'sexual');
                add('Pull away', 'pull_away_mouth', 'defensive');
                break;
            case 'penetrated_by_penis':
                 if (target) add(`Suck ${target.id}'s penis`, 'suck_penis_mouth', 'sexual');
                 add('Pull away', 'pull_away_mouth', 'defensive');
                break;
            default:
                break;
        }
        return actions;
    }

    getVaginaActions(player) {
        const actions = {};
        const part = player.bodyParts.vagina;
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch(part.state) {
            case 'free':
                add('Rest', 'rest_vagina', 'defensive');
                break;
            case 'entrance':
                add('Accept', 'accept_penetration_vagina', 'sexual');
                add('Reject', 'reject_penetration_vagina', 'defensive');
                break;
            case 'penetrated':
                add('Ride', 'ride_vagina', 'sexual');
                add('Clench', 'clench_vagina', 'sexual');
                add('Try to pull away', 'pull_away_vagina', 'defensive');
                break;
            default:
                break;
        }
        return actions;
    }

    getPenisActions(player) {
        const actions = {};
        const part = player.bodyParts.penis;
        const target = state.combat.actors.find(a => a.id === part.target);
        const targetPart = part.target_part;
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch(part.state) {
            case 'free':
                add('Rest', 'rest_penis', 'defensive');
                if (target) add(`Rub against ${target.id}`, 'rub_penis', 'sexual');
                break;
            case 'entrance':
                if (target) add(`Push into ${target.id}'s ${targetPart}`, 'penetrate_penis', 'sexual');
                add('Pull back', 'pull_back_penis', 'defensive');
                break;
            case 'penetrating':
                if (target) add(`Thrust into ${target.id}'s ${targetPart}`, 'thrust_penis', 'sexual');
                add('Pull out', 'pull_out_penis', 'defensive');
                break;
            default:
                break;
        }
        return actions;
    }

    getAnusActions(player) {
        const actions = {};
        const part = player.bodyParts.anus;
        const add = (name, id, cat) => Object.assign(actions, this._createAction(name, id, cat));

        switch(part.state) {
            case 'free':
                add('Rest', 'rest_anus', 'defensive');
                break;
            case 'entrance':
                add('Accept', 'accept_penetration_anus', 'sexual');
                add('Reject', 'reject_penetration_anus', 'defensive');
                break;
            case 'penetrated':
                add('Clench', 'clench_anus', 'sexual');
                add('Try to pull away', 'pull_away_anus', 'defensive');
                break;
            default:
                break;
        }
        return actions;
    }
}
