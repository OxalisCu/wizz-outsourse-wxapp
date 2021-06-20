import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {getFileInfo} from '../../../utils/index'
import { imgExten, fileExten } from '../../../service/type'

import './index.scss'

// icon
import deleteBtn from '../../../images/delete.png'

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
  const fileInfo: Array<FileInfo> = props.fileInfo;
  const deleteFile = props.deleteFile;

  const [imgs, setImgs] = useState<Array<ImgItem>>([]);


  useEffect(() => {
    if(images.length == 0 && (files.length == 0 || fileInfo.length == 0) && files.length == fileInfo.length){
      return;
    }
    // console.log(images, files, fileInfo);

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
    })

    setImgs(imgsTemp);
  }, [images, files, fileInfo])

  const previewImg = (index) => {
    Taro.previewImage({
      current: images[index], // 当前显示图片的http链接
      urls: images,   // 需要预览的图片http链接列表
      showmenue: {false},
      success(res){},
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
    <View className='file-upload-container'>
      {
        imgs.map((item, index) => {
          return (
            <View className='file-item' key={item.src}>
              {
                item.type == 'image' ? (
                  <View className='item image'>
                    <Image className='icon' src={item.src} mode='aspectFill' onClick={()=>previewImg(index)}></Image>
                    <View className='delete-btn' onClick={(e)=>{deleteFile(index);e.stopPropagation()}}>
                      <Image className='icon' src={deleteBtn}></Image>
                    </View>
                  </View>
                ) : (        
                  <View className='item file' onClick={()=>{previewFile(item.src)}}>
                    <Text className='type'>{(index - images.length < 0 || index - images.length >= fileInfo.length) ? '' : fileInfo[index - images.length].fileType}</Text>
                    <Text className='name'>{(index - images.length < 0 || index - images.length >= fileInfo.length) ? '' : fileInfo[index - images.length].name}</Text>
                    <View className='delete-btn' onClick={(e)=>{deleteFile(index);e.stopPropagation()}}>
                      <Image className='icon' src={deleteBtn}></Image>
                    </View>
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