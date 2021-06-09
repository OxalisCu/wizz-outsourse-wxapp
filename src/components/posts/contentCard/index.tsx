import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import Texts from './texts/index'
import Imgs from './imgs/index'
import Likers from './likers/index'
import {useStore} from '../../../model/store/index'
import {putLike, deleteLike, UserInfo, ContentMsg, ZoneMsg, LikeMsg} from '../../../model/api/index'

import './index.scss'

// icon
import zan from '../../../images/zan.png'
import zan_active from '../../../images/zan_active.png'
import pinglun from '../../../images/pinglun.png'
import jing from '../../../images/jing.png'
import jing_active from '../../../images/jing_active.png'

interface Zone{
  title: string
}

export default (props) => {
  const detail: boolean = props.detail;
  const userInfo: UserInfo = props.userInfo;
  const contentMsg: ContentMsg = props.contentMsg;
  const zoneMsg: ZoneMsg = props.zoneMsg;

  const [likeMsg, setLikeMsg] = useState<LikeMsg>(props.likeMsg);
  const [zones, setZones] = useState<Array<Zone>>([]);

  const [state1, actions1] = useStore('Mask');
  const [state2, actions2] = useStore('Data');
  const [state3, actions3] = useStore('Zones');

  useEffect(() => {
    setZones(state3.zones);
  }, [state3.zones])

  // 将用户点赞放在第一位
  // useEffect(() => {
  //   if(likeMsg.isLiked){
  //     let temp = likeMsg;
  //     temp.likers.map((item, index) => {
  //       if(item.id == userInfo.id){
  //         let demo = item;
  //         temp.likers.splice(index, 1);
  //         temp.likers.unshift(demo);
  //       }
  //     })
  //   }
  // }, [])

  const commentEditor = () => {
    actions1.setMask({
      mask: 'commentEditor',
      page: 'posts'
    });
    actions2.setData({
      id: contentMsg.id,
      name: userInfo.name,
      type: '评论'
    });
  }
  
  const like = () => {    // 点赞
    ;(
      async () => {
        console.log('demo1');
        let likeRes;
        if(likeMsg.isLiked){
          likeRes = await deleteLike({
            id: contentMsg.id
          })
        }else{
          likeRes = await putLike({
            id: contentMsg.id
          })
        }
        console.log('likeRes',likeRes);
        if(likeRes.data.success){
          let temp: LikeMsg = {
            isLiked: false,
            likeCount: 0,
            likers: []
          };
          if(likeMsg.isLiked){
            temp.isLiked = false;
            temp.likeCount = likeMsg.likeCount - 1;
            temp.likers = likeMsg.likers;
            // likeMsg.likers.map((item, index) => {   // 清除用户点赞数据
            //   if(user.id == item.id){
            //     temp.likers.splice(index, 1);
            //   }
            // })
          }else{
            temp.isLiked = true;
            temp.likeCount = likeMsg.likeCount + 1;
            temp.likers = likeMsg.likers;
            // temp.likers = temp.likers.unshift(user);
          }
          setLikeMsg(temp);
        }else{
          Taro.showToast({
            title: likeRes.data.message,
            icon: 'none'
          })
        }
      }
    )()
  }   

  return (
    <View className='content-container'>
      {/* 帖子内容 */}
      <View className={'content-text' + (detail ? ' content-text-detail' : '')}>
        <Texts
          detail={detail}
          content={contentMsg.content} 
          id={contentMsg.id}
        />
      </View>
      {/* 帖子图片、文件 */}
      <View className='content-imgs'>
        <Imgs
          detail={detail}
          images={contentMsg.pictures}
          files={contentMsg.files}
        />
      </View>
      <View className='component'>
        {/* 帖子分区 */}
        <View className='zones'>
          {
            zoneMsg.awesome && (
              <View>
                <Image className='icon' src={jing_active}></Image>
                精品
              </View>
            )
          }
          <View className='zone-item'>
            <Text>#</Text>
            <Text>{(zones != null && zones.length != 0) && zones[zoneMsg.zone].title}</Text>
          </View>
        </View>
        {/* 首页点赞和评论图标 */}
        {
          !detail && (
            <View className='operate'>
              <Image className='comment' src={pinglun} onClick={commentEditor}></Image>
              <Image className='like' src={likeMsg.isLiked ? zan_active : zan} onClick={like}></Image>
            </View>
          )
        }
      </View>
      {/* 帖子编辑时间 */}
      {
        detail && (
          <View className='last-edit'>最后编辑时间：{contentMsg.last_update}</View>
        )
      }
      {/* 点赞列表 */}
      <View className='likes'>
        <Likers
          likeMsg={likeMsg}
        />
      </View>
      {/* 详情页点赞图标 */}
      {
        detail && (
          <View className='like-bottom' onClick={like}>
            <Image className='icon' src={likeMsg.isLiked ? zan_active : zan}></Image>
            {
              likeMsg.isLiked && (
                <Text className='tip'>已点赞</Text>
              )
            }
          </View>
        )
      }
    </View>
  )
}