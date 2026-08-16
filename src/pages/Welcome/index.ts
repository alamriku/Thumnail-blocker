// External script (extension-page CSP blocks inline <script>).
import {reviewUrl} from "../constant";

const api: typeof chrome =
    typeof (globalThis as any).browser !== "undefined"
        ? (globalThis as any).browser
        : chrome;

// Firefox's pin flow differs from Chrome's, so tag the page to swap copy/visuals.
const isFirefox = api.runtime.getURL("").startsWith("moz-extension");
document.body.classList.add(isFirefox ? "ff" : "cr");

const reviewLink = document.getElementById("review-link") as HTMLAnchorElement | null;
if (reviewLink) {
    reviewLink.href = reviewUrl();
}

const iconUrl = api.runtime.getURL("icon-128.png");
["brand-icon", "menu-icon"].forEach((id) => {
    const el = document.getElementById(id) as HTMLImageElement | null;
    if (el) {
        el.src = iconUrl;
    }
});

const closeBtn = document.getElementById("close-btn");
if (closeBtn) {
    closeBtn.addEventListener("click", () => window.close());
}
