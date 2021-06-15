import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Input} from '@tarojs/components'
import UserCard from '../../components/posts/userCard/index'
import CommentBar from '../../components/posts/commentBar/index'
import Modal from '../../components/modal/index'
import {CommentItem, UserExp} from '../../model/api/index'
import {useStore} from '../../model/store/index'

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

  const comment = (id: number, name: string, type: string) => {
    mActions.openModal({
      page: 'commentDetail',
      mask: 'commentEditor',
      id,
      name,
      type
    })
  }

  const commentDelete = (item) => {
    if(userExp.type == 6 || userExp.id == item.user){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'commentDetail',
        id: item.id,
      })
    }
  }

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
          onClick={()=>{comment(commentDetail[0].user, commentDetail[0].userName, '回复')}}
        >{commentDetail[0].content}</View>
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
                  onClick={()=>{comment(item.user, item.userName, '回复')}} 
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

      <CommentBar detail id={commentDetail[0].id} name={commentDetail[0].userName} />

      <Modal page='commentDetail' />
    </View>
  )
}