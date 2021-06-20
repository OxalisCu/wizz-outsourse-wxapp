import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import UserCard from '../../../components/posts/userCard/index'
import CommentBar from '../../../components/posts/commentBar/index'
import Modal from '../../../components/modal/index'
import {CommentItem, UserExp} from '../../../model/api/index'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const [commentDetail, setCommentDetail] = useState<Array<CommentItem>>([]);

  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);

  const [userExp, setUserExp] = useState<UserExp>();

  const [mState, mActions] = useStore('Modal');

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

  const commentEditor = (item: CommentItem) => {
    mActions.openModal({
      page: 'commentDetail',
      mask: 'commentEditor',
      id: item.id,
      name: item.userName,
      type: '回复'
    })
  }

  const commentDelete = (item: CommentItem) => {
    if(userExp.type == 6 || userExp.id == item.user || userExp.id == commentDetail[0].user){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'commentDetail',
        id: item.id,
      })
    }
  }

  useEffect(() => {
    let commentList = [];
    if(mState.success == 'commentDelete'){
      commentDetail.map((item) => {
        if(item.id != mState.id){
          commentList.push(item);
        }
      })
      setCommentDetail(commentList);
      mActions.closeModal({
        success: ''
      })
    }else if(mState.success == 'commentEditor'){
      [...commentList] = commentDetail;
      commentList.push(mState.comment);
      setCommentDetail(commentList);
      mActions.closeModal({
        success: ''
      })
      mActions.commentMsg(null);
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
          onClick={()=>{commentEditor(commentDetail[0])}}
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
              <View className='reply-item' key={index}>
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
                  onClick={()=>{commentEditor(item)}} 
                  onLongPress={()=>{commentDelete(item)}}
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

      <CommentBar commentEditor={()=>{commentEditor(commentDetail[0])}} />

      <Modal page='commentDetail' />
    </View>
  )
}