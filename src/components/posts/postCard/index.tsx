import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserCard from '../userCard/index'
import ContentCard from '../contentCard/index'
import CommentPre from '../CommentPreview/index'
import {PostMsg, UserInfo, UserMsg, ContentMsg, ZoneMsg, LikeMsg, CommentMsg, CommentItem} from '../../../model/api/index'

import './index.scss'

export default (props) => {

  const postData: PostMsg = props.postData;

  const userInfo: UserInfo = {
    id: postData.creator,
    name: postData.creatorName
  }

  const userMsg: UserMsg = {
    creator: postData.creator,
    creatorName: postData.creatorName,
    createTime: postData.createTime,
    avatar: postData.avatar,
    userType: postData.userType
  }

  const contentMsg: ContentMsg = {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    pictures: postData.pictures,
    files: postData.files,
    last_update: postData.last_update
  }

  const zoneMsg: ZoneMsg = {
    zone: postData.zone,
    awesome: postData.awesome
  }

  const likeMsg: LikeMsg = {
    likeCount: postData.likeCount,
    isLiked: postData.isLiked,
    likers: postData.likers,
  }

  const commentMsg: CommentMsg = {
    commentCount: postData.commentCount,
    comments: postData.comments
  }

  const [commentPreview, setCommentPreview] = useState<Array<CommentItem>>([]);

  // 处理帖子评论（取出前五条首页展示
  useEffect(() => {
    let num = 5;
    commentMsg.comments.map((comment, i1) => {
      comment.map((item, i2) => {
        commentPreview.push(item);
        num --;
        if(num <= 0) return;
      })
      if(num <= 0) return;
    })
    setCommentPreview(commentPreview);
    console.log('commentPreview',commentPreview);
  }, [])

  return (
    <View className='post-container'>
      <View className='card-head'>
        <UserCard
          userMsg={userMsg}
        />
      </View>

      <View className='card-content'>
        <ContentCard
          detail={false}
          userInfo={userInfo}
          contentMsg={contentMsg}
          zoneMsg={zoneMsg}
          likeMsg={likeMsg}
        />
      </View>

      <View className='card-comment'>
        <CommentPre
          detail={false}
          id={contentMsg.id}
          previewMsg={commentPreview}
        />
      </View>
    </View>
  )
}