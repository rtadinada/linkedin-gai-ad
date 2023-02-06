import GeneratePage from "components/GeneratePage/GeneratePage";
import Modal, { ModalSize } from "components/Modal/Modal";
import React from "react";

type Props = {
    ref: React.LegacyRef<App>;
};
type State = {
    open: boolean;
    modalSize: ModalSize;
    urlInput: string;
};

const INITIAL_STATE: State = {
    open: false,
    modalSize: ModalSize.SMALL,
    urlInput: "",
};

export default class App extends React.Component<Props, State> {
    state = INITIAL_STATE;

    render(): React.ReactNode {
        return (
            this.state.open && (
                <Modal size={this.state.modalSize} onClose={() => this.setState(INITIAL_STATE)}>
                    <GeneratePage
                        urlInput={this.state.urlInput}
                        onInputChange={(e) => this.setState({ urlInput: e.target.value })}
                        onSubmit={(e) => {
                            e.preventDefault();
                            this.setState({ modalSize: ModalSize.LARGE });
                        }}
                    />
                </Modal>
            )
        );
    }
}
