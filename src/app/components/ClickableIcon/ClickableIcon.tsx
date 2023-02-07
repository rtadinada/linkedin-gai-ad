import React from "react";

import style from "./ClickableIcon.scss";

export type Props = React.PropsWithChildren<{
    icon: string;
    onClick: () => void;
}>;

export default function Modal(props: Props): JSX.Element {
    return (
        <button onClick={props.onClick} className={style.iconContainer}>
            <img className={style.icon} src={props.icon} />
        </button>
    );
}
