const rimraf = require('rimraf');

cleanDist();

function cleanDist() {
    rimraf.sync('./dist');
}
