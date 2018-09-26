let file = require("../models/file")
let util = require('util');
let path = require("path");
let formidable = require('formidable')
const uuidv1 = require('uuid/v1');

let fs = require('fs');
// 默认接口 F0001
exports.showIndex = (req, res) => {
    res.writeHead(200, { 'Content-Type': "text/html;charset=UTF-8" });
    res.end('文件接口');
}
// 单文件上传 F0002
exports.saveOneFile = (req, res) => {
    let that = this;
    // parse a file upload
    let form = new formidable.IncomingForm();
    //    Creates a new incoming form.
    form.encoding = 'utf-8';
    // If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true
    form.type = false;
    form.uploadDir = path.normalize("D:/GitDou/");
    form.parse(req, (err, fields, files, next) => {
        if (err) {
            throw err
        }
        let oldPath = files.file.path;
        // 判断尺寸
        let size = files.file.size;
        if (size > 1024000) { // 图片不可大于1M
            // res.JSON("图片不可大于2M");
            // 删除文件
            fs.unlink(oldPath)
            // 返回页面
            let content = {}
            content.success = false
            content.message = `文件不得超过${1024000 / 1024000}MB`
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(content));

            return
        }
        // 改名
        // 随机日期 
        //  let date = sd.format(new Date(), 'YYYYMMDDHHmmss');
        // 随机数
        let ran = uuidv1() //  parseInt(Math.random() * 89999 + 10000);
        // ran = ran.replaceAll("-","")
        // 拓展名
        let extname = path.extname(files.file.name);
        console.log(files.file)
        // 新路径
        let newPath = "D:/GitDou/" + fields.document + "/" + ran + extname;
        // 执行改名
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                throw err
            }
            let content = {}
            content.success = true
            content.url = newPath
            content.name = files.file.name
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(content));
        });
    });
}