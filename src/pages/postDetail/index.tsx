import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import UserCard from '../../components/posts/userCard'
import ContentCard from '../../components/posts/contentCard'
import CommentCard from '../../components/posts/commentCard'
import CommentBar from '../../components/posts/commentBar'
import Modal from '../../components/modal/index'
import {useStore} from '../../model/store/index'
import {getPostDetail, PostMsg, UserInfo, UserMsg, ContentMsg, ZoneMsg, LikeMsg, CommentMsg, CommentItem} from '../../model/api/index'

// 测试数据
import {postsData} from '../../data/data'

import './index.scss'

export default () => {

  const [postData, setPostData] = useState<PostMsg>();

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userMsg, setUserMsg] = useState<UserMsg>();
  const [contentMsg, setContentMsg] = useState<ContentMsg>();
  const [zoneMsg, setZoneMsg] = useState<ZoneMsg>();
  const [likeMsg, setLikeMsg] = useState<LikeMsg>();
  const [commentMsg, setCommentMsg] = useState<CommentMsg>();

  const [state4, actions4] = useStore('Query');

  // 测试数据
  useEffect(() => {
    setPostData(postsData.data.records[0]);
  }, [])

  // useEffect(() => {
  //   ;(
  //     async () => {
  //       var postRes = await getPostDetail({
  //         id: state4.id
  //       })
  //       if(postRes.data.success){
  //         setPostData(postRes.data.data);
  //       }else{
  //         Taro.showToast({
  //           title: postRes.data.message,
  //           icon: 'none'
  //         })
  //       }
  //     }
  //   )()
  // }, [])

  useEffect(() => {
    if(postData != null){
      setUserInfo({
        id: postData.creator,
        name: postData.creatorName
      })
      setUserMsg({
        creator: postData.creator,
        creatorName: postData.creatorName,
        createTime: postData.createTime,
        avatar: postData.avatar,
        userType: postData.userType
      })
      setContentMsg({
        id: postData.id,
        title: postData.title,
        content: postData.content,
        pictures: postData.pictures,
        files: postData.files,
        last_update: postData.last_update
      })
      setZoneMsg({
        zone: postData.zone,
        awesome: postData.awesome
      })
      setLikeMsg({
        likeCount: postData.likeCount,
        isLiked: postData.isLiked,
        likers: postData.likers,
      })
      setCommentMsg({
        commentCount: postData.commentCount,
        comments: postData.comments
      })
    }
  }, [postData])

  return postData != null && userInfo != null && userMsg != null && contentMsg != null &&zoneMsg != null && likeMsg != null && commentMsg != null
    && (
    <View className='post-detail-container'>
      <View className='up'>
        <UserCard 
          userMsg={userMsg}
        />
        
        <ContentCard
          detail
          userInfo={userInfo}
          contentMsg={contentMsg}
          zoneMsg={zoneMsg}
          likeMsg={likeMsg}
        />
      </View>
    
      <View className='bottom'>
        <View className='comment-num'>评论（{commentMsg.commentCount}）</View>
        {
          commentMsg.comments.length != 0 && (
            commentMsg.comments.map((item, index) => {
              return (
                <View className='comment-list' key={index}>
                  <CommentCard
                    commentItem={item} 
                  />
                </View>
              )
            })
          )
        }
      </View>

      <CommentBar detail={false} id={contentMsg.id} name={userMsg.creatorName} />

      <Modal page='postDetail' />
    </View>
  )
}