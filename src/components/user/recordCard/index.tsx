import React from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../../userNav/index'
import { timeFormat } from '../../../utils/index' 
import {RecordMsg} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const recordMsg: RecordMsg = props.recordMsg;
  
  const viewPost = () => {
    Taro.navigateTo({
      url: '../../posts/postDetail/index?id=' + recordMsg.id
    })
  }

  return (
    <View className='record-container'>
      <View className='record-head'>
        <UserNav>
          <View className='avatar'>
            <Image src={recordMsg.avatar}></Image>
          </View>
        </UserNav>
        <UserNav>
          <Text className='username'>{recordMsg.creatorName}</Text>
        </UserNav>
      </View>
      <View className='record-detail'>
        <View className='content' onClick={viewPost}>
          <View>
            <Text>{recordMsg.content}</Text>
          </View>
        </View>
        <Text className='time'>{timeFormat(recordMsg.last_update != null ? recordMsg.last_update : recordMsg.createTime)}</Text>
      </View>
    </View>
  )
}