import LeftArrow from "common/images/arrow-left.svg";
import RightArrow from "common/images/arrow-right.svg";
import Carousel from "components/Carousel/Carousel";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import EditableText from "components/EditableText/EditableText";
import Page from "components/Page/Page";
import { getResourceUrl } from "lib/chrome-utils";
import { GeneratedOptions } from "lib/openai-queries";
import { range } from "lib/util";
import React from "react";

import style from "./CreatePage.scss";

export type OverwriteFunc = (optionIndex: number, value: string) => void;

export type Props = {
    options: GeneratedOptions;
    ads: AdSelection[];
    selectedAd: number;
    onHeadlineOverwrite: OverwriteFunc;
    onChangeSelectedHeadline: (index: number) => void;
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

    const createOnHeadlineOverwrite = (
        optionNum: number
    ): React.ChangeEventHandler<HTMLTextAreaElement> => {
        return (e) => {
            props.onHeadlineOverwrite(optionNum, e.target.value);
        };
    };
    const createOnHeadlineReload = (optionNum: number) => {
        return () => {
            props.onHeadlineOverwrite(optionNum, props.options.headlines[optionNum]);
        };
    };

    return (
        <Page>
            <div className={style.headlineSectionContainer}>
                <div className={[style.arrowContainer, style.headlineArrow].join(" ")}>
                    <ClickableIcon
                        icon={getResourceUrl(LeftArrow)}
                        disabled={props.ads[props.selectedAd].headlineIndex === 0}
                        onClick={() => {
                            const newSelected = props.ads[props.selectedAd].headlineIndex - 1;
                            if (newSelected >= 0) {
                                console.log("change");
                                props.onChangeSelectedHeadline(newSelected);
                            }
                        }}
                        paddingPercent={25}
                    />
                </div>
                <div className={style.headlineInputContainer}>
                    <Carousel
                        selected={props.ads[props.selectedAd].headlineIndex}
                        alignItems="flex-end"
                    >
                        {range(props.options.headlines.length).map((i) => {
                            const overwrites = props.ads[props.selectedAd].headlineOverwrites;
                            const hasOverwrite = overwrites.has(i);
                            const headline = hasOverwrite
                                ? (overwrites.get(i) as string)
                                : props.options.headlines[i];
                            return (
                                <EditableText
                                    key={i}
                                    text={headline}
                                    canReload={hasOverwrite}
                                    onTextChange={createOnHeadlineOverwrite(i)}
                                    onReload={createOnHeadlineReload(i)}
                                />
                            );
                        })}
                    </Carousel>
                </div>
                <div className={[style.arrowContainer, style.headlineArrow].join(" ")}>
                    <ClickableIcon
                        icon={getResourceUrl(RightArrow)}
                        disabled={
                            props.ads[props.selectedAd].headlineIndex ===
                            props.options.headlines.length - 1
                        }
                        onClick={() => {
                            const newSelected = props.ads[props.selectedAd].headlineIndex + 1;
                            if (newSelected < props.options.headlines.length) {
                                props.onChangeSelectedHeadline(newSelected);
                            }
                        }}
                        paddingPercent={25}
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
