import React from "react";
import ReactDOM from "react-dom";
import {App} from "./App";

const bindReactInstance = () => {
let youtubeContainer = document.createElement('div');
    youtubeContainer.id = 'thumbNailBlockerRoot';
let point:Element = document.querySelector('body #page-manager')!
    if (point) {
        point.insertAdjacentElement('beforeend', youtubeContainer)
        ReactDOM.render(<App />, document.querySelector('#thumbNailBlockerRoot'));
    }
}

const observeBody = () => {
    let youtubeBodyObserver = new MutationObserver(function (mutations) {
        let el: any = document.querySelector('#thumbNailBlockerRoot')!;
       console.log('test,body observer')
        if (window.location.href.indexOf('watch?v') === -1 && el) {
           el.style.display = 'block'
       }
       if (window.location.href.indexOf('watch?v') !== -1 && el) {
           el.style.display = 'none'
       }
    });
    youtubeBodyObserver.observe(  document, {
        subtree: true,
        childList: true,
    });
}
const initThumbBlocker = () => {
    if (window.location.href.indexOf('watch?v') === -1) {
        bindReactInstance();
        observeBody();
    }
}

window.onload = initThumbBlocker
