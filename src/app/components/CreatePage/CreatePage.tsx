import EditableText from "components/EditableText/EditableText";
import Page from "components/Page/Page";
import { GeneratedOptions } from "lib/openai-queries";
import React from "react";

import style from "./CreatePage.scss";

export type OverwriteFunc = (adIndex: number, optionIndex: number, value: string) => void;

export type Props = {
    options: GeneratedOptions;
    ads: AdSelection[];
    selectedAd: number;
    onHeadlineOverwrite: OverwriteFunc;
};

export type AdSelection = {
    headlineIndex: number;
    introTextIndex: number;
    imageIndex: number;
    headlineOverwrites: Map<number, string>;
    introTextOverwrites: Map<number, string>;
};

export default function CreatePage(props: Props): JSX.Element {
    const { headlines, introTexts, imageUrls } = props.options;

    const createOnOverwrite = (): React.ChangeEventHandler<HTMLTextAreaElement> => {
        return (e) => {
            props.onHeadlineOverwrite(0, 0, e.target.value);
        };
    };

    const createOnReload = () => {
        return () => {
            props.onHeadlineOverwrite(0, 0, props.options.headlines[0]);
        };
    };

    const firstAdFirstHeadlineOverwrites = props.ads[0].headlineOverwrites;
    const hasOverwrite = firstAdFirstHeadlineOverwrites.has(0);
    const firstAdFirstHeadline = hasOverwrite
        ? (firstAdFirstHeadlineOverwrites.get(0) as string)
        : headlines[0];

    return (
        <Page>
            <div className={style.headlineSectionContainer}>
                <div className={style.headlineInputContainer}>
                    <EditableText
                        text={firstAdFirstHeadline}
                        canReload={hasOverwrite}
                        onTextChange={createOnOverwrite()}
                        onReload={createOnReload()}
                    />
                </div>
            </div>
        </Page>
    );
}

// {
//     /* <Page>
//             <div>
//                 <p>
//                     Headlines:
//                     <ul>
//                         {headlines.map((h) => (
//                             <li>{h}</li>
//                         ))}
//                     </ul>
//                 </p>
//                 <p>
//                     Intro texts:
//                     <ul>
//                         {introTexts.map((h) => (
//                             <li>{h}</li>
//                         ))}
//                     </ul>
//                 </p>
//                 <p>
//                     Images:
//                     <ul>
//                         {imageUrls.map((h) => (
//                             <li>{h}</li>
//                         ))}
//                     </ul>
//                 </p>
//             </div>
//         </Page> */
// }
