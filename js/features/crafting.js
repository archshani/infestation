function goToTailorHub() {
    closeAllOverlays();
    const overlay = document.getElementById('tailor-hub-overlay');
    const buttonsContainer = document.getElementById('tailor-slot-buttons');
    buttonsContainer.innerHTML = ''; // Clear previous buttons

    for (const slotId in state.equipment) {
        // Hand-held is excluded for now as there are no craftable hand-held templates.
        // This avoids showing the player a button that leads to an empty crafting screen.
        if (slotId !== 'hand-held') {
            const slot = state.equipment[slotId];
            const button = document.createElement('button');
            button.className = 'overlayBtn';
            button.textContent = slot.name;
            button.onclick = () => openCraftingOverlay(slotId);
            buttonsContainer.appendChild(button);
        }
    }
    overlay.style.display = 'block';
}

function backToTailorHub() {
    // This function will be called from the crafting overlay to go back to the hub
    document.getElementById('tailor-crafting-overlay').style.display = 'none';
    goToTailorHub();
}

const availableTags = ['athletic', 'bag', 'belly hiding', 'belly showing', 'business', 'casual', 'cool', 'costume', 'cotton', 'denim', 'fetish-wear', 'fishnet', 'formal', 'goth', 'high heeled', 'lace', 'latex', 'leather', 'metal', 'nylon', 'plastic', 'polyester', 'satin', 'sexy', 'silk', 'spandex', 'swimming', 'transparent', 'underwear', 'vinyl', 'wool'];

const materialTags = ['cotton', 'denim', 'fishnet', 'lace', 'latex', 'leather', 'metal', 'nylon', 'plastic', 'polyester', 'satin', 'silk', 'spandex', 'vinyl', 'wool'];
const styleTags = ['athletic', 'business', 'casual', 'cool', 'fetish-wear', 'formal', 'goth', 'sexy'];
const generalTags = ['bag', 'belly hiding', 'belly showing', 'costume', 'high heeled', 'swimming', 'transparent', 'underwear'];

const mutuallyExclusiveTags = [
    ['belly showing', 'belly hiding']
];

const slotSpecificTags = {
    'high heeled': ['feet']
};

function openCraftingOverlay(slotId) {
    document.getElementById('tailor-hub-overlay').style.display = 'none';
    const overlay = document.getElementById('tailor-crafting-overlay');
    const templateSelect = document.getElementById('tailor-template-select');
    const nameInput = document.getElementById('tailor-item-name');
    const tagsWrapper = document.getElementById('tailor-tags-sections-wrapper');

    // Store the current slot in the element for the craft button to use
    overlay.dataset.slotId = slotId;

    // Clear previous content and reset UI state
    templateSelect.innerHTML = '<option value="">--Please choose a template--</option>';
    nameInput.value = '';
    nameInput.disabled = true;
    tagsWrapper.style.display = 'none'; // Hide the tag sections initially

    // Populate templates based on the selected slot
    const templates = Object.values(clothingTemplates).filter(t => t.slot === slotId);
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.name;
        templateSelect.appendChild(option);
    });

    onTemplateSelect(); // Call this to ensure the UI is in a clean initial state
    overlay.style.display = 'block';
}

function onTemplateSelect() {
    const templateSelect = document.getElementById('tailor-template-select');
    const nameInput = document.getElementById('tailor-item-name');
    const tagsWrapper = document.getElementById('tailor-tags-sections-wrapper');
    const coverageList = document.getElementById('tailor-coverage-list');

    // Get containers for new UI
    const materialSection = document.getElementById('tailor-material-section');
    const materialSelect = document.getElementById('tailor-material-select');
    const styleContainer = document.getElementById('tailor-style-tags-container');
    const generalContainer = document.getElementById('tailor-general-tags-container');

    const selectedTemplateId = templateSelect.value;

    // 1. Reset everything to a clean slate.
    coverageList.innerHTML = '';
    materialSelect.innerHTML = '';
    styleContainer.innerHTML = '';
    generalContainer.innerHTML = '';

    if (!selectedTemplateId) {
        nameInput.value = '';
        nameInput.disabled = true;
        tagsWrapper.style.display = 'none';
        updateFinalTagsList();
        updateCraftingCost(); // Update cost to reset button
        return;
    }

    // 2. A template is selected, so enable UI.
    nameInput.disabled = false;
    tagsWrapper.style.display = 'flex'; // Show the whole tag section
    const template = clothingTemplates[selectedTemplateId];
    nameInput.value = template.name;

    const allowed = template.allowedTags || [];
    const forced = template.forcedTags || [];

    // 3. Populate Materials Dropdown
    const availableMaterials = materialTags.filter(t => allowed.includes(t));
    let hasForcedMaterial = false;
    if (availableMaterials.length > 0) {
        materialSelect.innerHTML = '<option value="">-- a material --</option>';
        availableMaterials.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            if (forced.includes(tag)) {
                option.selected = true;
                hasForcedMaterial = true;
            }
            materialSelect.appendChild(option);
        });
        materialSection.style.display = hasForcedMaterial ? 'none' : 'block';
    } else {
        materialSection.style.display = 'none';
    }
    materialSelect.onchange = updateTagAvailability;

    // 4. Populate Style & General Checkboxes
    const createCheckbox = (tag, container) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'tailor-tag';
        checkbox.value = tag;
        checkbox.checked = forced.includes(tag);
        checkbox.onclick = updateTagAvailability;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${tag}`));
        container.appendChild(label);
    };

    styleTags.filter(t => allowed.includes(t)).forEach(t => createCheckbox(t, styleContainer));
    generalTags.filter(t => allowed.includes(t)).forEach(t => createCheckbox(t, generalContainer));

    // 5. Populate coverage list and update UI
    updateCoverageList();
    updateTagAvailability();
}

function updateCoverageList() {
    const coverageList = document.getElementById('tailor-coverage-list');
    const template = clothingTemplates[document.getElementById('tailor-template-select').value];
    coverageList.innerHTML = '';
    if (!template || !template.covers) return;

    let finalCovers = [...template.covers];

    // Check if 'belly showing' is selected
    const bellyShowingCheckbox = document.querySelector('input[name="tailor-tag"][value="belly showing"]');
    if (bellyShowingCheckbox && bellyShowingCheckbox.checked) {
        const bellyIndex = finalCovers.indexOf('belly');
        if (bellyIndex > -1) {
            finalCovers.splice(bellyIndex, 1);
        }
    }

    // Check for transparent and fetish-wear to update the live preview
    const transparentCheckbox = document.querySelector('input[name="tailor-tag"][value="transparent"]');
    const fetishCheckbox = document.querySelector('input[name="tailor-tag"][value="fetish-wear"]');

    if (transparentCheckbox && transparentCheckbox.checked) {
        finalCovers.length = 0; // Clear the array
    } else if (fetishCheckbox && fetishCheckbox.checked) {
        const partsToExpose = ['vagina', 'left_nipple', 'right_nipple'];
        let i = finalCovers.length;
        while (i--) {
            if (partsToExpose.includes(finalCovers[i])) {
                finalCovers.splice(i, 1);
            }
        }
    }

    // Populate the list
    finalCovers.forEach(partName => {
        const li = document.createElement('li');
        li.textContent = state.playerBody[partName] ? state.playerBody[partName].name : partName;
        coverageList.appendChild(li);
    });
}

function updateTagAvailability() {
    const allCheckboxes = Array.from(document.querySelectorAll('input[name="tailor-tag"]'));
    const template = clothingTemplates[document.getElementById('tailor-template-select').value];
    if (!template) return;

    const forced = template.forcedTags || [];
    const allowed = template.allowedTags || [];

    // Enable all allowed checkboxes first
    allCheckboxes.forEach(cb => {
        cb.disabled = !allowed.includes(cb.value);
    });

    // Disable based on mutual exclusion
    const checkedTags = allCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
    checkedTags.forEach(checkedTag => {
        const exclusionGroup = mutuallyExclusiveTags.find(group => group.includes(checkedTag));
        if (exclusionGroup) {
            exclusionGroup.forEach(tagToDisable => {
                if (tagToDisable !== checkedTag) {
                    const checkboxToDisable = allCheckboxes.find(cb => cb.value === tagToDisable);
                    if (checkboxToDisable) checkboxToDisable.disabled = true;
                }
            });
        }
    });

    // Finally, disable all forced tags so they can't be unchecked
    forced.forEach(forcedTag => {
        const checkbox = allCheckboxes.find(cb => cb.value === forcedTag);
        if (checkbox) checkbox.disabled = true;
    });

    updateFinalTagsList();
    updateCraftingCost();
    setTimeout(updateCoverageList, 0);
}

function updateFinalTagsList() {
    const finalTagsList = document.getElementById('tailor-final-tags-list');
    const template = clothingTemplates[document.getElementById('tailor-template-select').value];
    finalTagsList.innerHTML = '';
    if (!template) return;

    const finalTags = new Set(template.tags || []);

    // Add selected material
    const materialSelect = document.getElementById('tailor-material-select');
    if (materialSelect.value) {
        finalTags.add(materialSelect.value);
    }

    // Add checked tags
    document.querySelectorAll('input[name="tailor-tag"]:checked').forEach(cb => {
        finalTags.add(cb.value);
    });

    Array.from(finalTags).sort().forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        finalTagsList.appendChild(li);
    });
}

const tagPrices = {
    'leather': 75,
    'silk': 100,
    'wool': 60,
    'metal': 80,
    'jewelry': 50,
    'fetish-wear': 40,
    'lace': 30,
    'satin': 35,
    'vinyl': 45
};

function updateCraftingCost() {
    const craftButton = document.getElementById('craft-item-btn');
    const templateSelect = document.getElementById('tailor-template-select');
    const selectedTemplateId = templateSelect.value;

    if (!selectedTemplateId) {
        craftButton.textContent = 'Craft Item';
        craftButton.disabled = true;
        return;
    }

    const template = clothingTemplates[selectedTemplateId];
    const fallbackMaterialPrice = 50;
    const fallbackTagPrice = 15;

    // --- Gather all final tags for the item ---
    const finalTags = new Set(template.tags || []);
    if (template.forcedTags) {
        template.forcedTags.forEach(tag => finalTags.add(tag));
    }
    const materialSelect = document.getElementById('tailor-material-select');
    if (materialSelect.value) {
        finalTags.add(materialSelect.value);
    }
    document.querySelectorAll('#tailor-style-tags-container input:checked, #tailor-general-tags-container input:checked').forEach(cb => {
        finalTags.add(cb.value);
    });

    // --- Calculate cost based on new pricing model ---
    let finalCost = 0;
    finalTags.forEach(tag => {
        if (tagPrices.hasOwnProperty(tag)) {
            finalCost += tagPrices[tag];
        } else if (materialTags.includes(tag)) {
            finalCost += fallbackMaterialPrice;
        } else {
            finalCost += fallbackTagPrice;
        }
    });

    craftButton.textContent = `Craft Item (${formatMoney(finalCost)})`;
    craftButton.dataset.cost = finalCost;
    craftButton.disabled = false;
}

function craftItemFromMenu() {
    const templateSelect = document.getElementById('tailor-template-select');
    const nameInput = document.getElementById('tailor-item-name');
    const selectedTemplateId = templateSelect.value;
    const craftButton = document.getElementById('craft-item-btn');
    const cost = parseFloat(craftButton.dataset.cost || '0');

    if (!selectedTemplateId) {
        showErrorNotification("Please select a template first.");
        return;
    }
    const itemName = nameInput.value.trim();
    if (!itemName) {
        showErrorNotification("Please enter a name for the item.");
        return;
    }
    if (state.money < cost) {
        showErrorNotification("You don't have enough money.");
        return;
    }

    const template = clothingTemplates[selectedTemplateId];
    const materialSelect = document.getElementById('tailor-material-select');

    // Check for material selection, if not forced
    const hasForcedMaterial = template.forcedTags && template.forcedTags.some(tag => materialTags.includes(tag));
    if (!hasForcedMaterial && !materialSelect.value) {
        showErrorNotification("Please select a material for this item.");
        return;
    }

    state.money -= cost;
    updateHeader();

    // --- Gather all final tags ---
    const finalTags = new Set(template.tags || []);
    if (template.forcedTags) {
        template.forcedTags.forEach(tag => finalTags.add(tag));
    }
    if (materialSelect.value) {
        finalTags.add(materialSelect.value);
    }
    document.querySelectorAll('#tailor-style-tags-container input:checked, #tailor-general-tags-container input:checked').forEach(cb => {
        finalTags.add(cb.value);
    });

    // --- Create a mutable copy of the covers array ---
    const finalCovers = [...template.covers];

    // --- Dynamic Coverage Logic ---
    if (finalTags.has('belly showing')) {
        const bellyIndex = finalCovers.indexOf('belly');
        if (bellyIndex > -1) {
            finalCovers.splice(bellyIndex, 1);
        }
    }

    // New rules for transparent and fetish-wear
    if (finalTags.has('transparent')) {
        finalCovers.length = 0; // Clear the array
    } else if (finalTags.has('fetish-wear')) {
        const partsToExpose = ['vagina', 'left_nipple', 'right_nipple'];
        let i = finalCovers.length;
        while (i--) {
            if (partsToExpose.includes(finalCovers[i])) {
                finalCovers.splice(i, 1);
            }
        }
    }

    const newItem = new ClothingItem({
        ...template,
        templateId: template.id, // Keep track of the original template
        id: `${template.id}_${Date.now()}`,
        name: itemName,
        tags: Array.from(finalTags),
        covers: finalCovers // Use the potentially modified covers array
    });

    state.inventory.push(newItem);
    showCraftNotification(newItem.name, template.name);

    backToTailorHub();
}
