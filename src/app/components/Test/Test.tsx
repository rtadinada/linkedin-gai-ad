import React from "react";

import style from "./Test.css";
import Image from "./Test.svg";

export default function Test(): JSX.Element {
    return (
        <div>
            <div className={style.test}>Test</div>
            <img src={Image} />
        </div>
    );
}
