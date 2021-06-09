import React, { useEffect, useState } from 'react';
import Taro, {useReady} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {useStore} from '../../../../model/store/index'

import './index.scss'

export default (props) => {
  const {content, detail, id} = props;
  const [wrap, setWrap] = useState(false);
  const idStr = detail ? '' : 'id-'+id;

  const [state4, actions4] = useStore('Query');

  useReady(() => {
    if(detail) return

    const query = Taro.createSelectorQuery();
    query
    .select('#' + idStr)
    .boundingClientRect((rect) => {
      console.log(rect);
      var height = rect.height;     // 高度 px
      var pixelRatio;             // 倍率 dpr
      Taro.getSystemInfo()
      .then(res => pixelRatio = res.pixelRatio)
      .then(()=>{
        if(height*pixelRatio > 15*44){
          console.log(height*pixelRatio);
          setWrap(true);
        }
      })
    })
    .exec()
  })

  const viewDetail = () => {
    Taro.navigateTo({
      url: '../postDetail/index'
    })
    actions4.setQuery(id);
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