import BeakerImage from "common/images/beaker.svg";
import Button from "components/Button/Button";
import { getResourceUrl } from "lib/chrome-utils";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";

declare global {
    interface Window {
        App: App;
    }
}

const reportingBarClass = "reporting-actions-bar__actions-container";
const buttonContainerId = "gai-open-button-cnt";

function run() {
    const jsInitChecktimer = setInterval(checkForBarLoaded, 11);

    function checkForBarLoaded() {
        if (document.getElementsByClassName(reportingBarClass).length > 0) {
            clearInterval(jsInitChecktimer);
            load();
        }
    }
}

function reloadButton() {
    setInterval(checkForBarLoadedAndButtonGone, 111);

    function checkForBarLoadedAndButtonGone() {
        const buttonLoaded = !!document.getElementById(buttonContainerId);
        if (!buttonLoaded && document.getElementsByClassName(reportingBarClass).length > 0) {
            loadButton();
        }
    }
}

function loadButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = buttonContainerId;
    buttonContainer.style.margin = "4px";

    const reportingBar = document.getElementsByClassName(reportingBarClass).item(0);
    const buttonCluster = reportingBar?.children.item(0);
    buttonCluster?.append(buttonContainer);

    const buttonRoot = createRoot(buttonContainer);
    buttonRoot.render(
        <React.StrictMode>
            <Button
                onClick={() => {
                    window.App.setState({ open: true });
                }}
                icon={getResourceUrl(BeakerImage)}
            >
                Auto-Generate
            </Button>
        </React.StrictMode>
    );
}

function load() {
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
    loadButton();
    reloadButton();
}

run();
