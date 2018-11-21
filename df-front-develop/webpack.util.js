const fs = require('fs')

function getAllFileArr(path) {
  let AllFileList = []
  getAllFile(path)
  function getAllFile(path) {
    let files = []
    if (fs.existsSync(path)) { // 是否存在此路径
      files = fs.readdirSync(path) // 获取当前目录下一层文件列表
      files.forEach((file) => { // 遍历获取文件
        let curPath = `${path}/${file}`
        if (fs.statSync(curPath).isDirectory()) { // recurse 查看文件是否是文件夹
          getAllFile(curPath) // 如果是文件夹，继续遍历获取
        } else if (file !== '.DS_Store') {
          // .DS_Store是IDE配置文件不用计入到文件列表
          if (file.split('.')[1] === 'js' || file.split('.')[1] === 'jsx') {
            AllFileList.push([file, path, curPath]) 
          }
        }
      })
    }
  }
  return AllFileList
}

function getEntry(path) {
  let file_list = getAllFileArr(path)
  let entry = {}
  file_list.forEach((item) => {
    entry[`${item[2].replace('./app/view', '')}`] = item[2] 
  })
  entry['style/index.css'] = './app/view/common/common.scss'
  entry['style/mobileCommon.css'] = './app/view/mobile_common/mobileCommon.scss'
  return entry
}

exports.getEntry = getEntry
exports.getAllFileArr = getAllFileArr 