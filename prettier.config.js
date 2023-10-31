// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 4,
  pluginSearchDirs: false,
  plugins: [
    require.resolve("@trivago/prettier-plugin-sort-imports"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^@buchungapp/(.*)$",
    "^#/(.*)$",
    "^~/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
