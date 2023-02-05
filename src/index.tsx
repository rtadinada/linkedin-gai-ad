import React from "react";
import ReactDOM from "react-dom";

import App from "./app/App";

console.log("start");

const button = document.createElement("button");
button.innerText = "click me";

console.log("button");

const reportingBar = document
    .getElementsByClassName("reporting-actions-bar__actions-container")
    .item(0);
reportingBar?.prepend(button);

console.log("append");

const appContainer = document.createElement("div");
appContainer.id = "gai-ad-root";
document.body.prepend(appContainer);

console.log("root");

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    appContainer
);

console.log("react");
