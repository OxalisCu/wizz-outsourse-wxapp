import React, { useEffect, useState } from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import {View, Input, Image, Text} from '@tarojs/components'
import {AtTabs, AtTabsPane} from 'taro-ui'
import PostCard from '../../components/posts/postCard/index'
import Modal from '../../components/modal/index'
import {getZones, getPostList, PostMsg} from '../../model/api/index'
import {useStore} from '../../model/store/index'

import './index.scss'

import search from '../../images/search.png'
import fatie from '../../images/fatie.png'

// 获取数据演示
import {zonesData, postsData} from '../../data/data'

interface Zone{
  title: string
}

export default () => {

  const [searchData, setSearchData] = useState('');   // 搜索框内容

  const [current, setCurrent] = useState(0);    // 当前选择分区
  const [zones, setZones] = useState<Array<Zone>>([]);   // 分区列表

  const [posts, setPosts] = useState<Array<PostMsg>>([]);   // 获取当前分区帖子信息
  const [page, setPage] = useState(1);    // 当前第几页
  const [bottom, setBottom] = useState(false);

  const [state3, actions3] = useStore('Zones');

  // 测试数据
  useEffect(() => {
    setZones(zonesData);
    actions3.setZones(zonesData);
    setPosts(postsData.data.records);
  }, [])

  // 获取分区和首页帖子信息
  // useEffect(()=>{
  //   ;(
  //     async ()=>{
  //       var zoneRes = await getZones();
  //       var zoneData = [{title: '全部'}, {title: '精品'}];
  //       zoneRes.data.data.map((item, index) => {
  //         zoneData[item.id] = {
  //           title: item.name
  //         }
  //       })
  //       await nextPage(current, page);
  //       setZones(zoneData);
  //       actions3.setZones(zonesData);
  //     }
  //   )()
  // }, [])

  // 换分区
  const changeZone = (index) => {
    if(nextPage(index, 1)){
      setCurrent(index);
      setPage(1);
    }
  }

  // 触底加载更多数据
  useReachBottom(() => {
    console.log('demo');
    setBottom(true);
    if(nextPage(current, page + 1)){
      setPage(page + 1);
    }
  })

  // 获取某分区某页帖子信息
  const nextPage = async (index, page) => {
    var postRes = await getPostList({
      zone: index,
      page: page
    })
    if(postRes.data.success){
      var postData = index == current ? posts : [];   // 若是换分区则清空 postData
      postRes.data.data.records.map((item, index) => {
        postData.push(item);
      })
      setPosts(postData);

      return true;
    }else{
      Taro.showToast({
        title: postRes.data.message,
        icon: 'none'
      })

      return false;
    }
  }

  // 创建帖子
  const createPost = () => {    // 创建帖子
    Taro.navigateTo({
      url: '../postEditor/index'
    })
  }

  // 付费 btn
  const payBtn = () => {
    
  }

  return (
    <View className='posts-container'>
      {/* 搜索框 */}
      <View className='search'>
        <Input
          className='input'
          onInput={(e)=>{setSearchData(e.detail.value)}} 
        />
        {
          searchData == '' ? (
            <View className='input-holder'>
              <Image className='icon' src={search}></Image>
              <Text className='tip'>搜索干货内容</Text>
            </View>
          ) : (
            ''
          )
        }
      </View>

      {/* 帖子分区选项卡 */}
      <AtTabs
        className='posts'
        current={current}
        scroll
        tabList={zones}
        onClick={changeZone}
      >
        {
          zones.length != 0 ?  zones.map((item, i1) => {
            if(i1 == current){
              return (
                <AtTabsPane current={current} index={i1}>
                  {
                    posts.length != 0 ? posts.map((item, i2) => {
                      return (
                        <View className='post-item' key={item.id}>
                          <PostCard
                            postData={item}
                          />
                        </View>
                      )
                    }) : (
                      <View>no content</View>
                    )
                  }
                  {
                    bottom && (
                      true ? (
                        <View className='bottom-pay'>
                          <Text>免费版仅可查看五条结果</Text>
                          <Text onClick={payBtn}>升级会员，即可查看更多，前往升级</Text>
                        </View>
                      ) : (
                        <View className='bottom-more'>加载中...</View>
                      )
                    )
                  }
                </AtTabsPane>
              )
            }else{
              return (
                <AtTabsPane current={current} index={i1}>
                </AtTabsPane>
              )
            }
          }) : (
            <View>loading...</View>
          )
        }
      </AtTabs>

      {/* 新建帖子按钮 */}
      <View className='edit-btn' onClick={createPost}>
        <Image className='icon' src={fatie}></Image>
      </View>

      {/* 导入带蒙层的操作按钮 */}
      <Modal page='posts' />
    </View>
  )
}