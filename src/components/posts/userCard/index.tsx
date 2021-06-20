import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserNav from '../../userNav/index'
import {delPost, UserExp, UserMsg} from '../../../model/api/index'
import { timeFormat } from '../../../utils'

import './index.scss'

// icon
import caozuo from '../../../images/caozuo.png'

export default (props) => {
  const userMsg: UserMsg = props.userMsg;
  const editable: boolean = props.editable || false;
  const postId: number | null = props.postId || null;

  const [more, setMore] = useState(false);    // 帖子操作按钮
  const [userExp, setUserExp] = useState<UserExp>();

  const rankList = ['免费用户', '小透明', '热心肠', '积极分子', '大佬', '合伙人', '管理员'];

  const editPost = () => {  // 编辑帖子
    if(postId != null){
      Taro.navigateTo({
        url: '../postEditor/index?id=' + postId
      })
    }
  }   

  const deletePost = async () => {    // 删除帖子
    if(postId != null){
      const delRes = await delPost({
        id: postId
      })
      if(delRes.data.success){
        Taro.showToast({
          title: '帖子删除成功',
          icon: 'none',
          success(res){
            Taro.switchTab({
              url: '../posts/index'
            })
          }
        })
      }else{
        Taro.showToast({
          title: delRes.data.message,
          icon: 'none'
        })
      }
    }
  } 

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
      }
    }catch(err){console.log(err)}
  }, [])

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
            <Text className='time'>{timeFormat(userMsg.createTime)}</Text>
          </View>
          {
            // 自己或管理员可以编辑帖子
            editable && userExp && (userExp.type == 6 || userMsg.creator == userExp.id) && (
              <View className={more ? 'more-active more' : 'more'}>
                <Image className='icon' src={caozuo} onClick={()=>{setMore(!more)}}></Image>
                <View className='post-manage'>
                  <Text onClick={()=>{setMore(!more);editPost()}}>编辑</Text>
                  <Text onClick={()=>{setMore(!more);deletePost()}}>删除</Text>
                </View>
              </View>
            )
          }
        </View>
    </View>
  )
}