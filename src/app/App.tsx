import Test from "components/Test/Test";
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
                <div
                    onClick={() => {
                        this.setState(INITIAL_STATE);
                    }}
                >
                    <Test />
                </div>
            )
        );
    }
}
