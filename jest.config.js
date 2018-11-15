module.exports = {
    "moduleFileExtensions": ["ts", "js"],
    "transform": {
        "^.+\\.ts$": "./node_modules/ts-jest/preprocessor.js"
    },
    "testMatch": ["**/?(*.)test.ts"],
    "verbose": true,
    "cacheDirectory": "./target/tmp/",
    "coverageDirectory": "./target/coverage/",
    "testURL": "http://localhost/"
}   