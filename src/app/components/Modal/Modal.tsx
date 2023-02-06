import { getResourceUrl } from "lib/chrome-utils";
import React from "react";

import style from "./Modal.scss";
import X from "./x.svg";

export enum ModalSize {
    LARGE,
    SMALL,
}

export type Props = React.PropsWithChildren<{
    size?: ModalSize;
    onClose: () => void;
}>;

export default function Modal(props: Props): JSX.Element {
    let classNames = [style.modal];
    const size = props.size || ModalSize.LARGE;
    if (size === ModalSize.SMALL) {
        classNames = classNames.concat([style.modalSmall]);
    }

    return (
        <div className={style.backdrop}>
            <div className={classNames.join(" ")}>
                <button onClick={props.onClose} className={style.xContainer}>
                    <img src={getResourceUrl(X)} />
                </button>
                {props.children}
            </div>
        </div>
    );
}
