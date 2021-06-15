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
  const commentEditor = props.commentEditor;
  
  const [del, setDel] = useState<boolean>(false);
  const [userExp, setUserExp] = useState<UserExp>();

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
  }, [])

  // 管理员、帖子发布者、评论发表者可删除评论
  const replyDelete = (item) => {   // 删除评论或回复
    if(userExp.type == 6 || userExp.id == userMsg.creator || userExp.id == previewMsg[0].user){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'postDetail',
        id: item.id ? item.id : previewMsg[0].id,
      })
      setDel(true);
    }
  }

  const replyEditor = () => {    // 评论
    mActions.openModal({
      mask: 'commentEditor',
      page: 'postDetail',
      id: previewMsg[0].id,
      name: previewMsg[0].userName,
      type: '回复',
    })
    
  }

  useEffect(()=>{
    if(mState.success == 'commentDelete' && del){
      console.log('commentDelete');
      let num = 5;
      let preview = [];
      // 删除评论
      if(mState.id == previewMsg[0].id){
        // 把 previewMsg 全删掉
      }else{    // 删除回复
        previewMsg.map((item, index) => {
          if(item.id != mState.id){
            preview.push(item);
            num --;
          }
          if(num < 0) return;
        })
      }
     
      setPreviewMsg(preview);
      setDel(true);
      mActions.closeModal({
        success: ''
      })
    }
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
  
      <View className='main-content' onClick={()=>{commentEditor(previewMsg[0])}} onLongPress={()=>{commentDelete(previewMsg[0])}}>
        {previewMsg[0].content}
      </View>

      {/* 评论或回复预览 */}
      <CommentPre
        detail
        previewMsg={previewMsg}
        commentDelete={replyDelete}
        commentEditor={replyEditor}
        viewDetail={viewDetail}
      />
    </View>
  )
}