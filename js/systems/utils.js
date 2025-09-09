function getLuminance(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function fmtHM(d){ return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false}); }
function fmtDate(d) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

function formatMoney(amount) {
    if (amount >= 10000000) {
        return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 10000) {
        return `$${(amount / 1000).toFixed(0)}k`;
    } else if (amount >= 1000) {
        return `$${amount.toFixed(0)}`;
    } else {
        return `$${amount.toFixed(2)}`;
    }
}

function getDaysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    // Discard time and timezone info for consistent day difference calculation
    const d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((d1 - d2) / oneDay);
}

function applySettings() {
  const settings = state.settings;
  document.body.style.fontFamily = settings.fontFamily;
  document.body.style.fontSize = settings.fontSize;
}

function changeFont(font) {
  state.settings.fontFamily = font;
  applySettings();
}

function changeFontSize(size) {
  state.settings.fontSize = size;
  applySettings();
}

function forceGlobalUIRefresh() {
  updateHeader();
  updateNeedsUI();
}

function checkStatTriggers() {
  if (state.storyEventActive) {
    return; // Don't interrupt story events
  }

  // Check for Stress max-out
  if (state.needs.stress >= state.ranges.stress) {
    state.storyEventActive = true;
    state.locationBeforeEvent = state.currentLocation;
    goToScene('stress_collapse_event', 0);
  }

  // Check for Arousal max-out
  if (state.needs.arousal >= state.ranges.arousal) {
    state.storyEventActive = true;
    state.locationBeforeEvent = state.currentLocation;
    goToScene('arousal_max_event', 0);
  }
}
