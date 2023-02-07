import React from "react";

import style from "./Page.scss";

export type Props = React.PropsWithChildren<{
    justifyContent?: string;
}>;

export default function Page(props: Props): JSX.Element {
    const justifyContent = props.justifyContent || "center";
    const elStyle = { justifyContent };

    return (
        <div style={elStyle} className={style.page}>
            {props.children}
        </div>
    );
}
