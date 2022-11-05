import React from "react";
import {Youtube} from "./modules/thumbnail-hider";
import '../../assets/style/main.css'

export const App = () => {
    return (
        <div className="z-1000 fixed top-[2.12rem] right-80">
            <Youtube />
        </div>
    )
}
// let myContainer = document.createElement('div');
// myContainer.className = 'youtube_thumbnail_blocker';
// let target: any
// const addEnableDisableButton = () => {
//     target = document.querySelector('body');
//     if (target) {
//         target.appendChild(myContainer);
//         target.insertAdjacentElement('afterend', myContainer)
//         render(
//             <Content />,
//             window.document.querySelector('.container__MoveOn_AddTo_cart')
//         );
//     }
// }
//
// switch (getStoreSlug()) {
//     case MOVEON_SUPPORTED_STORE.ALIEXPRESS:
//         addEnableDisableButton()
//         break
//     default:
//         break;
// }