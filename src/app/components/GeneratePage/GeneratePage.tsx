import { getResourceUrl } from "lib/chrome-utils";
import Submit from "components/Button/Submit";
import Page from "components/Page/Page";
import React, { ChangeEventHandler, FormEventHandler } from "react";

import style from "./GeneratePage.scss";
import OpenAI from "./openai.svg";

export type Props = {
    urlInput: string;
    onInputChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
};

export default function GeneratePage(props: Props): JSX.Element {
    return (
        <Page>
            <form className={style.form} onSubmit={props.onSubmit}>
                <img className={style.logo} src={getResourceUrl(OpenAI)} />
                <input
                    id={style.urlInput}
                    onChange={props.onInputChange}
                    placeholder="Landing page URL"
                    type="text"
                />
                <Submit>Generate</Submit>
            </form>
        </Page>
    );
}
