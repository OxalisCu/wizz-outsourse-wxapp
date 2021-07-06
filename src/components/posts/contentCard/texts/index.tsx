import React, { useEffect, useState } from 'react';
import Taro, {useDidShow, useReady} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {useStore} from '../../../../model/store'

import './index.scss'

export default (props) => {
  const {content, detail, id} = props;
  const [wrap, setWrap] = useState(false);

  const [wState, wActions] = useStore('Wrap');

  // 文本折叠
  useEffect(() => {
    if(detail) {
      return;
    }

    if(wState.wrap[id]){
      setWrap(true);
      return;
    }

    const time = setInterval(()=>{
      const query = Taro.createSelectorQuery();
      query
      .select('.texts-container>.id-' + id)
      .boundingClientRect((rect) => {
        if(rect == null){
          return;
        }else{
          clearInterval(time);
        }
        let h = rect.height;     // 高度 px
        let pixelRatio;             // 倍率 dpr
        Taro.getSystemInfo()
        .then(res => pixelRatio = res.pixelRatio)
        .then(()=>{
          if(h*pixelRatio > 15*44){
            setWrap(true);
            let wrapTemp = [...wState.wrap];
            wrapTemp[id] = true;
            wActions.setWrap(wrapTemp);
          }
        })
      })
      .exec()
    }, 100)
  }, [])

  return (
    <View className='texts-container'>
      <View className={('id-' + id + ' ') + 'content ' + (wrap ? 'wrap' : '')}>
        <Text>{content}</Text>
      </View>
      {
        wrap && (
          <Text className='more-content'>查看全文</Text>
        )
      }
    </View>
  )
}