import React, { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import {View} from '@tarojs/components'
import UserCard from '../../components/posts/userCard'
import ContentCard from '../../components/posts/contentCard'
import CommentCard from '../../components/posts/commentCard'
import CommentBar from '../../components/posts/commentBar'
import Modal from '../../components/modal/index'
import {getPostDetail, PostMsg, UserInfo, UserMsg, ContentMsg, ZoneMsg, LikeMsg, CommentMsg, CommentItem, UserExp} from '../../model/api/index'
import {useStore} from '../../model/store/index'

import './index.scss'

export default () => {
  const id = useRouter().params.id;

  const [postData, setPostData] = useState<PostMsg>();

  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [userMsg, setUserMsg] = useState<UserMsg>();
  const [contentMsg, setContentMsg] = useState<ContentMsg>();
  const [zoneMsg, setZoneMsg] = useState<ZoneMsg>();
  const [likeMsg, setLikeMsg] = useState<LikeMsg>();
  const [commentMsg, setCommentMsg] = useState<CommentMsg>();

  const [userExp, setUserExp] = useState<UserExp>();
  const [editCom, setEditCom] = useState<boolean>(false);

  const [mState, mActions] = useStore('Modal');

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
        // console.log(exp,name);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(() => {
    ;(
      async () => {
        var postRes = await getPostDetail({
          id: id
        })
        if(postRes.data.success){
          setPostData(postRes.data.data);
        }else{
          Taro.showToast({
            title: postRes.data.message,
            icon: 'none'
          })
        }
      }
    )()
  }, [])

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
        last_update: postData.last_update,
        pin: postData.pin
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

  const commentDelete = (item: CommentItem) => {
    if(userExp.type == 6 || userExp.id == userMsg.creator || userExp.id == item.user){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'postDetail',
        id: item.id,
      })
      setEditCom(true);
    }
  }

  const commentEditor = (item: CommentItem) => {
    mActions.openModal({
      mask: 'commentEditor',
      page: 'postDetail',
      id: item.id,
      name: item.userName,
      type: '回复'
    })
    setEditCom(true);
  }

  useEffect(()=>{
    if(mState.success == 'commentDelete' && setEditCom ){
      let commentList: Array<Array<CommentItem>> = [];
      commentMsg.comments.map((comment, i1) => {
        if(comment[0].id != mState.id){
          commentList.push(comment);
        }
      })
      setCommentMsg({
        commentCount: commentMsg.commentCount-1,
        comments: commentList
      })
      setEditCom(false);
      mActions.closeModal({
        success: ''
      })
    }else if(mState.success == 'commentEditor' && mState.id == contentMsg.id){
      console.log('dee');
      let [...commentList] = commentMsg.comments;
      setCommentMsg({
        commentCount: commentMsg.commentCount+1,
        comments: [[mState.comment]].concat(commentList)
      });
      setEditCom(false);
      mActions.closeModal({
        success: ''
      })
    }
  }, [mState.success])

  return postData != null && userInfo != null && userMsg != null && contentMsg != null &&zoneMsg != null && likeMsg != null && commentMsg != null
    && (
    <View className='post-detail-container'>
      <View className='up'>
        <UserCard 
          userMsg={userMsg}
          editable
          postId={contentMsg.id}
        />
        
        <ContentCard
          detail
          userMsg={userMsg}
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
                    previewMsg={item}
                    commentDelete={commentDelete}
                    commentEditor={commentEditor}
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