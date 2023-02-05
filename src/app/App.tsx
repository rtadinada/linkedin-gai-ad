import Modal from "components/Modal/Modal";
import React from "react";

type Props = {
    ref: React.LegacyRef<App>;
};
type State = {
    open: boolean;
};

const INITIAL_STATE: State = {
    open: false,
};

export default class App extends React.Component<Props, State> {
    state = INITIAL_STATE;

    render(): React.ReactNode {
        return (
            this.state.open && (
                <Modal onClose={() => this.setState(INITIAL_STATE)}>
                    <div>hello</div>
                </Modal>
            )
        );
    }
}
