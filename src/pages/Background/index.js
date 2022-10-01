chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'getThumbnailToggle') {
        chrome.storage.local.get(['thumbnailBlocker'], function (result){
            sendResponse({'thumbnailToggle': result.thumbnailBlocker});
        })
    }

    if (request.type === 'thumbnailBlockerFromPopup') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.storage.local.set({"thumbnailBlocker": request.thumbnailBlocker}, function () {

            })
            chrome.tabs.sendMessage(tabs[0].id, {'thumbnailToggle': request.thumbnailBlocker}, function(response) {
                console.log(response);
            });
        });
    }
    return true;
})
