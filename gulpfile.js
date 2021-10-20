'use strict';

const project_folder = "dist";  // папка с готовым, собранным проектом
const source_folder = "#src";  // рабочая папка

const path = {
    build: {   // пути, куда gulp будет отгружать уже обработанные файлы
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
    },  
    src: {   // пути файлов исходников
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // ** значит, что будут слушаться все подпапки папки img
        // /*.{}названия файлов.{расширения}
    }, 
    // файлы, которые нужно слушать постоянно и сразу налету выполнять
    watch: {  
        html: source_folder + "/**/*.html", //все подпапки с расширением html
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // ** значит, что будут слушаться все подпапки папки img
        // /*.{}названия файлов.{расширения}
    }, 
    // ?? путь к папке проекта, удаление ее каждый раз при запуске Gulp
    clean: "./" + project_folder + "/",
};

const {src, dest} = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const group_media = require("gulp-group-css-media-queries");
const clean_css = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const babel = require("gulp-babel");
const fs = require("fs"); //file system

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

// название функции должно отличаться от переменной
function browserSync(params) {  
    browsersync.init({
         server :{
            baseDir: "./" + project_folder + "/",
        },
        port:3000,
        notify:false,
    });
}


function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))  // перебросить файлы из исходной в папку назначения
        .pipe(browsersync.stream());  // внутри этой функции пишем команды для галпа
  
}


function css(params) {
    return src(path.src.css) //include не нужен так как scss и без этого умеет подключать внешние файлы
    .pipe(scss({
        outputStyle: "expanded"
    }))
    .pipe(group_media())
    .pipe(autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
    }))

    .pipe(dest(path.build.css)) // выгружаем файл до того как мы его сжимаем и переименовуем

    .pipe(clean_css())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(dest(path.build.css))

    .pipe(browsersync.stream());
}


function images() {
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}


function js() {
    return src('./#src/js/script.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(dest(path.build.js));    
}


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);  // ([путь], функция)
    gulp.watch([path.watch.img], images);
    
}


// удаляет папку dist
function clean(params) {
    return del(path.clean);
    
}


const build = gulp.series(clean, gulp.parallel(js, css, html, images));   //series(функции, которые должны выполняться)
const watch = gulp.parallel(build, watchFiles, browserSync);

// подружить gulp с новыми переменными:
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch; 




