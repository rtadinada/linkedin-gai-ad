import CopyWebpackPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const buildDir = path.resolve(dirName, "dist");

const config = {
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/i,
                type: "asset/resource",
                // generator: {
                //     outputPath: "assets/",
                // },
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx"],
        alias: {
            lib: path.resolve(dirName, "src/lib"),
        },
    },
    plugins: [
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
        filename: "content.js",
        path: buildDir,
        assetModuleFilename: "assets/[hash][ext][query]",
        publicPath: "",
        clean: true,
    },
};

export default config;
