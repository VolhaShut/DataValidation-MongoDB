const gulp = require('gulp'),
    util = require('gulp-util'),
    fs = require('fs'),
    path=require('path'),
    connection=require('./lib/connection'),
    comparing=require('./lib/comparing');


gulp.task('db:companies', ()=>{
    let userName=util.env.user;
    let password=util.env.password;
    let host=util.env.host;
    let baseName=util.env.base;
    return connection.getDataFromMongo(userName,password,host,baseName);
});

gulp.task('ui:export',()=>{
    let dirPath;
    if (util.env.path){
        dirPath=path.resolve(path.normalize(util.env.path));
    }else {
        dirPath=path.resolve(path.normalize("./reports"));
    }
    let companiesInfo=comparing.readFilesFromDir(dirPath);
    return fs.writeFileSync('./output/compamies.json',JSON.stringify(companiesInfo),'utf8');
});

gulp.task('compare:db-ui', ()=>{

});