Object.assign(state.scenes, scenes);

function quickStartDebug() {
    initCreationScreen(); // This randomizes the UI
    finalizeCharacterFromUI(); // This reads the randomized UI into the state
    startGame({ initialMoney: 250000, skipIntro: true });
}

function startGame(options = {}) {
    const { initialMoney = 0.00, skipIntro = false } = options;

    initMenstrualCycle();
    switchScreen('gameScreen');

    state.money = initialMoney;
    if (skipIntro) {
        for (const npcName in state.npcs) {
            state.npcs[npcName].hidden = false;
        }
    }

    // UI updates
    updateHeader();
    updateNeedsUI();
    initBottomButtons();
    initCalendar();
    buildCheatOverlay();
    applySettings();
    applyCheatsUI();

    // Equip starting gear
    const startingGear = [
        'upper_bra', 'lower_panties', 'upper_tshirt', 'lower_jeans', 'feet_sneakers'
    ];
    state.inventory = startingGear.map(templateId => {
        const template = clothingTemplates[templateId];
        return new ClothingItem({
            ...template,
            templateId: template.id,
            name: `Plain ${template.name}`,
            id: `${template.id}_${Date.now()}_${Math.random()}`
        });
    });
    const bra = state.inventory.find(i => i.name === 'Plain Bra');
    if (bra) equipItem(bra.id, 'skin');
    const panties = state.inventory.find(i => i.name === 'Plain Panties');
    if (panties) equipItem(panties.id, 'skin');
    const tshirt = state.inventory.find(i => i.name === 'Plain T-shirt');
    if (tshirt) equipItem(tshirt.id, 'middle');
    const jeans = state.inventory.find(i => i.name === 'Plain Jeans');
    if (jeans) equipItem(jeans.id, 'middle');
    const sneakers = state.inventory.find(i => i.name === 'Plain Sneakers');
    if (sneakers) equipItem(sneakers.id, 'outer');

    updateCharDesc();

    if (skipIntro) {
        state.storyEventActive = false;
        goToScene('foyer', 30);
    } else {
        state.storyEventActive = true;
        // --- HIDE SIDEBAR ELEMENTS DURING INTRO ---
        const sidebar = document.getElementById('sidebar');
        Array.from(sidebar.children).forEach(child => {
            if (child.id !== 'bottomButtons') {
                child.style.display = 'none';
            }
        });
        const bottomButtons = document.getElementById('bottomButtons');
        Array.from(bottomButtons.children).forEach(child => {
            if (child.id !== 'btnSettings' && child.id !== 'btnSaves') {
                child.style.display = 'none';
            }
        });

        showCurrentEvent();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    processClothingRules(); // Process all template rules once on load

    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            initCreationScreen();
            switchScreen('creationScreen');
        });
    }

    const loadBtn = document.getElementById('loadBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', () => openOverlay('loadBtn'));
    }

    const quickStartBtn = document.getElementById('quickStartBtn');
    if (quickStartBtn) {
        quickStartBtn.addEventListener('click', quickStartDebug);
    }

    const finalizeBtn = document.getElementById('finalizeBtn');
    if(finalizeBtn) {
        finalizeBtn.addEventListener('click', () => {
            finalizeCharacterFromUI();
            startGame();
        });
    }

    // Global key handler
    document.addEventListener('keydown', (e) => {
        // Don't interfere with text input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'Escape') {
            const subOverlay = document.getElementById('sub-overlay');
            if (subOverlay && subOverlay.style.display === 'block') {
                subOverlay.style.display = 'none';
                return; // Prioritize closing the sub-overlay
            }

            const calOverlay = document.getElementById('calendar-overlay');
            if (calOverlay && calOverlay.style.display === 'block') {
                calOverlay.style.display = 'none';
                return; // Close calendar and we're done
            }

            // If no sub-overlay is open, close any main overlay
            const anyOverlayOpen = document.querySelector('.overlay[style*="display: block"]');
            if (anyOverlayOpen) {
                closeAllOverlays();
            }
            return; // Escape's job is done
        }

        // Scene navigation hotkeys
        const keyMap = {
            '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9, '-': 10, '=': 11
        };
        const sceneButtonIndex = keyMap[e.key];
        if (sceneButtonIndex !== undefined) {
            const sceneButtons = document.querySelectorAll('.navColumn .link');
            if (sceneButtons[sceneButtonIndex]) {
                sceneButtons[sceneButtonIndex].click();
            }
        }
    });

    // Global click handler to close tooltips
    document.addEventListener('click', (e) => {
        const subOverlay = document.getElementById('sub-overlay');
        if (subOverlay && subOverlay.style.display === 'block') {
            // Check if the click was outside the sub-overlay
            if (!subOverlay.contains(e.target)) {
                subOverlay.style.display = 'none';
            }
        }
    });
});

function recoverFromArousalMax() {
    state.needs.arousal = 0;
    forceGlobalUIRefresh();
    goToScene('foyer', 60);
}

function recoverFromStressCollapse() {
    state.needs.stress = 350;
    forceGlobalUIRefresh();
    goToScene('foyer', 3600);
}
