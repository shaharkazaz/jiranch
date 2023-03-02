const terser = require("terser");
const fs = require("node:fs");
const {globSync} = require("glob");

const files = globSync('dist/**/*.js');
minifyFiles(files);

function minifyFiles(filePaths) {
    filePaths.forEach(async (filePath) => {
        const target = fs.readFileSync(filePath, "utf8");
        const {code} = await terser.minify(target);
        fs.writeFileSync(
            filePath,
            code
        );
    });
}
