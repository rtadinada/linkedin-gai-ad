import { AdSelection } from "components/CreatePage/CreatePage";

import { createAd, createCampaign } from "./cm-fetch";
import { GeneratedOptions } from "./openai-queries";

export function getHeadlineIntroOverlayUrl(options: GeneratedOptions, ad: AdSelection) {
    const headlineIndex = ad.headlineIndex;
    let headline = ad.headlineOverwrites.get(headlineIndex);
    if (!headline || headline === "") {
        headline = options.headlines[headlineIndex];
    }

    const introTextIndex = ad.introTextIndex;
    let introText = ad.introTextOverwrites.get(introTextIndex);
    if (!introText || introText === "") {
        introText = options.introTexts[introTextIndex];
    }

    const overlayTextIndex = ad.overlayTextIndex;
    let overlayText = options.overlayTexts[overlayTextIndex];
    if (ad.overlayTextOverwrites.has(overlayTextIndex)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        overlayText = ad.overlayTextOverwrites.get(overlayTextIndex)!;
    }

    const url = options.imageUrls[ad.imageIndex];

    return { headline, introText, overlayText, url };
}

async function createAdFromSelection(
    campaignId: number,
    landingPageUrl: string,
    options: GeneratedOptions,
    ad: AdSelection,
    postHeaders: object
): Promise<number> {
    const { headline, introText, overlayText, url } = getHeadlineIntroOverlayUrl(options, ad);

    return createAd(
        campaignId,
        `Generated Ad ${Date.now()}`,
        landingPageUrl,
        headline,
        introText,
        overlayText,
        url,
        postHeaders
    );
}

export async function createCampaignAndAds(
    name: string,
    landingPageUrl: string,
    ads: AdSelection[],
    options: GeneratedOptions,
    postHeaders: object
): Promise<number> {
    const campaignId = await createCampaign(name, postHeaders);

    await Promise.all(
        ads.map((ad) => createAdFromSelection(campaignId, landingPageUrl, options, ad, postHeaders))
    );

    return campaignId;
}
