import React from "react";

import style from "./ClickableIcon.scss";

export type Props = React.PropsWithChildren<{
    icon: string;
    onClick: () => void;
    paddingPercent?: number;
    disabled?: boolean;
}>;

export default function Modal(props: Props): JSX.Element {
    const paddingPercent = props.paddingPercent || 10;
    const disabled = !!props.disabled;

    let containerClasses = [style.iconContainer];
    if (disabled) {
        containerClasses = containerClasses.concat([style.iconContainerDisable]);
    }

    return (
        <button
            onClick={() => {
                if (!disabled) {
                    props.onClick();
                }
            }}
            className={containerClasses.join(" ")}
            style={{ padding: `${paddingPercent}%` }}
        >
            <img className={style.icon} src={props.icon} />
        </button>
    );
}
