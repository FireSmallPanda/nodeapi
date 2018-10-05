// 获取配置文件
let configUtil = require("../config/configUtil");
let configs = configUtil.configObj;
const fs = require("fs");
var Promise = require('promise');
let formidable = require('formidable')
let msgs = configUtil.msgObj;
var url=require('url');
// 获取所有图片
exports.getAllDocuments = (callback) => {
    let components = []
    const files = fs.readdirSync(configs.FILEPATH)
    files.forEach((item, index) => {
        let stat = fs.lstatSync(configs.FILEPATH + item)
        if (stat.isDirectory() === true) {
            components.push(item)
        }
    })
    return callback(components)
}
// 创建文件夹
exports.createDocument = (req, res) => {
    // parse a file upload
    let form = new formidable.IncomingForm();
    //    Creates a new incoming form.
    form.encoding = 'utf-8';
    let content = {}

    form.parse(req, (err, fields, files, next) => {
        // 文件路径
        let path = configs.FILEPATH + fields.name
        fs.exists(path, (exists) => {
            if (!exists) {
                // 创建文件夹
                fs.mkdir(path, (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    // 创建成功
                    content.success = true
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(content));
                });
            } else {
                // 若已经存在则报错
                content.success = false
                content.message = `${fields.name}${msgs.F_0002}`
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(content));
                return
            }
        })

    })

}
// 删除文件夹及内容
exports.deleteDocument = (req, res) => {
    // parse a file upload
    let form = new formidable.IncomingForm();
    //    Creates a new incoming form.
    form.encoding = 'utf-8';
    let content = {}

    form.parse(req, (err, fields, files, next) => {
        // 文件路径
        let path = configs.FILEPATH + fields.name
        fs.exists(path, (exists) => {
            if (!exists) {
                // 若不存在则报错
                content.success = false
                content.message = `${fields.name}${msgs.F_0003}`
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(content));
                return
            } else {
                // 若存在则执行
                deleteFolderRecursive(path,(retn) => {
                    // 删除成功
                    content.success = true
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(content));
                })

            }
        })
    })
}
// 递归删除
let deleteFolderRecursive = (path, callback) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
        callback(true)
    }
};


exports.getFile = (req, res) => { 


    // parse a file upload
    let uri = encodeURI(req.url)
    let form = url.parse(uri,true).query;

    let content = {}
        // 文件路径
        let path = configs.FILEPATH + form.path
        let name = form.name
        console.log(name)
        fs.exists(path, (exists) => {
            if (!exists) {
                // 若不存在则报错
                content.success = false
                content.message = `${form.path}${msgs.F_0004}`
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(content));
                return
            } else {
                   //第二种方式
                    var f = fs.createReadStream(path);
                    res.writeHead(200, {
                        'Content-Type': 'application/force-download',
                        'Content-Disposition': `attachment; filename=${name}`
                    });
                    f.pipe(res);
            }
        })


  
}