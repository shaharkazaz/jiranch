const terser = require("terser");
const fs = require("fs");
const glob = require("glob");

const files = glob.sync('dist/**/*.js');
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
