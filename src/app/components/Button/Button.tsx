import React from "react";

export type Props = {
    onClick: React.MouseEventHandler;
    children: string;
};

export default function Button(props: Props): JSX.Element {
    return <button onClick={props.onClick}>{props.children}</button>;
}
