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
                //img.classList.add('youtube_thumbnail_hide');
                img.classList.remove( 'opacity-1');
                img.classList.add('transition-opacity','duration-1000', 'ease-out', 'opacity-0');
            }
        })
    }

    const removeHideClass = (thumbNailNodes: HTMLElement[]) => {
        thumbNailNodes.forEach(item => {
            let img = item.querySelector('img');
            if (img) {
                //img.classList.remove('youtube_thumbnail_hide');
                img.classList.remove( 'opacity-0');
                img.classList.add( 'opacity-1');
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
    const showThumbnails = () => {
        try {
            let thumbNailNodes: HTMLElement[] = Array.from(getThumbnailImages());
            if (thumbNailNodes) {
                removeHideClass(thumbNailNodes)
            }
        } catch (e) {
            console.log(e);
        }
    }
    const waitingForExpectedNode = (params: IYoutubeObserverParam) => {
        let youtubeThumbnailObserver = new MutationObserver(function (mutations) {
            let el: Element = document.querySelector(params.selector)!;
            if (el) {
                params.done(el);
                youtubeThumbnailObserver.disconnect();
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

    const listenOnScrolling = (contain:string) => {
        window.addEventListener('scroll', function () {
            console.log(blockerToggle);
            if (BLOCKER_STATUS.thumbNailEnabled === contain) {
                observeThumbnail();
            }
        })
    }
    const initBlocker = () => {
        try {
            if (!localStorage.getItem(BLOCKER_STATUS.toggleName)) {
                setToggleValue(BLOCKER_STATUS.thumbNailEnabled)
                setTimeout(function () {
                    observeThumbnail();
                    hideThumbnailImages();
                    listenOnScrolling(BLOCKER_STATUS.thumbNailEnabled);
                }, 500)
            }
            if (localStorage.getItem(BLOCKER_STATUS.toggleName) == BLOCKER_STATUS.thumbNailEnabled) {
                setTimeout(function () {
                    observeThumbnail();
                    hideThumbnailImages();
                    listenOnScrolling(BLOCKER_STATUS.thumbNailEnabled);
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
        if (target.checked) {
            setBlockerToggle(BLOCKER_STATUS.thumbNailEnabled)
            setToggleValue(BLOCKER_STATUS.thumbNailEnabled)
            listenOnScrolling(BLOCKER_STATUS.thumbNailEnabled);
            hideThumbnailImages();
        }
        if (!target.checked) {
            setBlockerToggle(BLOCKER_STATUS.thumbNailDisabled);
            setToggleValue(BLOCKER_STATUS.thumbNailDisabled);
            listenOnScrolling(BLOCKER_STATUS.thumbNailDisabled);
            showThumbnails();
        }
        await sleep(300)
        //window.location.reload();
    }

    return (
        <div className="flex items-center">
            <span className="block items-center text-gray-700 font-medium mr-2"> Thumb Blocker </span>
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

        </div>
    )
}

