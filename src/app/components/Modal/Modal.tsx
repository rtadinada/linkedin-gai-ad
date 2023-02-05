import { getResourceUrl } from "lib/chrome-utils";
import React from "react";

import style from "./Modal.scss";
import X from "./x.svg";

export type Props = {
    children: React.ReactElement;
    onClose: () => void;
};

export default function Modal(props: Props): JSX.Element {
    return (
        <div className={style.backdrop}>
            <div className={style.modal}>
                <button onClick={props.onClose} className={style.xContainer}>
                    <img src={getResourceUrl(X)} />
                </button>
                {props.children}
            </div>
        </div>
    );
}
