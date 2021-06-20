import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import './index.scss'

// icon
import back from '../../images/back.png'

export default (props) => {
  const leftIcon = props.leftIcon || '';
  const leftText = props.leftText || '';
  const clickLeft = props.clickLeft;

  const [statusBarHeight, setStatusBarHeight] = useState<number>(0);

  useEffect(() => {
    Taro.getSystemInfo({
      success(res){
        setStatusBarHeight(res.statusBarHeight);
      }
    })
  }, [])

  return (
    <View className='navbar-container' style={{paddingTop: (statusBarHeight + 'px')}}>
      <View className='left' onClick={clickLeft}>
        {
          leftIcon != '' && <Image className='icon' src={back}></Image>
        }
        <Text className='text'>{leftText}</Text>
      </View>
    </View>
  )
}