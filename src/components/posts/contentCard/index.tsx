import React, { useEffect, useState } from 'react'
import Taro, { useTabItemTap } from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import Texts from './texts/index'
import Imgs from './imgs/index'
import Likers from './likers/index'
import {useStore} from '../../../model/store/index'
import {putLike, deleteLike, UserInfo, ContentMsg, ZoneMsg, LikeMsg, UserExp, UserMsg} from '../../../model/api/index'
import { timeFormat } from '../../../utils'

import './index.scss'

// icon
import zan from '../../../images/zan.png'
import zan_active from '../../../images/zan_active.png'
import pinglun from '../../../images/pinglun.png'
import jing from '../../../images/jing.png'
import jing_active from '../../../images/jing_active.png'
import { useImperativeHandle } from 'react'

interface Zone{
  title: string
}

export default (props) => {
  const detail: boolean = props.detail;
  const userMsg: UserMsg = props.userMsg;
  const contentMsg: ContentMsg = props.contentMsg;
  const zoneMsg: ZoneMsg = props.zoneMsg;
  
  const [likeMsg, setLikeMsg] = useState<LikeMsg>();

  const viewDetail = props.viewDetail;
  const commentEditor = props.commentEditor;

  const [zones, setZones] = useState<Array<Zone>>([]);

  const [userExp, setUserExp] = useState<UserExp>();
  const [nickName, setNickName] = useState<string>();
  const [isPay, setIsPay] = useState<boolean>();

  const [oState, oActions] = useStore('Operate');

  useEffect(() => {
    try{
      let zone = Taro.getStorageSync('zones');
      if(zone){
        setZones(zone);
        // console.log(zone);
      }
    }catch(err){console.log(err)}
  }, [])

  useEffect(() => {
    try{
      setLikeMsg(props.likeMsg);
      oActions.likeOperate(null);
      let exp = Taro.getStorageSync('userExp');
      let name = Taro.getStorageSync('nickName');
      if(exp && name){
        setUserExp(exp);
        setNickName(name);
        setIsPay(exp.type > 0 && exp.expireTime > new Date().getTime())
      }
    }catch(err){console.log(err)}
  }, [])

  // 点赞
  const like = async () => {  
    if(!isPay){
      oActions.likeOperate(null);
      Taro.showToast({
        title: '免费用户不能点赞',
        icon: 'none'
      })
      return;
    }

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

    if(likeRes.data.success){
      oActions.likeOperate({
        postId: contentMsg.id,
        userId: userMsg.creator,
        userName: userMsg.creatorName,
        open: true
      })
    }else{
      oActions.likeOperate(null);
      Taro.showToast({
        title: likeRes.data.message,
        icon: 'none'
      })
    }
  }   

  useEffect(() => {
    ;(
      async () => {
        if(likeMsg == null || oState.likeOperate == null || !oState.likeOperate.open || oState.likeOperate.postId != contentMsg.id){
          oActions.likeOperate(null);
          return;
        }
        
        console.log('like', oState.likeOperate);
        let temp: LikeMsg = {
          isLiked: false,
          likeCount: 0,
          likers: []
        };
        if(likeMsg.isLiked){    // 取消点赞
          temp.isLiked = false;
          temp.likeCount = likeMsg.likeCount - 1;
          temp.likers = [];
          likeMsg.likers.map((item, index) => {   // 清除用户点赞数据
            if(userExp.id != item.id){
              temp.likers.push({...item});
            }
          })    
        }else{    // 点赞
          temp.isLiked = true;
          temp.likeCount = likeMsg.likeCount + 1;
          temp.likers = [];
          likeMsg.likers.map((item, index) => {   // 添加用户点赞数据
            temp.likers.push({...item});
          })
          temp.likers.unshift({
            id: userExp.id,
            name: nickName
          });
        }
        setLikeMsg(temp);

        console.log('likeMsg', temp);

        oActions.likeOperate(null);
      }
    )()
  }, [oState.likeOperate])

  return (
    <View className='content-container'>
      <View className={'content-text' + (detail ? ' content-text-detail' : '')} onClick={viewDetail}>
        <Texts
          detail={detail}
          content={contentMsg.content}
          id={contentMsg.id}
        />
      </View>

      <View className='content-imgs' onClick={viewDetail}>
        <Imgs
          detail={detail}
          images={contentMsg.pictures || []}
          files={contentMsg.files || []}
        />
      </View>

      <View className='component'>
        <View className='zones'>
          {
            zoneMsg.awesome && (
              <View className='zone-awesome'>
                <Image className='icon' src={jing_active}></Image>
                精品
              </View>
            )
          }
          {
            zones.length != 0 && zoneMsg.zone > 0 && <View className='zone-item'>
            <Text>#</Text>
            <Text>{zones[zoneMsg.zone].title}</Text>
          </View>
          }
        </View>
        {
          !detail && likeMsg != null && (
            <View className='operate'>
              <View className='comment'>
                <Image className='icon' src={pinglun} onClick={()=>{commentEditor(null, null)}}></Image>
              </View>
              <View className='like'>
                <Image className='icon' src={likeMsg.isLiked ? zan_active : zan} onClick={like}></Image>
              </View>
            </View>
          )
        }
      </View>

      {
        detail && (
          <View className='last-edit'>最后编辑时间：{contentMsg.last_update == null ? timeFormat(userMsg.createTime) : timeFormat(contentMsg.last_update)}</View>
        )
      }
      <View className='likes'>
        <Likers
          likeMsg={likeMsg}
        />
      </View>
      {
        detail && likeMsg != null && (
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