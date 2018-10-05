// 获取配置文件
let configUtil = require("../config/configUtil");
let configs = configUtil.configObj;
const fs = require("fs");
var Promise = require('promise');
let formidable = require('formidable')
let msgs = configUtil.msgObj;
var url = require('url');
let path = require("path");
const uuidv1 = require('uuid/v1');
// oss连接池
let ossClient = configUtil.ossClient

// oss保存文件
async function put(onlinePath, localPath) {
    try {
        let result = await ossClient.put(onlinePath, localPath);
        return result
    } catch (e) {
        console.log(e);
        return
    }
}


// 默认接口 F1001
exports.showIndex = (req, res) => {
    res.writeHead(200, { 'Content-Type': "text/html;charset=UTF-8" });
    res.end('OSS对象存储文件接口');
}


// 单文件上传 F1002
exports.saveOneFile = (req, res) => {
    let that = this;
    // parse a file upload
    let form = new formidable.IncomingForm();
    //    Creates a new incoming form.
    form.encoding = 'utf-8';
    // If you want the files written to form.uploadDir to include the extensions of the original files, set this property to true
    form.type = false;
    form.uploadDir = path.normalize(configs.FILEPATH);
    form.parse(req, (err, fields, files, next) => {
        if (err) {
            throw err
        }

        // 返回参数
        let content = {}
        fs.exists(configs.FILEPATH + fields.document, (exists) => {
            if (!exists) {
                content.success = false
                content.message = `${fields.document}${msgs.F_0001}`
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(content));
                return
            } else {

                let oldPath = files.file.path;
                // 判断尺寸
                let size = files.file.size;
                if (size > configs.FILESIZE) { // 图片不可大于1M
                    // res.JSON("图片不可大于2M");
                    // 删除文件
                    fs.unlink(oldPath)

                    content.success = false
                    content.message = `文件不得超过${configs.FILESIZE / 1024000}MB`
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
                let localPath = configs.FILEPATH + fields.document + "/" + ran + extname;
                // 执行改名
                fs.rename(oldPath, localPath, (err) => {
                    if (err) {
                        throw err
                    }
                    let onlinePath = configs.OSSFILEPATH + '/' + fields.document + "/" + ran + extname
                    // 上传到oss
                    let result = put(onlinePath, localPath)
                    console.log(result)
                    let content = {}
                    content.success = true
                    content.url = onlinePath
                    content.name = files.file.name
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(content));
                });
            }

        });
    });
}