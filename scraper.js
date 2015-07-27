var path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs');

function refreshData(){
    console.log("starting to scrape");
    childProcess.execFile(phantomjs.path, [path.join(__dirname, 'scrapeHotslogs.js')], function(err, stdout, stderr) {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });
}

module.exports = refreshData;
