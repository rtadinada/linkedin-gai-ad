import CreatePage from "components/CreatePage/CreatePage";
import GeneratePage from "components/GeneratePage/GeneratePage";
import Modal, { ModalSize } from "components/Modal/Modal";
import { getLandingPageText } from "lib/page-content";
import React from "react";

type Props = {
    ref: React.LegacyRef<App>;
};
type State = {
    open: boolean;
    urlInput: string;
    pageContent: string;
    isFetching: boolean;
};

const INITIAL_STATE: State = {
    open: false,
    urlInput: "",
    pageContent: "",
    isFetching: false,
};

enum DisplayPage {
    GENERATE,
    CREATE,
}

export default class App extends React.Component<Props, State> {
    state = INITIAL_STATE;

    getPage = (): DisplayPage => {
        if (this.state.pageContent !== "") {
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
                this.setState({ isFetching: false, pageContent: content || "Error parsing" });
            }, 300);
        };

        const page = this.getPage();
        const size = page === DisplayPage.GENERATE ? ModalSize.SMALL : ModalSize.LARGE;

        return (
            this.state.open && (
                <Modal size={size} onClose={() => this.setState(INITIAL_STATE)}>
                    {page === DisplayPage.GENERATE && (
                        <GeneratePage
                            loading={this.state.isFetching}
                            urlInput={this.state.urlInput}
                            onInputChange={(e) => this.setState({ urlInput: e.target.value })}
                            onSubmit={onLandingPageSubmit}
                        />
                    )}
                    {page === DisplayPage.CREATE && <CreatePage html={this.state.pageContent} />}
                </Modal>
            )
        );
    }
}
