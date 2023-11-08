import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: "#121926",
                secondairy: "#364152",
                tertiary: "#202939",
                action: "#F37615",
                text: "#FCFCFD",
                "text-dark": "#C7C7C7",
                error: "#f31515",
            },
            animation: {
                "pulse-once": "pulse-once 0.500s ease-in-out forwards",
            },
            keyframes: {
                "pulse-once": {
                    "0%": { backgroundColor: "var(--tw-gradient-from)" },
                    "50%": { backgroundColor: "var(--tw-gradient-to)" },
                    "100%": { backgroundColor: "var(--tw-gradient-from)" },
                },
            },
        },
    },
    plugins: [
        {
            handler: ({ matchUtilities, theme }) => {
                matchUtilities(
                    {
                        "animation-delay": (value) => {
                            return {
                                "animation-delay": value,
                            };
                        },
                    },
                    {
                        values: theme("transitionDelay"),
                    }
                );
            },
        },
    ],
};
export default config;
