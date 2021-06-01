import React, {useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtTabs, AtTabsPane} from 'taro-ui'
import LoginModal from '../../components/login/index'
import { getNewToken } from '../../model/api/index'
import MessageCard from '../../components/posts/messageCard'

import './index.scss'

export default () => {
  const recordTabs = [
    {title: '发表的'},
    {title: '点赞和评论'},
    {title: '最近浏览'}
  ]

  const recordMsg = [
    {
      avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      username: '芙芙家的洗碗君',
      content: '爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易',
      time: '2021.05.20 10:00'
    },{
      avatar: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg',
      username: '芙芙家的洗碗君',
      content: '爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易，爆肝实在不容易',
      time: '2021.05.20 10:00'
    }
  ]

  const [openLogin, setOpenLogin] = useState(true);
  const [trigger, setTrigger] = useState(Symbol());
  const [current, setCurrent] = useState(0);

  const changeTab = (index) => {     // 换 tab
    setCurrent(index);
  } 

  useEffect(() => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          // code
          // console.log('code', res.code);
          Taro.setStorageSync('code', res.code);
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    })
  }, [])

  useEffect(() => {
    Taro.getStorage({
      key: 'id',
      success: async function (res) {
        // console.log(res);
        setOpenLogin(false);
        await getNewToken({
          id: res.data
        })
      },
      fail: (err)=>{console.log(err)}
    })
  }, [])

  return (
    <View className='records-container'>
      <AtMessage></AtMessage>
      {
        (Taro.getStorageSync('token')) ? (
          <LoginModal open={openLogin} trigger={trigger}></LoginModal>
        ) : (
          <View />
        )
      }
      <AtTabs 
      className='record-tabs'
      current={current}
      tabList={recordTabs}
      onClick={changeTab}>
        <AtTabsPane current={current} index={current}>
          {
            recordMsg.map((item) => {
              return (
                <View className='out-container'>
                  <MessageCard
                  type='记录'
                  messageMsg={item} />
                </View>
              )
            })
          }
        </AtTabsPane>
      </AtTabs>
    </View>
  )
}