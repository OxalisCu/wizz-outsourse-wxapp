import React, {useState, useEffect } from 'react'
import Taro, {useRouter, useDidHide} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import UserCard from '../../../components/posts/userCard/index'
import CommentBar from '../../../components/posts/commentBar/index'
import Modal from '../../../components/modal/index'
import {CommentItem, UserExp} from '../../../model/api/index'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const postId: number = parseInt(useRouter().params.id);
  const postCreator: number = parseInt(useRouter().params.creator);

  const [commentDetail, setCommentDetail] = useState<Array<CommentItem>>([]);
  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);

  const [userExp, setUserExp] = useState<UserExp>();

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');

  useEffect(()=>{
    try{
      const temp = Taro.getStorageSync('commentDetail');
      setCommentDetail(temp);
    }catch(err){console.log(err)}
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(()=>{
    if(commentDetail != null && commentDetail.length != 0){
      commentDetail.map((item) => {
        map[item.id] = item.userName;
      })
      setMap(map);
      setLoading(false);
    }
  }, [commentDetail])

  // 关闭模态框
  useDidHide(() => {
    mActions.closeModal({
      success: ''
    });
  })

  const commentEditor = (toId: number | null, toName: string | null) => {
    mActions.openModal({
      page: 'commentDetail',
      mask: 'commentEditor',
    })
    oActions.addComment({
      toId,
      postId: postId,
      name: toName,
      type: 0,
      comment: null
    })
  }

  // 管理员、帖子创建者、评论发表者删除评论
  const commentDelete = (toId: number, userId: number) => {
    if(userExp.type == 6 || userExp.id == postCreator || userExp.id == userId){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'commentDetail',
      })
      oActions.delComment({
        toId,
        postId: postId,
      })
    }
  }

  useEffect(() => {
    let commentList = [];
    if(mState.success == 'commentDelete' && oState.delComment.postId == postId){
      commentDetail.map((item) => {   // 删除回复
        if(item.id != oState.delComment.toId){
          commentList.push(item);
        }
      })
      setCommentDetail(commentList);
      mActions.closeModal({
        success: ''
      })
    }else if(mState.success == 'commentEditor' && oState.addComment.postId == postId){
      commentList = [...commentDetail, oState.addComment.comment];
      setCommentDetail(commentList);
      mActions.closeModal({
        success: ''
      })
    }
  }, [mState.success])

  return !loading && (
    <View className='comment-detail-container'>
      <View className='detail-head'>
        <UserCard
          userMsg={{
            creator: commentDetail[0].user,
            creatorName: commentDetail[0].userName,
            createTime: commentDetail[0].createTime,
            avatar: commentDetail[0].userAvatar,
            userType: commentDetail[0].userType
          }}
        />
        <View className='main-content' 
          onClick={()=>{commentEditor(commentDetail[0].id, commentDetail[0].userName)}}
        >
          <Text>{commentDetail[0].content}</Text>
        </View>
      </View>
      <View className='detail-body'>
        <Text className='title'>回复</Text>
        {
          commentDetail.map((item, index) => {
            if(index == 0){return ''}
            return (
              <View className='reply-item' key={item.id}>
                <UserCard
                  userMsg={{
                    creator: commentDetail[index].user,
                    creatorName: commentDetail[index].userName,
                    createTime: commentDetail[index].createTime,
                    avatar: commentDetail[index].userAvatar,
                    userType: commentDetail[index].userType
                  }}
                />
                <View className='reply-content' 
                  onClick={()=>{commentEditor(item.id, item.userName)}} 
                  onLongPress={()=>{commentDelete(item.id, item.user)}}
                >
                  {
                    (item.reply == commentDetail[0].id) ? ('') :(
                      <Text className='reply-tip'>
                        <Text>{'回复 '}</Text>
                        <Text>{map[item.reply] + '：'}</Text>
                      </Text>
                    )
                  }
                  <Text className='reply-text'>{item.content}</Text>
                </View>
              </View>
            )
          })
        }
      </View>

      <View onClick={()=>{commentEditor(commentDetail[0].id, commentDetail[0].userName)}}>
        <CommentBar />
      </View>

      <Modal page='commentDetail' />
    </View>
  )
}