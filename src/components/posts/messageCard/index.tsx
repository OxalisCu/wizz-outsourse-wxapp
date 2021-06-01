import React from 'react'
import {View, Image, Text} from '@tarojs/components'

import './index.scss'

export default (props) => {

  const messageMsg = props.messageMsg;
  const type = props.type;

  return (
    <View className='message-container'>
      <View className='message-head'>
        <Image className='avatar' src={messageMsg.avatar}></Image>
        <Text className='username'>{messageMsg.username}</Text>
        {
          messageMsg.type == '消息' ? (
            <Text className='tip'>{'回复了你的' + messageMsg.type}</Text>
          ) : ( '' )
        }
      </View>
      <View className='message-detail'>
        <View className='reply'>{messageMsg.reply}</View>
        <View className='content'>
          <View>{messageMsg.content}</View>
        </View>
        <Text className='time'>{messageMsg.time}</Text>
      </View>
    </View>
  )
}