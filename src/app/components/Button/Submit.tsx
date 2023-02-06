import React from "react";

import style from "./Button.scss";

export type Props = {
    children: string;
};

export default function Submit(props: Props): JSX.Element {
    return <input type="submit" className={style.button} value={props.children} />;
}
