import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const buildDir = path.resolve(dirName, "dist");

const config = {
    entry: {
        content: "./src/content.tsx",
        background: "./src/background.ts",
        settings: "./src/settings.tsx",
    },
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.svg$/i,
                type: "asset/resource",
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            lib: path.resolve(dirName, "src/lib"),
            config: path.resolve(dirName, "src/config"),
            components: path.resolve(dirName, "src/app/components"),
            common: path.resolve(dirName, "src/app/common"),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/settings.html",
            filename: "settings.html",
            chunks: ["settings"],
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/manifest.json",
                    to: buildDir,
                    force: true,
                },
            ],
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: buildDir,
        assetModuleFilename: "assets/[hash][ext][query]",
        publicPath: "",
        clean: true,
    },
};

export default config;
