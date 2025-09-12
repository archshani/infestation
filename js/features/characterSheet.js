/* ==============================================================
   CHARACTER WINDOW
   ============================================================== */
function showCharTab(tabName) {
    document.querySelectorAll('.char-tab').forEach(t => t.style.display = 'none');
    const tab = document.getElementById(`char-${tabName}`);
    if (tab) tab.style.display = 'block';

    if (state.ui) {
        state.ui.lastCharTab = tabName;
    }

    if (tabName === 'status') updateCharStatusTab();
    else if (tabName === 'skills') updateCharSkillsTab();
    else if (tabName === 'stats') updateCharStatsTab();
    else if (tabName === 'inventory') buildInventoryTab();
}

function buildInventoryTab() {
    const inventoryDiv = document.getElementById('char-inventory');
    inventoryDiv.innerHTML = ''; // Clear previous content

    if (state.inventory.length === 0) {
        inventoryDiv.innerHTML = '<p style="padding: 1rem;">Your inventory is empty.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'inventory-grid';

    // Sort inventory alphabetically before displaying
    const sortedInventory = [...state.inventory].sort((a, b) => a.name.localeCompare(b.name));

    sortedInventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = item.name;
        itemDiv.title = item.name; // Show full name on hover if it's truncated
        itemDiv.onclick = (event) => showItemTooltip(event, item);
        grid.appendChild(itemDiv);
    });

    inventoryDiv.appendChild(grid);
}

function updateCharStatusTab() {
    const statusDiv = document.getElementById('char-status');
    if (!statusDiv) return;

    let html = '<h4>Appearance</h4>';
    html += generateCharacterDescription(state.appearance, state.playerBody, false);

    html += '<h4 style="margin-top: 1.5rem;">Tattoos & Piercings</h4>';
    const coverageMap = getCoverageInfo();
    const piercingDescriptions = [];
    const tattooDescriptions = [];

    // Iterate through all body parts to gather piercings.
    Object.values(state.playerBody).forEach(part => {
        if (part.piercings && part.piercings.length > 0) {
            part.piercings.forEach(piercing => {
                const isVisible = !coverageMap.has(part.id);
                const visibleBlue = '#ADD8E6';
                const hiddenBlue = 'lightblue';
                let visibilityHtml = isVisible
                    ? `<span style="color: ${visibleBlue};">It is currently visible.</span>`
                    : `<span style="color: ${hiddenBlue};">It isn't currently visible.</span>`;
                piercingDescriptions.push(`<li>Your ${part.name.toLowerCase()} is pierced with a ${piercing.name}. ${visibilityHtml}</li>`);
            });
        }
    });

    // Iterate through all body parts again to gather tattoos.
    Object.values(state.playerBody).forEach(part => {
        if (part.tattoos && part.tattoos.length > 0) {
            part.tattoos.forEach(tattoo => {
                const isVisible = !coverageMap.has(part.id);
                const isSexual = tattoo.tags.some(t => tattooThemeTags.includes(t) && t !== 'none');
                const exposureRed = '#ff4d4d';
                const visibleBlue = '#ADD8E6';
                const hiddenBlue = 'lightblue';

                let nameHtml = isSexual
                    ? `<span style="color: ${exposureRed};">"${tattoo.name}"</span>`
                    : `<span style="color: ${hiddenBlue};">"${tattoo.name}"</span>`;

                let visibilityHtml = '';
                if (isVisible) {
                    const color = isSexual ? exposureRed : visibleBlue;
                    visibilityHtml = `<span style="color: ${color};">It is currently visible.</span>`;
                } else {
                    visibilityHtml = `<span style="color: ${hiddenBlue};">It isn't currently visible.</span>`;
                }
                tattooDescriptions.push(`<li>${nameHtml} has been tattooed on your ${part.name.toLowerCase()}. ${visibilityHtml}</li>`);
            });
        }
    });

    const allModsHtml = piercingDescriptions.join('') + tattooDescriptions.join('');

    if (allModsHtml.length > 0) {
        html += '<ul>' + allModsHtml + '</ul>';
    } else {
        html += '<p>You have no body modifications.</p>';
    }

    statusDiv.innerHTML = html;
}

function updateCharSkillsTab() {
    const skillsDiv = document.getElementById('char-skills');
    if (!skillsDiv) return;
    let html = '<div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;">';

    for (const skillName in state.skills) {
        const skill = state.skills[skillName];
        const expForNextLevel = getExpForLevel(skill.level);
        const progress = skill.level >= 20 ? 100 : Math.round((skill.exp / expForNextLevel) * 100);

        html += `
            <div style="border: 1px solid #444; padding: 0.5rem; width: 120px; box-sizing: border-box; text-align: center;">
                <div style="font-size: 0.8rem;">${skillName}<br>(Lvl ${skill.level})</div>
                <div style="background: #333; height: 10px; margin-top: 5px; border-radius: 2px; overflow: hidden;">
                    <div style="width: ${progress}%; height: 100%; background: lightblue; border-radius: 2px;"></div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    skillsDiv.innerHTML = html;
}

function updateCharStatsTab() {
    const statsDiv = document.getElementById('char-stats');
    if (!statsDiv) return;

    const generalStats = [
        'timesSlept', 'questsCompleted', 'itemsCrafted', 'distanceWalked',
        'timesCollapsedFromStress', 'timesClimaxed'
    ];

    const sexualStats = [
        'vaginalSexCount', 'analSexCount', 'oralSexGivenCount', 'oralSexReceivedCount',
        'vaginalCreampiesReceived', 'analCreampiesReceived', 'oralCreampiesReceived',
        'timesSwallowedSemen', 'totalGirlCumExpelled', 'uniqueSexualPartners'
    ];

    const formatStatName = (statName) => {
        return statName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    let html = '<h4>General</h4><ul style="list-style-position: inside; margin-top: 0.5rem;">';
    generalStats.forEach(statName => {
        if (state.stats.hasOwnProperty(statName)) {
            html += `<li>${formatStatName(statName)}: ${state.stats[statName]}</li>`;
        }
    });
    html += '</ul>';

    html += '<h4 style="margin-top: 1.5rem;">Sexual</h4><ul style="list-style-position: inside; margin-top: 0.5rem;">';
    sexualStats.forEach(statName => {
        if (state.stats.hasOwnProperty(statName)) {
            html += `<li>${formatStatName(statName)}: ${state.stats[statName]}</li>`;
        }
    });
    html += '</ul>';

    statsDiv.innerHTML = html;
}
