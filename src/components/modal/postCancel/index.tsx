import React, {useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const [hidden, setHidden] = useState(false);

  const [mState, mActions] = useStore('Modal');

  const back = () => {
    setHidden(true);

    mActions.closeModal({
      success: 'postCancel'
    })
  }

  const cancel = () => {
    // setHidden(true);

    mActions.closeModal({
      success: ''
    })
  }

  return !hidden && (
    <>
      <View className='mask' key={1} catchMove onClick={(e)=>{mActions.closeModal({success: ''}); e.stopPropagation();}}></View>
      <View className='post-cancel-container'>
        <View className='title'>退出此次编辑？</View>
        <View className='btns'>
          <View onClick={back}>确定</View>
          <View onClick={cancel}>取消</View>
        </View>
      </View>
    </>
  )
}