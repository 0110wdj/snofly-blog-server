const fs = require('fs');
const path = require('path');
const archiver = require('archiver-promise');

const filesToCompress = ['./答复单位.txt', './公开时间.txt', './咨询标题.txt', './咨询内容答复.txt', './urlList.txt']; // 要压缩的文件列表
const outputZip = './compressed_files.zip'; // 输出的 ZIP 文件名

const getZipStream = async (response) => {

  // 创建一个输出流到压缩文件
  const output = fs.createWriteStream(outputZip);
  const archive = archiver(outputZip, {
    zlib: { level: 9 } // 压缩级别，9 是最高级别
  });

  // 将输出流传递给 archiver
  await archive.pipe(output);

  // 将文件添加到压缩包
  filesToCompress.forEach(function (file) {
    archive.file(file, { name: file });
  });

  // 完成压缩
  await archive.finalize();

  const readStream = fs.createReadStream(outputZip)
  const stats = fs.statSync(outputZip);
  const filename = path.basename(outputZip);
  response.writeHead(200, {
    'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
    'Content-Disposition': 'attachment; filename=' + filename, //告诉浏览器这是一个需要下载的文件
    'Content-Length': stats.size
  });

  readStream.pipe(response);

  return Promise.resolve(readStream)
}

export default getZipStream