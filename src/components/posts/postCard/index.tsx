import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import CommentEditor from '../commentEditor/index'
import UserCard from '../userCard/index'
import ContentCard from '../contentCard/index'
import CommentCard from '../commentCard/index'

import fatie from '../../../images/fatie.png'

import './index.scss'

export default (props) => {

  const postData = {
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

  const [deleteBtn, setDeleteBtn] = useState(false);    // 是否显示评论删除按钮
  const [commentBox, setCommentBox] = useState(false);    // 是否打开评论编辑器

  const viewDetail = () => {    // 查看帖子详情，查看评论
    Taro.navigateTo({
      url: '../postDetail/index'
    })
  }   

  const deleteComment = () => {}    // 删除评论

  const createPost = () => {    // 创建帖子
    Taro.navigateTo({
      url: '../postEditor/index',
      success: (res)=> {console.log(res)}
    })
  }

  // useEffect(()=>{
  //   console.log('postData', postData);
  // },[])

  return (
    // 将全局容器设置样式 overflow：hidden; height: 100vh; 实现阻止滚动，但是会滚动到最顶端
    <View className='post-container'>
      <UserCard 
      className='card-head'
      editable={true}
      userMsg={
        {
          avatar: postData.avatar,
          username: postData.username,
          title: postData.title,
          time: postData.time
        }
      } />

      <ContentCard
      className='card-content'
      detail={false}
      contentMsg={
        {
          content: postData.content,
          images: postData.images,
          awesome: postData.awesome,
          zone: postData.zone,
          liked: postData.liked,
          likes: postData.likes,
        }
      } />

      <CommentCard
      onLongPress={()=>{setDeleteBtn(true)}}
      className='card-comment'
      detail={false}
      commentMsg={postData.comments} />

      <View className={deleteBtn || commentBox ? 'mask' : ''} onClick={(e)=>{setDeleteBtn(false); setCommentBox(false);e.stopPropagation();}}>
        {
          deleteBtn ? (
            <View className='delete-btn' onClick={deleteComment}>删除</View>
          ) : (
            <View />
          )
        }{
          commentBox ? (
            <CommentEditor type='评论' to={'芙芙家的洗碗君'} />
          ) : (
            <View />
          )
        }
      </View>

      <View className='edit-btn' onClick={createPost}>
        <Image className='icon' src={fatie}></Image>
      </View>
    </View>
  )
}