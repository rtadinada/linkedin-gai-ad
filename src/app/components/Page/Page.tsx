import React from "react";

import style from "./Page.scss";

export type Props = React.PropsWithChildren;

export default function Page(props: Props): JSX.Element {
    return <div className={style.page}>{props.children}</div>;
}