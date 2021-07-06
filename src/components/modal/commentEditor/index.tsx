import React, { useEffect, useState } from 'react'
import {View, Image, Text, Form, Button, Textarea} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {removeSpace, countWords} from '../../../utils/index'
import {useStore} from '../../../model/store/index'
import { getUserExp, postComment, UserExp } from '../../../model/api'

import biaoqing from '../../../images/biaoqing.png'

import './index.scss'

export default () => {
  const [mState, mActions] = useStore('Modal');

  const [userExp, setUserExp] = useState<UserExp>();
  const [nickName, setNickName] = useState();
  const [userAvatar, setUserAvatar] = useState();

  const [toType, setToType] = useState<string>('');

  // var keyBoardHeight = 0;   // 存储键盘高度信息

  const [comment, setComment] = useState('');
  const [words, setWords] = useState(0);
  // const [bottomHeight, setBottomHeight] = useState(40);

  useEffect(() => {
    try{
      const exp = Taro.getStorageSync('userExp');
      const name = Taro.getStorageSync('nickName');
      const avatar = Taro.getStorageSync('avatarUrl');
      if(exp && name && avatar){
        setUserExp(exp);
        setNickName(name);
        setUserAvatar(avatar);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(() => {
    if(mState.addComment != null){
      setToType(mState.addComment.type === 1 ? '评论' : '回复');
    }
  }, [mState.addComment])

  const submitCom = (e) => {  //提交评论
    (
      async ()=>{
        setComment(removeSpace(e.detail.value.comment));
        const commentRes = await postComment({
          toType: mState.addComment.type,
          toId: mState.addComment.type == 1 ? mState.addComment.postId : mState.addComment.toId,
          message: removeSpace(e.detail.value.comment)
        })
        if(commentRes.data.success){
          Taro.showToast({
            title: toType + '发表成功',
            icon: 'none'
          })
          let addTemp = {...mState.addComment};
          addTemp.comment = {
            id: commentRes.data.data.id,     // 新发表的评论的 id
            content: e.detail.value.comment,
            createTime: new Date().getTime(),
            reply: mState.addComment.toId,   // null 为评论，否则会回复
            user: userExp.id,
            userAvatar: userAvatar,
            userName: nickName,
            userType: userExp.type
          }
          mActions.addComment(addTemp);
          mActions.closeModal({
            success: 'commentEditor'
          })
        }else{
          Taro.showToast({
            title: commentRes.data.message,
            icon: 'none'
          })
        }
      }
    )()
  };   

  const getInput = (e) => {    // 获取 textarea 输入
    if(removeSpace(e.detail.value) == ''){   // 空串置为空
      setWords(0);
    }else{
      setWords(countWords(e.detail.value));
    }
  }

  // const changeHeight = (e) => {    // 键盘高度改变
  //   console.log(e.detail.height);
  // }   

  // 获取键盘高度
  // useEffect(() => {
    
  // }, [])

  return (
    <View className='comment-editor-container' onClick={(e)=>{e.stopPropagation();}}>
      <Form onSubmit={submitCom}>
        {
          toType != '' && (
            <View className='input-title'>
              {toType + ' ' + mState.addComment.name}
            </View>
          )
        }
        <Textarea 
          className='input-area' 
          name='comment'
          placeholder='文明发言'
          placeholderClass='input-holder'
          showConfirmBar={false}
          maxlength={500}
          autoFocus
          fixed
          onInput={getInput}
          // onKeyboardHeightChange={changeHeight} 
        />
        <View className='operate-line'>
          {/* <Image className='left' src={biaoqing}></Image> */}
          <View className='left'></View>
          <View className='right'>
            <Text className='words'>
              <Text>{words}</Text>
              <Text>{' / 500'}</Text>
            </Text>
            <Button className={words!=0 ? 'button-active' : ''} formType='submit' disabled={words==0}>发送</Button>
          </View>
        </View>
      </Form>
    </View>
  )
}