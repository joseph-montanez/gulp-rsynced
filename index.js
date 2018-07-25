var through = require('through2');
var path = require('path');
var process = require('process');
var Rsync = require('rsync');
var log = require('fancy-log');


function sync(filepath, options) {
    var rsync = new Rsync()
    .shell('ssh')
    .source(options.source + filepath);

    if (options.flags) {
        rsync.flags(options.flags);
    }

    if (options.recursive) {
        rsync.recursive();
    }

    if (options.exclude) {
        rsync.exclude(options.exclude);
    }

    if (options.delete) {
        rsync.delete();
    }

    if (options.update) {
        rsync.update();
    }

    if (options.quiet) {
        rsync.quiet();
    }

    if (options.dry) {
        rsync.dry();
    }

    if (options.compress) {
        rsync.compress();
    }

    if (options.times) {
        rsync.times();
    }

    if (options.progress) {
        rsync.progress();
    }

    if (options.dirs) {
        rsync.dirs();
    }

    if (options.perms) {
        rsync.perms();
    }
    
    rsync.destination(
        options.username + '@' + options.host + ':' + options.dest
        + (filepath != null ? '/' + filepath : '')
    );

    log('Syncing ' + filepath);
    var t = process.hrtime();
    rsync.execute(function(error, code, cmd) {
        // we're done
        if (code == 0) {
            t = process.hrtime(t);
            var total = t[0] + ' seconds';
            if (t[0] < 1) {
                total = Math.round(t[1] / 1000000.0) + ' milliseconds';
            }
            log('Synced ' + filepath + ' in ' + total);
        } else {
            log('Sync Error: "' + error + '" |' + code + '| ' + cmd);
        }
    });
}

module.exports = function (options) {
    return through.obj(function (file, encoding, callback) {
        var filename = path.relative(
            path.join(file.cwd, options.source), 
            file.path
        );
        sync(filename, options);
        callback(null, file);
    });
}

