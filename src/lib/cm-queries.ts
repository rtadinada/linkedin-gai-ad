import { AdSelection } from "components/CreatePage/CreatePage";

import { createAd, createCampaign } from "./cm-fetch";
import { GeneratedOptions } from "./openai-queries";

function getHeadlineIntoUrl(options: GeneratedOptions, ad: AdSelection) {
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

    const url = options.imageUrls[ad.imageIndex];

    return { headline, introText, url };
}

async function createAdFromSelection(
    campaignId: number,
    landingPageUrl: string,
    options: GeneratedOptions,
    ad: AdSelection,
    postHeaders: object
): Promise<number> {
    const { headline, introText, url } = getHeadlineIntoUrl(options, ad);
    return createAd(
        campaignId,
        `Generated Ad ${Date.now()}`,
        landingPageUrl,
        headline,
        introText,
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
