import React, { MouseEventHandler } from "react";

import style from "./Button.scss";

export type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    icon?: string;
    children: string;
};

export default function Button(props: Props): JSX.Element {
    return (
        <button className={style.button} onClick={props.onClick}>
            {props.icon && <img className={style.icon} src={props.icon} />}
            {props.children}
        </button>
    );
}
