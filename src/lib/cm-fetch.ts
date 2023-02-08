import { downloadImage } from "./background-fetch";

const CAMPAIGN_GROUP = 627520796;
const ACCOUNT_ID = 509082510;
const COMPANY_OWNER_ID = 5025865;

function extractId(text: string) {
    const matches = text.match(/\d+/);
    if (matches === null) {
        throw new Error(`Bad id: ${text}`);
    }
    return Number(matches[0]);
}

async function throwErrorWithLog(
    response: Response,
    requestBody: object,
    params: object,
    options: object,
    errorText: string
) {
    let responseText = null;
    try {
        responseText = await response.text();
    } catch {}
    let responseJson = null;
    try {
        if (responseText !== null) {
            responseJson = JSON.parse(responseText);
        }
    } catch {}
    console.error({
        response,
        requestBody,
        params,
        options,
        responseText,
        responseJson,
    });
    throw new Error(`${errorText}: ${responseText}`);
}

async function errorOnBadStatus(
    response: Response,
    requestBody: object,
    params: object,
    options: object
) {
    const responseStatus = response.status;
    if (!(200 <= responseStatus && responseStatus < 300)) {
        throwErrorWithLog(
            response,
            requestBody,
            params,
            options,
            `Error in result, status ${responseStatus}`
        );
    }
}

export async function createCampaign(name: string, postHeaders: object): Promise<number> {
    const params = { name, postHeaders };

    const requestBody: Campaign = { ...DEFAULT_CAMPAIGN_FIELDS, name };
    const headers = { ...CREATE_CAMPAIGN_DEFAULT_HEADERS, ...postHeaders };
    const options: RequestInit = {
        headers,
        referrer: `https://www.linkedin.com/campaignmanager/accounts/509082510/campaigns/new/details?campaignGroupId=${CAMPAIGN_GROUP}`,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(requestBody),
        method: "POST",
        mode: "cors",
        credentials: "include",
    };
    console.log({ requestBody, options });

    const response = await fetch(
        "https://www.linkedin.com/campaign-manager-api/campaignManagerCampaigns",
        options
    );
    await errorOnBadStatus(response, requestBody, params, options);

    const location = response.headers.get("Location");
    if (!location) {
        throwErrorWithLog(response, requestBody, params, options, "No id in response");
        return -1;
    }
    return extractId(location);
}

async function uploadImage(url: string, postHeaders: object): Promise<string> {
    const params = { url, postHeaders };

    const blob = await downloadImage(url);
    if (!blob) {
        throw new Error(`Error getting image: ${url}`);
    }
    const fileSize = blob.size;

    const assetName = `AI Asset - ${Date.now()}`;
    const requestBody: RegisterImageUpload = {
        ...DEFAULT_REGISTER_IMAGE_UPLOAD_FIELDS,
        assetName,
        fileSize,
    };
    const registerHeaders = { ...DEFAULT_REGISTER_IMAGE_UPLOAD_HEADERS, ...postHeaders };
    const options: RequestInit = {
        headers: registerHeaders,
        referrer:
            "https://www.linkedin.com/campaignmanager/accounts/509082510/campaigns/198365086/creatives/new",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(requestBody),
        method: "POST",
        mode: "cors",
        credentials: "include",
    };

    const response = await fetch(
        "https://www.linkedin.com/campaign-manager-api/campaignManagerVectorAssetMetadata?action=registerMediaUpload",
        options
    );
    await errorOnBadStatus(response, requestBody, params, options);

    const registerDataHolder: RegisterImageUploadResponse = (await response.json()).data;
    if (!registerDataHolder.value) {
        throwErrorWithLog(response, requestBody, params, options, "no value");
    }

    const registerData: RegisterImageUploadResponseValue = registerDataHolder.value;

    const uploadHeaders = {
        ...DEFAULT_IMAGE_UPLOAD_HEADERS,
        ...postHeaders,
        ...registerData.singleUploadHeaders,
    };
    const uploadOptions: RequestInit = {
        headers: uploadHeaders,
        referrer:
            "https://www.linkedin.com/campaignmanager/accounts/509082510/campaigns/198365086/creatives/new",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: blob,
        method: "PUT",
        mode: "cors",
        credentials: "include",
    };

    const uploadResponse = await fetch(registerData.singleUploadUrl, uploadOptions);
    await errorOnBadStatus(uploadResponse, {}, params, options);

    return registerData.urn;
}

export async function createAd(
    campaign: number,
    name: string,
    landingPageUrl: string,
    headline: string,
    introText: string,
    url: string,
    postHeaders: object
): Promise<number> {
    const imageUrn = await uploadImage(url, postHeaders);
    const params = { campaign, name, headline, introText, url, postHeaders, imageUrn };

    const userGeneratedAdContent: UserGeneratedAdContent = {
        introductoryText: { text: introText },
        contentType: "ARTICLE",
        referenceUrn: "urn:li:article:-1",
        entities: [
            {
                callToAction: "LEARN_MORE",
                destinationUrl: landingPageUrl,
                headline: headline,
                image: {
                    reference: imageUrn,
                    referenceType: "DIGITAL_MEDIA_ASSET",
                },
            },
        ],
    };
    const sponsoredUpdateContent: SponsoredUpdateContent = {
        ...DEFAULT_CREATIVE_CREATION_FIELDS.sponsoredUpdateContent,
        accountId: ACCOUNT_ID,
        companyId: COMPANY_OWNER_ID,
        userGeneratedAdContent,
    };
    const requestBody: CreativeCreationRequest = {
        ...DEFAULT_CREATIVE_CREATION_FIELDS,
        adName: name,
        campaignId: campaign,
        sponsoredUpdateContent,
    };

    const headers = { ...DEFAULT_CREATIVE_CREATION_HEADERS, ...postHeaders };
    const options: RequestInit = {
        headers,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(requestBody),
        method: "POST",
        mode: "cors",
        credentials: "include",
    };

    const response = await fetch(
        "https://www.linkedin.com/campaign-manager-api/campaignManagerCreatives",
        options
    );
    await errorOnBadStatus(response, requestBody, params, options);

    const location = response.headers.get("Location");
    if (!location) {
        throwErrorWithLog(response, requestBody, params, options, "No id in response");
        return -1;
    }
    return extractId(location);
}

const CREATE_CAMPAIGN_DEFAULT_HEADERS = {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "text/plain;charset=UTF-8",
    "csrf-token": "ajax:0653335087529179969",
    "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-li-er-key": "urn:li:sponsoredAccount:509082510",
    "x-li-lang": "en_US",
    "x-li-page-instance": "urn:li:page:d_campaign_details;fE8zyBrgRn2oHc3tld3ypg==",
    "x-li-track":
        '{"clientVersion":"2.24.857","mpVersion":"2.24.857","osName":"web","timezoneOffset":-5,"timezone":"America/New_York","deviceFormFactor":"DESKTOP","mpName":"campaign-manager-web","displayDensity":2,"displayWidth":3456,"displayHeight":2234}',
    "x-restli-protocol-version": "2.0.0",
};

const DEFAULT_CAMPAIGN_FIELDS: Campaign = {
    name: "This is my campaign name",
    accountId: 509082510,
    audienceExpansionEnabled: false,
    objectiveType: "WEBSITE_VISIT",
    adFormats: ["STANDARD_SPONSORED_CONTENT"],
    locale: {
        language: "en",
        country: "US",
    },
    targetingCriteria: {
        include: {
            and: [
                {
                    or: [
                        {
                            facet: {
                                urn: "urn:li:adTargetingFacet:interfaceLocales",
                                name: "Interface Locales",
                            },
                            segments: [
                                {
                                    urn: "urn:li:locale:en_US",
                                    name: "English",
                                    facetUrn: "urn:li:adTargetingFacet:interfaceLocales",
                                },
                            ],
                        },
                    ],
                },
                {
                    or: [
                        {
                            facet: {
                                urn: "urn:li:adTargetingFacet:locations",
                                name: "Locations",
                            },
                            segments: [
                                {
                                    urn: "urn:li:geo:103644278",
                                    name: "United States",
                                    facetUrn: "urn:li:adTargetingFacet:locations",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        exclude: {
            or: [],
        },
    },
    offsiteDeliveryEnabled: false,
    myNetworkDeliveryEnabled: false,
    offsitePreferences: {
        iabCategories: {
            exclude: [],
        },
        publisherRestrictionFiles: {
            exclude: [],
        },
    },
    campaignGroupId: CAMPAIGN_GROUP,
    creativeSelection: "OPTIMIZED",
    status: "DRAFT",
    costType: "CPM",
    optimizationTargetType: "MAX_CLICK",
    totalBudget: {
        amount: "1000",
        currencyCode: "USD",
    },
    unitCost: {
        amount: "7.86",
        currencyCode: "USD",
    },
    runSchedule: {
        start: 1759276800000,
        end: 1761954300000,
    },
    lifetimePacingStrategy: "NO_LIFETIME_PACING",
    pacingStrategy: "LIFETIME",
    accountProductType: "MARKETING_SOLUTIONS",
};

const DEFAULT_REGISTER_IMAGE_UPLOAD_HEADERS = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "text/plain;charset=UTF-8",
    "csrf-token": "ajax:0653335087529179969",
    "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-li-er-key": "urn:li:sponsoredAccount:509082510",
    "x-li-lang": "en_US",
    "x-li-page-instance": "urn:li:page:d_creatives_new;5tuStLYHStOSHBI+9t+w0g==",
    "x-li-track":
        '{"clientVersion":"2.24.931","mpVersion":"2.24.931","osName":"web","timezoneOffset":-5,"timezone":"America/New_York","deviceFormFactor":"DESKTOP","mpName":"campaign-manager-web","displayDensity":2,"displayWidth":3456,"displayHeight":2234}',
    "x-restli-protocol-version": "2.0.0",
};

const DEFAULT_REGISTER_IMAGE_UPLOAD_FIELDS: RegisterImageUpload = {
    fileSize: 2121380,
    ownerId: COMPANY_OWNER_ID,
    ownerType: "COMPANY",
    accountId: ACCOUNT_ID,
    assetName:
        "DALL·E 2022-12-14 17.39.30 - a potato hatching out of a pink egg in a castle as an impressionist painting.png",
    addToAssetLibrary: true,
    uploadRecipes: ["COMPANY_UPDATE_ARTICLE_IMAGE"],
    pemRegisterMediaUploadMetadata: {
        key: "asset-image-upload",
        value: "asset-image-upload-failure",
        entityIds: [],
        productName: "Campaign Manager - Ad Assets",
    },
};

const DEFAULT_IMAGE_UPLOAD_HEADERS = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "image/png",
    "csrf-token": "ajax:0653335087529179969",
    "media-type-family": "STILLIMAGE",
    "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-li-er-key": "urn:li:sponsoredAccount:509082510",
    "x-li-lang": "en_US",
    "x-li-page-instance": "urn:li:page:d_creatives_new;5tuStLYHStOSHBI+9t+w0g==",
    "x-li-track":
        '{"clientVersion":"2.24.931","mpVersion":"2.24.931","osName":"web","timezoneOffset":-5,"timezone":"America/New_York","deviceFormFactor":"DESKTOP","mpName":"campaign-manager-web","displayDensity":2,"displayWidth":3456,"displayHeight":2234}',
    "x-restli-protocol-version": "2.0.0",
};

const DEFAULT_CREATIVE_CREATION_FIELDS: CreativeCreationRequest = {
    campaignId: 198365086,
    adName: "ad",
    status: "ACTIVE",
    type: "SPONSORED_STATUS_UPDATE",
    sponsoredUpdateContent: {
        accountId: 509082510,
        authorUrn: "urn:li:company:5025865",
        companyId: 5025865,
        state: { lifecycleState: "PUBLISHED" },
        visibility: "DARK",
        userGeneratedAdContent: {
            introductoryText: { text: "This is my intro text" },
            contentType: "ARTICLE",
            referenceUrn: "urn:li:article:-1",
            entities: [
                {
                    callToAction: "LEARN_MORE",
                    destinationUrl: "http://www.destination.com",
                    headline: "This is my headline",
                    image: {
                        reference: "urn:li:digitalmediaAsset:D5618AQGTFAvkGtDpQw",
                        referenceType: "DIGITAL_MEDIA_ASSET",
                    },
                },
            ],
        },
    },
};

const DEFAULT_CREATIVE_CREATION_HEADERS = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "text/plain;charset=UTF-8",
    "csrf-token": "ajax:0653335087529179969",
    "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-li-er-key": "urn:li:sponsoredAccount:509082510",
    "x-li-lang": "en_US",
    "x-li-page-instance": "urn:li:page:d_creatives_new;zN1pS+5fReu/vVnts+0J6w==",
    "x-li-track":
        '{"clientVersion":"2.24.931","mpVersion":"2.24.931","osName":"web","timezoneOffset":-5,"timezone":"America/New_York","deviceFormFactor":"DESKTOP","mpName":"campaign-manager-web","displayDensity":2,"displayWidth":3456,"displayHeight":2234}',
    "x-restli-method": "create",
    "x-restli-protocol-version": "2.0.0",
};

interface Campaign {
    name: string;
    accountId: number;
    audienceExpansionEnabled: boolean;
    objectiveType: string;
    adFormats: string[];
    locale: {
        language: string;
        country: string;
    };
    targetingCriteria: {
        include: {
            and: Array<{
                or: Array<{
                    facet: {
                        urn: string;
                        name: string;
                    };
                    segments: Array<{
                        urn: string;
                        name: string;
                        facetUrn: string;
                    }>;
                }>;
            }>;
        };
        exclude: {
            or: any[];
        };
    };
    offsiteDeliveryEnabled: boolean;
    myNetworkDeliveryEnabled: boolean;
    offsitePreferences: {
        iabCategories: {
            exclude: any[];
        };
        publisherRestrictionFiles: {
            exclude: any[];
        };
    };
    campaignGroupId: number;
    creativeSelection: string;
    status: string;
    costType: string;
    optimizationTargetType: string;
    totalBudget: {
        amount: string;
        currencyCode: string;
    };
    unitCost: {
        amount: string;
        currencyCode: string;
    };
    runSchedule: {
        start: number;
        end: number;
    };
    lifetimePacingStrategy: string;
    pacingStrategy: string;
    accountProductType: string;
}

interface RegisterImageUpload {
    fileSize: number;
    ownerId: number;
    ownerType: string;
    accountId: number;
    assetName: string;
    addToAssetLibrary: boolean;
    uploadRecipes: string[];
    pemRegisterMediaUploadMetadata: {
        key: string;
        value: string;
        entityIds: number[];
        productName: string;
    };
}

interface RegisterImageUploadResponseValue {
    urn: string;
    mediaArtifactUrn: string;
    singleUploadHeaders: {
        "media-type-family": string;
    };
    assetRealtimeTopic: string;
    singleUploadUrl: string;
    type: string;
}

interface RegisterImageUploadResponse {
    value: RegisterImageUploadResponseValue;
}

interface UserGeneratedAdContent {
    introductoryText: { text: string };
    contentType: string;
    referenceUrn: string;
    entities: {
        callToAction: string;
        destinationUrl: string;
        headline: string;
        image: {
            reference: string;
            referenceType: string;
        };
    }[];
}

interface SponsoredUpdateContent {
    accountId: number;
    authorUrn: string;
    companyId: number;
    state: { lifecycleState: string };
    visibility: string;
    userGeneratedAdContent: UserGeneratedAdContent;
}

interface CreativeCreationRequest {
    campaignId: number;
    adName: string;
    status: string;
    type: string;
    sponsoredUpdateContent: SponsoredUpdateContent;
}
