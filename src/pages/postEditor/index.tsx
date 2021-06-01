import React, {useState, useEffect} from 'react'
import {View, Text, Textarea, Image} from '@tarojs/components'
import Taro, { saveImageToPhotosAlbum } from '@tarojs/taro'

import './index.scss'
import { zones } from '../../data/zones'

import tupian from '../../images/tupian.png'
import wenjian from '../../images/wenjian.png'
import biaoqing from '../../images/biaoqing.png'

export default () => {

  const [sendAvailable, setSendAvailable] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [postCon, setPostCon] = useState('');
  const [images, setImages] = useState([]);

  const uploadPost = () => {}   // 上传帖子

  return (
    <View className='post-editor-container'>
      <View className='edit-content'>
        <View className='text-input'>
          <Textarea
          style={lineCount > 7 ? 'height: ' + lineCount*20 + 'px' : ''}
          placeholder='说点什么吧'
          placeholderClass='text-input-holder'
          maxlength={-1}
          // autoHeight
          onLineChange={(e)=>{setLineCount(e.detail.lineCount)}}
          onInput={(e)=>{setPostCon(e.detail.value)}} />
          <View className='post-files'>
            {
              images.map((item) => {
                return (
                  <Image className='file-item' src={item}></Image>
                )
              })
            }
          </View>
        </View>
        <View className='file-upload'>
          <Image className='file-img' src={tupian}></Image>
          <Image className='file-file' src={wenjian}></Image>
          <Image className='file-emoji' src={biaoqing}></Image>
        </View>
        <View className='choose-zones'>
          <Text className='zone-title'>
            <Text>选分区</Text>
            <Text>（必选）</Text>
          </Text>
          <View className='zone-tags'>
            {
              zones.map((item) => {
                return (
                  <View className='tag-item'>{item.title}</View>
                )
              })
            }
          </View>
        </View>
      </View>
      <View className={sendAvailable ? 'send-btn send-btn-active' : 'send-btn'} onClick={uploadPost}>发送</View>
    </View>
  )
}