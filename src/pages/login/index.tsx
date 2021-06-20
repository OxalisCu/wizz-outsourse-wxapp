import React, { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton, AtActivityIndicator, AtMessage } from 'taro-ui'

import './index.scss'


export default () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.setStorageSync('code', res.code)
          Taro.getSetting({
            success: function () {
              Taro.switchTab({
                url: '../posts/posts/index'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }, [])
  
  return (
    <View>
      {loading ? (
        <AtActivityIndicator mode='center' />
      ) : (
        <View>
          <Image
            src='http://www.blbldata.com/main/static/media/logo.e685d75e.svg'
            style={{
              width: '100%',
              opacity: '0.1',
              margin: '200px 0px 100px 0px'
            }}
          ></Image>
          <View style={{ width: '80%', margin: '0 auto' }}>
            <AtButton
              type='primary'
              disabled={false}
            >
              正在前往首页....请稍等
            </AtButton>
          </View>
        </View>
      )}
    </View>
  )
}
