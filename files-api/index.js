let express = require("express")
let app = express()
let router = require(__dirname+"/controller/router")
// 主页 F0001
app.get("/",router.showIndex)
// 保存单个文件 F0002
app.post("/file",router.saveOneFile)

app.listen(3000)