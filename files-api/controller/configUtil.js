const YAML = require('yamljs');
const fs = require("fs");
// file为文件所在路径
exports.conifg = YAML.parse(fs.readFileSync(__dirname+"/dev.yml").toString());