var gulp = require('gulp');
var watch = require('gulp-watch');
var rsycned = require('gulp-rsynced');

var rsyncOptions = {
    source: './',
    dest: '/home/proj/public_html',
    host: 'stage.proj.com',
    username: 'goalstage',
    recursive: true,
    flags: 'avz',
    exclude: [    
        'node_modules/',
        'tags',
        'tags.lock', 
        'tags.temp',
        'tags.temp.tmp',
        '.git/',
        '**/@neomake*'
    ],
};

gulp.task('stage:deploy', function() {
  return gulp.src(folders).pipe(rsycned(rsyncOptions));
});

gulp.task('stage:deploy:watch', function () {
    var folders = [rsyncOptions.source];
    if (rsyncOptions.exclude) {
        var excludes = rsyncOptions.exclude.map(function (path) {
            return '!' + path;
        });
        folders = folders.concat(excludes);
    }

    return watch(
        folders,
		{ ignoreInitial: true, base: rsyncOptions.source }
	)
	.pipe(rsycned(rsyncOptions));
});
