import React, {useState, useEffect} from 'react'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {useStore} from '../../../model/store/index'
import {CommentItem} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const detail: boolean = props.detail;
  const id: number | undefined = props.id;
  const previewMsg: Array<CommentItem> | null = props.previewMsg;

  const [map, setMap] = useState<Array<string>>([]);
  const [loading, setLoading]  = useState(true);
  
  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');
  const [state4, actions4] = useStore('Query');

  useEffect(()=>{
    if(previewMsg.length != 0){
      previewMsg.map((item) => {
        map[item.id] = item.userName;
      })
      setMap(map);
      setLoading(false);
    }
  }, [previewMsg.length])

  const viewDetail = () => {    // 查看帖子详情
    Taro.navigateTo({
      url: detail ? '../commentDetail/index' : '../postDetail/index'
    })
    if(id != undefined){
      actions4.setQuery(id);
    }
  }  
  
  const commentDelete = (e) => {   // 删除评论
    actions1.setMask({
      mask: 'commentDelete',
      page: detail ? 'postDetail' : 'posts'
    });
  }

  return previewMsg != null && previewMsg.length > 1 && !loading && (
    <View className='preview-container' onClick={viewDetail}>
      {
        previewMsg.map((item, index) => {
          if(index >= 5){   // 多余五条折叠
            if(index == 5){
              return (
                <View className='more'>查看全部回复</View>
              )
            }
          }else if(item.reply == null){    // 是否把评论展示进预览里（是否为首页
            if(!detail){
              return (  
                <View className='comment-item' onLongPress={commentDelete}>
                  <Text className='name'>{item.userName}：</Text>   
                  <Text className='content'>{item.content}</Text>
                </View>
              )
            }
          }else{    // 回复信息
            return (  
              <View className={'reply-item' + (detail ? '' : ' margin')} onLongPress={commentDelete}>
                <Text className='name'>{item.userName}</Text>
                <Text className='between'>回复</Text>
                <Text className='name'>{map[item.reply]}：</Text>
                <Text className='content'>{item.content}</Text>
              </View>
            )
          }
        })
      }
    </View>
  )
}