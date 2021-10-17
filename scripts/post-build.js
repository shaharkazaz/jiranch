const fs = require('fs');

copyAssets();

function copyAssets() {
    const {scripts, devDependencies, ['lint-staged']: _, config, husky, ...cleanPackage} = JSON.parse(fs.readFileSync('package.json').toString());
    fs.writeFileSync('dist/package.json', JSON.stringify(cleanPackage, null, 2));

    const assets = ['README.md', 'step-1.png', 'step-2.png'];
    for (const asset of assets) {
        fs.copyFileSync(asset, `dist/${asset}`);
    }
}

