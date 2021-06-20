import React from 'react'
import {View} from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

export default (props) => {

  const {id, name} = props;

  const userNav = () => {
    Taro.navigateTo({
      url: '../user/' + id,
    })
  }

  return (
    <View className='user-nav-container' onClick={userNav}>
      {props.children}
    </View>
  )
}