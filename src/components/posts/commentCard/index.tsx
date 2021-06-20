import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import UserCard from '../userCard/index'
import CommentPre from '../commentPreview/index'
import {useStore} from '../../../model/store/index'
import {CommentItem, UserMsg, UserExp} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const [userMsg, setUserMsg] = useState<UserMsg>();
  const [previewMsg, setPreviewMsg] = useState<Array<CommentItem>>(props.previewMsg);
  const commentDelete = props.commentDelete;
  
  const [userExp, setUserExp] = useState<UserExp>();
  const [wrap, setWrap] = useState<boolean>();

  const [mState, mActions] = useStore('Modal');

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(() => {
    if(previewMsg != null && previewMsg.length != 0){
      setUserMsg({
        creator: previewMsg[0].user,
        creatorName: previewMsg[0].userName,
        avatar: previewMsg[0].userAvatar,
        createTime: previewMsg[0].createTime,
        userType: previewMsg[0].userType
      })
    }
    // console.log('previewMsg',previewMsg);
  }, [])

  useEffect(()=>{
    if(previewMsg.length > 5){
      setWrap(true);
    }else{
      setWrap(false);
    }
  }, [previewMsg])

  // 管理员、帖子发布者、评论发表者可删除评论
  const replyDelete = (item) => {   // 删除评论或回复
    if(userExp.type == 6 || userExp.id == userMsg.creator || userExp.id == previewMsg[0].user){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'postDetail',
        id: item.id,
      })
    }
  }

  const replyEditor = (item) => {    // 回复
    mActions.openModal({
      mask: 'commentEditor',
      page: 'postDetail',
      id: item.id,
      name: item.userName,
      type: '回复',
    })
  }

  useEffect(()=>{
    let preview = [];
    if(mState.success == 'commentDelete'){
      // 删除回复
      previewMsg.map((item, index) => {
        if(item.id != mState.id){
          preview.push(item);
        }
      })
      setPreviewMsg(preview);
    }else if(mState.success == 'commentEditor'){
      // 回复评论，放在最末尾
      [...preview] = previewMsg;
      preview.push(mState.comment);
      mActions.commentMsg(null);
      setPreviewMsg(preview);
      // console.log('replyPreview',preview);
    }
    mActions.closeModal({
      success: ''
    })
  }, [mState.success])

  const viewDetail = () => {
    try{
      // 存储回复信息
      Taro.setStorageSync('commentDetail', previewMsg);
      Taro.navigateTo({
        url: '../commentDetail/index'
      })
    }catch(err){console.log(err);}
  }

  return previewMsg != null && previewMsg.length != 0 && userMsg != null && (
    <View className='comment-container'>
      {/* 评论详情 */}
      <UserCard
        className='head'
        editable={false}
        userMsg={userMsg}
      />
  
      <View className='main-content' onClick={()=>{replyEditor(previewMsg[0])}} onLongPress={()=>{commentDelete(previewMsg[0])}}>
        <Text>{previewMsg[0].content}</Text>
      </View>

      {/* 评论或回复预览 */}
      <CommentPre
        detail
        previewMsg={previewMsg}
        wrap={wrap}
        commentDelete={replyDelete}
        commentEditor={replyEditor}
        viewDetail={viewDetail}
      />
    </View>
  )
}