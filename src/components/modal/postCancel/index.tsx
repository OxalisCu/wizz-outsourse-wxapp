import React, {useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');

  return (
    <View className='post-cancel-container'>

    </View>
  )
}