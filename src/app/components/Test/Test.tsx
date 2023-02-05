import React from "react";

import { getResourceUrl } from "lib/chrome-utils";
import style from "./Test.css";
import Image from "./Test.svg";

export default function Test(): JSX.Element {
    return (
        <div className={style.cover}>
            <div className={style.test}>Test</div>
            <img src={getResourceUrl(Image)} />
        </div>
    );
}
