import X from "common/images/x.svg";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import { getResourceUrl } from "lib/chrome-utils";
import React from "react";

import style from "./Modal.scss";

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
                {props.children}
                <div className={style.xContainer}>
                    <ClickableIcon icon={getResourceUrl(X)} onClick={props.onClose} />
                </div>
            </div>
        </div>
    );
}
