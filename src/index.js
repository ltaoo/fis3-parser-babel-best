import babel from '@babel/core';

/* eslint-disable no-param-reassign */

/**
 * interface File {
 *   subpath: string;
 *   useBabel: boolean;
 *   ext: string;
 * }
 * interface Config {
 *   sourceMapRelative: boolean;
 * }
 * @param {string} content - 要编译的文件内容
 * @param {File} file
 * @param {Config} conf
 * @return {string}
 */
export default function transform(content, file, conf) {
  if (file.useBabel === false) {
    return content;
  }

  // 添加 jsx 的 html 语言能力处理
  if (fis.compile.partial && file.ext === '.jsx') {
    content = fis.compile.partial(content, file, {
      ext: '.html',
      isHtmlLike: true,
    });
  }

  const { sourceMapRelative } = conf;

  if (sourceMapRelative) {
    delete conf.sourceMapRelative;
  }

  // 出于安全考虑，不使用原始路径
  conf.filename = file.subpath.substring(1);
  const result = babel.transform(content, conf);

  // 添加resourcemap输出
  if (result.map) {
    const mapping = fis.file.wrap(`${file.dirname}/${file.filename}${file.rExt}.map`);
    mapping.setContent(JSON.stringify(result.map, null, 4));
    const url = sourceMapRelative
      ? (`./${file.basename}.map`).replace('jsx', 'js')
      : mapping.getUrl(fis.compile.settings.hash, fis.compile.settings.domain);
    result.code = result.code.replace(/\n?\s*\/\/#\ssourceMappingURL=.*?(?:\n|$)/g, '');
    result.code += `\n//# sourceMappingURL=${url}\n`;
    file.extras = file.extras || {};
    file.extras.derived = file.extras.derived || [];
    file.extras.derived.push(mapping);
  }

  return result.code;
}
