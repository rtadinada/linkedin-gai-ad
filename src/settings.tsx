import SettingsPage from "components/SettingsPage/SettingsPage";
import React from "react";
import { createRoot } from "react-dom/client";

const appContainer = document.getElementById("root");

const appRoot = createRoot(appContainer!);
appRoot.render(
    <React.StrictMode>
        <SettingsPage />
    </React.StrictMode>
);
