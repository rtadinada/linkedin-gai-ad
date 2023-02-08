import * as Settings from "lib/settings";
import React from "react";

type Props = Record<string, never>;
type State = {
    campaignGroupInput: string;
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
    state = { campaignGroupInput: "" };

    async componentWillMount() {
        const campaignGroup = await Settings.getCampaignGroup();
        const campaignGroupString = campaignGroup > 0 ? campaignGroup.toString() : "";
        this.setState({ campaignGroupInput: campaignGroupString });
    }

    save = async () => {
        console.log("save");
        await Promise.all([Settings.setCampaignGroup(Number(this.state.campaignGroupInput))]);
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
                    </tbody>
                </table>
                <button onClick={this.save}>Save</button>
            </div>
        );
    }
}
