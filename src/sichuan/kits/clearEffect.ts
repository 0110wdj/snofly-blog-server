const fs = require("fs");

const clear = async () => {
  const filesToCompress = ['./答复单位.txt', './公开时间.txt', './咨询标题.txt', './咨询内容答复.txt', './urlList.txt', './compressed_files.zip']; // 要压缩的文件列表
  try {
    filesToCompress.forEach(url => {
      if (fs.existsSync(url)) {
        fs.unlinkSync(url);
      } else {
        console.log("not found:" + url);
      }
    })
    return Promise.resolve()
  } catch (error) {
    console.error(error);
  }
  return Promise.reject()
}

export default clear