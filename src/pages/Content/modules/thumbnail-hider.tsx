import '../../Content/content.styles.css';
import React, {useEffect, useState} from "react";
import {BLOCKER_STATUS} from "../../constant";
import {setBlockerClass, sleep} from "../../helper";
import {isEnabled, readCached, readState, subscribe, writeState} from "../../state";

export const Youtube = () => {
    const [state, setState] = useState<string>(readCached());
    const on = isEnabled(state);

    // Dismiss the Shorts shelf (unchanged behaviour).
    const hideShorts = async () => {
        await sleep(900);
        const click = new Event("click", {bubbles: true, cancelable: false});
        const close = document.querySelector('[aria-label = "Not interested"]');
        close && close.dispatchEvent(click)
    }

    useEffect(() => {
        // Reconcile with the authoritative store, and stay in sync with the
        // popup (or another tab) toggling.
        readState(setState);
        subscribe(setState);
    }, [])

    const toggle = async () => {
        const next = on
            ? BLOCKER_STATUS.thumbNailDisabled
            : BLOCKER_STATUS.thumbNailEnabled;
        setState(next);
        writeState(next);
        setBlockerClass(next === BLOCKER_STATUS.thumbNailEnabled); // instant, no wait
        if (next === BLOCKER_STATUS.thumbNailEnabled) {
            hideShorts();
        }
        await sleep(300)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
        }
    }

    return (
        <div
            className={`tb-toggle ${on ? 'is-on' : ''}`}
            role="switch"
            aria-checked={on}
            aria-label="Block YouTube thumbnails"
            tabIndex={0}
            title={on
                ? 'Thumbnails hidden — click to show them'
                : 'Thumbnails visible — click to hide them'}
            onClick={toggle}
            onKeyDown={onKeyDown}
        >
            {/* eye / eye-off icon: crossed-out when blocking is on */}
            <svg className="tb-icon" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                 strokeLinejoin="round" aria-hidden="true">
                {on ? (
                    <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                ) : (
                    <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </>
                )}
            </svg>
            <span className="tb-label">Thumbnails</span>
            <span className="tb-switch" aria-hidden="true">
                <span className="tb-knob"/>
            </span>
        </div>
    )
}
