import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import UserCard from '../userCard/index'
import {CommentItem, UserMsg, UserExp} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const commentItem: Array<CommentItem> = props.commentItem;
  const postId: number = props.postId;
  const postCreator: number = props.postCreator;

  const commentEditor = props.commentEditor;
  const commentDelete = props.commentDelete;

  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(()=>{
    if(commentItem != null && commentItem.length != 0){
      commentItem.map((item) => {
        map[item.id] = item.userName;
      })
      setMap(map);
      setLoading(false);
    }
  }, [commentItem])

  const viewDetail = () => {
    try{
      // 存储回复信息
      Taro.setStorageSync('commentDetail', commentItem);
      Taro.navigateTo({
        url: '../commentDetail/index?id=' + postId + '&creator=' + postCreator
      })
    }catch(err){console.log(err);}
  }

  return commentItem != null && commentItem.length != 0 && !loading && (
    <View className='comment-container'>
      {/* 评论详情 */}
      <UserCard
        className='head'
        editable={false}
        userMsg={{
          creator: commentItem[0].user,
          creatorName: commentItem[0].userName,
          createTime: commentItem[0].createTime,
          avatar: commentItem[0].userAvatar,
          userType: commentItem[0].userType
        }}
      />
      <View className='main-content' onClick={(e)=>{commentEditor(commentItem[0].id, commentItem[0].userName)}} onLongPress={()=>{commentDelete(commentItem[0].id)}}>
        <Text>{commentItem[0].content}</Text>
      </View>

      {/* 评论或回复预览 */}
      {
        commentItem.length > 1 && (
          <View className='reply-container'>
          {
            commentItem.map((item, index) => {
              if(index == 0 || index > 5){
                return '';
              }else{
                return (  
                  <View className='reply-item' key={item.id} onClick={(e)=>{commentEditor(item.id, item.userName)}} onLongPress={()=>{commentDelete(item.id)}}>
                    <Text className='name'>{item.userName}</Text>
                    <Text className='between'>回复</Text>
                    <Text className='name'>{map[item.reply]}：</Text>
                    <Text className='content'>{item.content}</Text>
                  </View>
                )
              }
            })
          }
          {
            commentItem.length > 6 && (
              <View className='more' onClick={viewDetail}>查看全部回复</View>
            )
          }
          </View>
        )
      }
    </View>
  )
}