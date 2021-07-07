import React, { useEffect, useState } from 'react'
import {View, Image, Text, Form, Button, Textarea} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {removeSpace, countWords} from '../../../utils/index'
import {useStore} from '../../../model/store/index'
import { getUserExp, postComment, UserExp } from '../../../model/api'

import biaoqing from '../../../images/biaoqing.png'

import './index.scss'

export default () => {
  const [userExp, setUserExp] = useState<UserExp>();
  const [nickName, setNickName] = useState();
  const [userAvatar, setUserAvatar] = useState();

  const [toType, setToType] = useState<string>('');

  // var keyBoardHeight = 0;   // 存储键盘高度信息

  const [comment, setComment] = useState('');
  const [words, setWords] = useState(0);
  // const [bottomHeight, setBottomHeight] = useState(40);

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');

  useEffect(() => {
    // console.log('keyBoard', mState.detail);
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
    if(oState.addComment != null){
      setToType(oState.addComment.type === 1 ? '评论' : '回复');
    }
  }, [oState.addComment])

  const submitCom = (e) => {  //提交评论
    (
      async ()=>{
        setComment(removeSpace(e.detail.value.comment));
        const commentRes = await postComment({
          toType: oState.addComment.type,
          toId: oState.addComment.type == 1 ? oState.addComment.postId : oState.addComment.toId,
          message: removeSpace(e.detail.value.comment)
        })
        if(commentRes.data.success){
          Taro.showToast({
            title: toType + '发表成功',
            icon: 'none'
          })
          let addTemp = {...oState.addComment};
          addTemp.comment = {
            id: commentRes.data.data.id,     // 新发表的评论的 id
            content: e.detail.value.comment,
            createTime: new Date().getTime(),
            reply: oState.addComment.toId,   // null 为评论，否则会回复
            user: userExp.id,
            userAvatar: userAvatar,
            userName: nickName,
            userType: userExp.type
          }
          oActions.addComment(addTemp);
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

  const changeHeight = (e) => {    // 键盘高度改变
    console.log(e.detail.height);
  }   

  // 获取键盘高度
  // useEffect(() => {
    
  // }, [])

  return (
    <View className='comment-editor-container' onClick={(e)=>{e.stopPropagation();}}>
      <Form onSubmit={submitCom}>
        {
          toType != '' && (
            <View className='input-title'>
              {toType + ' ' + oState.addComment.name}
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
          cursorSpacing={mState.detail ? 180 : 10}
          onInput={getInput}
          onKeyboardHeightChange={changeHeight} 
        />
        <View className='operate-line'>
          {/* <Image className='left' src={biaoqing}></Image> */}
          <View className='left'></View>
          <View className='right'>
            <Text className='words'>
              <Text>{words}</Text>
              <Text>{' / 500'}</Text>
            </Text>
            <Button className={words!=0 ? 'button-active' : ''} formType='submit' disabled={words==0}><Text>发送</Text></Button>
          </View>
        </View>
      </Form>
    </View>
  )
}