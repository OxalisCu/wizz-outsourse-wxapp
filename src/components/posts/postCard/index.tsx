import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
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

  const [commentMsg, setCommentMsg] = useState<CommentMsg>({
    commentCount: postData.commentCount,
    comments: postData.comments
  })

  const [commentPreview, setCommentPreview] = useState<Array<CommentItem>>([]);
  const [wrap, setWrap] = useState<boolean>(false);

  // 处理帖子评论（取出前五条首页展示
  useEffect(() => {
    let preview = [];
    commentMsg.comments.map((comment, i1) => {
      if(i1 >= 5) return;
      comment.map((item, i2) => {
        if(i2 > 5) return;
        preview.push(item);
      })
    })
    setCommentPreview(preview);
    // console.log('preview',preview);
  }, [commentMsg])

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

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
  const commentEditor = (item: CommentItem) => {
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
      id: item == null ? contentMsg.id : item.id,
      name: item == null ? userMsg.creatorName : item.userName,
      type: item == null ? '评论' : '回复'
    })
  }

  // 删除或添加评论
  useEffect(()=>{
    let commentList = [];
    if(mState.success == 'commentDelete'){
      commentMsg.comments.map((comment, i1) => {
        if(comment[0].id == mState.id){   // 删除评论
          return;
        }
        let temp = [];
        comment.map((item, i2) => { 
          if(item.id != mState.id){   // 删除回复
            temp.push(item);
          }
        })
        commentList.push(temp);
      })
      setCommentMsg({
        commentCount: commentMsg.commentCount-1,
        comments: commentList
      })
      mActions.closeModal({
        success: '',
      })
    }else if(mState.success == 'commentEditor'){
      if(mState.comment.reply == null){   // 评论，新发表放在最上面
        [...commentList] = commentMsg.comments;
        commentList.unshift([mState.comment]);  
        setCommentMsg({
          commentCount: commentMsg.commentCount+1,
          comments: commentList
        })
        mActions.commentMsg(null);
      }else{    // 回复，新发表放在最后
        commentMsg.comments.map((comment, i1) => {
          let temp = [];
          comment.map((item, i2) => {
            temp.push(item);
            if(comment[0].id == mState.comment.reply && i2 == comment.length - 1){
              temp.push(mState.comment);
            }
          })
          commentList.push(temp);
        })
        setCommentMsg({
          commentCount: commentMsg.commentCount+1,
          comments: commentList
        })
        mActions.commentMsg(null);
      }
      mActions.closeModal({
        success: '',
      })
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
          viewDetail={viewDetail}
        />
      </View>

      <View className='card-comment'>
        <CommentPre
          detail={false}
          previewMsg={commentPreview}
          wrap={wrap}
          commentDelete={commentDelete}
          commentEditor={commentEditor}
          viewDetail={viewDetail}
        />
      </View>
    </View>
  )
}