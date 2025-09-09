function createPlayerBody(sex = 'female') {
    const body = {};
    const addPart = (id, name) => {
        body[id] = new BodyPart(id, name);
    };
    const addPairedParts = (baseId, baseName) => {
        addPart(`left_${baseId}`, `Left ${baseName}`);
        addPart(`right_${baseId}`, `Right ${baseName}`);
    };

    // Head & Face
    addPart('head', 'Head');
    addPart('neck', 'Neck');
    addPart('face', 'Face');
    addPart('forehead', 'Forehead');
    addPairedParts('eye', 'Eye');
    addPairedParts('ear', 'Ear');
    addPart('nose', 'Nose');
    addPart('lips', 'Lips');
    addPart('tongue', 'Tongue');

    // Torso
    addPart('chest', 'Chest');
    addPart('belly', 'Belly');
    addPart('waist', 'Waist');
    addPart('upper_back', 'Upper Back');
    addPart('lower_back', 'Lower Back');

    // Groin & Butt
    addPart('groin', 'Groin');
    // addPart('butt', 'Buttocks'); // Removed to prevent duplicate descriptor issues
    addPairedParts('ass_cheek', 'Ass Cheek');
    addPart('anus', 'Anus');

    // Limbs
    addPairedParts('arm', 'Arm');
    addPairedParts('wrist', 'Wrist');
    addPairedParts('hand', 'Hand');
    addPairedParts('thigh', 'Thigh');
    addPairedParts('calf', 'Calf');
    addPairedParts('ankle', 'Ankle');
    addPairedParts('foot', 'Foot');

    // Conditional parts based on sex
    if (sex === 'female') {
        addPairedParts('breast', 'Breast');
        addPairedParts('nipple', 'Nipple');
        addPart('vagina', 'Vagina');
    } else if (sex === 'male') {
        addPart('penis', 'Penis');
    }

    return body;
}

function createEmptyEquipment() {
    return {
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
    };
}

function createDefaultNpcClothing() {
    const equipment = createEmptyEquipment();
    const shirtTemplate = clothingTemplates['upper_tshirt'];
    const pantsTemplate = clothingTemplates['lower_pants'];
    equipment.upper.middle = new ClothingItem({
        ...shirtTemplate,
        id: `npc_shirt_${Date.now()}`,
        name: 'Simple Shirt',
        templateId: shirtTemplate.id
    });
    equipment.lower.middle = new ClothingItem({
        ...pantsTemplate,
        id: `npc_pants_${Date.now()}`,
        name: 'Simple Pants',
        templateId: pantsTemplate.id
    });
    return equipment;
}
