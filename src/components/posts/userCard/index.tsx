import React, {useState, useEffect} from 'react'
import {View, Image, Text} from '@tarojs/components'

import './index.scss'

// icon
import caozuo from '../../../images/caozuo.png'


export default (props) => {

  const userMsg = props.userMsg;
  const editable = props.editable;    // 是否显示编辑按钮
  const [more, setMore] = useState(false);    // 是否显示帖子操作按钮

  const editPost = () => {}   // 编辑帖子
  const deletePost = () => {}   // 删除帖子

  return (
    <View className='head-container'>
        <Image className='avatar' src={userMsg.avatar}></Image>
        <View className='head'>
          <View className='postmsg'>
            <View className='username'>
              {userMsg.username}
              <Text className='title'>{userMsg.title}</Text>
            </View>
            <Text className='time'>{userMsg.time}</Text>
          </View>
          {
            editable ? (
              <View className={more ? 'more-active more' : 'more'}>
                <Image className='icon' src={caozuo} onClick={()=>{setMore(!more)}}></Image>
                <View className='post-manage'>
                  <Text onClick={editPost}>编辑</Text>
                  <Text onClick={deletePost}>删除</Text>
                </View>
              </View>
            ) : (
              <View />
            )
          }
        </View>
    </View>
  )
}