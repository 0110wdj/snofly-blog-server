const fs = require("fs");

const clear = async () => {
  const filesToCompress = ['./unit.txt', './time.txt', './title.txt', './context.txt', './urlList.txt', './compressed_files.zip']; // 要压缩的文件列表
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