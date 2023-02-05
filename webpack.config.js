import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const config = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx"],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
    ],
    output: {
        filename: "content.js",
        path: path.resolve(dirName, "dist"),
        // clean: true,
    },
};

export default config;
