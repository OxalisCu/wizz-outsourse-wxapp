import React, { useState, useEffect } from 'react'
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtMessage
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

export default (props) => {
  const { open, trigger } = props
  const [isOpened, setIsOpened] = useState(false)

  let getUserInfo = async (e: LoginType) => {
    // iv...
    // console.log('iv', e);
    if (!e.detail.iv) {
      Taro.atMessage({
        message: `失败: ${e.detail.errMsg}`,
        type: 'error'
      })
      return
    }
    const { data } = await login({
      code: Taro.getStorageSync('code'),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    })
    Taro.setStorageSync('nickName', e.detail.userInfo.nickName)
    Taro.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)

    // id
    // console.log('id',data);

    if (data.errorCode === 0) {
      Taro.setStorageSync('id', data.data.id)
    } else {
      Taro.atMessage({
        message: `失败: ${data.errorCode},${data.errorMessage}`,
        type: 'error'
      })
    }
    setIsOpened(false)
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
        <Button openType='getUserInfo' onGetUserInfo={getUserInfo}>
          确定
        </Button>
      </AtModalAction>
    </AtModal>
  )
}
