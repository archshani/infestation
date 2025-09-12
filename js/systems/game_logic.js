/* ==============================================================
   HEADER (date | time | money)
   ============================================================== */
function updateHeader(){
  document.getElementById('clock').textContent = fmtHM(state.currentTime);
  document.getElementById('date' ).textContent = fmtDate(state.currentTime);
  document.getElementById('money').textContent = formatMoney(state.money);
}

/* ==============================================================
   NEEDS UI
   ============================================================== */
function getFillPct(k){
  const cur = state.needs[k];
  const max = state.ranges[k];
  return Math.min(100, Math.max(0, (cur / max) * 100));
}

/* Simple stage labels (just for visual flavour) */
function stageLabel(p){
  if(p===0) return 'Stage 0';
  if(p<=33) return 'Stage 1';
  if(p<=66) return 'Stage 2';
  if(p<=99) return 'Stage 3';
  if(p=100) return 'Stage 4';
}

function updateNeedsUI(){
  Object.keys(state.needs).forEach(k=>{
    const el   = document.getElementById(`need-${k}`);
    if(!el) return;

    const pct  = getFillPct(k);                     // 0‑100 %
    const fill = el.querySelector('.fill');
    const line = el.querySelector('.needLine');

/* ---------- colour (custom logic) ---------- */
const inverted = ['stress','trauma','arousal'].includes(k);
const barColor =
  k === 'corruption' ? '#99009F' :
  k === 'alcohol' ? '#FFA500' :
  k === 'drugs' ? '#FFA07A' :
  (() => {
    const r = Math.round(255 * (inverted ? pct/100 : 1-pct/100));
    const g = Math.round(255 * (inverted ? 1-pct/100 : pct/100));
    return `rgb(${r},${g},0)`;
  })();

    fill.style.width = pct + '%';
    fill.style.background = barColor;               // thin bar colour


    /* ---------- stage label ---------- */
    const labels = el.getAttribute('data-labels').split('|');
    const labelRangesAttr = el.getAttribute('data-label-ranges');
    let stage;

    if (labelRangesAttr) {
        // New system with custom, expandable ranges
        const ranges = labelRangesAttr.split(',').map(Number);
        let labelIndex = -1;

        for (let i = 0; i < ranges.length; i++) {
            if (pct <= ranges[i]) {
                labelIndex = i;
                break;
            }
        }

        if (labelIndex === -1) {
            labelIndex = labels.length - 1;
        }

        stage = labels[labelIndex];
    } else {
        // Original system for backward compatibility
        const idx = Math.min(labels.length-1, Math.floor(pct/20)); // 0‑4
        stage = labels[idx];
    }

    /* ---------- compose “Name: Stage” line ----------
       – for normal needs we show the name, for hidden ones we hide it
    */
    const needName = el.getAttribute('data-name');
    if(el.classList.contains('noName')){
      // hidden needs: only the stage (no name)
      line.innerHTML = `<span class="stage" style="color:${barColor};">${stage}</span>`;
    }else{
      // normal needs: “Name: Stage” on one line
      line.innerHTML = `
        <span style="color:#fff;">${needName}:</span>
        <span class="stage" style="color:${barColor}; margin-left:.4rem;">${stage}</span>
      `;
    }

    /* ---------- tooltip (name white + % coloured) ---------- */
    const tooltip = el.querySelector('.tooltip');
    tooltip.innerHTML = `
      <span style="color:#fff;">${needName}</span>
      <span style="color:${barColor}; margin-left:.4rem;">${pct.toFixed(0)}%</span>
    `;

    /* ---------- empty‑text colour handling (unchanged) ---------- */
    if(!inverted && pct===0 && !el.classList.contains('noName')){
      line.classList.add('empty');
    }else{
      line.classList.remove('empty');
    }
  });

  /* ---- visibility of the “bad” needs (unchanged) ---- */
  document.getElementById('need-alcohol')
          .style.display = state.needs.alcohol>0 ? 'block' : 'none';
  document.getElementById('need-drugs')
          .style.display = state.needs.drugs>0 ? 'block' : 'none';

  const corr = document.getElementById('need-corruption');
  if(state.showCorruption){
    corr.classList.remove('hiddenBar');
    corr.style.display = 'block';
  }else{
    corr.classList.add('hiddenBar');
    corr.style.display = 'none';
  }
}

function startRelaxing() {
  state.locationBeforeEvent = state.currentLocation;
  goToScene('relaxing', 0);
}

function startShowering() {
  state.locationBeforeEvent = state.currentLocation;
  goToScene('showering', 0);
}

function startSleeping() {
  state.locationBeforeEvent = state.currentLocation;
  goToScene('sleeping', 0);
}

function finishShower() {
  advanceTime(600); // 10 minutes
  goToScene(state.locationBeforeEvent, 0);
}

function finishRelaxing() {
  advanceTime(1800, false);
  let newHappiness = state.needs.happiness + 50;
  if (newHappiness > state.ranges.happiness) {
    newHappiness = state.ranges.happiness;
  }
  state.needs.happiness = newHappiness;

  let newTiredness = state.needs.tiredness + 1000;
  if (newTiredness > state.ranges.tiredness) {
    newTiredness = state.ranges.tiredness;
  }
  state.needs.tiredness = newTiredness;
  forceGlobalUIRefresh();
  checkStatTriggers();
  goToScene(state.locationBeforeEvent, 0);

}

function sleepFor(hours) {
    const seconds = hours * 3600;
    const tirednessRestored = 16 * seconds * (10000 / 86400);
    let newTiredness = state.needs.tiredness + tirednessRestored;
    if (newTiredness > state.ranges.tiredness) {
        newTiredness = state.ranges.tiredness;
    }
    state.needs.tiredness = newTiredness;

    advanceTime(seconds, false);
    forceGlobalUIRefresh();
    checkStatTriggers();
    goToScene(state.locationBeforeEvent, 0);
}


function passDay() {
    advanceTime(86400);
}
/* ==============================================================
   SCREEN SWITCHING
   ============================================================== */
function switchScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ==============================================================
   INTRO EVENT SEQUENCE (no time advance while reading)
   ============================================================== */
function showCurrentEvent(){
  const c = document.getElementById('mainArea');
  c.innerHTML = '';

  const ev = state.events[state.eventIndex];

  if (ev.reveals) {
    if (Array.isArray(ev.reveals)) {
      // Handle array of NPCs
      ev.reveals.forEach(npcName => {
        if (state.npcs[npcName]) {
          state.npcs[npcName].hidden = false;
        }
      });
    } else if (typeof ev.reveals === 'string' && state.npcs[ev.reveals]) {
      // Handle single NPC string for backward compatibility
      state.npcs[ev.reveals].hidden = false;
    }
  }

  const title = document.createElement('h2');
  title.className = 'eventTitle';
  title.textContent = ev.title;
  c.appendChild(title);

  const txt = document.createElement('p');
  txt.className = 'eventText';
  txt.innerHTML = ev.text;
  c.appendChild(txt);

  const link = document.createElement('span');
  link.className = 'link';
  link.textContent = (state.eventIndex < state.events.length-1) ? 'Continue...' : 'Time to get out there and figure out this \'guest\'...';
  link.onclick = () => {
    if(state.eventIndex < state.events.length-1){
      state.eventIndex++;
      showCurrentEvent();          // **no** advanceTime here
    }else{
      state.storyEventActive = false; // Intro is over
      // --- RESTORE SIDEBAR ELEMENTS AFTER INTRO ---
      const sidebar = document.getElementById('sidebar');
      Array.from(sidebar.children).forEach(child => {
          child.style.display = ''; // Reset to default
      });
      const bottomButtons = document.getElementById('bottomButtons');
        Array.from(bottomButtons.children).forEach(child => {
            child.style.display = ''; // Reset to default
        });
      applyCheatsUI();
      goToScene('home', 30);      // entering the lab starts the map
    }
  };
  c.appendChild(link);
}

/* ==============================================================
   MAP – FOYER AND ROOMS (each move advances time)
   ============================================================== */
function renderScene(sceneName) {
  state.currentLocation = sceneName;
  const sceneData = state.scenes[sceneName];
  if (!sceneData) return; // Or show an error scene

  const c = document.getElementById('mainArea');
  c.innerHTML = `
    <h2 class="eventTitle">${sceneData.title}</h2>
    <p class="eventText" id="sceneDesc">${sceneData.description}</p>
    <div class="navColumn" id="sceneNav"></div>
  `;

  const nav = document.getElementById('sceneNav');
  let navHtml = '';
  sceneData.nav.forEach(link => {
    let showLink = true;
    if (link.condition) {
      if (link.condition.type === 'npc_relationship') {
        const npc = state.npcs[link.condition.npc];
        if (!npc || npc.relationship < link.condition.value) {
          showLink = false;
        }
      } else if (link.condition.type === 'parasite_impregnate_enabled') {
        if (!state.parasite.canImpregnate) {
            showLink = false;
        }
      } else if (link.condition.type === 'worms_ready_to_birth') {
        const now = state.currentTime.getTime();
        const readyWorms = state.parasite.worms.filter(worm => now >= worm.birthReadyTime);
        if (readyWorms.length === 0) {
            showLink = false;
        }
      }
      // Future condition types can be added here
    }

    if (showLink) {
      navHtml += `<span class="link" onclick="${link.action}">${link.text}</span>`;
    }
  });
  nav.innerHTML = navHtml;

  positionNavBelow(document.getElementById('sceneDesc'), nav);
}

function goToScene(sceneName, seconds) {
  if (seconds > 0) {
    advanceTime(seconds);
  }

  // --- NEW RANDOM EVENT LOGIC ---
  const destinationScene = state.scenes[sceneName];
  if (destinationScene && destinationScene.randomEvents) {
    for (const event of destinationScene.randomEvents) {
      const conditionMet = checkEventCondition(event.condition);
      if (conditionMet && Math.random() < event.chance) {
        // The random event triggered!
        renderScene(event.scene); // Go to the event scene instead
        return; // Stop processing further
      }
    }
  }

  // If no random event triggered, render the original destination
  renderScene(sceneName);
}

/* Helper – positions a .navColumn just below a given element */
function positionNavBelow(targetEl, navEl){
  const parent = document.getElementById('mainArea').getBoundingClientRect();
  const tgt    = targetEl.getBoundingClientRect();
  const pct = ((tgt.bottom - parent.top) / parent.height) * 100;
  navEl.style.top = `${pct + 2}%`;   // small gap
}

/* ==============================================================
   BOTTOM BUTTONS & OVERLAYS
   ============================================================== */
function initBottomButtons(){
  // Character / Social / Journal / Saves – placeholder handlers (you can flesh out)
  document.getElementById('btnChar'   ).onclick = () => openOverlay('btnChar');
  document.getElementById('btnSocial' ).onclick = () => openOverlay('btnSocial');
  document.getElementById('btnJournal').onclick = () => openOverlay('btnJournal');
  document.getElementById('btnSaves'  ).onclick = () => openOverlay('btnSaves');

  // Settings button – opens its overlay
  document.getElementById('btnSettings').onclick = () => openOverlay('btnSettings');

  // Cheats button – appears only after the checkbox is ticked
  document.getElementById('cheatsBtn'  ).onclick = () => openOverlay('cheatsBtn');
}

function getDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    // Discard time and timezone info for consistent day difference calculation
    const d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((d1 - d2) / oneDay);
}

function buildCalendar(year, month) { // month is 0-indexed
  const monthYearEl = document.getElementById('calendar-month-year');
  const daysEl = document.getElementById('calendar-days');

  daysEl.innerHTML = ''; // Clear previous days

  const date = new Date(year, month, 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  monthYearEl.textContent = `${monthName} ${year}`;

  const firstDay = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get reminders for the current month for efficiency
  const remindersForMonth = state.journal.reminders.filter(r => {
    const reminderDate = new Date(r.date + 'T00:00:00');
    return reminderDate.getFullYear() === year && reminderDate.getMonth() === month;
  });

  // Create blank cells for the days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day', 'other-month');
    daysEl.appendChild(dayCell);
  }

  // Create cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');

    const daySpan = document.createElement('span');
    daySpan.textContent = i;
    dayCell.appendChild(daySpan);

    const fullDate = new Date(year, month, i);
    const currentDate = state.currentTime;

    // Check if it's the current day
    if (fullDate.getFullYear() === currentDate.getFullYear() &&
        fullDate.getMonth() === currentDate.getMonth() &&
        fullDate.getDate() === currentDate.getDate()) {
      dayCell.classList.add('current-day');
    }

    // Check for reminders
    const reminder = remindersForMonth.find(r => {
        const reminderDate = new Date(r.date + 'T00:00:00');
        return reminderDate.getDate() === i;
    });

    if (reminder) {
      dayCell.classList.add('has-reminder');
      dayCell.onclick = () => {
        closeAllOverlays();
        openOverlay('btnJournal');
      };
    }

    // Check for period days
    if (!state.parasite.canImpregnate) { // Only show for normal cycles
        const dayDiff = getDaysBetween(fullDate, state.currentTime);
        const cycleDayForCell = state.menstrualCycle.currentDayInCycle + dayDiff;
        const cycleLength = state.menstrualCycle.cycleLength;
        const periodLength = state.menstrualCycle.periodLength;

        // Normalize the cycle day to be within 1 and cycleLength
        const normalizedCycleDay = ((cycleDayForCell - 1) % cycleLength + cycleLength) % cycleLength + 1;

        if (normalizedCycleDay <= periodLength) {
            dayCell.classList.add('period-day');
        }
    }

    daysEl.appendChild(dayCell);
  }
}

function positionCalendar() {
    const sidebar = document.getElementById('sidebar');
    const calendar = document.getElementById('calendar-overlay');
    if (sidebar && calendar) {
        const sidebarRect = sidebar.getBoundingClientRect();
        const dateRect = document.getElementById('date').getBoundingClientRect();
        calendar.style.left = `${sidebarRect.right + 10}px`; // 10px gap
        calendar.style.top = `${dateRect.top}px`;
    }
}

function initCalendar() {
  document.getElementById('date').onclick = () => {
    const calOverlay = document.getElementById('calendar-overlay');
    if (calOverlay.style.display === 'block') {
      calOverlay.style.display = 'none';
    } else {
      closeAllOverlays();
      state.calendarDate = new Date(state.currentTime);
      buildCalendar(state.calendarDate.getFullYear(), state.calendarDate.getMonth());
      positionCalendar(); // Position it dynamically
      calOverlay.style.display = 'block';
    }
  };

  document.getElementById('calendar-prev-btn').onclick = () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
    buildCalendar(state.calendarDate.getFullYear(), state.calendarDate.getMonth());
  };

  document.getElementById('calendar-next-btn').onclick = () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
    buildCalendar(state.calendarDate.getFullYear(), state.calendarDate.getMonth());
  };
}

/* Generic overlay toggler (click again to hide) */
function openOverlay(btnId){
  const ov = document.getElementById(`${btnId}-overlay`);
  if(!ov) return;

  if(ov.style.display === 'block'){
    ov.style.display = 'none';
  }else{
    closeAllOverlays();
    ov.style.display = 'block';

    // Populate overlays with dynamic content when they are opened
    if (btnId === 'btnSettings') {
        // Check the current font and font size radio buttons
        document.querySelectorAll(`input[name="font"][value="${state.settings.fontFamily}"]`).forEach(el => el.checked = true);
        document.querySelectorAll(`input[name="fontsize"][value="${state.settings.fontSize}"]`).forEach(el => el.checked = true);
    } else if (btnId === 'btnChar') {
        // If ui state exists, open the last tab, otherwise default to 'status'
        const lastTab = state.ui ? state.ui.lastCharTab : 'status';
        showCharTab(lastTab || 'status');
    } else if (btnId === 'btnSocial') {
        buildSocialOverlay();
    } else if (btnId === 'btnJournal') {
        buildJournalOverlay();
    } else if (btnId === 'btnSaves') {
        buildSavesOverlay();
    } else if (btnId === 'loadBtn') {
        buildLoadScreen();
    } else if (btnId === 'cheatsBtn') {
        buildCheatOverlay();
    } else if (btnId === 'wardrobe') {
        buildWardrobe();
    }
  }
}

/* Hide every overlay */
function closeAllOverlays(){
  document.querySelectorAll('.overlay').forEach(o=>o.style.display='none');
}

function openWardrobe() {
    openOverlay('wardrobe');
}

/* --------------------------------------------------------------
   SETTINGS → CHEATS CHECKBOX
   -------------------------------------------------------------- */
function toggleCheats(cb){
  state.cheatsEnabled = cb.checked;
  applyCheatsUI();
}

function applyCheatsUI() {
  const cheatsEnabled = state.cheatsEnabled;

  const cheatsChk = document.getElementById('cheatsChk');
  if (cheatsChk) {
    cheatsChk.checked = cheatsEnabled;
  }

  if (cheatsEnabled) {
    document.body.classList.add('cheats-enabled');
  } else {
    document.body.classList.remove('cheats-enabled');
  }

  const cheatsBtn = document.getElementById('cheatsBtn');
  if (cheatsBtn) {
    cheatsBtn.style.display = cheatsEnabled ? 'inline-block' : 'none';
  }
}

let notificationTimeout;
function showCraftNotification(itemName, templateName) {
    const notification = document.getElementById('craft-notification-overlay');
    if (!notification) return;

    // Clear any existing timeout to prevent overlaps
    clearTimeout(notificationTimeout);

    notification.innerHTML = `
        '${itemName}'
        <span style="font-size: 0.8em; color: #333;">(${templateName})</span>
        <br>added to inventory!
    `;

    notification.style.display = 'block';
    // Use a tiny timeout to allow the display property to apply before changing opacity for the transition
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    // Set timeout to fade out and then hide
    notificationTimeout = setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 400); // This should match the CSS transition duration
    }, 2500);
}

let errorNotificationTimeout;
function showErrorNotification(message) {
    const notification = document.getElementById('error-notification-overlay');
    if (!notification) return;

    clearTimeout(errorNotificationTimeout);
    notification.textContent = message;

    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    errorNotificationTimeout = setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 400);
    }, 1500);
}

/* Advance time by a given number of seconds and refresh the header */
function checkEventCondition(condition) {
    if (!condition) return true; // No condition means it can always trigger

    switch (condition.type) {
        case 'human_pregnancy_early':
            return state.pregnancy.isPregnant &&
                   state.pregnancy.type === 'human' &&
                   state.pregnancy.days >= 7 &&
                   state.pregnancy.days <= 35;
        case 'parasite_pregnancy':
            return state.parasite.eggs.length > 0;
        case 'has_piercings':
            const hasEquipped = Object.values(state.playerBody).some(p => p.piercings && p.piercings.length > 0);
            const hasStored = state.unequippedPiercings.length > 0;
            return hasEquipped || hasStored;
        // Future condition types can be added here
        default:
            return false;
    }
}

function advanceTime(seconds, updateUI = true) {
  if (typeof seconds !== 'number' || seconds < 0) return;

  const initialDay = Math.floor(state.currentTime.getTime() / (1000 * 60 * 60 * 24));

  const needs = state.needs;
  const ranges = state.ranges;

  // --- CALCULATE DECREASES ---

  // Fatigue (tiredness) decreases over time. 10000 points over 24 hours (86400s)
  const fatigueDecrease = seconds * (10000 / 86400);
  needs.tiredness = Math.max(0, needs.tiredness - fatigueDecrease);

  // Stress recovers over time: 1 point every 30 seconds
  const stressDecrease = seconds * (1 / 30);
  needs.stress = Math.max(0, needs.stress - stressDecrease);

  // Trauma recovers very slowly: 1 point every hour (3600s)
  const traumaDecrease = seconds * (1 / 3600);
  needs.trauma = Math.max(0, needs.trauma - traumaDecrease);

  // Alcohol metabolizes: 12 points every hour (3600s)
  const alcoholDecrease = seconds * (12 / 3600);
  needs.alcohol = Math.max(0, needs.alcohol - alcoholDecrease);

  // Drugs wear off: 6 points every hour (3600s)
  const drugsDecrease = seconds * (6 / 3600);
  needs.drugs = Math.max(0, needs.drugs - drugsDecrease);

  // Arousal 
    // Rate for 1000 -> 0 points over 180 mins (3h)
    const arousalDecrease = seconds * (1000 / 10800);
    needs.arousal = Math.max(0, needs.arousal - arousalDecrease)

  state.currentTime = new Date(state.currentTime.getTime() + (seconds * 1000));

  const finalDay = Math.floor(state.currentTime.getTime() / (1000 * 60 * 60 * 24));
  const daysPassed = finalDay - initialDay;

  if (daysPassed > 0) {
    for (let i = 0; i < daysPassed; i++) {
      advanceDay();
    }
  }

  if (updateUI) {
    forceGlobalUIRefresh();
  }

  // New Hatching Logic
  if (!state.storyEventActive && state.parasite.eggs.some(egg => state.currentTime.getTime() >= egg.hatchAtTime)) {
      state.storyEventActive = true;
      state.locationBeforeEvent = state.currentLocation;
      renderScene('parasite_hatch_event');
      return; // Exit advanceTime to prevent other triggers
  }

  checkStatTriggers();
}
