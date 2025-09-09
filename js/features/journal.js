function buildJournalOverlay() {
    const body = document.querySelector('#btnJournal-overlay .overlayBody');
    if (!body) return;

    // --- Active Quests (now filters hidden quests) ---
    let activeQuestsHtml = '<ul>';
    const activeQuests = state.journal.quests.filter(q => !q.complete && !q.hidden);
    if (activeQuests.length > 0) {
        activeQuests.forEach(q => {
            activeQuestsHtml += `<li><strong>${q.title}:</strong> ${q.description}</li>`;
        });
    } else {
        activeQuestsHtml += '<li>No active quests.</li>';
    }
    activeQuestsHtml += '</ul>';

    // --- Completed Quests (now collapsible with count) ---
    const completedQuests = state.journal.quests.filter(q => q.complete);
    const completedCount = completedQuests.length;
    const completedQuestsHeaderHtml = `<h4 id="completed-quests-header" style="cursor: pointer;">Completed Quests (${completedCount})</h4>`;

    let completedQuestsListHtml = '<ul style="display: none;">'; // Start hidden
    if (completedCount > 0) {
        completedQuests.forEach(q => {
            completedQuestsListHtml += `<li><s><strong>${q.title}:</strong> ${q.description}</s></li>`;
        });
    } else {
        completedQuestsListHtml += '<li>No completed quests yet.</li>';
    }
    completedQuestsListHtml += '</ul>';

    // --- Reminders ---
    let remindersHtml = '<ul>';
    if (state.journal.reminders.length > 0) {
        state.journal.reminders.forEach(r => {
            if (typeof r === 'string') {
                remindersHtml += `<li>${r}</li>`;
            } else if (r && r.text && r.date) {
                const reminderDate = new Date(r.date + 'T00:00:00');
                remindersHtml += `<li>${r.text} (on ${reminderDate.toLocaleDateString()})</li>`;
            }
        });
    } else {
        remindersHtml += '<li>No reminders.</li>';
    }
    remindersHtml += '</ul>';

    body.innerHTML = `
        <div id="journal-content-wrapper">
            <div>
                <h4>Active Quests</h4>
                ${activeQuestsHtml}
            </div>
            <div style="margin-top: 1rem;">
                ${completedQuestsHeaderHtml}
                <div id="completed-quests-list-container">
                    ${completedQuestsListHtml}
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <h4>Reminders</h4>
                ${remindersHtml}
            </div>
            <div style="margin-top: 1rem; display: flex; flex-direction: column; flex-grow: 1;">
                <h4>Notes</h4>
                <textarea id="journal-notepad" style="width: 98%; background: #111; color: #eee; border: 0.0625rem solid #444; flex-grow: 1;"></textarea>
            </div>
        </div>
    `;

    // Add click listener for collapsible section
    const completedHeader = document.getElementById('completed-quests-header');
    if (completedHeader) {
        completedHeader.onclick = () => {
            const list = document.querySelector('#completed-quests-list-container ul');
            if (list) {
                const isHidden = list.style.display === 'none';
                list.style.display = isHidden ? 'block' : 'none';
            }
        };
    }

    const notepad = document.getElementById('journal-notepad');
    notepad.value = state.journal.notes;
    notepad.addEventListener('input', (event) => {
        state.journal.notes = event.target.value;
    });
}
