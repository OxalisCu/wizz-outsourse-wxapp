import React, { useEffect, useState } from 'react'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../../../userNav/index'
import {LikeMsg} from '../../../../model/api/index'

import './index.scss'

import zan_small from '../../../../images/zan_small.png'

export default (props) => {

  const likeMsg: LikeMsg | null = props.likeMsg;

  return likeMsg != null && likeMsg.isLiked && (
    <View className='likers-container'>
      <Image className='icon' src={zan_small}></Image>
      {
        (likeMsg.likers != null) && likeMsg.likers.map((item, index) => {
          if(index >= 20){
            return index == 20 ? (
              <Text>等{likeMsg.likeCount}人觉得很赞</Text>
            ) : ('')
          }else{
            return (
              <UserNav className='likers'>{(index == 0 ? '' : '，') + item.name}</UserNav>
            )
          }
        })
      }
    </View>
  )
}