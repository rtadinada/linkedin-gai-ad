import React from "react";
import ReactDOM from "react-dom";

import App from "./app/App";

const button = document.createElement("button");
button.innerText = "click me";

const testDiv = document.getElementById("test-div");
testDiv?.appendChild(button);

const appContainer = document.createElement("div");
appContainer.id = "gai-ad-root";
document.body.prepend(appContainer);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    appContainer
);
