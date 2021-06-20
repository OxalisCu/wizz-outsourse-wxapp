import React, { useEffect, useState } from 'react';
import Taro, {useDidShow, useReady} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {UserExp} from '../../../../model/api/index'

import './index.scss'

export default (props) => {
  const {content, detail, id} = props;
  const [wrap, setWrap] = useState(false);

  const idStr = detail ? '' : 'id-'+id;

  const [userExp, setUserExp] = useState<UserExp>();

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

  // 文本折叠
  useEffect(() => {
    const time = setInterval(()=>{
      // console.log('demo');

      const query = Taro.createSelectorQuery();
      query
      .select('#' + idStr)
      .boundingClientRect((rect) => {
        // console.log(rect);
        if(rect == null){
          return;
        }else{
          clearInterval(time);
        }
        var h = rect.height;     // 高度 px
        // console.log('height',h);
        var pixelRatio;             // 倍率 dpr
        Taro.getSystemInfo()
        .then(res => pixelRatio = res.pixelRatio)
        .then(()=>{
          if(h*pixelRatio > 15*44){
            // console.log(h*pixelRatio);
            setWrap(true);
          }
        })
      })
      .exec()
    }, 100)
  }, [])

  return (
    <View className='texts-container'>
      <View id={idStr} className={wrap ? 'content wrap' : 'content'}>
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