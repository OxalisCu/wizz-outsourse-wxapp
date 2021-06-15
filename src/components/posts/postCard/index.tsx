import React, { useEffect, useState } from 'react'
import Taro, { setBackgroundTextStyle, useTabItemTap } from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserCard from '../userCard/index'
import ContentCard from '../contentCard/index'
import CommentPre from '../CommentPreview/index'
import {PostMsg, UserMsg, ContentMsg, ZoneMsg, LikeMsg, CommentMsg, CommentItem, UserExp} from '../../../model/api/index'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default (props) => {
  const postData: PostMsg = props.postData;
  const [userExp, setUserExp] = useState<UserExp>();

  const [mState, mActions] = useStore('Modal');

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
    last_update: postData.last_update,
    pin: postData.pin
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
    let preview = [];
    if(commentMsg.commentCount == 0){
      return;
    }
    commentMsg.comments.map((comment, i1) => {
      comment.map((item, i2) => {
        preview.push(item);
        num --;
        if(num < 0) return;
      })
      if(num < 0) return;
    })
    setCommentPreview(preview);
  }, [])

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(() => {
    if(mState.success == 'commentEditor'){
      console.log(mState);
      console.log(mState.success);
    }
  }, [mState.success])

  // 管理员、帖子发表者、评论发表者可删除评论
  const commentDelete = (item) => {
    if(userExp.type == 6 || userExp.id == item.user || userExp.id == userMsg.creator){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'posts',
        id: item.id,
      })
    }
  }

  // 付费用户评论
  const commentEditor = (preview) => {
    if(userExp.type == 0){
      Taro.showToast({
        title: '免费用户不能评论',
        icon: 'none'
      })
      return;
    }

    mActions.openModal({
      mask: 'commentEditor',
      page: 'posts',
      id: contentMsg.id,
      name: userMsg.creatorName,
      type: preview ? '回复' : '评论'
    })
  }

  // 删除或添加评论
  useEffect(()=>{
    if(mState.success == 'commentDelete'){
      let num = 5;
      let preview = [];
      commentMsg.comments.map((comment, i1) => {
        if(comment[0].id == mState.id){   // 删除评论
          return;
        }
        comment.map((item, i2) => { 
          if(item.id != mState.id){   // 删除回复
            preview.push(item);
            num --;
          }
          if(num < 0) return;
        })
        if(num < 0) return;
      })
      setCommentPreview(preview);
      mActions.closeModal({
        success: ''
      })
    }else if(mState.success == 'commentEditor'){
      let num = 5;
      let preview = [];
      if(mState.comment.reply == null){   // 评论
        preview[0] = mState.comment;
        num --;
        commentMsg.comments.map((comment, i1) => {
          comment.map((item, i2) => {
            preview.push(item);
            num --;
            if(num < 0){return}
          })
          if(num < 0){return}
        })
      }else{    // 回复
        commentMsg.comments.map((comment, i1) => {
          comment.map((item, i2) => {
            preview.push(item);
            num --;
            if(num < 0){return}
            if(comment[0].id == mState.comment.reply && i2 == comment.length - 1){
              preview.push(mState.comment);
              num --;
            }
          })
          if(num < 0){return}
        })
      }
      setCommentPreview(preview);
      mActions.closeModal({
        success: '',
      })
      mActions.commentMsg(null);
    }
  }, [mState.success])

    // 查看帖子详情
  const viewDetail = () => {  
    if(userExp.type == 0){
      Taro.showToast({
        title: '免费用户不能查看帖子详情',
        icon: 'none'
      })
      return;
    }
    
    Taro.navigateTo({
      url: '../postDetail/index?id=' + contentMsg.id
    })
  } 

  return (
    <View className='post-container'>
      <View className='card-head'>
        <UserCard
          userMsg={userMsg}
          editable
          postId={contentMsg.id}
        />
      </View>

      <View className='card-content'>
        <ContentCard
          detail={false}
          userMsg={userMsg}
          contentMsg={contentMsg}
          zoneMsg={zoneMsg}
          likeMsg={likeMsg}
          commentEditor={commentEditor}
        />
      </View>

      <View className='card-comment'>
        <CommentPre
          detail={false}
          previewMsg={commentPreview}
          commentDelete={commentDelete}
          commentEditor={commentEditor}
          viewDetail={viewDetail}
        />
      </View>
    </View>
  )
}