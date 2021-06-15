import React, { useState, useEffect } from 'react'
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui'
import { Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { login } from '../../model/api/index'

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

interface ID{
  ownId: number,
  unionId: string
}

interface IdType{
  errorCode: number,
  errorMessage: string,
  data: ID
}

export default (props) => {
  const { open, trigger, getIsLogin } = props
  const [isOpened, setIsOpened] = useState(false)

  const getUserProfile = async (e: LoginType) => {
    // 微信登录，获取登录凭证
    const UserRes = await Taro.getUserProfile({
      desc: '获取登录信息',
      lang: 'zh_CN'
    })
    // 用户未授权
    if (!UserRes.iv) {
      Taro.atMessage({
        message: `失败: ${UserRes.errMsg}`,
        type: 'error'
      })
      return
    }
    
    // 自定义登录
    const data = await login({
      code: Taro.getStorageSync('code'),
      iv: UserRes.iv,
      encryptedData: UserRes.encryptedData
    })
    Taro.setStorageSync('nickName', UserRes.userInfo.nickName)
    Taro.setStorageSync('avatarUrl', UserRes.userInfo.avatarUrl)
    // id
    if (data.data.errorCode === 0) {
      Taro.setStorageSync('id', data.data.data.ownId)
    } else {
      Taro.atMessage({
        message: `失败: ${data.data.errorCode},${data.data.errorMessage}`,
        type: 'error'
      })
    }

    setIsOpened(false)
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
