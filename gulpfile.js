/**
 * Created by private on 01/04/2017.
 */
var main_folder = './src/';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var less = require('gulp-less');
var inject = require('gulp-inject');
var minify = require('gulp-minify');
var clean = require('gulp-clean');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tscConfig = require('./src/tsconfig.json');

var jsFiles = 'includes/js/*.js';
var lessFiles = 'includes/less/*.less';
var jsDest = 'public/js';
var cssDest = 'public/css';

gulp.task('hello-world',function(){
    console.log('our first hello world gulp task!');
});

gulp.task('index-inject', function () {
    var target = gulp.src(main_folder + 'index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    //var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});
    var sources = gulp.src([__dirname + '/' + jsDest + '/*.js', __dirname + '/' + cssDest + '/*.css'], {read: false, cwd : __dirname + '/public'});

    return target.pipe(inject(sources))
        .pipe(gulp.dest(main_folder));
});

gulp.task('js-compress', function() {
    gulp.src('./' + jsDest + '/*.js').pipe(clean());
    gulp.src(jsFiles)
        .pipe(minify({
            ext:{
                //src:'-debug.js',
                min:'.min.js'
            },
            noSource : true,
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest(jsDest))
});

gulp.task('webserver', function() {
    gulp.src(main_folder)
        .pipe(webserver({
            port: 9090,
            livereload: true,
            open: true,
            fallback : 'index.html'
        }));
});
gulp.task('less', function() {
    gulp.src('./' + cssDest + '/*.css').pipe(clean());
    gulp.src(lessFiles)
        .pipe(less())
        .pipe(gulp.dest(cssDest));
        //.pipe(webserver.reload());
});
gulp.task('clean', function () {
    gulp.src('public/ts').pipe(clean());
});

gulp.task('compile-typescript', ['clean'], function () {
    return gulp.src('src/app/includes/ts/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/app/public/ts'));
});
//
//gulp.task('copy:libs', function() {
//    gulp.src('public/libs').pipe(clean());
//    return gulp.src([
//        'node_modules/angular2/bundles/angular2-polyfills.js',
//        'node_modules/systemjs/dist/system.js',
//        'node_modules/systemjs/dist/system.src.js',
//        'node_modules/systemjs/dist/system.src.js.map',
//        'node_modules/rxjs/bundles/Rx.js',
//        'node_modules/angular2/bundles/angular2.dev.js',
//        'node_modules/es6-shim/es6-shim.js',
//        'node_modules/angular2/bundles/http.dev.js',
//        'node_modules/typescript/lib/typescript.js',
//        'node_modules/angular2/bundles/http.dev.js',
//        'node_modules/angular2/bundles/router.dev.js'
//    ])
//        .pipe(gulp.dest('public/lib'))
//});
gulp.task('watch-less', function() {
    gulp.watch(lessFiles, ['less']);
})
gulp.task('watch-css-new-files', function() {
    gulp.watch(cssDest + '/*.css', ['index-inject']);
})
gulp.task('watch-new-js-files',function(){
    gulp.watch(jsFiles, ['js-compress']);
})
gulp.task('watch-new-min-js-files',function(){
    gulp.watch(jsDest + '/*.js', ['index-inject']);
})

gulp.task('default',
    [
        'webserver',
        'less',
        'watch-less',
        'watch-css-new-files',
        'index-inject',
        'js-compress',
        'watch-new-js-files',
        'watch-new-min-js-files',
        //'copy:libs',
        'compile-typescript'
    ]);
