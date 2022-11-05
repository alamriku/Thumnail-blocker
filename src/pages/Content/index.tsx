import React from "react";
import ReactDOM from "react-dom";
import {App} from "./App";

const listenToDomChange = () => {
    const targetNode = document.querySelector('body')!;

    const config = {
        attributes: true,
        childList: true,
        characterData: true
    };

    const callback = (mutations: MutationRecord[]) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                console.log(targetNode.children);
                const listValues = Array.from(targetNode.children)
                    .map(node => node.innerHTML)
                    .filter(html => html !== '<br>');
                console.log(listValues);
            }
        });
    }

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}

const bindReactInstance = () => {
    //listenToDomChange();
let youtubeContainer = document.createElement('div');
    youtubeContainer.id = 'thumbNailBlockerRoot';
let point:Element = document.querySelector('body #page-manager')!
    if (point) {
        point.insertAdjacentElement('beforeend', youtubeContainer)
        ReactDOM.render(<App />, document.querySelector('#thumbNailBlockerRoot'));
    }
}
window.onload = bindReactInstance