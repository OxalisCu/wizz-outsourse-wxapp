import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import CommentEditor from '../commentEditor/index'

import './index.scss'

// icon
import zan from '../../../images/zan.png'
import zan_active from '../../../images/zan_active.png'
import zan_small from '../../../images/zan_small.png'
import pinglun from '../../../images/pinglun.png'
import jing from '../../../images/jing.png'
import jing_active from '../../../images/jing_active.png'

export default (props) => {

  const contentMsg = props.contentMsg;    // 帖子内容，图片，分区，点赞信息
  const detail = props.detail;    // 是否显示帖子详情

  const [commentBox, setCommentBox] = useState(false);    // 是否打开评论编辑器

  const viewDetail = () => {    // 查看帖子详情，查看评论
    Taro.navigateTo({
      url: '../postDetail/index'
    })
  }   

  const previewImg = () => {
    Taro.previewImage({
      current: 'https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg', // 当前显示图片的http链接
      urls: ['https://witrip.wizzstudio.com/images/image/100o1f000001gp44rA9EC_D_256_180.jpg'], // 需要预览的图片http链接列表
      showmenu: false,
      success(res){
        console.log(res);
      }
    })
  }

  const deleteComment = () => {}    // 删除评论
  
  const like = () => {}   // 点赞

  const comment = () => {    // 评论

  }  

  return (
    <View className='content-container'>
      <View className='card-content'>
        <View className='content' onClick={()=>{if(!detail)viewDetail()}}>
          {contentMsg.content}
        </View>
        {
          !detail ? (
            <Text className='more-content' onClick={viewDetail}>查看全文</Text>
          ) : (
            <View />
          )
        }
        <View className='imgs'>
          {
            contentMsg.images.map((item, index) => {
              if(index < 3){
                return (
                  <View className='img-item' key={index}>
                    <Image src={item} onClick={previewImg}></Image>
                  </View>
                )
              }
            })
          }
        </View>
        <View className='component'>
          <View className='zones'>
            {
              contentMsg.awesome ? (
                <View>
                  <Image className='icon' src={jing_active}></Image>
                  精品
                </View>
              ) : (<View />)
            }
            <View className='zone-item'>
              <Text>#</Text>
              <Text>{contentMsg.zone}</Text>
            </View>
          </View>
          {
            !detail ? (
              <View className='operate'>
                <Image className='comment' src={pinglun} onClick={()=>{setCommentBox(true)}}></Image>
                <Image className='like' src={contentMsg.liked ? zan_active : zan} onClick={like}></Image>
              </View>
            ) : (
              <View />
            )
          }
        </View>
        {
          detail ? (
            <View className='last-edit'>最后编辑时间：{'2021.05.20 12:00'}</View>
          ) : (
            <View />
          )
        }
        <View className='likes'>
          <Image className='icon' src={zan_small}></Image>
          {
            contentMsg.likes.map((item, index) => {
              if(index == contentMsg.likes.length-1 || index >= 20){
                return (
                <Text>等{contentMsg.likes.length}人觉得很赞</Text>
                )
              }else{
                return (
                  <Text>{item + '，'}</Text>
                )
              }
            })
          }
        </View>
        {
          detail ? (
            <View className='like-bottom'>
              <Image className='icon' src={contentMsg.liked ? zan_active : zan}></Image>
              {
                contentMsg.liked ? (
                  <Text className='tip'>已点赞</Text>
                ) : (
                  <View />
                )
              }
            </View>
          ) : (
            <View />
          )
        }
      </View>
      {
          commentBox ? (
            <CommentEditor
            to='芙芙家的洗碗君1'
            type='评论' />
          ) : (
            ''
          )
        }
    </View>
  )
}