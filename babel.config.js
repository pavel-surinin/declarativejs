const presets = [
    [
        "@babel/env",
        {
            targets: { ie: 11 },
            useBuiltIns: "usage",
            corejs: { version: 3 }
        },
        "minify"
    ]
];

module.exports = { presets };