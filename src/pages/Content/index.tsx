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
window.onload = bindReactInstance