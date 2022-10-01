import '../../Content/content.styles.css';

export const addHideClass = (thumbNailNodes) => {
    thumbNailNodes.forEach(item => {
        let img = item.querySelector('img');
        if (img) {
            img.classList.add('youtube_thumbnail_hide');
        }
    })
}

export const hideThumbnailImages = () => {
    try {
        let thumbNailNodes = [...getThumbnailImages()];
        if (thumbNailNodes) {
            addHideClass(thumbNailNodes)
        }
    } catch (e) {
        console.log(e);
    }

}

const waitingForExpectedNode = (params) => {
    let youtubeThumbnailObserver = new MutationObserver(function(mutations) {
        let el = document.querySelector(params.selector);
        if (el) {
            this.disconnect();
            params.done(el);
        }
    });
    youtubeThumbnailObserver.observe(params.parent || document, {
            subtree: true,
            childList: true,
        });
}

export const observeThumbnail = () => {
    waitingForExpectedNode({
        selector: 'ytd-thumbnail.style-scope.ytd-rich-grid-media',
        parent: document,
        recursive: false,
        done: function(el) {
            hideThumbnailImages();
        }
    });

}

export const getThumbnailImages = () => {
    return document.querySelectorAll('ytd-thumbnail.style-scope.ytd-rich-grid-media');
}

export const listenOnScrolling = () => {
    window.addEventListener('scroll', function () {
        observeThumbnail();
    })
}

export const youtube = () => {
    let previousThumbnailToggleState;
    try {
        chrome.runtime.sendMessage({type: "getThumbnailToggle"}, function (response) {
            previousThumbnailToggleState = response.thumbnailToggle;
            if(response.thumbnailToggle === 'enabled') {
                setTimeout(function () {
                    observeThumbnail();
                    hideThumbnailImages();
                    listenOnScrolling();
                }, 1500)
            }
        })
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(previousThumbnailToggleState);
                window.location.reload()
                return true;
            }
        );

    } catch (e) {
        console.log(e);
    }
}

