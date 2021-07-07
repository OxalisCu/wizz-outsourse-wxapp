import React from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'
import { delComment } from '../../../model/api'

import './index.scss'

export default () => {

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');

  const deleteComment = async () => {
    const delRes = await delComment({
      id: oState.delComment.toId
    })

    if(delRes.data.success){
      Taro.showToast({
        title: '评论删除成功',
        icon: 'none'
      })
      mActions.closeModal({
        success: 'commentDelete'
      })
    }else{
      Taro.showToast({
        title: delRes.data.message,
        icon: 'none'
      })
    }
    
  }

  return (
    <View className='delete-btn-container' onClick={deleteComment}>删除</View>
  )
}