import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import UserCard from '../userCard/index'
import CommentPre from '../commentPreview/index'
import {useStore} from '../../../model/store/index'
import {CommentItem, UserMsg} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const commentItem: Array<CommentItem> = props.commentItem;

  const [userMsg, setUserMsg] = useState<UserMsg>();
  const [previewMsg, setPreviewMsg] = useState<Array<CommentItem>>([]);

  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');

  useEffect(() => {
    if(commentItem != null && commentItem.length != 0){
      setUserMsg({
        creator: commentItem[0].user,
        creatorName: commentItem[0].userName,
        avatar: commentItem[0].userAvatar,
        createTime: commentItem[0].createTime,
        userType: commentItem[0].userType
      })
      setPreviewMsg(commentItem);
    }
  }, [])

  const viewDetail = () => {    // 查看帖子详情
    Taro.navigateTo({
      url: '../postDetail/index'
    })
  }   

  const commentDelete = (e) => {   // 删除评论或回复
    actions1.setMask({
      mask: 'commentDelete',
      page: 'postDetail'
    });
  }

  const commentEditor = () => {    // 评论
    actions1.setMask({
      mask: 'commentEditor',
      page: 'postDetail'
    });
    actions2.setData({
      id: previewMsg[0].id,
      name: previewMsg[0].userName,
      type: '回复'
    });
  }

  return commentItem != null && commentItem.length != 0 && userMsg != null && previewMsg != null
   && (
    <View className='comment-container'>
      {/* 评论详情 */}
      <UserCard
        className='head'
        editable={false}
        userMsg={userMsg}
      />
  
      <View className='main-content' onClick={commentEditor} onLongPress={commentDelete}>
        {commentItem[0].content}
      </View>

      {/* 评论或回复预览 */}
      <CommentPre
        detail
        previewMsg={previewMsg} 
      />
    </View>
  )
}