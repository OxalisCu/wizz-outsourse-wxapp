import React, { useEffect, useState } from 'react'
import {View, Input} from '@tarojs/components'
import UserCard from '../../components/posts/userCard'
import ContentCard from '../../components/posts/contentCard'
import CommentCard from '../../components/posts/commentCard'
import CommentEditor from '../../components/posts/commentEditor'

// data
// import {posts} from '../../data/data'

import './index.scss'

export default () => {

  // const postDetail = posts[0];

  const postDetail = {
    avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
    username: '芙芙家的洗碗君1',
    title: '大佬',
    time: '2021.5.20 10:00',
    level: 2,
    content: '关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒关注 up 主很长时间了，作品很棒',
    images: [
      'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg'
    ],
    awesome: true,
    zone: '剪辑制作技巧',
    likes: [
      '路易斯', '爱吃美食的路易斯', '哪路多', '萨斯给', '卡卡西森森', '班', '黑那大'
    ],
    liked: true,
    comments: [
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
      },{
        username: '路易斯',
        content: '萨斯给',
        to: '爱吃美食的路易斯'
      },{
        username: '跑步鞋',
        content: '哪路多',
        to: '帖子'
      },{
        username: '路易斯',
        content: '芜湖',
        to: '帖子'
      }
    ]
  };
  
  const [commentBox, setCommentBox] = useState(false);

  return (
    <View className='post-detail-container'>
      <View className='up'>
        <UserCard 
        editable={false}
        userMsg={
          {
            avatar: postDetail.avatar,
            username: postDetail.username,
            title: postDetail.title,
            time: postDetail.time
          }
        }/>
        <ContentCard
        detail={true}
        contentMsg={
          {
            content: postDetail.content,
            images: postDetail.images,
            awesome: postDetail.awesome,
            zone: postDetail.zone,
            liked: postDetail.liked,
            likes: postDetail.likes,
          }
        } />
      </View>
    
      <View className='bottom'>
        <View className='comment-num'>评论（{1435}）</View>
        {
          [1,2,3,4].map((item) => {
            return (
              <CommentCard
              className='comment-list'
              detail={true}
              userMsg={
                {
                  avatar: postDetail.avatar,
                  username: postDetail.username,
                  title: postDetail.title,
                  time: postDetail.time
                }
              }
              commentMsg={postDetail.comments} />
            )
          })
        }
      </View>

      {
        commentBox ? (
          <CommentEditor
          to={postDetail.username}
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