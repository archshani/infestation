function buildSocialOverlay() {
    const body = document.querySelector('#btnSocial-overlay .overlayBody');
    if (!body) return;

    let html = '<div class="npc-grid" style="display: flex; flex-wrap: wrap; gap: 1rem; align-content: flex-start; height: 100%; overflow-y: auto;">';

    const knownNpcs = Object.keys(state.npcs).filter(npcName => !state.npcs[npcName].hidden);

    if (knownNpcs.length === 0) {
        html += '<p>You haven\'t met anyone yet.</p>';
    } else {
        for (const npcName of knownNpcs) {
            const npc = state.npcs[npcName];

            html += `<div class="npc-plate" style="border: 1px solid #444; padding: 1rem; width: 22%; box-sizing: border-box; min-height: 160px; display: flex; flex-direction: column; justify-content: space-between;">`;

            html += `<div><h4>${npcName}</h4>`;

            // Always show stats for visible NPCs
            html += createNpcStatBar('Love', npc.relationship, '#ff0000'); // Red
            html += createNpcStatBar('Lust', npc.attraction, '#ff69b4');   // Hot Pink
            html += createNpcStatBar('Trust', npc.trust, '#1e90ff');     // Dodger Blue
            html += createNpcStatBar('Fear', npc.fear, '#9932cc');       // Dark Orchid
            html += createNpcStatBar('Anger', npc.anger, '#ff4500');      // OrangeRed

            html += `</div></div>`; // Close h4 div and npc-plate
        }
    }
    html += '</div>';

    body.innerHTML = html;
}

function createNpcStatBar(statName, value, barColor = '#4a90e2') {
    const percentage = Math.max(0, Math.min(100, value));

    return `
        <div class="npc-stat-bar-container" style="display: flex; align-items: center; margin-bottom: 0.3rem;">
            <span style="width: 80px; font-size: 0.9em; text-align: right; margin-right: 5px;">${statName}</span>
            <div class="bar" style="flex-grow: 1; height: 8px; background: #444; border-radius: 2px;">
                <div class="fill" style="width: ${percentage}%; height: 100%; background: ${barColor}; border-radius: 2px;"></div>
            </div>
        </div>
    `;
}
