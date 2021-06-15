export const logError = (url, err) => {
  console.log(`❌ ❌ ❌${url}接口出错了,错误是${err}`)
}

export const logMsg = (url, msg) => {
  console.log(`${url}提示：${msg}`)
}