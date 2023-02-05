import { merge } from "webpack-merge";

import common from "./webpack.common.js";

const config = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
});

export default config;
