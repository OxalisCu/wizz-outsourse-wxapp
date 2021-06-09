import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {getFileInfo} from '../../../../utils/index'

import './index.scss'

interface ImgItem{
  src: string,
  type: string
}

interface FileInfo{
  fileType: string,
  name: string
}

export default (props) => {
  const detail = props.detail;
  const images: Array<string> = props.images != null ? props.images : [];
  const files: Array<string> = props.files != null ? props.files : [];
  const [imgs, setImgs] = useState<Array<ImgItem>>([]);
  const [fileInfo, setFileInfo] = useState<Array<FileInfo>>([]);

  useEffect(() => {
    images.map((item, index) => {
      imgs.push({
        src: item,
        type: 'image'
      })
    })
    files.map((item, index) => {
      imgs.push({
        src: item,
        type: 'file'
      })
      let info = getFileInfo(item);
      fileInfo.push({
        name: info[0],
        fileType: info[1].toUpperCase()
      })
    })
    setFileInfo(fileInfo);
    var temp;
    if(!detail && imgs.length > 3){
      temp = imgs.slice(0, 3);
    }else{
      temp = imgs;
    }
    setImgs(temp);
  }, [])

  const previewImg = (index) => {
    Taro.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images,   // 需要预览的图片http链接列表
      showmenue: {false},
      success(res){
        console.log(res);
      }
    })
  }

  const previewFile = (src) => {
    Taro.downloadFile({
      url: src,
      success(res1){
        console.log(res1);
        const filePath = res1.tempFilePath
        Taro.openDocument({
          filePath: filePath,
          success: function (res2) {
            console.log(res2);
            console.log('打开文档成功')
          }
        })
      }
    })
  }

  return (imgs != null && imgs.length != 0 && fileInfo.length === files.length) && (
    <View className='imgs-container'>
      {
        imgs.map((item, index) => {
          return (
            <View className={'img-item' + (detail ? ' detail' : '')} key={index}>
              {
                item.type == 'image' ? (
                  <Image className='item image' src={item.src} mode='aspectFill' onClick={()=>previewImg(index)}></Image>
                ) : (        
                  <View className='item file' onClick={()=>{previewFile(item.src)}}>
                    <Text className='type'>{fileInfo[index - images.length].fileType}</Text>
                    <Text className='name'>{fileInfo[index - images.length].name}</Text>
                  </View>
                )
              }
            </View>
          )
        })
      }
    </View>
  )
}