import React, {useState} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../../userNav/index'
import {MessageItem, putMsgRead} from '../../../model/api/index'
import {timeFormat} from '../../../utils/index'

import './index.scss'

export default (props) => {
  const [messageMsg, setMessageMsg] = useState<MessageItem>(props.messageMsg);

  const type = ['评论', '帖子', '点赞'];

  const viewPosts = () => {
    Taro.navigateTo({
      url: '../../posts/postDetail/index?id=' + messageMsg.toId,
      success: async(res)=>{
        if(!messageMsg.readed){
          if(await (await putMsgRead({id: messageMsg.id})).data.success){
            let msg = {...messageMsg};
            msg.readed = true;
            setMessageMsg(msg);
          }
        }
      }
    })
  }

  return (
    <View className='message-container'>
      <View className='message-head'>
        <UserNav>
          <View className='avatar'>
            <Image src={messageMsg.emitterAvatar}></Image>
          </View>
        </UserNav>
        <View className='head'>
          <UserNav>
            <Text className='username'>{messageMsg.emitterName}</Text>
          </UserNav>
          <Text className='tip'>
            <Text>{messageMsg.fromType == 2 ? '赞' : '回复'}</Text>
            了你的
            <Text>{messageMsg.fromType == 2 ? '帖子' : type[messageMsg.toType]}</Text>
          </Text>
        </View>
        {
          messageMsg.readed || <View className='readed'></View>
        }
      </View>
      <View className='message-detail'>
        <View className='reply'>{messageMsg.fromContent}</View>
        {
          messageMsg.toId != null && messageMsg.toContent != null ? (
            <View className='content' onClick={viewPosts}>
              <View>
                <Text>{messageMsg.toContent}</Text>
              </View>
            </View>
          ) : (
            <View className='content' onClick={viewPosts}>
              <View>已删除</View>
            </View>
          )
        }
        <Text className='time'>{timeFormat(messageMsg.create_time)}</Text>
      </View>
    </View>
  )
}