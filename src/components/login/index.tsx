import React, { useState, useEffect } from 'react'
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui'
import { Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { login, getToken } from '../../model/api/index'

interface UserInfoType {
  nickName: string
  avatarUrl: string
}

interface DetailType {
  iv: string
  encryptedData: string
  userInfo: UserInfoType
  errMsg: string
}

interface LoginType {
  detail: DetailType
}

export default (props) => {
  const { open, trigger, getIsLogin } = props
  const [isOpened, setIsOpened] = useState(false)

  const getUserProfile = async (e: LoginType) => {
    // 微信登录，获取头像昵称
    const userProfileRes = await Taro.getUserProfile({
      desc: '获取登录信息',
      lang: 'zh_CN'
    })
    Taro.setStorageSync('nickName', userProfileRes.userInfo.nickName)
    Taro.setStorageSync('avatarUrl', userProfileRes.userInfo.avatarUrl)

    // 获取 iv 等
    const userRes = await Taro.getUserInfo();
    // console.log('userRes', userRes);
    // 用户未授权
    if (!userRes.iv) {
      Taro.atMessage({
        message: `失败: ${userRes.errMsg}`,
        type: 'error'
      })
      return;
    }
    
    // 自定义登录
    const data = await login({
      code: Taro.getStorageSync('code'),
      // iv: userRes.iv,
      // encryptedData: userRes.encryptedData
      iv: userProfileRes.iv,
      encryptedData: userProfileRes.encryptedData
    })
    // id
    console.log('id', data);
    if (data.data.errorCode === 0) {
      Taro.setStorageSync('id', data.data.data.ownId)
      // Taro.setStorageSync('token', data.header.authorization)

      // 使用测试 token
      let token = await getToken({id: data.data.data.ownId});
      // console.log(token);
      Taro.setStorageSync('token', token.data);
      
    } else {
      Taro.atMessage({
        message: `失败: ${data.data.errorCode},${data.data.errorMessage}`,
        type: 'error'
      })
    }

    setIsOpened(false);
    getIsLogin(true);

    Taro.atMessage({
      message: '🎉开始访问吧',
      type: 'success'
    })
  }

  useEffect(() => {
    setIsOpened(open)
  }, [open, trigger])

  return (
    <AtModal isOpened={isOpened}>
      <AtModalHeader>登陆授权</AtModalHeader>
      <AtModalContent>我们希望获取您的公开信息（头像，昵称），以为您提供更全面的服务</AtModalContent>
      <AtModalAction>
        <Button onClick={() => setIsOpened(false)}>取消</Button>
        <Button onClick={getUserProfile}>
          确定
        </Button>
      </AtModalAction>
    </AtModal>
  )
}
