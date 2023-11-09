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
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.tmdb.org",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
