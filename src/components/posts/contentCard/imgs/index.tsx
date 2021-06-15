import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {getFileInfo} from '../../../../utils/index'
import { imgExten, fileExten } from '../../../../service/type'

import './index.scss'

interface ImgItem{
  src: string,
  type: string
}

type FileType =
    | 'doc'
    | 'docx'
    | 'xls'
    | 'xlsx'
    | 'ppt'
    | 'pptx'
    | 'pdf'

interface FileInfo{
  fileType: FileType,
  name: string
}

export default (props) => {
  const detail = props.detail;
  const images: Array<string> = props.images;
  const files: Array<string> = props.files;

  const [imgs, setImgs] = useState<Array<ImgItem>>([]);
  const [fileInfo, setFileInfo] = useState<Array<FileInfo>>([]);

  useEffect(() => {
    let imgsTemp = [];
    let fileTemp = [];

    images.map((item, index) => {
      imgsTemp.push({
        src: item,
        type: 'image'
      })
    })

    // console.log(images);
    // console.log('img', imgsTemp);

    files.map((item, index) => {
      imgsTemp.push({
        src: item,
        type: 'file'
      })
      let exten = getFileInfo(item);
      // console.log(exten);
      let info = decodeURIComponent(exten[0]);
      // console.log(info);
      fileTemp.push({
        name: info,
        fileType: exten[1].toUpperCase()
      })
    })

    let temp;
    if(!detail && imgsTemp.length > 3){
      temp = imgsTemp.slice(0, 3);
    }else{
      temp = imgsTemp;
    }

    setFileInfo(fileTemp);
    setImgs(temp);
  }, [images, files])

  const previewImg = (index) => {
    Taro.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images,   // 需要预览的图片http链接列表
      showmenue: {false},
      fail(err){console.log(err)}
    })
  }

  const previewFile = (src) => {
    Taro.downloadFile({
      url: src,
      success(res1){
        const filePath = res1.tempFilePath;
        Taro.openDocument({
          filePath: filePath,
          success: function (res2) {
            console.log('打开文档成功');
          }
        })
      }
    })
  }

  return (imgs.length != 0) && (
    <View className='imgs-container'>
      {
        imgs.map((item, index) => {
          return (
            <View className={'img-item' + (detail ? ' detail' : '')} key={item.src}>
              {
                item.type == 'image' ? (
                  <Image className='item image' src={item.src} mode='aspectFill' onClick={()=>previewImg(index)}></Image>
                ) : (        
                  <View className='item file' onClick={()=>{previewFile(item.src)}}>
                    <Text className='type'>{(index - images.length < 0) ? '' : fileInfo[index - images.length].fileType}</Text>
                    <Text className='name'>{(index - images.length < 0) ? '' : fileInfo[index - images.length].name}</Text>
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