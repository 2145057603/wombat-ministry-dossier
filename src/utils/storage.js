(() => {
window.WOMBAT = window.WOMBAT || {};

const STORAGE_KEY = "wombat-test-state-v1";

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function saveStoredState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Ignore storage failures in read-only contexts.
  }
}

function clearStoredState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_error) {
    // Ignore.
  }
}

window.WOMBAT.storage = {
  loadStoredState,
  saveStoredState,
  clearStoredState
};
})();
