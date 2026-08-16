import {BLOCKER_STATUS} from "./constant";

// Single source of truth for the on/off state, shared between the content
// script (youtube.com) and the extension popup.
//
// - chrome.storage.local is authoritative and syncs across both contexts.
// - localStorage (on youtube.com) is a synchronous mirror, read on page load
//   so the blocker class is applied before paint (no thumbnail flash).

const KEY = BLOCKER_STATUS.toggleName;                // 'isThumbnailEnabled'
const DEFAULT = BLOCKER_STATUS.toggleDefaultValue;    // 'enabled'

export type BlockerState = string;

export const isEnabled = (s: BlockerState): boolean =>
    s === BLOCKER_STATUS.thumbNailEnabled;

// Instant synchronous read from the localStorage mirror (page context only).
export const readCached = (): BlockerState => {
    try {
        return localStorage.getItem(KEY) || DEFAULT;
    } catch {
        return DEFAULT;
    }
};

// Authoritative async read from chrome.storage, falling back to the mirror.
export const readState = (cb: (s: BlockerState) => void): void => {
    try {
        chrome.storage.local.get([KEY], (r) => {
            const s = (r && r[KEY]) || readCached();
            try { localStorage.setItem(KEY, s); } catch { /* extension context */ }
            cb(s);
        });
    } catch {
        cb(readCached());
    }
};

// Persist to both stores. chrome.storage.onChanged then notifies every context.
export const writeState = (s: BlockerState): void => {
    try { localStorage.setItem(KEY, s); } catch { /* extension context */ }
    try { chrome.storage.local.set({[KEY]: s}); } catch { /* no-op */ }
};

// Subscribe to changes made in any context (e.g. popup toggling while a
// YouTube tab is open).
export const subscribe = (cb: (s: BlockerState) => void): void => {
    try {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'local' && changes[KEY]) {
                const s = changes[KEY].newValue as BlockerState;
                try { localStorage.setItem(KEY, s); } catch { /* extension context */ }
                cb(s);
            }
        });
    } catch { /* no-op */ }
};
