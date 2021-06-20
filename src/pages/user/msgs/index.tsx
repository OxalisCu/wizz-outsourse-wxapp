import React, {useEffect, useState}  from 'react'
import Taro,{useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import MessageCard from '../../../components/user/messageCard/index'
import {getMessage, MessageItem} from '../../../model/api/index'

import './index.scss'

export default (props) => {
  const [page, setPage]=useState(1)
  const [messages, setMessages] = useState<Array<MessageItem>>([]);

  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    ;(
      async () => {
        await loadMsgs(1, false);
      }
    )()
  }, [])
  
  useReachBottom(async () => {
    if(await loadMsgs(page + 1, true)){
      setPage(page + 1);
    }
  })

  const loadMsgs = async (page: number, more: boolean): Promise<boolean> => {
    setLoadMore(true);
    let msgRes = await getMessage({
      page,
    })
    console.log(msgRes);
    if(msgRes.data.success){
      if(more){
        let msgs = [...messages, ...msgRes.data.data.records];
        setMessages(msgs);
      }else{
        setMessages(msgRes.data.data.records);
      }
    }else{
      Taro.showToast({
        title: msgRes.data.message
      })
    }
    setLoadMore(false);
    return msgRes.data.success;
  }

  return (
    <View className='msgs-container'>
      {
        messages.map((item, index) => {
          return (
            <View className='out-container' key={item.id}>
              <MessageCard
                messageMsg={item} 
              />
            </View>
          )
        })
      }
      {
        loadMore && (
          <View className='bottom-more'>加载中...</View>         
        )
      }
    </View>
  )
}