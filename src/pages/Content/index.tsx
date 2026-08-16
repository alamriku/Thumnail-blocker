import React from "react";
import ReactDOM from "react-dom";
import {App} from "./App";
import {setBlockerClass} from "../helper";
import {isEnabled, readCached, readState, subscribe} from "../state";

const ROOT_ID = 'thumbNailBlockerRoot';

const applyState = (state: string) => setBlockerClass(isEnabled(state));

// Position the fixed toggle just to the LEFT of the masthead's button cluster
// (Create / bell / avatar), measured live, and collapse it responsively so it
// never overlaps the search / mic on narrow (tablet) widths.
const positionToggle = (el: HTMLElement) => {
    const end = document.querySelector('ytd-masthead #end') as HTMLElement | null;
    if (!end) {
        el.style.top = '8px';
        el.style.height = '40px';
        el.style.right = '220px';
        return;
    }
    const r = end.getBoundingClientRect();
    el.style.top = Math.max(r.top, 0) + 'px';
    el.style.height = r.height + 'px';
    el.style.right = Math.max(window.innerWidth - r.left + 8, 8) + 'px';

    // How much room between the search bar and the button cluster?
    const center = document.querySelector('ytd-masthead #center') as HTMLElement | null;
    const gap = center ? r.left - center.getBoundingClientRect().right : r.left;

    el.classList.remove('tb-hide', 'tb-compact', 'tb-mini');
    if (gap < 52) {
        el.classList.add('tb-hide');      // tiny mobile → use the popup instead
    } else if (gap < 96) {
        el.classList.add('tb-mini');      // icon only (still toggles)
    } else if (gap < 168) {
        el.classList.add('tb-compact');   // icon + switch, no label
    }
    // else: full pill (icon + label + switch)
}

// Mount ONCE into a container YouTube never strips (ytd-app), fixed-positioned.
// Living outside the masthead's Polymer subtree is what lets it survive SPA
// navigation (back/forward) without being wiped.
const mountToggle = () => {
    let container = document.getElementById(ROOT_ID) as HTMLElement | null;
    if (!container) {
        const host = document.querySelector('ytd-app') || document.body;
        if (!host) return;
        container = document.createElement('div');
        container.id = ROOT_ID;
        container.style.position = 'fixed';
        container.style.zIndex = '2100';
        host.appendChild(container);
        ReactDOM.render(<App/>, container);
    }
    positionToggle(container);
}

// Apply instantly from the cache (no flash), then reconcile with chrome.storage.
applyState(readCached());
readState(applyState);
subscribe(applyState);            // live updates from the popup
mountToggle();

setInterval(mountToggle, 1000);
document.addEventListener('yt-navigate-finish', mountToggle);
window.addEventListener('resize', mountToggle);
