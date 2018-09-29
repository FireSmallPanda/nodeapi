let express = require("express")
let app = express()
let router = require(__dirname+"/controller/router")
// let configUtil = require(__dirname+"/controller/configUtil")
const YAML = require('yamljs');
const fs = require("fs");
// 获取配置文件
let config = YAML.parse(fs.readFileSync(__dirname+"/config/dev.yml").toString());

// 主页 F0001
app.get("/",router.showIndex)
// 保存单个文件 F0002
app.post("/file",router.saveOneFile)
app.listen(config.PORT)