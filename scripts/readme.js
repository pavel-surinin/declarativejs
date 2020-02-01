const fs = require('fs')
const readLine = require('readline');
const package = require('../package.json');

const path = './target/out'
const filePath = './target/out/README.md';

if (fs.existsSync(filePath)) {
    fs.unlinkSync('./target/out/README.md')
}

const lineReader = readLine.createInterface({
    input: fs.createReadStream('./README.md')
});

let isReading = true
lineReader.on('line', function (line) {
    if (line.includes('# Array Functions')) {
        isReading = false
        fs.appendFileSync(filePath, `# Documentation\n`)
        fs.appendFileSync(filePath, `All documentation can be found here: [link](${package.homepage})\n`)
        fs.appendFileSync(filePath, `# License\n`)
        fs.appendFileSync(filePath, package.license)

    }
    if (isReading) {
        fs.appendFileSync(`${path}/README.md`, line + '\n')
        console.log(line);
    }
});