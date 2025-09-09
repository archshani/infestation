function isSaveDataValid(saveData) {
    if (!saveData || typeof saveData !== 'object') return false;
    if (!saveData.state || typeof saveData.state !== 'object') return false;

    const s = saveData.state;
    const requiredKeys = ['currentTime', 'money', 'needs', 'skills', 'npcs', 'journal', 'currentLocation', 'scenes'];
    for (const key of requiredKeys) {
        if (!(key in s)) {
            console.error(`Save data validation failed: Missing key "${key}"`);
            return false;
        }
    }
    return true;
}

function buildLoadScreen() {
    const body = document.querySelector('#loadBtn-overlay .overlayBody');
    if (!body) return;

    let slotsHtml = '';
    for (let i = 1; i <= 10; i++) {
        const saveKey = `infestation_save_${i}`;
        const savedData = localStorage.getItem(saveKey);
        let slotName = "Empty Slot";
        let slotDate = "";

        if (savedData) {
            const data = JSON.parse(savedData);
            slotName = data.name;
            slotDate = new Date(data.date).toLocaleString();
        }

        slotsHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 0.0625rem solid #444;">
                <div style="flex-grow: 1;">
                    <span style="font-weight: bold;">${i}: ${slotName}</span>
                    <span style="font-size: 0.8em; color: #aaa; margin-left: 1rem;">${slotDate}</span>
                </div>
                <div>
                    <button class="overlayBtn" disabled>Save</button>
                    <button class="overlayBtn" onclick="loadGame(${i})" ${!savedData ? 'disabled' : ''}>Load</button>
                    <button class="overlayBtn" disabled>Export</button>
                </div>
            </div>
        `;
    }

    body.innerHTML = `
        <div style="flex-grow: 1;">${slotsHtml}</div>
        <div style="padding-top: 1rem; text-align: right;">
            <button class="overlayBtn" onclick="importGame()">Import</button>
        </div>
    `;
}

function buildSavesOverlay() {
    const body = document.querySelector('#btnSaves-overlay .overlayBody');
    if (!body) return;

    let slotsHtml = '';
    for (let i = 1; i <= 10; i++) {
        const saveKey = `infestation_save_${i}`;
        const savedData = localStorage.getItem(saveKey);
        let slotName = "Empty Slot";
        let slotDate = "";

        if (savedData) {
            const data = JSON.parse(savedData);
            slotName = data.name;
            slotDate = new Date(data.date).toLocaleString();
        }

        slotsHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 0.0625rem solid #444;">
                <div style="flex-grow: 1;">
                    <span style="font-weight: bold;">${i}: ${slotName}</span>
                    <span style="font-size: 0.8em; color: #aaa; margin-left: 1rem;">${slotDate}</span>
                </div>
                <div>
                    <button class="overlayBtn" onclick="saveGame(${i})">Save</button>
                    <button class="overlayBtn" onclick="loadGame(${i})" ${!savedData ? 'disabled' : ''}>Load</button>
                    <button class="overlayBtn" onclick="exportGame(${i})" ${!savedData ? 'disabled' : ''}>Export</button>
                </div>
            </div>
        `;
    }

    body.innerHTML = `
        <div style="flex-grow: 1;">${slotsHtml}</div>
        <div style="padding-top: 1rem; text-align: right;">
            <button class="overlayBtn" onclick="importGame()">Import</button>
        </div>
    `;
}

function getSaveStateObject() {
    // 1. Define keys for properties that represent player state and should be saved.
    const stateToSave = [
        'currentTime', 'money', 'eventIndex', 'needs', 'skills', 'sex', 'playerBody',
        'appearance', 'equipment', 'inventory', 'unequippedPiercings', 'stats', 'womb',
        'menstrualCycle', 'pregnancy', 'parasite', 'npcs', 'settings', 'ui',
        'currentLocation', 'locationBeforeEvent'
    ];

    const savedState = {};

    // 2. Selectively copy the state properties into the new object.
    for (const key of stateToSave) {
        if (state.hasOwnProperty(key)) {
            savedState[key] = state[key];
        }
    }

    // 3. Handle the journal separately for forward compatibility.
    savedState.journal = {
        notes: state.journal.notes,
        reminders: state.journal.reminders,
        recurringReminders: state.journal.recurringReminders,
        quests: {} // Save quest *progress* only, not definitions.
    };

    state.journal.quests.forEach(q => {
        savedState.journal.quests[q.title] = {
            complete: q.complete,
            hidden: q.hidden
        };
    });

    return savedState;
}

function saveGame(slotId) {
    const overlay = document.getElementById('save-prompt-overlay');
    const input = document.getElementById('save-name-input');
    const confirmBtn = document.getElementById('save-confirm-btn');
    const cancelBtn = document.getElementById('save-cancel-btn');

    // Check for existing save to pre-fill the name
    const saveKey = `infestation_save_${slotId}`;
    const existingSave = localStorage.getItem(saveKey);
    if (existingSave) {
        input.value = JSON.parse(existingSave).name;
    } else {
        input.value = `Save Slot ${slotId}`;
    }

    // Store the slotId on the button so the handler can access it
    confirmBtn.dataset.slotId = slotId;

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            // Trigger the confirm button's click handler
            confirmBtn.click();
        }
    };

    const cleanupAndClose = () => {
        overlay.style.display = 'none';
        input.removeEventListener('keydown', handleEnterKey);
    };

    // Define what the buttons do
    confirmBtn.onclick = () => {
        const newSaveName = input.value.trim();
        if (!newSaveName) {
            alert("Save name cannot be empty.");
            return;
        }

        const saveData = {
            name: newSaveName,
            date: new Date().toISOString(),
            state: state
        };

        try {
            localStorage.setItem(`infestation_save_${slotId}`, JSON.stringify(saveData));
            buildSavesOverlay(); // Refresh the saves screen
            cleanupAndClose(); // Hide prompt and clean up listener
        } catch (e) {
            alert("Error saving game: Your browser's storage might be full.");
            console.error("Save failed: ", e);
        }
    };

    cancelBtn.onclick = cleanupAndClose;

    // Show the overlay and add the listener
    input.addEventListener('keydown', handleEnterKey);
    overlay.style.display = 'block';
    input.focus(); // Focus the input field for convenience
}

function loadState(newState) {
    try {
        // A simple deep copy for the main state properties
        Object.keys(newState).forEach(key => {
            if (key === 'currentTime') {
                state.currentTime = new Date(newState.currentTime);
            } else if (key !== 'equipment' && key !== 'inventory') { // Defer hydration
                state[key] = newState[key];
            }
        });

        // Re-hydrate equipment
        const hydratedEquipment = {};
        for (const slotId in newState.equipment) {
            const loadedSlot = newState.equipment[slotId];
            if (!loadedSlot) continue;

            if (loadedSlot.hasOwnProperty('skin')) { // EquipmentSlot
                const newSlot = new EquipmentSlot(loadedSlot.id, loadedSlot.name);
                ['skin', 'middle', 'outer'].forEach(layer => {
                    if (loadedSlot[layer]) {
                        newSlot[layer] = new ClothingItem(loadedSlot[layer]);
                    }
                });
                hydratedEquipment[slotId] = newSlot;
            } else if (loadedSlot.hasOwnProperty('left')) { // HandHeldSlot
                const newSlot = new HandHeldSlot(loadedSlot.name);
                if (loadedSlot.left) newSlot.left = new ClothingItem(loadedSlot.left);
                if (loadedSlot.right) newSlot.right = new ClothingItem(loadedSlot.right);
                hydratedEquipment[slotId] = newSlot;
            } else if (loadedSlot.hasOwnProperty('item')) { // BackSlot
                const newSlot = new BackSlot(loadedSlot.name);
                if (loadedSlot.item) newSlot.item = new ClothingItem(loadedSlot.item);
                hydratedEquipment[slotId] = newSlot;
            } else {
                hydratedEquipment[slotId] = loadedSlot; // Fallback
            }
        }
        state.equipment = hydratedEquipment;

        // Re-hydrate inventory items
        state.inventory = newState.inventory.map(itemData => new ClothingItem(itemData));

        switchScreen('gameScreen');
        fullUiRefresh();
        closeAllOverlays();
    } catch (e) {
        alert("Error loading game state: The save data may be corrupt.");
        console.error("Load failed: ", e);
    }
}

function loadGame(slotId) {
    const saveDataString = localStorage.getItem(`infestation_save_${slotId}`);
    if (!saveDataString) {
        alert("No save data found in this slot.");
        return;
    }

    try {
        const saveData = JSON.parse(saveDataString);
        if (!isSaveDataValid(saveData)) {
            throw new Error("Save data is corrupted or invalid.");
        }
        loadState(saveData.state);
    } catch (e) {
        alert(`Error loading game: ${e.message}`);
        console.error("Load failed: ", e);
    }
}

function exportGame(slotId) {
    const saveDataString = localStorage.getItem(`infestation_save_${slotId}`);
    if (!saveDataString) {
        alert("No save data in this slot to export.");
        return;
    }

    const blob = new Blob([saveDataString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infestation_save_${slotId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importGame() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,application/json';

    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const saveDataString = event.target.result;
            try {
                const saveData = JSON.parse(saveDataString);
                if (!isSaveDataValid(saveData)) {
                    throw new Error("Imported file is not a valid save file.");
                }
                loadState(saveData.state);
            } catch (err) {
                alert(`Failed to import save data: ${err.message}`);
                console.error("Import failed: ", err);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

function fullUiRefresh() {
    updateHeader();
    updateNeedsUI();
    updateCharDesc();
    initBottomButtons();
    applySettings();
    applyCheatsUI();

    // Re-render the main area based on current location
    if (state.currentLocation === 'event_intro') {
        showCurrentEvent();
    } else {
        renderScene(state.currentLocation);
    }
}
