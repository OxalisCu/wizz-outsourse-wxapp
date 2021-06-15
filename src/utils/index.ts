
// 删去字符串开头的空格
export const removeSpace = function(str: string): string{  
  const reg = /^\s+/;
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
  let info = temp.split('.');
  if(info.length > 2){
    info = [info[0], info[info.length - 1]]
  }
  return info;
}

// 获取 oss 的文件链接
export const getUrl = function (str: string): string{
  return str.split('?')[0];
}

// 判断是本地图片（文件）还是网络图片（文件）
export const isUpload = function (str: string): boolean{
  const reg = /^http:\/\/tmp/;
  return !reg.test(str);
}

// 时间转换
export const timeFormat = function (time: number): string{
  const date = new Date(time);
  return date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes();
}