const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = path.resolve(__dirname, '..');
const targetOut = path.join(root, 'target', 'out');
const pnpmStoreDir = path.join(root, 'node_modules', '.pnpm');

function findPnpmPackagePath(prefix) {
    const entries = fs.readdirSync(pnpmStoreDir);
    const entry = entries
        .filter((name) => name.startsWith(prefix + '@'))
        .sort()
        .pop();

    if (!entry) {
        throw new Error('Cannot find package "' + prefix + '" in ' + pnpmStoreDir);
    }

    return path.join(pnpmStoreDir, entry, 'node_modules', prefix);
}

function runTscDeclarations() {
    const tscPath = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
    childProcess.execFileSync(
        process.execPath,
        [
            tscPath,
            '-p',
            path.join(root, 'tsconfig.json'),
            '--declaration',
            '--emitDeclarationOnly',
            '--outDir',
            targetOut,
            '--declarationDir',
            targetOut
        ],
        { stdio: 'inherit' }
    );
}

async function bundleJavaScript() {
    const esbuildPath = findPnpmPackagePath('esbuild');
    const esbuild = require(path.join(esbuildPath, 'lib', 'main.js'));
    const commonConfig = {
        entryPoints: [path.join(root, 'index.ts')],
        bundle: true,
        minify: true,
        sourcemap: false,
        target: ['es2018']
    };

    await esbuild.build({
        ...commonConfig,
        format: 'cjs',
        outfile: path.join(targetOut, 'index.js')
    });

    await esbuild.build({
        ...commonConfig,
        format: 'esm',
        outfile: path.join(targetOut, 'index.mjs')
    });
}

async function run() {
    fs.rmSync(targetOut, { recursive: true, force: true });
    fs.mkdirSync(targetOut, { recursive: true });
    runTscDeclarations();
    await bundleJavaScript();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
