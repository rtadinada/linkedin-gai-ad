import LeftArrow from "common/images/arrow-left.svg";
import RightArrow from "common/images/arrow-right.svg";
import Button from "components/Button/Button";
import SecondaryButton, { SecondaryButtonColor } from "components/Button/SecondaryButton";
import Carousel from "components/Carousel/Carousel";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import EditableText, { FontSize } from "components/EditableText/EditableText";
import Page from "components/Page/Page";
import { getResourceUrl } from "lib/chrome-utils";
import { getHeadlineIntroOverlayUrl } from "lib/cm-queries";
import { GeneratedOptions } from "lib/openai-queries";
import { range } from "lib/util";
import React from "react";

import style from "./CreatePage.scss";

export const MAX_ADS = 5;

export type OverwriteFunc = (optionIndex: number, value: string) => void;

export type Props = {
    options: GeneratedOptions;
    ads: AdSelection[];
    selectedAd: number;
    onHeadlineOverwrite: OverwriteFunc;
    onChangeSelectedHeadline: (index: number) => void;
    onIntroTextOverwrite: OverwriteFunc;
    onChangeSelectedIntroText: (index: number) => void;
    onOverlayTextOverwrite: OverwriteFunc;
    onChangeSelectedOverlayText: (index: number) => void;
    onChangeSelectedImage: (index: number) => void;
    onSelectAd: (index: number) => void;
    onCreateNewAd: () => void;
    onDeleteAd: () => void;
    onCreateCampaign: () => void;
};

export type AdSelection = {
    headlineIndex: number;
    introTextIndex: number;
    overlayTextIndex: number;
    imageIndex: number;
    headlineOverwrites: Map<number, string>;
    introTextOverwrites: Map<number, string>;
    overlayTextOverwrites: Map<number, string>;
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
        fontSize: FontSize;
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
                    fontSize={opts.fontSize}
                    canReload={hasOverwrite}
                    onTextChange={onTextChange}
                    onReload={onReload}
                />
            );
        };
    };

    type ImageInputCreatorOptions = {
        options: string[];
    };
    const imageElementCreatorCreator = (
        opts: ImageInputCreatorOptions
    ): ((i: number) => JSX.Element) => {
        return (i) => <img key={i} className={style.image} src={opts.options[i]} />;
    };

    type TextInputCarouselOptions = {
        options: string[];
        fontSize: FontSize;
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

    type ImageCarouselOptions = {
        options: string[];
        indexGetter: (ad: AdSelection) => number;
        onChangeIndex: (index: number) => void;
        sectionContainerClass: string;
        arrowClass: string;
        carouselContainerClass: string;
        carouselAlign: string;
    };
    const createImageCarousel = (opts: ImageCarouselOptions): JSX.Element => {
        const carouselElementCreator = imageElementCreatorCreator(opts);
        return createCarouselSection({ ...opts, carouselElementCreator });
    };

    const { overlayText } = getHeadlineIntroOverlayUrl(props.options, props.ads[props.selectedAd]);
    console.log(overlayText);

    return (
        <Page justifyContent="flex-start">
            <div className={style.pageTitleContainer}>
                <h1>Select Ads</h1>
            </div>
            {createTextInputCarousel({
                options: props.options.headlines,
                fontSize: FontSize.LARGE,
                overwritesGetter: (ad) => ad.headlineOverwrites,
                onOverwrite: props.onHeadlineOverwrite,
                indexGetter: (ad) => ad.headlineIndex,
                onChangeIndex: props.onChangeSelectedHeadline,
                sectionContainerClass: style.headlineSectionContainer,
                arrowClass: style.headlineArrow,
                carouselContainerClass: style.headlineInputContainer,
                carouselAlign: "flex-end",
            })}
            {createTextInputCarousel({
                options: props.options.overlayTexts,
                fontSize: FontSize.SMALL,
                overwritesGetter: (ad) => ad.overlayTextOverwrites,
                onOverwrite: props.onOverlayTextOverwrite,
                indexGetter: (ad) => ad.overlayTextIndex,
                onChangeIndex: props.onChangeSelectedOverlayText,
                sectionContainerClass: style.overlayTextSectionContainer,
                arrowClass: style.overlayTextArrow,
                carouselContainerClass: style.overlayTextInputContainer,
                carouselAlign: "flex-start",
            })}
            {createImageCarousel({
                options: props.options.imageUrls,
                indexGetter: (ad) => ad.imageIndex,
                onChangeIndex: props.onChangeSelectedImage,
                sectionContainerClass: style.imageSectionContainer,
                arrowClass: style.imageArrow,
                carouselContainerClass: style.imageInputContainer,
                carouselAlign: "center",
            })}
            {createTextInputCarousel({
                options: props.options.introTexts,
                fontSize: FontSize.SMALL,
                overwritesGetter: (ad) => ad.introTextOverwrites,
                onOverwrite: props.onIntroTextOverwrite,
                indexGetter: (ad) => ad.introTextIndex,
                onChangeIndex: props.onChangeSelectedIntroText,
                sectionContainerClass: style.introTextSectionContainer,
                arrowClass: style.introTextArrow,
                carouselContainerClass: style.introTextInputContainer,
                carouselAlign: "flex-start",
            })}
            <div className={style.numberButtons}>
                {range(props.ads.length).map((i) => {
                    const selected = i === props.selectedAd;
                    const num = i + 1;

                    const onClick = () => {
                        props.onSelectAd(i);
                    };
                    const classes = [style.numberButton];
                    if (selected) {
                        classes.push(style.selectedNumber);
                    }

                    return (
                        <button onClick={onClick} className={classes.join(" ")} key={i}>
                            {num}
                        </button>
                    );
                })}
            </div>
            <div className={style.buttonBar}>
                <div className={style.leftSideButton}>
                    <SecondaryButton
                        disabled={props.ads.length === 1}
                        color={SecondaryButtonColor.RED}
                        onClick={props.onDeleteAd}
                    >
                        Delete
                    </SecondaryButton>
                </div>
                <div className={style.rightSideButton}>
                    <SecondaryButton
                        disabled={props.ads.length === MAX_ADS}
                        onClick={props.onCreateNewAd}
                    >
                        Select Another
                    </SecondaryButton>
                </div>
                <div className={style.rightSideButton}>
                    <Button onClick={props.onCreateCampaign}>Create Campaign</Button>
                </div>
            </div>
        </Page>
    );
}
