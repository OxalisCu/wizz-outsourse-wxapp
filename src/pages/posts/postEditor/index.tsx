import React, {useState, useEffect} from 'react'
import {View, Text, Textarea, Image} from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import SparkMD5 from 'spark-md5'
import FileUpload from '../../../components/posts/fileUpload/index'
import Navbar from '../../../components/navbar/index'
import Modal from '../../../components/modal/index'
import {useStore} from '../../../model/store/index'
import {getFileInfo, getUrl, isUpload} from '../../../utils/index'
import {getPostDetail, getFileUrl, createPost, putFileOss, editPost} from '../../../model/api/index'
import {fileType} from '../../../service/type'

import './index.scss'

import tupian from '../../../images/tupian.png'
import wenjian from '../../../images/wenjian.png'
import biaoqing from '../../../images/biaoqing.png'

interface Zone{
  title: string
}

interface FileInfo{
  name: string,
  md5: string,
  type: string
}

interface FileName{
  name: string,
  fileType: string
}

interface OssUrl{
  image: Array<string>,
  file: Array<string>
}

interface SafeArea{
  height: number,
  top: number,
}

export default () => {
  const [zones, setZones] = useState<Array<Zone>>([]);
  const id = useRouter().params.id;

  const [postCon, setPostCon] = useState<string>('');
  const [zoneChoice, setZoneChoice] = useState<number>(-1);
  
  // url
  const [images, setImages] = useState<Array<string>>([]);    
  const [files, setFiles] = useState<Array<string>>([]);
  const [fileName, setFileName] = useState<Array<FileName>>([]);

  // 上传 oss 之后的 url
  const [url, setUrl] = useState<OssUrl>();

  // 允许上传
  const [upload, setUpload] = useState<boolean>(false);

  const [sendAvailable, setSendAvailable] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [safeArea, setSafeArea] = useState<SafeArea>();

  const [mState, mActions] = useStore('Modal');
 
  // 加载分区信息
  useEffect(() => {
    try{
      let zone = Taro.getStorageSync('zones');
      if(zone){
        setZones(zone);
      }
    }catch(err){console.log(err)}
  }, [])

  // 获取状态栏高度
  useEffect(() => {
    Taro.getSystemInfo({
      success(res){
        setSafeArea({
          height: res.safeArea.height - 88/res.pixelRatio - 70.5,
          top: res.safeArea.top + 88/res.pixelRatio
        });
      }
    })
  }, [])

  // 获取帖子编辑数据
  useEffect(()=>{
    ;(
      async ()=>{
        if(id != null){
          const detailRes = await getPostDetail({
            id: id
          })
          if(detailRes.data.success){
            setPostCon(detailRes.data.data.content);
            setZoneChoice(detailRes.data.data.zone);
            setImages(detailRes.data.data.pictures || []);
            let names = [];
            if(detailRes.data.data.files != null){
              detailRes.data.data.files.map((item) => {
                let temp = getFileInfo(item);
                names.push({
                  name: decodeURIComponent(temp[0]),
                  fileType: temp[1]
                })
              })
            }
            // console.log('names',names);
            setFileName(names);
            setFiles(detailRes.data.data.files || []);
          }else{
            Taro.showToast({
              title: '帖子信息获取失败',
              icon: 'none',
              success(res){
                setTimeout(()=>{
                  Taro.navigateBack({
                    delta: 1
                  })
                })
              }
            })
          }
        }
      }
    )()
  }, [id])

  const getMD5 = async (file: string) => {
    let fileRes;
    try{
      fileRes = Taro.getFileSystemManager().readFileSync(file);
    }catch(err){
      console.log(err);
    }
    let spark = new SparkMD5.ArrayBuffer();
    await spark.append(fileRes);
    const hexhash = await spark.end();
    console.log(hexhash)
    return hexhash;
  }

  const getOssUrl = async () => {
    Taro.showToast({
      title: '文件上传中',
      icon: 'loading'
    })

    if(images.length == 0 && files.length == 0){
      // console.log('ddeomo');
      setUrl(null);
      setUpload(true);
      return;
    }

    let url1: Array<string> = [];
    await Promise.all(
      images.map(async (image, index) => {
        if(isUpload(image)){
          url1.push(image);
          return;
        }

        let info = getFileInfo(image);
        let MD5 = await getMD5(image);
        let imgTmp: FileInfo = {
          name: info[0] + '.' + info[1],
          type: fileType[info[1]],
          md5: MD5
        }
        let url = await getFileUrl(imgTmp);
        if(url.data.success){
          url1.push(url.data.data.url);
        }else{
          Taro.showToast({
            title: '获取图片 url 失败',
            icon: 'none'
          })
          setUpload(false);
          return;
        }
      })
    )
    
    let url2: Array<string> = [];
    await Promise.all(
      files.map(async (file, index) => {
        if(isUpload(file)){
          url2.push(file);
          return;
        }

        // let info = getFileInfo(file);
        let MD5 = await getMD5(file);
        let fileTmp: FileInfo = {
          name: fileName[index].name + '.' + fileName[index].fileType,
          type: fileType[fileName[index].fileType],
          md5: MD5
        }
        let url = await getFileUrl(fileTmp);
        if(url.data.success){
          url2.push(url.data.data.url);
        }else{
          Taro.showToast({
            title: '获取文件 url 失败',
            icon: 'none'
          })
          setUpload(false);
          return;
        }
      })
    )

    setUrl({
      image: url1,
      file: url2
    })
    setUpload(true);
  }

  useEffect(()=>{
    ;(
      async ()=>{
        if(upload){
          
          console.log('uploadFile');
          console.log('url',url);

          let failNums = 0;     //上传失败文件数

          // 文件 url
          let imageUrl = [], fileUrl = [];   
          if(url != null){
            // 上传文件
            await Promise.all(
              images.map(async (item, index) => {
                if(isUpload(item)){return}

                let tempFileRes = Taro.getFileSystemManager().readFileSync(item);
                let uploadRes = await putFileOss(url.image[index], tempFileRes, fileType[getFileInfo(item)[1]]);
                // console.log('uploadRes',uploadRes);
                if(uploadRes.statusCode != 200){
                  failNums++;
                  Taro.showToast({
                    title: failNums + '份文件上传失败',
                    icon: 'none'
                  })
                }
              })
            )
            await Promise.all(
              files.map(async (item, index) => {
                if(isUpload(item)){return}

                let tempFileRes = Taro.getFileSystemManager().readFileSync(item);
                let uploadRes = await putFileOss(url.file[index], tempFileRes, fileType[getFileInfo(item)[1]]);
                if(uploadRes.statusCode != 200){
                  failNums++;
                  Taro.showToast({
                    title: failNums + '份文件上传失败',
                    icon: 'none'
                  })
                }
              })
            )
            // 取出url
            imageUrl = url.image.map((item) => {
              return getUrl(item);
            })
            fileUrl = url.file.map((item) => {
              return getUrl(item);
            })
          }
          Taro.showToast({
            title: '帖子创建中',
            icon: 'loading'
          })
          let createRes;
          if(id == null){
            createRes = await createPost({
              title: 'dd',
              pictures: imageUrl,
              files: fileUrl,
              zone: zoneChoice,
              content: postCon
            });
          }else{
            createRes = await editPost({
              id: id,
              pictures: imageUrl,
              files: fileUrl,
              content: postCon
            });
          }
          // console.log(createRes);
          Taro.hideToast();
          if(createRes.data.success){
            Taro.showToast({
              title: id == null ? '帖子创建成功' : '帖子修改成功',
              icon: 'none',
              success(){
                setTimeout(()=>{
                  Taro.navigateBack({
                    delta: 1
                  })
                }, 100)
              }
            })
          }else{
            Taro.showToast({
              title: createRes.data.message,
              icon: 'none'
            })
            setUpload(false);
          }
        }
      }
    )()
  }, [upload])

  const chooseImg = () => {
    if(images.length == 9){
      Taro.showToast({
        title: '最多选择9张图片',
        icon: 'none'
      })
      return;
    }

    console.log(images.length);
    Taro.chooseImage({
      count: 9 - images.length,
      success: function(res){
        let [...temp] = images;
        res.tempFiles.map(item => {
          let info = getFileInfo(item.path);
          let type = info[1];
          // 只许上传 jpg 或 png 格式的图片
          if(type === 'jpg' || type === 'jpeg' || type === 'png'){
            temp.push(item.path);
          }
        })
        // console.log('temp',temp);
        setImages(temp);
      },
      fail(err){console.log(err)}
    })
  }

  const chooseFile = () => {
    if(files.length == 9){
      Taro.showToast({
        title: '最多选择9份文件',
        icon: 'none'
      })
      return;
    }

    // console.log(files.length);
    Taro.chooseMessageFile({
      count: 9 - files.length,
      type: 'file',
      extension: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      success: function (res) {
        let [...temp] = files;
        let [...name] = fileName;
        res.tempFiles.map(item => {
          temp.push(item.path);
          let demo = getFileInfo(item.name);
          name.push({
            name: demo[0],
            fileType: demo[1]
          })
        })
        setFileName(name);
        // console.log(temp);
        setFiles(temp);
      },
      fail(err){console.log(err)}
    })
  }

  const deleteFile = (index) => {
    if(index < images.length){
      let [...temp] = images;
      temp.splice(index, 1);
      setImages(temp);
    }else{
      let [...temp1] = files;
      let [...temp2] = fileName;
      temp1.splice(index-images.length, 1);
      temp2.splice(index-images.length, 1);
      setFiles(temp1);
      setFileName(temp2);
    }
  }

  const showEmoji = () => {

  }

  const showModal = () => {
    if(sendAvailable){
      mActions.openModal({
        mask: 'postCancel',
        page: 'postEditor'
      })
    }else{
      Taro.navigateBack({
        delta: 1
      })
    }
  }

  useEffect(() => {
    if(mState.success == 'postCancel'){
      Taro.navigateBack({
        delta: 1
      })
    }
  }, [mState.success])

  useEffect(() => {
    setSendAvailable(zoneChoice >= 0 && postCon.length != 0);
  }, [zoneChoice, postCon])

  return (
    <View className='post-editor-page'>
      <View className='navbar'>
        <Navbar
          leftText='取消'
          clickLeft={showModal}
        />
      </View>
      <View className='post-editor-container' style={safeArea != null && {minHeight: (safeArea.height + 'px'), marginTop: (safeArea.top + 'px')}}>
        <View className='edit-content'>
          <View className='text-input'>
            <Textarea
              style={lineCount > 7 ? 'height: ' + lineCount*20 + 'px' : ''}
              placeholder='说点什么吧'
              value={postCon}
              placeholderClass='text-input-holder'
              maxlength={-1}
              // cursorSpacing={110}
              onLineChange={(e)=>{setLineCount(e.detail.lineCount)}}
              onInput={(e)=>{setPostCon(e.detail.value)}} 
              // onKeyboardHeightChange={(e)=>{console.log(e)}}
            />
            <View className='post-files'>
              {
                (images.length == 0 && (files.length == 0 || fileName.length == 0) && files.length == fileName.length) || (
                  <FileUpload
                    detail
                    images={images}
                    files={files}
                    fileInfo={fileName}
                    deleteFile={deleteFile}
                  />
                )
              }
            </View>
          </View>
          <View className='file-upload'>
            <Image className='file-img' src={tupian} onClick={chooseImg}></Image>
            <Image className='file-file' src={wenjian} onClick={chooseFile}></Image>
            {/* <Image className='file-emoji' src={biaoqing} onClick={showEmoji}></Image> */}
          </View>
          <View className='choose-zones'>
            <Text className='zone-title'>
              <Text>选分区</Text>
              <Text>（必选）</Text>
            </Text>
            <View className='zone-tags'>
              {
                zones.length != 0 && zones.map((item, index) => {
                  return index >= 2 && (
                    <View className={'tag-item' + (zoneChoice == index ? ' choose' : '')} key={index} onClick={()=>{if(id == null)setZoneChoice(index)}}>{item.title}</View>
                  )
                })
              }
            </View>
          </View>
        </View>
      </View>

      <View className={sendAvailable ? 'send-btn active' : 'send-btn'} onClick={getOssUrl}>发送</View>

      <Modal page='postEditor' />
    </View>
  )
}