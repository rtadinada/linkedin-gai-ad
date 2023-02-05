import Button from "components/Button/Button";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";

declare global {
    interface Window {
        App: App;
    }
}

const appContainer = document.createElement("div");
appContainer.id = "gai-ad-root";
document.body.prepend(appContainer);

const appRoot = createRoot(appContainer);
appRoot.render(
    <React.StrictMode>
        <App
            ref={(app) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                window.App = app!;
            }}
        />
    </React.StrictMode>
);

const buttonContainer = document.createElement("div");
buttonContainer.id = "gai-open-button-cnt";

const reportingBar = document
    .getElementsByClassName("reporting-actions-bar__actions-container")
    .item(0);
reportingBar?.prepend(buttonContainer);

const buttonRoot = createRoot(buttonContainer);
buttonRoot.render(
    <React.StrictMode>
        <Button
            onClick={() => {
                window.App.setState({ open: true });
            }}
        >
            Click Me
        </Button>
    </React.StrictMode>
);
