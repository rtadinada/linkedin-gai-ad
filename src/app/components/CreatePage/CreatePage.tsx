import Page from "components/Page/Page";
import { GeneratedOptions } from "lib/openai-queries";
import React from "react";

// import style from "./GeneratePage.scss";

export type Props = {
    options: GeneratedOptions;
    ads: AdSelection[];
    selectedAd: number;
};

export type OverwriteIndex = {
    index: number;
    overwrite: string | null;
};
export type AdSelection = {
    headlineIndex: OverwriteIndex;
    introTextIndex: OverwriteIndex;
    imageIndex: number;
};

export default function CreatePage(props: Props): JSX.Element {
    const { headlines, introTexts, imageUrls } = props.options;

    return (
        <Page>
            <div>
                <p>
                    Headlines:
                    <ul>
                        {headlines.map((h) => (
                            <li>{h}</li>
                        ))}
                    </ul>
                </p>
                <p>
                    Intro texts:
                    <ul>
                        {introTexts.map((h) => (
                            <li>{h}</li>
                        ))}
                    </ul>
                </p>
                <p>
                    Images:
                    <ul>
                        {imageUrls.map((h) => (
                            <li>{h}</li>
                        ))}
                    </ul>
                </p>
            </div>
        </Page>
    );
}
