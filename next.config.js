const withBundleAnalyzer = require("@next/bundle-analyzer")();

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, context) => {
        config.plugins.push(
            new context.webpack.DefinePlugin({
                "process.env.FLUENTFFMPEG_COV": false,
            })
        );

        return config;
    },
};

module.exports = nextConfig;
