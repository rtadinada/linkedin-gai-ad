import React, { MouseEventHandler } from "react";

import style from "./Button.scss";

export enum SecondaryButtonColor {
    RED,
    BLUE,
}

export type Props = {
    onClick: MouseEventHandler<HTMLButtonElement>;
    color?: SecondaryButtonColor;
    disabled?: boolean;
    children: string;
};

export default function SecondaryButton(props: Props): JSX.Element {
    const color =
        props.color === SecondaryButtonColor.RED
            ? SecondaryButtonColor.RED
            : SecondaryButtonColor.BLUE;
    const disabled = !!props.disabled;

    const classes = [style.secondaryButton];
    if (disabled) {
        classes.push(style.secondaryButtonDisabled);
    } else if (color === SecondaryButtonColor.RED) {
        classes.push(style.secondaryButtonRed);
    }

    return (
        <button className={classes.join(" ")} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
