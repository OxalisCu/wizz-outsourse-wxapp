import React from 'react'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../userNav/index'

import './index.scss'

export default (props) => {

  const {messageMsg, type} = props;

  return (
    <View className='message-container'>
      <View className='message-head'>
        <UserNav>
          <Image className='avatar' src={messageMsg.avatar}></Image>
        </UserNav>
        <UserNav>
          <Text className='username'>{messageMsg.username}</Text>
        </UserNav>
        {
          type == '消息' ? (
            <Text className='tip'>{'回复了你的' + type}</Text>
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