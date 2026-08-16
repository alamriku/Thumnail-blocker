export enum BLOCKER_STATUS{
    toggleName  = 'isThumbnailEnabled',
    toggleDefaultValue = 'enabled',
    thumbNailEnabled = 'enabled',
    thumbNailDisabled = 'disabled',
    enabledDisplayText = 'Enabled',
    disabledDisplayText = 'Disabled',
}

const REVIEW_URL = {
    chrome:
        'https://chromewebstore.google.com/detail/thumb-blocker-hide-youtub/anhgkgicmobhfkigcljmdhpkigfcplam/reviews',
    firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/hide-youtube-thumbnail/reviews/',
};

// Firefox extension URLs use the moz-extension:// scheme; Chrome uses chrome-extension://.
export const isFirefox = (): boolean => {
    const api: typeof chrome =
        typeof (globalThis as any).browser !== 'undefined'
            ? (globalThis as any).browser
            : chrome;
    return api?.runtime?.getURL('').startsWith('moz-extension') ?? false;
};

export const reviewUrl = (): string =>
    isFirefox() ? REVIEW_URL.firefox : REVIEW_URL.chrome;