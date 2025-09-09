class BodyPart {
    constructor(id, name, adjectives = [], size = 'average') {
        this.id = id; // e.g., 'left_thigh'
        this.name = name; // e.g., 'Left Thigh'
        this.descriptor = null; // e.g., 'small', 'large', 'toned'
        this.adjectives = adjectives; // e.g., ['strong', 'scarred']
        this.size = size;
        this.tattoos = []; // Array of TattooItem objects
        this.piercings = []; // Array of PiercingItem objects
    }
}

class EquipmentSlot {
    constructor(id, name, layers = ['skin', 'middle', 'outer']) {
        this.id = id;
        this.name = name;
        layers.forEach(layer => {
            this[layer] = null;
        });
    }
}

class HandHeldSlot {
    constructor(name = 'Hand-held') {
        this.name = name;
        this.left = null;
        this.right = null;
    }
}

class BackSlot {
    constructor(name = 'Back') {
        this.name = name;
        this.item = null;
    }
}


class ClothingItem {
    constructor({
        id,
        templateId, // The original ID from the clothingTemplates object
        name,
        slot, // The ID of the EquipmentSlot it goes into
        layer = null, // 'skin', 'middle', or 'outer'
        covers, // Array of BodyPart IDs it covers
        bonusStats = {}, // e.g., { warmth: 5, style: 10 }
        durability = 100,
        tags = []
    }) {
        this.id = id;
        this.templateId = templateId;
        this.name = name;
        this.slot = slot;
        this.layer = layer;
        this.covers = covers;
        this.bonusStats = bonusStats;
        this.durability = durability;
        this.tags = tags;
    }
}

class TattooItem {
    constructor({
        id, // Unique instance ID
        name, // Final name, e.g., "Large Color Rose Tattoo"
        design, // Final description
        tags = []
    }) {
        this.id = id;
        this.name = name;
        this.design = design;
        this.tags = tags;
    }
}

class PiercingItem {
    constructor({
        id, // Unique instance ID
        name, // Final name, e.g., "Gold Stud"
        bodyPartId, // The specific part it's on
        jewelry, // Description of the jewelry
        tags = []
    }) {
        this.id = id;
        this.name = name;
        this.bodyPartId = bodyPartId;
        this.jewelry = jewelry;
        this.tags = tags;
    }
}
