import React, {useState, useEffect} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

// icon
import usertype from '../../images/usertype.png'
import exp from '../../images/exp.png'

interface ExpMsg{
  id: number,
  type: number,
  expireTime: number,
  exp: number | null,
  last_Update: number
}

export default () => {
  const rankList = ['免费用户', '小透明', '热心肠', '积极分子', '大佬', '合伙人', '管理员'];

  const [avatarUrl, setAvatarUrl] = useState();
  const [nickName, setNickName] = useState();
  const [expMsg, setExpMsg] = useState<ExpMsg>();

  return (
    <View className='user-container'>
      <View className='user-msg'>
        <Image className='avatar' src={avatarUrl}></Image>
        <View className='msg'>
          <Text className='name'>{nickName}</Text>
          <Image className='type' src={usertype}></Image>
        </View>
        <View className='experience'>
          <Text className='title'>{rankList[expMsg.type]}</Text>
          <Image className='icon' src={exp}></Image>
          <Text className='exp'>{expMsg.exp}</Text>
        </View>
      </View>
    </View>
  )
}