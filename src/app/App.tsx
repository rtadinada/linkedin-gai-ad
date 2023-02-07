import CreatePage, { AdSelection, OverwriteFunc } from "components/CreatePage/CreatePage";
import GeneratePage from "components/GeneratePage/GeneratePage";
import Modal, { ModalSize } from "components/Modal/Modal";
import { generateAllOptions, GeneratedOptions } from "lib/openai-queries";
import { getLandingPageText } from "lib/page-content";
import React from "react";

type Props = {
    ref: React.LegacyRef<App>;
};
type State = {
    open: boolean;
    urlInput: string;
    isFetching: boolean;
    generatedOptions: GeneratedOptions | null;
    ads: AdSelection[];
    selectedAd: number;
};

function makeNewAdSelection(): AdSelection {
    return {
        headlineIndex: 0,
        introTextIndex: 0,
        imageIndex: 0,
        headlineOverwrites: new Map(),
        introTextOverwrites: new Map(),
    };
}
function makeInitialState(): State {
    return {
        open: false,
        urlInput: "",
        isFetching: false,
        generatedOptions: null,
        ads: [makeNewAdSelection()],
        selectedAd: 0,
    };
}

function updateAd(prevState: State, adIndex: number, newAd: AdSelection) {
    const newAds = prevState.ads
        .slice(0, adIndex)
        .concat([newAd, ...prevState.ads.slice(adIndex + 1)]);

    return { ads: newAds };
}

function updateHeadlineOverwrite(prevState: State, headlineIndex: number, overwrite: string) {
    const adIndex = prevState.selectedAd;

    const newOverwites = new Map(prevState.ads[adIndex].headlineOverwrites);
    if (overwrite !== prevState.generatedOptions?.headlines[headlineIndex]) {
        newOverwites.set(headlineIndex, overwrite);
    } else {
        newOverwites.delete(headlineIndex);
    }

    const newAd: AdSelection = {
        ...prevState.ads[adIndex],
        headlineOverwrites: newOverwites,
    };

    return updateAd(prevState, adIndex, newAd);
}

function selectHeadline(prevState: State, newHeadlineIndex: number) {
    const adIndex = prevState.selectedAd;
    const prevAd = prevState.ads[adIndex];
    const prevIndex = prevAd.headlineIndex;

    let newAd: AdSelection = {
        ...prevAd,
        headlineIndex: newHeadlineIndex,
    };
    if (newAd.headlineOverwrites.get(prevIndex) === "") {
        const newOverwites = new Map(prevState.ads[adIndex].headlineOverwrites);
        newOverwites.delete(prevIndex);
        newAd = { ...newAd, headlineOverwrites: newOverwites };
    }

    return updateAd(prevState, adIndex, newAd);
}

enum DisplayPage {
    GENERATE,
    CREATE,
}

export default class App extends React.Component<Props, State> {
    state = makeInitialState();

    getPage = (): DisplayPage => {
        if (this.state.generatedOptions !== null) {
            return DisplayPage.CREATE;
        }
        return DisplayPage.GENERATE;
    };

    render(): React.ReactNode {
        const onLandingPageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            this.setState({ isFetching: true });
            setTimeout(async () => {
                const content = await getLandingPageText(this.state.urlInput);
                if (content === null) {
                    console.error("Unable to retrieve page content");
                    return;
                }
                const generatedOptions = await generateAllOptions(content);
                if (generatedOptions === null) {
                    console.error("Unable to retrieve options.");
                    return;
                }
                this.setState({ isFetching: false, generatedOptions });
            }, 300);
        };

        const page = this.getPage();
        const size = page === DisplayPage.GENERATE ? ModalSize.SMALL : ModalSize.LARGE;

        const onHeadlineOverwrite: OverwriteFunc = (optionIndex, value) => {
            if (value.length > 100) {
                return;
            }
            this.setState((prevState) => updateHeadlineOverwrite(prevState, optionIndex, value));
        };
        const onChangeSelectedHeadline = (newIndex: number) => {
            this.setState((prevState) => selectHeadline(prevState, newIndex));
        };

        return (
            this.state.open && (
                <Modal size={size} onClose={() => this.setState(makeInitialState())}>
                    {page === DisplayPage.GENERATE && (
                        <GeneratePage
                            loading={this.state.isFetching}
                            urlInput={this.state.urlInput}
                            onInputChange={(e) => this.setState({ urlInput: e.target.value })}
                            onSubmit={onLandingPageSubmit}
                        />
                    )}
                    {page === DisplayPage.CREATE && (
                        <CreatePage
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            options={this.state.generatedOptions!}
                            ads={this.state.ads}
                            selectedAd={this.state.selectedAd}
                            onHeadlineOverwrite={onHeadlineOverwrite}
                            onChangeSelectedHeadline={onChangeSelectedHeadline}
                        />
                    )}
                </Modal>
            )
        );
    }
}
