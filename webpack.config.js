import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const config = {
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
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
    ],
    output: {
        filename: "content.js",
        path: path.resolve(dirName, "dist"),
        assetModuleFilename: "assets/[hash][ext][query]",
        // clean: true,
    },
};

export default config;
