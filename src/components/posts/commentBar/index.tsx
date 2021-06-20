import React from 'react'
import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'

import './index.scss'

export default (props) => {
  const commentEditor = props.commentEditor;

  return (
    <View className='comment-bar-container' onClick={commentEditor}>
      <View className='input'>
        <Text className='input-holder'>文明发言</Text>
      </View>
    </View>
  )
}