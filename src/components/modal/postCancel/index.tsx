import React, {useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const [mState, mActions] = useStore('Modal');

  const back = () => {
    mActions.closeModal({
      success: 'postCancel'
    })
  }

  const cancel = () => {
    mActions.closeModal({
      success: ''
    })
  }

  return (
    <View className='post-cancel-container'>
      <View className='title'>退出此次编辑？</View>
      <View className='btns'>
        <View onClick={back}>确定</View>
        <View onClick={cancel}>取消</View>
      </View>
    </View>
  )
}