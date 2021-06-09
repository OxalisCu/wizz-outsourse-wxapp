import React from 'react'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {

  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');

  const deleteComment = () => {
    actions1.setMask('');
  }

  return (
    <View className='delete-btn-container' onClick={deleteComment}>删除</View>
  )
}