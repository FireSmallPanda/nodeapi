let express = require("express")
let app = express()
let router = require(__dirname+"/controller/router")
let configUtil = require(__dirname+"/config/configUtil")
const fs = require("fs");
// 获取配置文件
let configs = configUtil.configObj;
// 主页 F0001
app.get("/",router.showIndex)
// 保存单个文件 F0002
app.post("/file",router.saveOneFile)
// 获取文件列表 F0003
app.get("/document/list",router.getFileList)
// 创建文件夹 F0004
app.post("/document",router.createDocument)
// 删除文件夹 F0005
app.delete("/document",router.deleteDocument)
// 下载单个文件 F0006
app.get("/file",router.getFile)

console.log("启动端口为："+configs.PORT)
app.listen(configs.PORT)