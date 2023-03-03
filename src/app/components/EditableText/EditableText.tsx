import PencilIcon from "common/images/pencil.svg";
import ResetIcon from "common/images/reset.svg";
import { getResourceUrl } from "lib/chrome-utils";
import React from "react";

import style from "./EditableText.scss";

export enum FontSize {
    LARGE,
    SMALL,
}

export type Props = {
    text: string;
    placeholderText?: string;
    fontSize: FontSize;
    canReload: boolean;
    onTextChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onReload: () => void;
};

export default function EditableText(props: Props): JSX.Element {
    const placeholderText = props.placeholderText || "";
    let inputRef: HTMLTextAreaElement | null = null;

    const fontClass = props.fontSize === FontSize.LARGE ? style.largeFont : style.smallFont;

    return (
        <div className={style.inputContainer}>
            <div className={[style.inputText, fontClass, style.hiddenBack].join(" ")}>
                {props.text}
            </div>
            <textarea
                className={[style.inputText, fontClass].join(" ")}
                style={{ boxShadow: "none" }}
                value={props.text}
                onChange={props.onTextChange}
                placeholder={placeholderText}
                ref={(ref) => {
                    inputRef = ref;
                }}
            />
            <div className={style.buttonBar}>
                {props.canReload && (
                    <div className={style.button} onClick={props.onReload}>
                        <img className={style.icon} src={getResourceUrl(ResetIcon)} />
                    </div>
                )}
                <div className={style.button} onClick={() => inputRef?.focus()}>
                    <img className={style.icon} src={getResourceUrl(PencilIcon)} />
                </div>
            </div>
        </div>
    );
}
