import React from "react";

import style from "./Button.scss";

export type Props = {
    onClick: React.MouseEventHandler;
    children: string;
};

export default function Button(props: Props): JSX.Element {
    return (
        <button className={style.button} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
