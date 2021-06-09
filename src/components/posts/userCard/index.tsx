import React, {useState, useEffect} from 'react'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../userNav/index'
import {UserMsg} from '../../../model/api/index'

import './index.scss'

// icon
import caozuo from '../../../images/caozuo.png'

export default (props) => {
  const userMsg: UserMsg = props.userMsg;

  const [more, setMore] = useState(false);    // 帖子操作按钮

  const rankList = ['免费用户', '小透明', '热心肠', '积极分子', '大佬', '合伙人', '管理员'];

  const editPost = () => {}   // 编辑帖子
  const deletePost = () => {}   // 删除帖子

  return (
    <View className='head-container'>
        <UserNav>
          <Image className='avatar' src={userMsg.avatar}></Image>
        </UserNav>
        <View className='head'>
          <View className='postmsg'>
            <View className='username'>
              <UserNav>{userMsg.creatorName}</UserNav>
              {
                userMsg.userType != 0 && (
                  <Text className='title'>{rankList[userMsg.userType]}</Text>
                )
              }
            </View>
            <Text className='time'>{userMsg.createTime}</Text>
          </View>
          {
            // 自己或管理员可以编辑帖子
            userMsg.userType == 6 && (
              <View className={more ? 'more-active more' : 'more'}>
                <Image className='icon' src={caozuo} onClick={()=>{setMore(!more)}}></Image>
                <View className='post-manage'>
                  <Text onClick={editPost}>编辑</Text>
                  <Text onClick={deletePost}>删除</Text>
                </View>
              </View>
            )
          }
        </View>
    </View>
  )
}