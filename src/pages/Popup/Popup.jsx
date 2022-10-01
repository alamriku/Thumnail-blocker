import React, {useEffect, useState} from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
    const [thumbnailBlockCheck, setThumbnailBlockCheck] = useState(true);

    const handleThumbnailSwitch = (v) => {
        if (v) {
            chrome.runtime.sendMessage({
                type: 'thumbnailBlockerFromPopup',
                thumbnailBlocker: "enabled"
            }, function (response) {
                console.log(response);
            });

            return !v;
        } else {
            chrome.runtime.sendMessage({
                type: 'thumbnailBlockerFromPopup',
                thumbnailBlocker: "disabled"
            }, function (response) {
                console.log(response);
            });
            return !v;
        }
    }

    return (
        <div className="App hide_thumbnail_app_overflow_hidden bg-gray-50">
            <div className="h-16 bg-accent rounded-b-2xl bg-black absolute top-0 left-0 w-full"></div>
            <div
                className="absolute hide_thumbnail_width hide_thumbnail_position flex items-center space-x-2 hover:ring-2 hover:ring-gray-900 bg-white dark:bg-gray-800 transform rounded-lg ui-card p-4 w-full flex items-center space-x-2 hover:ring-2 hover:ring-gray-900">
                <span className="font-extrabold">{thumbnailBlockCheck ? "Enabled" : "Disabled"}</span>
                <input type="checkbox" className={thumbnailBlockCheck ? "enabledThumbBlocker" : "disabledThumbBlocker"}
                       id="thumbnailHideButton" onChange={() => setThumbnailBlockCheck(handleThumbnailSwitch)}
                       checked={thumbnailBlockCheck}
                />
                <label htmlFor="thumbnailHideButton" className="relative"></label>
            </div>
        </div>
    );
};

export default Popup;
