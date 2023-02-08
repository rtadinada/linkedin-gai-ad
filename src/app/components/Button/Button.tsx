import React, { MouseEventHandler } from "react";

import style from "./Button.scss";

export type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    icon?: string;
    isIconRight?: boolean;
    children: string;
};

export default function Button(props: Props): JSX.Element {
    const isIconRight = !!props.isIconRight;
    return (
        <button className={style.button} onClick={props.onClick}>
            {props.icon && !isIconRight && (
                <img className={[style.icon, style.iconLeft].join(" ")} src={props.icon} />
            )}
            {props.children}
            {props.icon && isIconRight && (
                <img className={[style.icon, style.iconRight].join(" ")} src={props.icon} />
            )}
        </button>
    );
}
