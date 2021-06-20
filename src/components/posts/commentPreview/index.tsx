import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {CommentItem} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const detail: boolean = props.detail;
  const previewMsg: Array<CommentItem> = props.previewMsg;
  const wrap: boolean = props.wrap;

  const commentDelete = props.commentDelete;
  const commentEditor = props.commentEditor;
  const viewDetail = props.viewDetail;

  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(()=>{
    // console.log(previewMsg);
    if(previewMsg != null && previewMsg.length != 0){
      previewMsg.map((item) => {
        map[item.id] = item.userName;
      })
      setMap(map);
      setLoading(false);
    }
  }, [previewMsg])

  return previewMsg != null && (!detail && previewMsg.length > 0 || detail && previewMsg.length > 1)  && !loading && (
    <View className='preview-container' onClick={viewDetail}>
      {
        previewMsg.map((item, index) => {
          if(detail && index > 5){
            return '';
          }
          if(item.reply == null){    // 是否把评论展示进预览里（是否为首页
            if(!detail){
              return (  
                <View className='comment-item' key={item.id} onClick={(e)=>{commentEditor(item);e.stopPropagation()}} onLongPress={()=>{commentDelete(item)}}>
                  <Text className='name'>{item.userName}：</Text>   
                  <Text className='content'>{item.content}</Text>
                </View>
              )
            }
          }else{    // 回复信息
            return (  
              <View className={'reply-item' + (detail ? '' : ' margin')} key={item.id} onClick={(e)=>{commentEditor(item);e.stopPropagation()}} onLongPress={()=>{commentDelete(item)}}>
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
        wrap && (
          <View className='more'>{detail ? '查看全部回复' : '查看全部评论'}</View>
        )
      }
    </View>
  )
}