import React, {useState, useEffect} from 'react'
import {View, Text, Input} from '@tarojs/components'
import UserCard from '../../components/posts/userCard/index'
import CommentEditor from '../../components/posts/commentEditor/index'

import './index.scss'

export default () => {
  const userMsg = {
    avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
    username: '芙芙家的洗碗君1',
    title: '大佬',
    time: '2021.5.20 10:00',
    level: 2,
  }
  const commentDetail = [
    {
      username: '路易斯',
      content: '大爱',
      to: '帖子'     
    },{
      username: '爱吃美食的路易斯',
      content: '关注 up 主很长时间了，作品很棒',
      to: '帖子'
    },{
      username: '跑步鞋',
      content: '卡卡西森森',
      to: '路易斯'
    }
  ]
  
  const [commentBox, setCommentBox] = useState(false);

  return (
    <View className='comment-detail'>
      <View className='detail-head'>
        <UserCard
        editable={false}
        userMsg={userMsg} />
        <View className='main-content'>谢谢大家的支持！！</View>
      </View>
      <View className='detail-body'>
        <Text className='title'>回复</Text>
        {
          commentDetail.map((item) => {
            return (
              <View className='reply-item'>
                <UserCard
                editable={false}
                userMsg={userMsg} />
                <View className='reply-content'>
                  {
                    (item.to == '帖子') ? (
                      <Text className='reply-tip'>
                        <Text>{'回复 '}</Text>
                        <Text>{userMsg.username + '：'}</Text>
                      </Text>
                    ) : (
                      <View />
                    )
                  }
                  <Text className='reply-text'>{item.content}</Text>
                </View>
              </View>
            )
          })
        }
      </View>

      {
        commentBox ? (
          <CommentEditor
          to={userMsg.username}
          type='评论' />
        ) : (
          <View className='over'>
            <Input
            className='input'
            placeholder='文明发言'
            placeholderClass='input-holder'
            onFocus={()=>{setCommentBox(true)}}
            />
          </View>
        )
      }
    </View>
  )
}