import PencilIcon from "common/images/pencil.svg";
import ResetIcon from "common/images/reset.svg";
import { getResourceUrl } from "lib/chrome-utils";
import React from "react";

import style from "./EditableText.scss";

export type Props = {
    text: string;
    canReload: boolean;
    onTextChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onReload: () => void;
};

export default function EditableText(props: Props): JSX.Element {
    let inputRef: HTMLTextAreaElement | null = null;

    return (
        <div className={style.inputContainer}>
            <div className={`${style.inputText} ${style.hiddenBack}`}>{props.text}</div>
            <textarea
                className={style.inputText}
                style={{ boxShadow: "none" }}
                value={props.text}
                onChange={props.onTextChange}
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