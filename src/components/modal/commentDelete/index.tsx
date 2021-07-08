import React, {useState} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'
import { delComment } from '../../../model/api'

import './index.scss'

export default () => {
  const type = ['回复', '评论'];

  const [hidden, setHidden] = useState(false);

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');

  const deleteComment = async () => {
    // setHidden(true);

    const delRes = await delComment({
      id: oState.delComment.toId
    })

    if(delRes.data.success){
      Taro.showToast({
        title: type[oState.delComment.type] + '删除成功',
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

  return !hidden && (
    <>
      <View className='mask' key={1} catchMove onClick={(e)=>{mActions.closeModal({success: ''}); e.stopPropagation();}}></View>
      <View className='delete-btn-container' onClick={deleteComment}>删除</View>
    </>
  )
}