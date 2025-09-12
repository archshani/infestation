function processClothingRules() {
    for (const id in clothingTemplates) {
        const template = clothingTemplates[id];

        // Ensure forcedTags and allowedTags exist to prevent errors
        if (!template.forcedTags) {
            template.forcedTags = [];
        }
        if (!template.allowedTags) {
            template.allowedTags = [];
        }

        // RULE 1: Automatically add 'belly hiding' if the item covers the belly
        // and is not explicitly a 'belly showing' optional item.
        if (template.covers && template.covers.includes('belly')) {
            const isBellyShowingOptional = template.allowedTags.includes('belly showing');
            if (!isBellyShowingOptional) {
                if (!template.forcedTags.includes('belly hiding')) {
                    template.forcedTags.push('belly hiding');
                }
            }
        }

        // RULE 2: If an item has only one material option, force it.
        const templateMaterials = template.allowedTags.filter(t => materialTags.includes(t));
        if (templateMaterials.length === 1) {
            const material = templateMaterials[0];
            // Move from allowed to forced
            const index = template.allowedTags.indexOf(material);
            if (index > -1) {
                template.allowedTags.splice(index, 1);
            }
            if (!template.forcedTags.includes(material)) {
                template.forcedTags.push(material);
            }
        }
    }
}

function updateCharDesc() {
    const descEl = document.getElementById('charDesc');
    const coverageMap = getCoverageInfo(); // This is the key
    const purple = 'purple';
    const red = '#ff4d4d';

    const formatItemName = (item, isOuter) => {
        if (!item) return '';
        if (isOuter && item.tags.includes('underwear')) {
            return `<span style="color: ${purple};">${item.name}</span>`;
        }
        return item.name;
    };

    const upperSlot = state.equipment.upper;
    const lowerSlot = state.equipment.lower;

    const upperVisible = upperSlot.outer || upperSlot.middle || upperSlot.skin;
    const lowerVisible = lowerSlot.outer || lowerSlot.middle || lowerSlot.skin;

    // --- Part 1: Determine what is being worn visibly ---
    const clothingParts = [];
    if (upperVisible) {
        clothingParts.push(formatItemName(upperVisible, true));
    }
    // Only add the lower item to the description if it's not covered by the upper item.
    const upperCoversGroin = upperVisible && upperVisible.covers.includes('groin');
    if (!upperCoversGroin && lowerVisible) {
        clothingParts.push(formatItemName(lowerVisible, true));
    }

    // --- Part 2: Determine what parts are exposed ---
    const exposureParts = [];
    // Use the coverage map for accurate exposure checks
    if (!coverageMap.has('left_breast')) { // Check one breast as a proxy for both
        const breastDescText = state.playerBody.left_breast.descriptor ? `${state.playerBody.left_breast.descriptor} ` : '';
        exposureParts.push(`Your ${breastDescText}breasts are exposed!`);
    }
    if (!coverageMap.has('vagina')) {
        const vaginaDescText = state.playerBody.vagina.descriptor ? `${state.playerBody.vagina.descriptor} ` : '';
        exposureParts.push(`Your ${vaginaDescText}vagina is exposed!`);
    }

    // --- Part 3: Construct the final description ---

    // Handle completely naked case
    if (clothingParts.length === 0 && exposureParts.length > 0) {
        descEl.innerHTML = `<span style="color: ${red};">You are completely naked!</span>`;
        return;
    }

    // 1. Start with the "wearing" part.
    let finalDesc = `You are wearing ${clothingParts.join(' and ')}`;

    // 2. Append the "underneath" part.
    const actuallyUnderUpper = upperSlot.skin && upperSlot.skin.tags.includes('underwear') && (upperSlot.middle || upperSlot.outer);
    const actuallyUnderLower = lowerSlot.skin && lowerSlot.skin.tags.includes('underwear') && (lowerSlot.middle || lowerSlot.outer);

    const underPartsToShow = [];
    if (actuallyUnderUpper) {
        underPartsToShow.push(upperSlot.skin);
    }
    if (actuallyUnderLower) {
        underPartsToShow.push(lowerSlot.skin);
    }
    const finalUnderParts = [...new Set(underPartsToShow)];

    const upperSkinNonUnderwear = upperSlot.skin && !upperSlot.skin.tags.includes('underwear');
    const lowerSkinNonUnderwear = lowerSlot.skin && !lowerSlot.skin.tags.includes('underwear');
    const hasAnyOuterwear = upperSlot.middle || upperSlot.outer || lowerSlot.middle || lowerSlot.outer || upperSkinNonUnderwear || lowerSkinNonUnderwear;

    if (hasAnyOuterwear) {
        if (finalUnderParts.length > 0) {
            finalDesc += ` with ${finalUnderParts.map(item => formatItemName(item, false)).join(' and ')} underneath`;
        } else {
            finalDesc += ` with <span style="color: ${purple};">nothing</span> underneath`;
        }
    }
    finalDesc += '.';

    // 3. Append the "exposure" part as a new sentence.
    if (exposureParts.length > 0) {
        finalDesc += ` <span style="color: ${red};">${exposureParts.join(' ')}</span>`;
    }

    // --- Part 4: Add Semen Descriptions ---
    if (state.bodyFluids) {
        const semenDescParts = [];
        const bodySemen = state.bodyFluids.body.semen.reduce((acc, s) => acc + s.volume, 0);
        const vaginaSemen = state.bodyFluids.vagina.semen.reduce((acc, s) => acc + s.volume, 0);
    const anusSemen = state.bodyFluids.anus.semen.reduce((acc, s) => acc + s.volume, 0);
    const mouthSemen = state.bodyFluids.mouth.semen.reduce((acc, s) => acc + s.volume, 0);

    if (bodySemen > 50) {
        semenDescParts.push("You are drenched in cum.");
    } else if (bodySemen > 20) {
        semenDescParts.push("You are covered in cum.");
    } else if (bodySemen > 0) {
        semenDescParts.push("You have some cum on you.");
    }

    if (vaginaSemen > 30) {
        semenDescParts.push("Your womb is bloated with semen.");
    } else if (vaginaSemen > 10) {
        semenDescParts.push("Semen is dripping from your vagina.");
    } else if (vaginaSemen > 0) {
        semenDescParts.push("You are wet with semen inside.");
    }

    if (anusSemen > 30) {
        semenDescParts.push("Your bowels are overflowing with semen.");
    } else if (anusSemen > 10) {
        semenDescParts.push("Semen is dripping from your anus.");
    } else if (anusSemen > 0) {
        semenDescParts.push("Your anus is filled with semen.");
    }

    if (mouthSemen > 15) {
        semenDescParts.push("You keep coughing up semen.");
    } else if (mouthSemen > 5) {
        semenDescParts.push("Your mouth is full of semen.");
    } else if (mouthSemen > 0) {
        semenDescParts.push("You have semen in your mouth.");
    }

    if (semenDescParts.length > 0) {
        finalDesc += ` <span style="color: #ff99ff;">${semenDescParts.join(' ')}</span>`;
    }
    }


    descEl.innerHTML = finalDesc;
}


function equipItem(itemId, subSlot) { // subSlot can be layer, hand, or null for 'back'
    const itemIndex = state.inventory.findIndex(i => i.id === itemId);
    if (itemIndex === -1) { console.error(`Item "${itemId}" not found.`); return; }

    const item = state.inventory[itemIndex];
    const targetSlotId = item.slot;
    const slot = state.equipment[targetSlotId];

    if (!slot) { console.error(`Slot "${targetSlotId}" not found.`); return; }

    // Determine what's currently equipped in the target location
    let currentlyEquippedItem = null;
    if (slot instanceof BackSlot) {
        currentlyEquippedItem = slot.item;
    } else if (slot instanceof HandHeldSlot && slot.hasOwnProperty(subSlot)) {
        currentlyEquippedItem = slot[subSlot];
    } else if (slot instanceof EquipmentSlot && slot.hasOwnProperty(subSlot)) {
        currentlyEquippedItem = slot[subSlot];
    }

    // If an item is there, move it to inventory
    if (currentlyEquippedItem) {
        state.inventory.push(currentlyEquippedItem);
    }

    // Equip the new item
    if (slot instanceof BackSlot) {
        slot.item = item;
    } else if (slot instanceof HandHeldSlot && slot.hasOwnProperty(subSlot)) {
        slot[subSlot] = item; // 'left' or 'right'
    } else if (slot instanceof EquipmentSlot && slot.hasOwnProperty(subSlot)) {
        slot[subSlot] = item; // 'skin', 'middle', 'outer'
    } else {
        console.error(`Cannot equip to invalid slot type for ${targetSlotId}`);
        if (currentlyEquippedItem) { state.inventory.pop(); } // Revert if equip fails
        return;
    }

    // Remove the newly equipped item from inventory
    state.inventory.splice(itemIndex, 1);
    // Sort inventory alphabetically for consistency, useful for UI
    state.inventory.sort((a, b) => a.name.localeCompare(b.name));
}

function unequipItem(slotId, subSlot) { // subSlot is layer, hand, or null
    const slot = state.equipment[slotId];
    if (!slot) {
        console.error(`Slot "${slotId}" not found.`);
        return;
    }

    let itemToUnequip = null;

    // The subSlot for BackSlot is 'item' as defined in wardrobe.js
    if (slot instanceof BackSlot) {
        itemToUnequip = slot.item;
        slot.item = null;
    } else if (slot instanceof HandHeldSlot && slot.hasOwnProperty(subSlot)) {
        itemToUnequip = slot[subSlot];
        slot[subSlot] = null;
    } else if (slot instanceof EquipmentSlot && slot.hasOwnProperty(subSlot)) {
        itemToUnequip = slot[subSlot];
        slot[subSlot] = null;
    }

    if (itemToUnequip) {
        state.inventory.push(itemToUnequip);
        // Sort inventory alphabetically for consistency
        state.inventory.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        // This log can be noisy if a slot type isn't handled above, so let's be specific.
        // console.log(`Nothing to unequip from ${slotId} -> ${subSlot}`);
    }
}

function getCoverageInfo() {
    const coverageMap = new Map(); // bodyPartId -> ClothingItem

    // Helper to process a slot by iterating from outer to inner layers
    const processSlot = (slot) => {
        const layers = ['outer', 'middle', 'skin'];
        for (const layer of layers) {
            const item = slot[layer];
            if (item && item.covers) {
                item.covers.forEach(partId => {
                    // Only set the coverage if it's not already set by a higher layer
                    if (!coverageMap.has(partId)) {
                        coverageMap.set(partId, item);
                    }
                });
            }
        }
    };

    // Iterate over all layered equipment slots
    ['head', 'neck', 'upper', 'lower', 'waist', 'arms', 'hands', 'legs', 'feet'].forEach(slotId => {
        const slot = state.equipment[slotId];
        if (slot instanceof EquipmentSlot) {
            processSlot(slot);
        }
    });

    // Non-layered slots can be added here if needed.

    return coverageMap;
}
