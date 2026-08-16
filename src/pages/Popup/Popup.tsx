import React, {useEffect, useState} from "react";
import {BLOCKER_STATUS, reviewUrl} from "../constant";
import {isEnabled, readState, subscribe, writeState} from "../state";
import "./popup.css";

export const Popup = () => {
    const [state, setState] = useState<string>(BLOCKER_STATUS.toggleDefaultValue);
    const on = isEnabled(state);

    useEffect(() => {
        readState(setState);
        subscribe(setState);
    }, []);

    const toggle = () => {
        const next = on
            ? BLOCKER_STATUS.thumbNailDisabled
            : BLOCKER_STATUS.thumbNailEnabled;
        setState(next);
        writeState(next);
    };

    return (
        <div className="pp">
            <div className="pp-head">
                <span className={`pp-logo ${on ? "on" : ""}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         aria-hidden="true">
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
                </span>
                <div className="pp-titles">
                    <div className="pp-title">Thumb Blocker</div>
                    <div className="pp-sub">Hide YouTube thumbnails</div>
                </div>
            </div>

            <button
                type="button"
                className={`pp-row ${on ? "on" : ""}`}
                role="switch"
                aria-checked={on}
                onClick={toggle}
            >
                <span className="pp-row-label">
                    {on ? "Thumbnails hidden" : "Thumbnails visible"}
                </span>
                <span className="pp-switch" aria-hidden="true">
                    <span className="pp-knob"/>
                </span>
            </button>

            <div className="pp-note">
                Applies to all YouTube tabs. There's also a quick toggle in the
                YouTube top bar on wider screens.
            </div>

            <a
                className="pp-rate"
                href={reviewUrl()}
                target="_blank"
                rel="noopener noreferrer"
            >
                Enjoying Thumb Blocker? Leave a 5-star review ★
            </a>
        </div>
    );
};
