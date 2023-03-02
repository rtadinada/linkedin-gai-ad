import * as Settings from "lib/settings";
import React from "react";

import style from "./SettingsPage.scss";

type Props = Record<string, never>;
type State = {
    campaignGroupInput: string;
    openAiKeyInput: string;
    campaignNamePromptInput: string;
    headlinePromptInput: string;
    introTextPromptInput: string;
    overlayTextPromptInput: string;
    imagePromptPromptInput: string;
    imageStylesInput: string;
};

function extractDigits(input: string): string {
    let result = "";
    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);
        if (!isNaN(parseInt(char))) {
            result += char;
        }
    }
    return result;
}

export default class SettingsPage extends React.Component<Props, State> {
    state = {
        campaignGroupInput: "",
        openAiKeyInput: "",
        campaignNamePromptInput: "",
        headlinePromptInput: "",
        introTextPromptInput: "",
        overlayTextPromptInput: "",
        imagePromptPromptInput: "",
        imageStylesInput: "",
    };

    async componentWillMount() {
        const [
            campaignGroup,
            openAiKey,
            campaignNamePrompt,
            headlinePrompt,
            introTextPrompt,
            overlayTextPrompt,
            imagePromptPrompt,
            imageStyles,
        ] = await Promise.all([
            Settings.getCampaignGroup(),
            Settings.getOpenAiKey(),
            Settings.getCampaignNamePrompt(),
            Settings.getHeadlinePrompt(),
            Settings.getIntroTextPrompt(),
            Settings.getOverlayTextPrompt(),
            Settings.getImagePromptPrompt(),
            Settings.getImageStyles(),
        ]);
        const campaignGroupString = campaignGroup > 0 ? campaignGroup.toString() : "";
        this.setState({
            campaignGroupInput: campaignGroupString,
            openAiKeyInput: openAiKey,
            campaignNamePromptInput: campaignNamePrompt,
            headlinePromptInput: headlinePrompt,
            introTextPromptInput: introTextPrompt,
            overlayTextPromptInput: overlayTextPrompt,
            imagePromptPromptInput: imagePromptPrompt,
            imageStylesInput: JSON.stringify(imageStyles),
        });
    }

    save = async () => {
        console.log("save");
        let imageStylesArr = [];
        const errorText = `Image styles input must be JSON string array with at least one input, but recieved: \`${this.state.imageStylesInput}\``;
        try {
            imageStylesArr = JSON.parse(this.state.imageStylesInput);
            if (!(Array.isArray(imageStylesArr) && imageStylesArr.length >= 1)) {
                alert(errorText);
                throw new Error(errorText);
            }
        } catch (error) {
            alert(errorText);
            throw new Error(errorText);
        }

        await Promise.all([
            Settings.setCampaignGroup(Number(this.state.campaignGroupInput)),
            Settings.setOpenAiKey(this.state.openAiKeyInput),
            Settings.setCampaignNamePrompt(this.state.campaignNamePromptInput),
            Settings.setHeadlinePrompt(this.state.headlinePromptInput),
            Settings.setIntroTextPrompt(this.state.introTextPromptInput),
            Settings.setOverlayTextPrompt(this.state.overlayTextPromptInput),
            Settings.setImagePromptPrompt(this.state.imagePromptPromptInput),
            Settings.setImageStyles(imageStylesArr),
        ]);
    };

    render(): React.ReactNode {
        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Campaign Group: </td>
                            <td>
                                <input
                                    type="text"
                                    value={this.state.campaignGroupInput}
                                    onChange={(e) =>
                                        this.setState({
                                            campaignGroupInput: extractDigits(e.target.value),
                                        })
                                    }
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>Open AI Key: </td>
                            <td>
                                <input
                                    type="text"
                                    value={this.state.openAiKeyInput}
                                    onChange={(e) =>
                                        this.setState({
                                            openAiKeyInput: e.target.value,
                                        })
                                    }
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Prompts</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>Campaign Name Prompt: </td>
                            <td>
                                <input
                                    className={style.promptInput}
                                    type="text"
                                    value={this.state.campaignNamePromptInput}
                                    onChange={(e) =>
                                        this.setState({
                                            campaignNamePromptInput: e.target.value,
                                        })
                                    }
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <td>Headline Prompt: </td>
                            <td>
                                In 100 characters or less, &nbsp;
                                <span>
                                    <input
                                        className={style.promptInput}
                                        type="text"
                                        value={this.state.headlinePromptInput}
                                        onChange={(e) =>
                                            this.setState({
                                                headlinePromptInput: e.target.value,
                                            })
                                        }
                                    ></input>
                                </span>
                                &nbsp; the product described above:
                            </td>
                        </tr>
                        <tr>
                            <td>Intro Text Prompt: </td>
                            <td>
                                In 500 characters or less, &nbsp;
                                <span>
                                    <input
                                        className={style.promptInput}
                                        type="text"
                                        value={this.state.introTextPromptInput}
                                        onChange={(e) =>
                                            this.setState({
                                                introTextPromptInput: e.target.value,
                                            })
                                        }
                                    ></input>
                                </span>
                                &nbsp; the product described above:
                            </td>
                        </tr>
                        <tr>
                            <td>Overlay Text Prompt: </td>
                            <td>
                                In 75 characters or less, &nbsp;
                                <span>
                                    <input
                                        className={style.promptInput}
                                        type="text"
                                        value={this.state.overlayTextPromptInput}
                                        onChange={(e) =>
                                            this.setState({
                                                overlayTextPromptInput: e.target.value,
                                            })
                                        }
                                    ></input>
                                </span>
                                &nbsp; the product described above:
                            </td>
                        </tr>
                        <tr>
                            <td>Image Prompt Prompt (used to generate query for Dall-E): </td>
                            <td>
                                <span>
                                    <input
                                        className={style.promptInputLarge}
                                        type="text"
                                        value={this.state.imagePromptPromptInput}
                                        onChange={(e) =>
                                            this.setState({
                                                imagePromptPromptInput: e.target.value,
                                            })
                                        }
                                    ></input>
                                </span>
                                &nbsp; with the product described above:
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Image styles (input as JSON array of strings, 1 is randomly
                                selected):{" "}
                            </td>
                            <td>
                                <input
                                    className={style.promptInputLarge}
                                    type="text"
                                    value={this.state.imageStylesInput}
                                    onChange={(e) =>
                                        this.setState({
                                            imageStylesInput: e.target.value,
                                        })
                                    }
                                ></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={this.save}>Save</button>
            </div>
        );
    }
}
