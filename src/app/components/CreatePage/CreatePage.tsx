import Page from "components/Page/Page";
import React from "react";

// import style from "./GeneratePage.scss";

export type Props = {
    html: string;
};

export default function CreatePage(props: Props): JSX.Element {
    return (
        <Page>
            <div>{props.html}</div>
        </Page>
    );
}
