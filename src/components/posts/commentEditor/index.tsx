import React, { useEffect, useState } from 'react'
import {View, Image, Text, Form, Button, Textarea} from '@tarojs/components'

import biaoqing from '../../../images/biaoqing.png'

import './index.scss'

export default (props) => {
  const to = props.to;
  const type = props.type;    // 评论还是回复
  var keyBoardHeight = 0;   // 存储键盘高度信息

  const [comment, setComment] = useState('');
  const [words, setWords] = useState(false);
  const [boardHeight, setBoardHeight] = useState(0);

  const submitCom = (e) => {  //提交评论
    setComment(removeSpace(e.detail.value.comment));
  };   

  const getInput = (e) => {    // 获取 textarea 输入
    if(removeSpace(e.detail.value) == ''){   // 空串置为空
      setWords(false);
    }else{
      setWords(true);
    }
  }

  const removeSpace = (str) => {   // 删去字符串开头的空格
    var reg = /^\s+/;
    console.log(str.replace(reg, ''+'d'));
    return str.replace(reg, '');
  }

  const changeHeight = (e) => {    // 键盘高度改变，输入框保持吸底
    console.log(e.detail.height);
    // setBoardHeight(e.detail.height);
    if(e.detail.height != 0){
      keyBoardHeight = e.detail.height;
    }
  }   

  // 获取键盘高度
  useEffect(() => {
    
  }, [])

  return (
    <View className='comment-editor-container' onClick={(e)=>{e.stopPropagation();}} style={'position: fixed; bottom:' + boardHeight + 'px'}>
      <Form onSubmit={submitCom}>
        <View className='input-title'>{type + ' ' + to}</View>
        <Textarea 
        className='input-area' 
        name='comment'
        placeholder='文明发言'
        placeholderClass='input-holder'
        showConfirmBar={false}
        maxlength={-1}
        // autoFocus
        onFocus={()=>{setBoardHeight(keyBoardHeight)}}
        onBlur={()=>{setBoardHeight(0)}}
        autoHeight
        fixed
        onInput={getInput}
        onKeyboardHeightChange={changeHeight} />
        <View className='operate-line'>
          <Image src={biaoqing}></Image>
          <Button className={words ? 'button-active' : ''} formType='submit' disabled={!words}>发送</Button>
        </View>
      </Form>
    </View>
  )
}