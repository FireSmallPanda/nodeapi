const YAML = require('yamljs');
const fs = require("fs");
// 返回配置文件对象
exports.configObj = YAML.parse(fs.readFileSync(__dirname+"/dev.yml").toString());
// 返回信息对象
exports.msgObj = YAML.parse(fs.readFileSync(__dirname+"/msg.yml").toString());