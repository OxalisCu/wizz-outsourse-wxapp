import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import UserCard from '../userCard/index'

import './index.scss'

export default (props) => {

  const commentMsg = props.commentMsg;    // 评论信息
  const userMsg = props.userMsg;
  const detail = props.detail;    // 是否为详情页

  const [deleteBtn, setDeleteBtn] = useState(false);    // 是否显示评论删除按钮

  const viewReply = () => {    // 查看帖子详情，查看评论
    Taro.navigateTo({
      url: '../commentDetail/index'
    })
  }   

  return (
    <View className='comment-container'>
      {
        detail ? (
          <UserCard
          className='head'
          editable={false}
          userMsg={userMsg} />
        ) : (
          <View />
        )
      }
      {
        detail ? (
          <View className='main-content'>
            谢谢大家的支持！！
          </View>
        ) : (
          <View />
        )
      }
      <View className='preview'>
      {
        commentMsg.map((item, index) => {
          if(index >= 5){
            return (
              <View className='more' onClick={viewReply}>查看全部评论</View>
            )
          }else if(item.to == '帖子'){
            return (
              <View className='comment-item'>
                <Text className='name'>{item.username}：</Text>
                <Text className='content'>{item.content}</Text>
              </View>
            )
          }else{
            return (
              <View className='reply-item' onLongPress={()=>{setDeleteBtn(true)}}>
                <Text className='name'>{item.username}</Text>
                <Text className='between'>回复</Text>
                <Text className='name'>{item.to}：</Text>
                <Text className='content'>{item.content}</Text>
              </View>
            )
          }
        })
      }
      </View>
    </View>
  )
}