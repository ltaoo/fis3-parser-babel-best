const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_PATH = path.resolve(__dirname, '../.cache');

/**
 * 根据传入的 secret 特征生成 md5
 * @param {string} secret - 字符串
 * @return {MD5}
 */
function createMd5(secret) {
  return crypto.createHash('md5').update(secret).digest('hex');
}

/**
 * 返回被缓存的内容
 * @param {string} filename
 * @return {string}
 */
function getCachedContent(filename) {
  const realPath = path.resolve(CACHE_PATH, filename);
  if (!fs.existsSync(realPath)) {
    return '';
  }
  return fs.readFileSync(realPath).toString();
}

/**
 * 缓存文件
 * @param {string} filename
 * @param {string} content
 * @return {void 0}
 */
function cacheContent(filename, content) {
  const realPath = path.resolve(CACHE_PATH, filename);
  fs.writeFileSync(realPath, content);
}

export default {
  createMd5,
  getCachedContent,
  cacheContent,
};
