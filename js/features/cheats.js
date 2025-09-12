function cheatAddAllSkillsExp(amount) {
    for (const skillName in state.skills) {
        addSkillExp(skillName, amount);
    }
    // Visually update the character screen if it's open
    if (document.getElementById('btnChar-overlay').style.display === 'block') {
        updateCharSkillsTab();
    }
}

function cheatAddSkillExp(skillName, amount) {
    addSkillExp(skillName, amount);
    buildCheatOverlay();
    if (document.getElementById('btnChar-overlay').style.display === 'block') {
        updateCharSkillsTab();
    }
}

function cheatModifyNpcStat(npcName, stat, amount) {
    if (state.npcs[npcName]) {
        state.npcs[npcName][stat] = Math.max(0, Math.min(100, state.npcs[npcName][stat] + amount));
        buildCheatOverlay(); // Redraw cheats to update value
        if (document.getElementById('btnSocial-overlay').style.display === 'block') {
            buildSocialOverlay();
        }
    }
}

function buildDebugCheatTab() {
    const debugTab = document.getElementById('cheat-tab-debug');
    if (!debugTab) return;

    // Helper to format a single data object (like state.pregnancy)
    const createSectionFromObject = (title, dataObject, keysToOmit = []) => {
        let content = `<h4 style="color: #00ff00; border-bottom: 1px solid #444; padding-bottom: 0.3rem; margin-top: 1rem;">${title}</h4>`;
        content += '<div style="font-family: monospace; font-size: 0.9em; white-space: pre; background: #111; padding: 0.5rem; border-radius: 4px;">';
        for (const key in dataObject) {
            if (keysToOmit.includes(key)) continue;

            const value = dataObject[key];
            let displayValue = value;
            if (typeof value === 'boolean') {
                displayValue = value ? '<span style="color: lightgreen;">true</span>' : '<span style="color: salmon;">false</span>';
            } else if (typeof value === 'object' && value !== null) {
                displayValue = JSON.stringify(value, null, 2);
            }
            content += `${key.padEnd(20)}: ${displayValue}\n`;
        }
        content += '</div>';
        return content;
    };

    // Helper to format the bodyFluids object specifically
    const createBodyFluidsSection = (title, fluidsObject) => {
        let content = `<h4 style="color: #00ff00; border-bottom: 1px solid #444; padding-bottom: 0.3rem; margin-top: 1rem;">${title}</h4>`;
        content += '<div style="font-family: monospace; font-size: 0.9em; white-space: pre; background: #111; padding: 0.5rem; border-radius: 4px;">';
        for (const location in fluidsObject) {
            if (location === 'vagina' || location === 'anus' || location === 'mouth' || location === 'body') {
                const totalVolume = fluidsObject[location].semen.reduce((acc, s) => acc + s.volume, 0);
                const fathers = [...new Set(fluidsObject[location].semen.map(s => s.fatherId))].join(', ') || 'none';
                content += `${location.padEnd(20)}: Total Volume: ${totalVolume.toFixed(2)}ml, Fathers: [${fathers}]\n`;
            }
        }
        content += '</div>';
        return content;
    };

    let html = '<div style="padding: 0 1rem;">';
    if (state.bodyFluids) {
        html += createBodyFluidsSection('Body Fluids', state.bodyFluids);
    }
    html += createSectionFromObject('Menstrual Cycle', state.menstrualCycle);
    html += createSectionFromObject('Human Pregnancy', state.pregnancy, ['eggCount']); // Omit eggCount
    html += createSectionFromObject('Parasite', state.parasite);
    html += `
        <div style="text-align: center; padding: 1rem; border-top: 1px solid #444; margin-top: 1rem;">
        </div>
    `;
    html += '</div>';

    debugTab.innerHTML = html;
}

function cheatModifyNeed(key, delta) {
  const max = state.ranges[key];
  const min = 0;
  state.needs[key] = Math.min(max, Math.max(min, state.needs[key] + delta));
  updateNeedsUI();
  buildCheatOverlay(); // Redraw cheats to update value
  checkStatTriggers();
}

// This helper function creates the new standardized row for any cheat
function createCheatControlRow(config) {
    // config: { label, value, neg_actions, pos_actions }
    return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.2rem; border-bottom: 1px solid #333;">
            <span style="flex-basis: 30%; font-size: 0.9em;">${config.label}</span>
            <div style="flex-basis: 70%; display: flex; justify-content: flex-end; align-items: center; gap: 0.3rem;">
                <button class="overlayBtn" onclick="${config.neg_actions[0].onclick}">${config.neg_actions[0].label}</button>
                <button class="overlayBtn" onclick="${config.neg_actions[1].onclick}">${config.neg_actions[1].label}</button>
                <button class="overlayBtn" onclick="${config.neg_actions[2].onclick}">${config.neg_actions[2].label}</button>
                <span style="min-width: 6ch; text-align: center; font-weight: bold;">${config.value}</span>
                <button class="overlayBtn" onclick="${config.pos_actions[0].onclick}">${config.pos_actions[0].label}</button>
                <button class="overlayBtn" onclick="${config.pos_actions[1].onclick}">${config.pos_actions[1].label}</button>
                <button class="overlayBtn" onclick="${config.pos_actions[2].onclick}">${config.pos_actions[2].label}</button>
            </div>
        </div>
    `;
}

function showCheatTab(tabName) {
    document.querySelectorAll('.cheat-tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(`cheat-tab-${tabName}`).style.display = 'block';
    if (state.ui) {
        state.ui.lastCheatTab = tabName;
    }
}

function buildCheatOverlay() {
    const body = document.querySelector('#cheatsBtn-overlay .overlayBody');
    body.innerHTML = ''; // Clear previous content

    // --- Get active tab from state ---
    const activeTab = (state.ui && state.ui.lastCheatTab) ? state.ui.lastCheatTab : 'general';

    // --- Create Tab Buttons ---
    const tabButtonContainer = document.createElement('div');
    tabButtonContainer.className = 'cheat-tabs-container';
    const tabConfigs = [
        { name: 'General', id: 'general' },
        { name: 'Skills', id: 'skills' },
        { name: 'NPCs', id: 'npcs' },
        { name: 'Body/Debug', id: 'debug' }
    ];
    tabConfigs.forEach(config => {
        const btn = document.createElement('button');
        btn.className = 'overlayBtn';
        btn.style.flexGrow = '1';
        btn.textContent = config.name;
        btn.onclick = () => showCheatTab(config.id);
        tabButtonContainer.appendChild(btn);
    });

    // --- Create Panels Container ---
    const panelsContainer = document.createElement('div');
    panelsContainer.className = 'cheat-panels-container';

    // --- Build and Append All Tabs ---

    // 1. General Tab
    const generalTab = document.createElement('div');
    generalTab.id = 'cheat-tab-general';
    generalTab.className = 'cheat-tab-content';
    let generalContent = '<div style="display: flex; gap: 2rem;">';
    let leftCol = '<div style="flex-basis: 50%;">';
    leftCol += '<h4 style="text-align: center;">Needs</h4>';
    for (const key in state.needs) {
        const max = state.ranges[key];
        leftCol += createCheatControlRow({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: `${state.needs[key].toFixed(0)}`,
            neg_actions: [ { label: '-50%', onclick: `cheatModifyNeed('${key}', -${max*0.5})` }, { label: '-10%', onclick: `cheatModifyNeed('${key}', -${max*0.1})` }, { label: '-1%', onclick: `cheatModifyNeed('${key}', -${max*0.01})` } ],
            pos_actions: [ { label: '+1%', onclick: `cheatModifyNeed('${key}', ${max*0.01})` }, { label: '+10%', onclick: `cheatModifyNeed('${key}', ${max*0.1})` }, { label: '+50%', onclick: `cheatModifyNeed('${key}', ${max*0.5})` } ]
        });
    }
    leftCol += '</div>';
    let rightCol = '<div style="flex-basis: 50%;">';
    rightCol += '<h4 style="text-align: center;">Money & Toggles</h4>';
    rightCol += createCheatControlRow({
        label: "Money", value: `$${state.money.toFixed(2)}`,
        neg_actions: [ { label: '-1k', onclick: `cheatMoney(-1000)` }, { label: '-100', onclick: `cheatMoney(-100)` }, { label: '-10', onclick: `cheatMoney(-10)` } ],
        pos_actions: [ { label: '+10', onclick: `cheatMoney(10)` }, { label: '+100', onclick: `cheatMoney(100)` }, { label: '+1k', onclick: `cheatMoney(1000)` } ]
    });
    rightCol += `<div style="text-align: center; padding: 1rem;"><label><input type="checkbox" onchange="toggleCorruptionDisplay(this)" ${state.showCorruption?'checked':''}> Show Corruption Bar</label></div>`;
    rightCol += `<div style="text-align: center; padding: 0.5rem;"><button class="overlayBtn" onclick="toggleParasitePregnancyCheat()">Parasite Pregnancy: ${state.parasite.canImpregnate ? '<span style=\\"color: red\\">Enabled</span>' : 'Disabled'}</button></div>`;
    rightCol += `<div style="text-align: center; padding: 0.5rem;"><button class="overlayBtn" onclick="openWardrobe()">Open Wardrobe</button></div>`;
    rightCol += '</div>';
    generalContent += leftCol + rightCol + '</div>';
    generalTab.innerHTML = generalContent;
    panelsContainer.appendChild(generalTab);

    // 2. Skills Tab
    const skillsTab = document.createElement('div');
    skillsTab.id = 'cheat-tab-skills';
    skillsTab.className = 'cheat-tab-content';
    const skillsColumnContainer = document.createElement('div');
    skillsColumnContainer.className = 'skills-column-container';
    let skillsHtml = '';
    for (const skillName in state.skills) {
        skillsHtml += createCheatControlRow({
            label: skillName, value: `${state.skills[skillName].exp.toFixed(0)} exp`,
            neg_actions: [ {label: '-64', onclick:`cheatAddSkillExp('${skillName}', -64)`}, {label: '-8', onclick:`cheatAddSkillExp('${skillName}', -8)`}, {label: '-1', onclick:`cheatAddSkillExp('${skillName}', -1)`} ],
            pos_actions: [ {label: '+1', onclick:`cheatAddSkillExp('${skillName}', 1)`}, {label: '+8', onclick:`cheatAddSkillExp('${skillName}', 8)`}, {label: '+64', onclick:`cheatAddSkillExp('${skillName}', 64)`} ],
        });
    }
    skillsColumnContainer.innerHTML = skillsHtml;
    skillsTab.appendChild(skillsColumnContainer);
    panelsContainer.appendChild(skillsTab);

    // 3. NPCs Tab
    const npcsTab = document.createElement('div');
    npcsTab.id = 'cheat-tab-npcs';
    npcsTab.className = 'cheat-tab-content';
    let npcsHtml = '<h4 style="text-align: center;">NPCs</h4><div style="display: flex; gap: 1rem;">';
    const npcs = Object.keys(state.npcs);
    const npcMid = Math.ceil(npcs.length / 2);
    const npcCol1 = npcs.slice(0, npcMid);
    const npcCol2 = npcs.slice(npcMid);
    let npcCol1Html = '<div style="flex-basis: 50%;">';
    npcCol1.forEach(npcName => {
        npcCol1Html += `<h5 style="text-align:center;">${npcName}</h5>`;
        for(const stat in state.npcs[npcName]) {
            if(typeof state.npcs[npcName][stat] === 'number') {
                npcCol1Html += createCheatControlRow({
                    label: stat.charAt(0).toUpperCase() + stat.slice(1), value: state.npcs[npcName][stat],
                    neg_actions: [ {label: '-25', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -25)`}, {label: '-5', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -5)`}, {label: '-1', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -1)`} ],
                    pos_actions: [ {label: '+1', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 1)`}, {label: '+5', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 5)`}, {label: '+25', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 25)`} ]
                });
            }
        }
    });
    npcCol1Html += '</div>';
    let npcCol2Html = '<div style="flex-basis: 50%;">';
    npcCol2.forEach(npcName => {
        npcCol2Html += `<h5 style="text-align:center;">${npcName}</h5>`;
        for(const stat in state.npcs[npcName]) {
            if(typeof state.npcs[npcName][stat] === 'number') {
                npcCol2Html += createCheatControlRow({
                    label: stat.charAt(0).toUpperCase() + stat.slice(1), value: state.npcs[npcName][stat],
                    neg_actions: [ {label: '-25', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -25)`}, {label: '-5', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -5)`}, {label: '-1', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', -1)`} ],
                    pos_actions: [ {label: '+1', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 1)`}, {label: '+5', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 5)`}, {label: '+25', onclick:`cheatModifyNpcStat('${npcName}', '${stat}', 25)`} ]
                });
            }
        }
    });
    npcCol2Html += '</div>';
    npcsTab.innerHTML = npcsHtml + npcCol1Html + npcCol2Html + '</div>';
    panelsContainer.appendChild(npcsTab);

    // 4. Debug Tab
    const debugTab = document.createElement('div');
    debugTab.id = 'cheat-tab-debug';
    debugTab.className = 'cheat-tab-content';
    panelsContainer.appendChild(debugTab); // Append empty, will be filled by its own function

    // Append main containers to the overlay body
    body.appendChild(tabButtonContainer);
    body.appendChild(panelsContainer);

    // Populate the debug tab content
    buildDebugCheatTab();

    // Show the correct tab
    showCheatTab(activeTab);
}

/* optional money cheat – keeps two‑decimal precision */
function cheatMoney(delta){
  state.money = Math.round((state.money + delta) * 100) / 100;
  updateHeader();
  buildCheatOverlay();
}

function toggleParasitePregnancyCheat() {
    state.parasite.canImpregnate = !state.parasite.canImpregnate;
    buildCheatOverlay(); // Re-render the cheat overlay to update the button text
}

/* toggle the hidden “Corruption” bar */
function toggleCorruptionDisplay(cb){
  state.showCorruption = cb.checked;
  updateNeedsUI();
}
