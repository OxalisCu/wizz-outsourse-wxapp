import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'

export default (props) => {
  Taro.navigateTo({
    url: props.url
  })
}