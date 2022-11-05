import '../../Content/content.styles.css';
import React, {useEffect, useState} from "react";
import {BLOCKER_STATUS} from "../../constant";
import {sleep} from "../../helper";

interface IYoutubeObserverParam {
    selector: string,
    parent: Document,
    recursive: boolean,
    done: (el: Element) => void
}

export const Youtube = () => {
    const setToggleValue = (value:string) => {
        localStorage.setItem(BLOCKER_STATUS.toggleName, value)
    }
    const getToggleValue = ():string => {
        if (localStorage.getItem(BLOCKER_STATUS.toggleName)) {
            return localStorage.getItem(BLOCKER_STATUS.toggleName)!;
        }
        return BLOCKER_STATUS.toggleDefaultValue;
    }
    let [blockerToggle, setBlockerToggle] = useState(getToggleValue());
    const addHideClass = (thumbNailNodes: HTMLElement[]) => {
        thumbNailNodes.forEach(item => {
            let img = item.querySelector('img');
            if (img) {
                img.classList.add('youtube_thumbnail_hide');
            }
        })
    }

    const hideThumbnailImages = () => {
        try {
            let thumbNailNodes: HTMLElement[] = Array.from(getThumbnailImages());
            if (thumbNailNodes) {
                addHideClass(thumbNailNodes)
            }
        } catch (e) {
            console.log(e);
        }
    }

    const waitingForExpectedNode = (params: IYoutubeObserverParam) => {
        let youtubeThumbnailObserver = new MutationObserver(function (mutations) {
            let el: Element = document.querySelector(params.selector)!;
            if (el) {
                youtubeThumbnailObserver.disconnect();
                params.done(el);
            }
        });
        youtubeThumbnailObserver.observe(params.parent || document, {
            subtree: true,
            childList: true,
        });
    }

    const observeThumbnail = () => {
        waitingForExpectedNode({
            selector: 'ytd-thumbnail.style-scope.ytd-rich-grid-media',
            parent: document,
            recursive: false,
            done: function (el: Element) {
                hideThumbnailImages();
            }
        });

    }

    const getThumbnailImages = () => {
        return document.querySelectorAll<HTMLElement>('ytd-thumbnail.style-scope.ytd-rich-grid-media');
    }

    const listenOnScrolling = () => {
        window.addEventListener('scroll', function () {
            observeThumbnail();
        })
    }
    const initBlocker = () => {
        try {
            console.log(localStorage.getItem(BLOCKER_STATUS.toggleName));
            if (!localStorage.getItem(BLOCKER_STATUS.toggleName)) {
                setToggleValue(BLOCKER_STATUS.thumbNailEnabled)
                setTimeout(function () {
                    observeThumbnail();
                    hideThumbnailImages();
                    listenOnScrolling();
                }, 500)
            }
            if (localStorage.getItem(BLOCKER_STATUS.toggleName) == BLOCKER_STATUS.thumbNailEnabled) {
                setTimeout(function () {
                    observeThumbnail();
                    hideThumbnailImages();
                    listenOnScrolling();
                }, 500)
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        initBlocker()
    }, [])

    const handleThumbBlockerToggle = async (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        console.log(target.checked)
        if (target.checked) {
            setBlockerToggle(BLOCKER_STATUS.thumbNailEnabled)
            setToggleValue(BLOCKER_STATUS.thumbNailEnabled)
        }
        if (!target.checked) {
            setBlockerToggle(BLOCKER_STATUS.thumbNailDisabled)
            setToggleValue(BLOCKER_STATUS.thumbNailDisabled)
        }
        await sleep(300)
        console.log('wating')
        window.location.reload();
    }

    return (
        <>
            <label htmlFor="thumbBLockerToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="thumbBLockerToggle" className="sr-only"
                            checked={blockerToggle === BLOCKER_STATUS.thumbNailEnabled}
                           onChange={handleThumbBlockerToggle}/>
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                    {blockerToggle === BLOCKER_STATUS.thumbNailEnabled
                        ? BLOCKER_STATUS.enabledDisplayText
                        : BLOCKER_STATUS.disabledDisplayText
                    }
                </div>
            </label>
            {/*<button type="button"*/}
            {/*        className="z-1000 toggle_button fixed top-1.5 right-80 inline-flex items-center px-6 py-6 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Button*/}
            {/*    Enabled*/}
            {/*</button>*/}

        </>
    )
}

