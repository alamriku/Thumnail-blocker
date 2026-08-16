export const sleep = (durationMilliseconds:number):Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, durationMilliseconds));
}

// Root class that drives all hiding rules in content.styles.css.
export const BLOCKER_ROOT_CLASS = 'thumb-blocker-on';

// Toggle the single <html> class. CSS does the actual hiding, so this covers
// current + future/lazy thumbnails and survives SPA navigation with no observers.
export const setBlockerClass = (enabled: boolean): void => {
    document.documentElement.classList.toggle(BLOCKER_ROOT_CLASS, enabled);
}