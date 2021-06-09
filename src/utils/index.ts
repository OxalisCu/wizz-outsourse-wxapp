
// 删去字符串开头的空格
export const removeSpace = function(str: string): string{  
  const reg = /^\s+/;
  console.log(str.replace(reg, ''+'d'));
  return str.replace(reg, '');
}

// 字符串中字符数
export const countWords = function(str: string): number{
  return str.length;
}

// 根据 url 获取文件信息
export const getFileInfo = function (str: string): Array<string>{
  let raw = str.split('/');
  let temp = raw[raw.length - 1]; 
  const info = temp.split('.');
  return info;
}