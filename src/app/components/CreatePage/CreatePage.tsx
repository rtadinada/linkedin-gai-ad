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
    const selectedAd = props.ads[props.selectedAd];

    type CarouselOptions = {
        options: string[];
        indexGetter: (ad: AdSelection) => number;
        onChangeIndex: (index: number) => void;
        sectionContainerClass: string;
        arrowClass: string;
        carouselContainerClass: string;
        carouselAlign: string;
        carouselElementCreator: (index: number) => JSX.Element;
    };
    const createCarouselSection = (opts: CarouselOptions): JSX.Element => {
        const optionIndex = opts.indexGetter(selectedAd);

        return (
            <div className={opts.sectionContainerClass}>
                <div className={[style.arrowContainer, opts.arrowClass].join(" ")}>
                    <ClickableIcon
                        icon={getResourceUrl(LeftArrow)}
                        disabled={optionIndex === 0}
                        onClick={() => {
                            const newSelected = optionIndex - 1;
                            if (newSelected >= 0) {
                                opts.onChangeIndex(newSelected);
                            }
                        }}
                        paddingPercent={25}
                    />
                </div>
                <div className={opts.carouselContainerClass}>
                    <Carousel selected={optionIndex} alignItems={opts.carouselAlign}>
                        {range(opts.options.length).map(opts.carouselElementCreator)}
                    </Carousel>
                </div>
                <div className={[style.arrowContainer, opts.arrowClass].join(" ")}>
                    <ClickableIcon
                        icon={getResourceUrl(RightArrow)}
                        disabled={optionIndex === opts.options.length - 1}
                        onClick={() => {
                            const newSelected = optionIndex + 1;
                            if (newSelected < opts.options.length) {
                                opts.onChangeIndex(newSelected);
                            }
                        }}
                        paddingPercent={25}
                    />
                </div>
            </div>
        );
    };

    type TextInputCreatorOptions = {
        options: string[];
        overwritesGetter: (ad: AdSelection) => Map<number, string>;
        onOverwrite: OverwriteFunc;
    };
    const textInputElementCreatorCreator = (
        opts: TextInputCreatorOptions
    ): ((i: number) => JSX.Element) => {
        const overwrites = opts.overwritesGetter(selectedAd);

        return (i) => {
            const onTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
                opts.onOverwrite(i, e.target.value);
            };
            const onReload = () => {
                opts.onOverwrite(i, opts.options[i]);
            };

            const hasOverwrite = overwrites.has(i);
            const text = hasOverwrite ? (overwrites.get(i) as string) : opts.options[i];

            return (
                <EditableText
                    key={i}
                    text={text}
                    canReload={hasOverwrite}
                    onTextChange={onTextChange}
                    onReload={onReload}
                />
            );
        };
    };

    type TextInputCarouselOptions = {
        options: string[];
        overwritesGetter: (ad: AdSelection) => Map<number, string>;
        onOverwrite: OverwriteFunc;
        indexGetter: (ad: AdSelection) => number;
        onChangeIndex: (index: number) => void;
        sectionContainerClass: string;
        arrowClass: string;
        carouselContainerClass: string;
        carouselAlign: string;
    };
    const createTextInputCarousel = (opts: TextInputCarouselOptions): JSX.Element => {
        const carouselElementCreator = textInputElementCreatorCreator(opts);
        return createCarouselSection({ ...opts, carouselElementCreator });
    };

    return (
        <Page>
            {createTextInputCarousel({
                options: props.options.headlines,
                overwritesGetter: (ad) => ad.headlineOverwrites,
                onOverwrite: props.onHeadlineOverwrite,
                indexGetter: (ad) => ad.headlineIndex,
                onChangeIndex: props.onChangeSelectedHeadline,
                sectionContainerClass: style.headlineSectionContainer,
                arrowClass: style.headlineArrow,
                carouselContainerClass: style.headlineInputContainer,
                carouselAlign: "flex-end",
            })}
        </Page>
    );
}

// return (
//     <Page>
//         <div className={style.headlineSectionContainer}>
//             <div className={[style.arrowContainer, style.headlineArrow].join(" ")}>
//                 <ClickableIcon
//                     icon={getResourceUrl(LeftArrow)}
//                     disabled={props.ads[props.selectedAd].headlineIndex === 0}
//                     onClick={() => {
//                         const newSelected = props.ads[props.selectedAd].headlineIndex - 1;
//                         if (newSelected >= 0) {
//                             props.onChangeSelectedHeadline(newSelected);
//                         }
//                     }}
//                     paddingPercent={25}
//                 />
//             </div>
//             <div className={style.headlineInputContainer}>
//                 <Carousel
//                     selected={props.ads[props.selectedAd].headlineIndex}
//                     alignItems="flex-end"
//                 >
//                     {range(props.options.headlines.length).map((i) => {
//                         const overwrites = props.ads[props.selectedAd].headlineOverwrites;
//                         const hasOverwrite = overwrites.has(i);
//                         const headline = hasOverwrite
//                             ? (overwrites.get(i) as string)
//                             : props.options.headlines[i];
//                         return (
//                             <EditableText
//                                 key={i}
//                                 text={headline}
//                                 canReload={hasOverwrite}
//                                 onTextChange={createOnHeadlineOverwrite(i)}
//                                 onReload={createOnHeadlineReload(i)}
//                             />
//                         );
//                     })}
//                 </Carousel>
//             </div>
//             <div className={[style.arrowContainer, style.headlineArrow].join(" ")}>
//                 <ClickableIcon
//                     icon={getResourceUrl(RightArrow)}
//                     disabled={
//                         props.ads[props.selectedAd].headlineIndex ===
//                         props.options.headlines.length - 1
//                     }
//                     onClick={() => {
//                         const newSelected = props.ads[props.selectedAd].headlineIndex + 1;
//                         if (newSelected < props.options.headlines.length) {
//                             props.onChangeSelectedHeadline(newSelected);
//                         }
//                     }}
//                     paddingPercent={25}
//                 />
//             </div>
//         </div>
//     </Page>
// );
