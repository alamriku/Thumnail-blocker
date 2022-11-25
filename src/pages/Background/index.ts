chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
    console.log(changeInfo, tab)
})