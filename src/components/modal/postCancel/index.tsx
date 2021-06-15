import React, {useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const [mState, mActions] = useStore('Modal');

  return (
    <View className='post-cancel-container'>

    </View>
  )
}