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
