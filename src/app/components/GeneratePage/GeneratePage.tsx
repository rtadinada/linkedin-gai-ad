import OutboundLink from "common/images/outbound-link.svg";
import Button from "components/Button/Button";
import Submit from "components/Button/Submit";
import Page from "components/Page/Page";
import { getResourceUrl } from "lib/chrome-utils";
import React, { ChangeEventHandler, FormEventHandler } from "react";

import style from "./GeneratePage.scss";
import OpenAI from "./openai.svg";

export type Props = {
    urlInput: string;
    onInputChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    campaignId: number | null;
    onGoToCampaign: () => void;
    loading: boolean;
};

export default function GeneratePage(props: Props): JSX.Element {
    const showCampaignButton = props.campaignId !== null;

    let logoClass = [style.logo];
    let formClass = [style.form];
    if (props.loading) {
        logoClass = logoClass.concat([style.logoCenter]);
        formClass = formClass.concat([style.formHidden]);
    }

    return (
        <Page>
            <img className={logoClass.join(" ")} src={getResourceUrl(OpenAI)} />
            {!showCampaignButton && (
                <form className={formClass.join(" ")} onSubmit={props.onSubmit}>
                    <input
                        id={style.urlInput}
                        onChange={props.onInputChange}
                        placeholder="Landing page URL"
                        type="text"
                    />
                    <Submit>Generate</Submit>
                </form>
            )}
            <div
                className={[
                    style.campaignButtonContainer,
                    !showCampaignButton ? style.campaignButtonHidden : "",
                ].join(" ")}
            >
                <Button
                    icon={getResourceUrl(OutboundLink)}
                    isIconRight={true}
                    onClick={() => {
                        if (showCampaignButton) {
                            props.onGoToCampaign();
                        }
                    }}
                >
                    Go To Campaign
                </Button>
            </div>
        </Page>
    );
}
