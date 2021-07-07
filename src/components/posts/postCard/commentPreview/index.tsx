import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {CommentItem} from '../../../../model/api/index'

import './index.scss'

export default (props) => {
  const previewMsg: Array<Array<CommentItem>> = props.previewMsg;

  const commentEditor = props.commentEditor;
  const viewDetail = props.viewDetail;

  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(()=>{
    if(previewMsg != null && previewMsg.length != 0){
      previewMsg.map((msg) => {
        msg.map((item)=>{
          map[item.id] = item.userName;
        })
      })
      setMap(map);
      setLoading(false);
    }
  }, [previewMsg])

  return previewMsg != null &&  previewMsg.length > 0 && !loading && (
    <View className='posts-preview-container'>
      {
        previewMsg.map((msg, i1) => {
          if(i1 >= 5){
            return '';
          }
          return msg.map((item, i2) => {
            if(item.reply == null){
              return (  
                <View className='comment-item' key={item.id} onClick={(e)=>{commentEditor(item.id, item.userName)}}>
                  <Text className='name'>{item.userName}：</Text>   
                  <Text className='content'>{item.content}</Text>
                </View>
              )
            }else if(i2 < 6){
              return (
                <View className='reply-item' key={item.id} onClick={(e)=>{commentEditor(item.id, item.userName)}}>
                  <Text className='name'>{item.userName}</Text>
                  <Text className='between'>回复</Text>
                  <Text className='name'>{map[item.reply] != undefined ? map[item.reply] : '已删除'}：</Text>
                  <Text className='content'>{item.content}</Text>
                </View>
              )
            }
          })
        })
      }
      {
        previewMsg.length > 5 && (
          <View className='more' onClick={viewDetail}>查看全部评论</View>
        )
      }
    </View>
  )
}