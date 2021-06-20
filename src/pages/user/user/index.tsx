import React, {useState, useEffect} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, {useTabItemTap, useDidShow} from '@tarojs/taro'
import { AtMessage } from 'taro-ui'
import {getMsgNum, getToken, getUserExp, UserExp} from '../../../model/api/index'
import LoginModal from '../../../components/login/index'

import './index.scss'

// icon
import usertype from '../../../images/usertype.png'
import exp from '../../../images/exp.png'
import userPosts from '../../../images/user_posts.png'
import userMsg from '../../../images/user_msg.png'
import userCard from '../../../images/user_card.png'
import userOrder from '../../../images/user_order.png'

export default () => {
  const [isLogin, setIsLogin] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [trigger, setTrigger] = useState(Symbol());

  const rankList = ['免费用户', '小透明', '热心肠', '积极分子', '大佬', '合伙人', '管理员'];

  const [avatarUrl, setAvatarUrl] = useState();
  const [nickName, setNickName] = useState();
  const [userExp, setUserExp] = useState<UserExp>();

  const [msgNum, setMsgNum] = useState<number>(0);

  // 每次切换 tab，验证是否登录
  useTabItemTap((item)=>{
    ;(
      async()=>{
        if(!isLogin){
          try{
            let id = Taro.getStorageSync('id');
            if(id){
              setIsLogin(true);
    
               // 使用测试 token
               let token = await getToken({id,});
               console.log(token);
               Taro.setStorageSync('token', token.data);
    
              await loadUserExp();
              await loadMsgNum();
            }else{
              setOpenLogin(true);
              setTrigger(Symbol());
            }
          }catch(err){console.log(err)}
        }
      }
    )()
  })

  // 从 LoginModal 获悉是否登录
  const getIsLogin = (param: boolean) => {
    setIsLogin(param);
    if(param){
      loadUserExp();
      loadMsgNum();
    }
  }

  // 登录后获取用户经验信息
  const loadUserExp = async ()=>{
    const expRes = await getUserExp({id: Taro.getStorageSync('id')});
    try{
      let name = Taro.getStorageSync('nickName');
      let avatar = Taro.getStorageSync('avatarUrl');
      if(name && avatar){
        setNickName(name);
        setAvatarUrl(avatar);
      }
    }catch(err){console.log(err)}
    if(expRes.data.success){
      setUserExp(expRes.data.data);
      try{
        Taro.setStorageSync('userExp', expRes.data.data);
      }catch(err){console.log(err);}
    }
  }

  useDidShow(()=>{
    loadMsgNum();
  })

  // 获取未读消息
  const loadMsgNum = async () => {
    const msgRes = await getMsgNum();
    if(msgRes.data.success){
      setMsgNum(msgRes.data.data);
    }
  }

  // 跳转到 func 页面
  const toFunc = (func) => {
    Taro.navigateTo({
      url: '../../user/' + func + '/index'
    })
  }

  return (
    <View className='user-container'>
      {/* 登录弹窗 */}
      <AtMessage></AtMessage>
      {
        !isLogin && (
          <LoginModal open={openLogin} trigger={trigger} getIsLogin={getIsLogin}></LoginModal>
        )
      }
      {
        isLogin && userExp != null && (
          <View className='user-msg'>
            <View className='user-head'>
              <View className='avatar'>
                <Image src={avatarUrl}></Image>
              </View>
              <View className='msg'>
                <View className='name-msg'>
                  <Text className='name'>{nickName}</Text>
                  <Image className='type' src={usertype}></Image>
                </View>
                <View className='experience'>
                  <Text className='title'>{rankList[userExp.type]}</Text>
                  <View className='exp-msg'>
                    <Image className='icon' src={exp}></Image>
                    <Text className='exp'>{userExp.exp}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className='user-func'>
              <View className='func-1' onClick={()=>{toFunc('card')}}>
                <Image className='icon' src={userCard}></Image>
                <Text className='title'>名片</Text>
              </View>
              <View className='func-2' onClick={()=>{toFunc('order')}}>
                <Image className='icon' src={userOrder}></Image>
                <Text className='title'>订单</Text>
              </View>
              <View className='func-3' onClick={()=>{toFunc('records')}}>
                <Image className='icon' src={userPosts}></Image>
                <Text className='title'>帖子记录</Text>
              </View>
              <View className='func-4' onClick={()=>{toFunc('msgs')}}>
                <Image className='icon' src={userMsg}> </Image>  
                <Text className='title'>消息</Text>
                {
                  msgNum != 0 && (
                    <View className='tip'>{msgNum}</View>
                  )
                }
              </View>
            </View>
          </View>
        )
      }
    </View>
  )
}