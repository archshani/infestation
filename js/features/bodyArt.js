/* ==============================================================
   PIERCING LOGIC (New Crafting System)
   ============================================================== */
function initPiercingTab() {
    const template = piercingTemplates.standard_stud;
    const locationSelect = document.getElementById('piercing-location-select');
    const materialSelect = document.getElementById('piercing-material-select');
    const styleSelect = document.getElementById('piercing-style-select');

    // Filter allowed tags into locations, materials, and styles
    const allLocationTags = template.allowedTags.filter(t => state.playerBody[t]);
    const materialTags = template.allowedTags.filter(t => piercingMaterialTags.includes(t));
    const styleTags = template.allowedTags.filter(t => piercingStyleTags.includes(t));

    // Sort location tags according to the master body part order
    const sortedLocationTags = bodyPartOrder.filter(p => allLocationTags.includes(p));

    locationSelect.innerHTML = sortedLocationTags.map(partId => `<option value="${partId}">${state.playerBody[partId].name}</option>`).join('');
    materialSelect.innerHTML = materialTags.map(mat => `<option value="${mat}">${mat}</option>`).join('');
    styleSelect.innerHTML = styleTags.map(sty => `<option value="${sty}">${sty}</option>`).join('');

    updatePiercingPreview();
}

function updatePiercingPreview() {
    const template = piercingTemplates.standard_stud;
    const location = document.getElementById('piercing-location-select').value;
    const material = document.getElementById('piercing-material-select').value;
    const style = document.getElementById('piercing-style-select').value;

    const jewelryEl = document.getElementById('piercing-preview-jewelry');
    const nameEl = document.getElementById('piercing-preview-name');
    const costBtn = document.getElementById('get-piercing-btn');

    let finalCost = template.baseCost;
    if (material === 'silver') finalCost += 50;
    if (material === 'gold') finalCost += 150;
    if (material === 'titanium') finalCost += 75;
    if (style === 'ring') finalCost += 20;
    if (style === 'barbell') finalCost += 30;
    if (style === 'horseshoe') finalCost += 40;

    const finalJewelry = `a ${material} ${style}`;
    const finalName = `${material.charAt(0).toUpperCase() + material.slice(1)} ${style.charAt(0).toUpperCase() + style.slice(1)}`;

    jewelryEl.textContent = finalJewelry;
    nameEl.textContent = finalName;
    costBtn.textContent = `Get Piercing (${formatMoney(finalCost)})`;
    costBtn.dataset.cost = finalCost;
}

function getPiercing() {
    const location = document.getElementById('piercing-location-select').value;
    const cost = parseFloat(document.getElementById('get-piercing-btn').dataset.cost);

    if (state.money < cost) {
        showErrorNotification("You don't have enough money.");
        return;
    }

    state.money -= cost;
    const name = document.getElementById('piercing-preview-name').textContent;
    const jewelry = document.getElementById('piercing-preview-jewelry').textContent;
    const material = document.getElementById('piercing-material-select').value;
    const style = document.getElementById('piercing-style-select').value;

    const newPiercing = new PiercingItem({
        id: `piercing_${location}_${Date.now()}`,
        name: name,
        bodyPartId: location,
        jewelry: jewelry,
        tags: [location, material, style]
    });

    // Check if body part already has a piercing
    if (state.playerBody[location].piercings.length > 0) {
        // If occupied, add the new piercing to unequipped storage
        state.unequippedPiercings.push(newPiercing);
        showCraftNotification(newPiercing.name, "sent to storage");
    } else {
        // If free, equip it directly
        state.playerBody[location].piercings.push(newPiercing);
        showCraftNotification(newPiercing.name, "Piercing");
    }

    forceGlobalUIRefresh();
}

function openManagePiercings() {
    closeAllOverlays();
    const overlay = document.getElementById('manage-piercings-overlay');
    overlay.style.display = 'block';

    const equippedList = document.getElementById('equipped-piercings-list');
    const storedList = document.getElementById('stored-piercings-list');
    equippedList.innerHTML = '';
    storedList.innerHTML = '';

    let hasEquipped = false;
    for (const partId in state.playerBody) {
        const part = state.playerBody[partId];
        if (part.piercings && part.piercings.length > 0) {
            hasEquipped = true;
            part.piercings.forEach(p => {
                const div = document.createElement('div');
                div.innerHTML = `<span>${p.name} on your ${part.name}</span>`;
                const btn = document.createElement('button');
                btn.className = 'overlayBtn';
                btn.textContent = 'Unequip';
                btn.onclick = () => unequipPiercingToStorage(p.id, partId);
                div.appendChild(btn);
                equippedList.appendChild(div);
            });
        }
    }
    if (!hasEquipped) {
        equippedList.innerHTML = '<p>No piercings equipped.</p>';
    }

    if (state.unequippedPiercings.length > 0) {
        state.unequippedPiercings.forEach(p => {
            const div = document.createElement('div');
            const partName = state.playerBody[p.bodyPartId].name;
            div.innerHTML = `<span>${p.name} (for ${partName})</span>`;
            const btn = document.createElement('button');
            btn.className = 'overlayBtn';
            btn.textContent = 'Equip';
            btn.onclick = () => equipPiercingFromStorage(p.id);
            div.appendChild(btn);
            storedList.appendChild(div);
        });
    } else {
        storedList.innerHTML = '<p>No piercings in storage.</p>';
    }
}

function unequipPiercingToStorage(piercingId, bodyPartId) {
    const part = state.playerBody[bodyPartId];
    const pIndex = part.piercings.findIndex(p => p.id === piercingId);
    if (pIndex > -1) {
        const [piercing] = part.piercings.splice(pIndex, 1);
        state.unequippedPiercings.push(piercing);
        forceGlobalUIRefresh();
        openManagePiercings(); // Refresh the overlay
    }
}

function equipPiercingFromStorage(piercingId) {
    const pIndex = state.unequippedPiercings.findIndex(p => p.id === piercingId);
    if (pIndex > -1) {
        const [piercing] = state.unequippedPiercings.splice(pIndex, 1);
        const bodyPartId = piercing.bodyPartId;

        // Check if the slot is free before equipping
        if (state.playerBody[bodyPartId].piercings.length > 0) {
            showErrorNotification("That body part is already pierced. You must unequip the current piercing first.");
            state.unequippedPiercings.push(piercing); // Put it back
            return;
        }

        state.playerBody[bodyPartId].piercings.push(piercing);
        forceGlobalUIRefresh();
        openManagePiercings(); // Refresh the overlay
    }
}

function openBodyArtStudio() {
    closeAllOverlays();
    const overlay = document.getElementById('body-art-studio-overlay');
    overlay.style.display = 'block';

    // Populate body part dropdown for tattoos, in the correct order
    const tattooPartSelect = document.getElementById('tattoo-body-part-select');
    const allTattooParts = bodyPartOrder.filter(p => tattooTemplates[p]);
    tattooPartSelect.innerHTML = allTattooParts.map(partId => `<option value="${partId}">${state.playerBody[partId].name}</option>`).join('');

    // Set default tab and populate its content
    showBodyArtTab('tattoos');
}

function showBodyArtTab(tabName) {
    document.querySelectorAll('.body-art-tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(`body-art-tab-${tabName}`).style.display = 'flex';

    if (tabName === 'tattoos') {
        onTattooPartSelect();
        populateCurrentTattoos();
    } else if (tabName === 'piercings') {
        initPiercingTab();
    }
}

function removeTattoo(tattooId, bodyPartId) {
    const removalCost = 5000;
    if (state.money < removalCost) {
        showErrorNotification("You can't afford the removal fee.");
        return;
    }
    const bodyPart = state.playerBody[bodyPartId];
    if (!bodyPart) return;

    const tattooIndex = bodyPart.tattoos.findIndex(t => t.id === tattooId);
    if (tattooIndex > -1) {
        state.money -= removalCost;
        bodyPart.tattoos.splice(tattooIndex, 1);
        forceGlobalUIRefresh();
        populateCurrentTattoos(); // Refresh the removal list
    }
}

function onTattooPartSelect() {
    const partId = document.getElementById('tattoo-body-part-select').value;
    const templateNameEl = document.getElementById('tattoo-template-name');
    const tagsWrapper = document.getElementById('tattoo-tags-sections-wrapper');
    const nameInput = document.getElementById('tattoo-name-input');

    const template = tattooTemplates[partId] || tattooTemplates['custom_text']; // Fallback to custom text

    if (!template) {
        // This should not happen if all body parts are covered
        tagsWrapper.style.display = 'none';
        templateNameEl.textContent = 'N/A';
        updateTattooPreview();
        return;
    }

    // Set the template name and show the tags
    templateNameEl.textContent = template.name;
    tagsWrapper.style.display = 'flex';
    nameInput.value = ''; // Clear name input on part change

    const createCheckboxes = (containerId, tags, category) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        if (!template.allowedTags) {
            document.getElementById(containerId.replace('-tags-container', '-section')).style.display = 'none';
            return;
        }
        const allowed = tags.filter(tag => template.allowedTags.includes(tag));
        if (allowed.length === 0) {
            document.getElementById(containerId.replace('-tags-container', '-section')).style.display = 'none';
            return;
        }
        document.getElementById(containerId.replace('-tags-container', '-section')).style.display = 'block';

        allowed.forEach(tag => {
            const label = document.createElement('label');
            const inputEl = document.createElement('input');
            inputEl.type = (category === 'theme') ? 'radio' : 'checkbox';
            inputEl.name = `tattoo-tag-${category}`;
            inputEl.value = tag;
            inputEl.onclick = () => updateTattooPreview();
            if (template.forcedTags && template.forcedTags.includes(tag)) {
                inputEl.checked = true;
                inputEl.disabled = true;
            }
            label.appendChild(inputEl);
            label.appendChild(document.createTextNode(` ${tag}`));
            container.appendChild(label);
        });
    };

    createCheckboxes('tattoo-style-tags-container', tattooStyleTags, 'style');
    createCheckboxes('tattoo-feature-tags-container', tattooFeatureTags, 'feature');
    createCheckboxes('tattoo-size-tags-container', tattooSizeTags, 'size');
    createCheckboxes('tattoo-theme-tags-container', tattooThemeTags, 'theme');

    const textSection = document.getElementById('tattoo-text-section');
    const isCustomText = template.baseDesign.includes('{text}');
    textSection.style.display = isCustomText ? 'block' : 'none';
    if (isCustomText) {
        document.getElementById('tattoo-custom-text').value = '';
    }

    updateTattooPreview();
}


function updateTattooPreview() {
    const partId = document.getElementById('tattoo-body-part-select').value;
    const template = tattooTemplates[partId] || tattooTemplates['custom_text'];

    const designEl = document.getElementById('tattoo-preview-design');
    const tagsEl = document.getElementById('tattoo-final-tags-list');
    const costBtn = document.getElementById('get-tattoo-btn');

    designEl.textContent = '';
    tagsEl.innerHTML = '';
    costBtn.textContent = 'Get Tattoo';
    costBtn.disabled = true;

    if (!template) return;

    const finalTags = new Set(template.forcedTags || []);
    let finalCost = template.baseCost;

    document.querySelectorAll('#tattoo-tags-sections-wrapper input:checked').forEach(cb => {
        finalTags.add(cb.value);
    });

    let finalDesign = template.baseDesign;
    if (finalDesign.includes('{text}')) {
        const customText = document.getElementById('tattoo-custom-text').value;
        if (customText) {
            finalDesign = finalDesign.replace('{text}', `"${customText}"`);
        } else {
            finalDesign = finalDesign.replace('{text}', '..._');
        }
    }

    finalTags.forEach(tag => {
        if (tattooTagPrices[tag]) {
            finalCost += tattooTagPrices[tag];
        }
    });

    designEl.textContent = finalDesign;
    const displayTags = Array.from(finalTags).filter(t => t !== 'none');
    tagsEl.innerHTML = displayTags.sort().map(tag => `<li>${tag}</li>`).join('');
    costBtn.textContent = `Get Tattoo (${formatMoney(finalCost)})`;
    costBtn.disabled = false;
    costBtn.dataset.cost = finalCost;
}

function getTattoo() {
    const partId = document.getElementById('tattoo-body-part-select').value;
    const name = document.getElementById('tattoo-name-input').value.trim();
    const cost = parseFloat(document.getElementById('get-tattoo-btn').dataset.cost);

    if (!name) {
        showErrorNotification("Please enter a name for your tattoo.");
        return;
    }

    // Mandatory tag check
    const selectedTagsSet = new Set(Array.from(document.querySelectorAll('#tattoo-tags-sections-wrapper input:checked')).map(cb => cb.value));
    const checkCategory = (sectionId, tagArray, categoryName) => {
        const section = document.getElementById(sectionId);
        if (section.style.display !== 'none' && !tagArray.some(tag => selectedTagsSet.has(tag))) {
            showErrorNotification(`Please select at least one ${categoryName} for your tattoo.`);
            return false;
        }
        return true;
    };

    if (!checkCategory('tattoo-style-section', tattooStyleTags, 'Style')) return;
    if (!checkCategory('tattoo-feature-section', tattooFeatureTags, 'Feature')) return;
    if (!checkCategory('tattoo-size-section', tattooSizeTags, 'Size')) return;
    if (!checkCategory('tattoo-theme-section', tattooThemeTags, 'Theme')) return;

    if (!partId) {
        showErrorNotification("Please select a body part.");
        return;
    }
    if (state.money < cost) {
        showErrorNotification("You don't have enough money.");
        return;
    }

    // Check if body part already has a tattoo
    if (state.playerBody[partId].tattoos.length > 0) {
        showErrorNotification("This body part already has a tattoo. Please remove the existing one first.");
        return;
    }

    const design = document.getElementById('tattoo-preview-design').textContent;
    const tagsList = document.getElementById('tattoo-final-tags-list');
    let tags = Array.from(tagsList.querySelectorAll('li')).map(li => li.textContent);

    // Filter out the 'none' tag if it exists
    if (tags.includes('none')) {
        tags = tags.filter(t => t !== 'none');
    }

    state.money -= cost;
    const newTattoo = new TattooItem({
        id: `tattoo_${Date.now()}`,
        name: name,
        design: design,
        tags: tags
    });

    state.playerBody[partId].tattoos.push(newTattoo);

    forceGlobalUIRefresh();
    populateCurrentTattoos();
}

function populateCurrentTattoos() {
    const container = document.getElementById('current-tattoos-container');
    container.innerHTML = '';
    let hasTattoos = false;

    for (const partId in state.playerBody) {
        const part = state.playerBody[partId];
        if (part.tattoos && part.tattoos.length > 0) {
            hasTattoos = true;
            part.tattoos.forEach(tattoo => {
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.justifyContent = 'space-between';
                div.style.marginBottom = '0.5rem';
                div.innerHTML = `<span>${tattoo.name} on your ${part.name}</span>`;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'overlayBtn';
                removeBtn.textContent = 'Remove';
                removeBtn.onclick = () => removeTattoo(tattoo.id, partId);

                div.appendChild(removeBtn);
                container.appendChild(div);
            });
        }
    }

    if (!hasTattoos) {
        container.innerHTML = '<p>You have no tattoos.</p>';
    }
}
