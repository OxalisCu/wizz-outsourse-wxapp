import React from 'react'
import Taro from '@tarojs/taro'
import {View, Input} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default (props) => {
  const detail = props.detail;
  const id = props.id;
  const name = props.name;

  const [mState, mActions] = useStore('Modal');

  const commentEditor = () => {
    mActions.openModal({
      mask: 'commentEditor',
      page: detail ? 'commentDetail' : 'postDetail',
      id: id,
      name: name,
      type: '评论'
    })
  }

  return (
    <View className='comment-bar-container'>
      <Input
        className='input'
        placeholder='文明发言'
        placeholderClass='input-holder'
        onFocus={commentEditor}
      />
    </View>
  )
}