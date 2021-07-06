import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro'
import {Button} from '@tarojs/components'

export default () => {
  const [loginRes, setLoginRes] = useState<any>();

  useEffect(() => {
    ;(
      async() => {
        const loginRes = await Taro.login();
        setLoginRes(loginRes);
        console.log('loginRes', loginRes);
      }
    )()
  }, [])

  const login = async () => {
    const userResP = await Taro.getUserProfile({
      desc: '获取登录信息',
      lang: 'zh_CN'
    })
    console.log('userResP', userResP);
    const userRes = await Taro.getUserInfo();
    console.log('userRes', userRes);
    if (!userRes.iv) {
      Taro.atMessage({
        message: `失败: ${userRes.errMsg}`,
        type: 'error'
      })
      return;
    }
    const idRes = await Taro.request({
      url: 'https://www.blbldata.com/xiaoLogin/grantAuthorization/',
      data: {
        code: loginRes.code,
        iv: userRes.iv,
        encryptedData: userRes.encryptedData
        // iv: userResP.iv,
        // encryptedData: userResP.encryptedData
      },
      header: {
        contentType: 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
    console.log('idRes', idRes);
  } 

  return (
    <Button onClick={login}>登录</Button>
  )
}