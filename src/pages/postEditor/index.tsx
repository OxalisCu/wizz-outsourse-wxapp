import React, {useState, useEffect} from 'react'
import {View, Text, Textarea, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import SparkMD5 from 'spark-md5'
import Imgs from '../../components/posts/contentCard/imgs/index'
import {useStore} from '../../model/store/index'
import {getFileInfo} from '../../utils/index'
import {getFileUrl, createPost} from '../../model/api/index'

import './index.scss'

import tupian from '../../images/tupian.png'
import wenjian from '../../images/wenjian.png'
import biaoqing from '../../images/biaoqing.png'

// 获取测试数据
import {zonesData} from '../../data/data'
import { indexOf } from 'lodash'

interface Zone{
  title: string
}

interface FileInfo{
  name: string,
  md5: string,
  type: string
}

interface ChooseFile{
  name: string,
  path: string,
  size: number,
  time: number,
  type: string
}

interface Post{
  title: string,
  pictures: Array<string>,
  files: Array<string>,
  zone: number,
  content: string
}

export default () => {
  const [zones, setZones] = useState<Array<Zone>>([]);
  const [postCon, setPostCon] = useState<string>('');

  const [images, setImages] = useState<Array<string>>([]);
  const [file, setFile] = useState<Array<string>>([]);
  const [files, setFiles] = useState<Array<ChooseFile>>([]);

  let imgUrl: Array<string>;
  let fileUrl: Array<string>;
  let zone: number;

  const [sendAvailable, setSendAvailable] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  const [state4, actions4] = useStore('Zones')
 
  // 测试数据
  useEffect(() => {
    setZones(zonesData);
  })

  // 加载分区信息
  // useEffect(() => {
  //   setZones(state4.zones);
  // })

  const getMD5 = async (image) => {
    let hexHash: string;
    await Taro.getFileSystemManager().readFile({
      filePath: image,   //选择图片返回的相对路径
      encoding: 'binary', //编码格式
      success(res){
        console.log('data:image/png;base64,' , res)
        var spark = new SparkMD5.ArrayBuffer();
        spark.append(res.data);
        hexHash = spark.end(false);
        console.log(hexHash)
      }
    })
    return hexHash;
  }

  const uploadFiles = async () => {
    let imgInfo: Array<FileInfo>;
    let imgMD5 = await getMD5(images);
    images.map(async (image, index) => {
      let info = getFileInfo(image);
      imgInfo.push({
        name: info[0],
        type: info[1],
        md5: imgMD5[index]
      })
      let url = await getFileUrl(imgInfo);
      if(url.data.success){
        imgUrl.push(url.data.data.url);
      }else{
        Taro.showToast({
          title: '上传图片失败',
          icon: 'none'
        })
      }
    })
    

    let fileArr = files.map((file)=>{
      return file.path
    })
    let fileInfo: Array<FileInfo>;
    let fileMD5 = await getMD5(fileArr);
    files.map(async (file, index) => {
      let info = getFileInfo(file.path);
      fileInfo.push({
        name: file.name,
        type: info[1],
        md5: fileMD5[index]
      })
      let url = await getFileUrl(fileInfo);
      if(url.data.success){
        fileUrl.push(url.data.data.url);
      }else{
        Taro.showToast({
          title: '上传文件失败',
          icon: 'none'
        })
      }
    })
  }

  const uploadPost = async () => {
    const createRes = await createPost({
      title: '',
      pictures: imgUrl,
      files: fileUrl,
      zone: zone,
      content: postCon
    })
    if(createRes.data.data.success){
      Taro.showToast({
        title: '帖子创建成功',
        icon: 'none',
        success(){
          Taro.navigateBack({
            delta: 1
          })
        }
      })
    }else{
      Taro.showToast({
        title: '帖子创建失败',
        icon: 'none'
      })
    }
  }

  const chooseImg = () => {
    Taro.chooseImage({
      success: function(res){
        setImages(res.tempFilePaths);
      }
    })
  }

  const chooseFile = () => {
    Taro.chooseMessageFile({
      count: 10,
      type: 'file',
      success: function (res) {
        setFiles(res.tempFiles);
        let temp = [];
        files.map((item) => {
          temp.push(item.path);
        })
        setFile(temp);
      }
    })
  }

  const showEmoji = () => {

  }

  return (
    <View className='post-editor-container'>
      <View className='edit-content'>
        <View className='text-input'>
          <Textarea
            style={lineCount > 7 ? 'height: ' + lineCount*20 + 'px' : ''}
            placeholder='说点什么吧'
            placeholderClass='text-input-holder'
            maxlength={-1}
            onLineChange={(e)=>{setLineCount(e.detail.lineCount)}}
            onInput={(e)=>{setPostCon(e.detail.value)}} 
          />
          <View className='post-files'>
            <Imgs
              detail
              images={images}
              files={file}
            />
          </View>
        </View>
        <View className='file-upload'>
          <Image className='file-img' src={tupian} onClick={chooseImg}></Image>
          <Image className='file-file' src={wenjian} onClick={chooseFile}></Image>
          <Image className='file-emoji' src={biaoqing} onClick={showEmoji}></Image>
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