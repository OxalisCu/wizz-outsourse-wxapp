import React, { useEffect, useState } from 'react'
import {View, Image, Text, Form, Button, Textarea} from '@tarojs/components'
import {removeSpace, countWords} from '../../../utils/index'
import {useStore} from '../../../model/store/index'

import biaoqing from '../../../images/biaoqing.png'

import './index.scss'

export default () => {
  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');

  var keyBoardHeight = 0;   // 存储键盘高度信息

  const [comment, setComment] = useState('');
  const [words, setWords] = useState(0);
  // const [bottomHeight, setBottomHeight] = useState(40);

  const submitCom = (e) => {  //提交评论
    (
      async ()=>{
        setComment(removeSpace(e.detail.value.comment));
        
        actions1.setMask({
          page: '',
          mask: ''
        });
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
    // console.log(e.detail.height);
  }   

  // 获取键盘高度
  useEffect(() => {
    
  }, [])

  return (
    <View className='comment-editor-container' onClick={(e)=>{e.stopPropagation();}}>
      <Form onSubmit={submitCom}>
        <View className='input-title'>{state2.data.type + ' ' + state2.data.name}</View>
          <Textarea 
            className='input-area' 
            name='comment'
            placeholder='文明发言'
            placeholderClass='input-holder'
            showConfirmBar={false}
            maxlength={500}
            autoFocus
            autoHeight
            fixed
            onInput={getInput}
            onKeyboardHeightChange={changeHeight} 
          />
        <View className='operate-line'>
          <Image className='left' src={biaoqing}></Image>
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