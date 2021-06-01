import React from 'react'
import {View} from '@tarojs/components'
import MessageCard from '../../components/posts/messageCard'

import './index.scss'

export default (props) => {

  const messageMsg = [
    {
      avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      username: '路易斯',
      type: '评论',
      reply: '大爱大爱',
      content: '爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易',
      time: '2021.05.19 15:00'
    },{
      avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      username: '路易斯',
      type: '回复',
      reply: '大爱大爱',
      content: '爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易',
      time: '2021.05.19 15:00'
    }
  ]

  return (
    <View className='msgs-container'>
      {
        messageMsg.map((item) => {
          return (
            <View className='out-container'>
              <MessageCard
              type='消息'
              messageMsg={item} />
            </View>
          )
        })
      }
    </View>
  )
}