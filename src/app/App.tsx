import CreatePage from "components/CreatePage/CreatePage";
import GeneratePage from "components/GeneratePage/GeneratePage";
import Modal, { ModalSize } from "components/Modal/Modal";
import { getPageRawHTML } from "lib/fetch";
import React from "react";

type Props = {
    ref: React.LegacyRef<App>;
};
type State = {
    open: boolean;
    urlInput: string;
    pageHTML: string;
};

const INITIAL_STATE: State = {
    open: false,
    urlInput: "",
    pageHTML: "",
};

enum DisplayPage {
    GENERATE,
    CREATE,
}

export default class App extends React.Component<Props, State> {
    state = INITIAL_STATE;

    getPage = (): DisplayPage => {
        if (this.state.pageHTML !== "") {
            return DisplayPage.CREATE;
        }
        return DisplayPage.GENERATE;
    };

    render(): React.ReactNode {
        const onLandingPageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            this.setState({ pageHTML: await getPageRawHTML(this.state.urlInput) });
        };

        const page = this.getPage();
        const size = page === DisplayPage.GENERATE ? ModalSize.SMALL : ModalSize.LARGE;

        return (
            this.state.open && (
                <Modal size={size} onClose={() => this.setState(INITIAL_STATE)}>
                    {page === DisplayPage.GENERATE && (
                        <GeneratePage
                            urlInput={this.state.urlInput}
                            onInputChange={(e) => this.setState({ urlInput: e.target.value })}
                            onSubmit={onLandingPageSubmit}
                        />
                    )}
                    {page === DisplayPage.CREATE && <CreatePage html={this.state.pageHTML} />}
                </Modal>
            )
        );
    }
}
