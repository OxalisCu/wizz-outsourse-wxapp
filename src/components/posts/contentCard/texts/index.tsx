import React, { useEffect, useState } from 'react';
import Taro, {useDidShow, useReady} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {UserExp} from '../../../../model/api/index'

import './index.scss'

export default (props) => {
  const {content, detail, id} = props;
  const [wrap, setWrap] = useState(false);
  const [height, setHeight] = useState(0); 

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
        setHeight(rect.height);
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

  const viewDetail = () => {
    if(userExp.type == 0){
      Taro.showToast({
        title: '免费用户不能查看帖子详情',
        icon: 'none'
      })
      return;
    }

    Taro.navigateTo({
      url: '../postDetail/index?id=' + id,
    })
  }

  return (
    <View className='texts-container'>
      <View id={idStr} className={wrap ? 'content wrap' : 'content'} onClick={()=>{if(!detail)viewDetail()}}>
        {content}
      </View>
      {
        wrap && (
          <Text className='more-content' onClick={viewDetail}>查看全文</Text>
        )
      }
    </View>
  )
}