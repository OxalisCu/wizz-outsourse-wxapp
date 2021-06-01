import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {View, Input, Image, Text} from '@tarojs/components'
import {AtTabs, AtTabsPane} from 'taro-ui'
import PostCard from '../../components/posts/postCard/index'
import {zones} from '../../data/zones'

// 获取数据演示
// import {posts} from '../../data/data'

import './index.scss'

import search from '../../images/search.png'

export default () => {

  const [searchData, setSearchData] = useState('');   // 搜索框内容
  const [current, setCurrent] = useState(0);    // 当前选择分区
  const [zoneList, setZoneList] = useState([]);   // 分区列表
  const [postData, setPostData] = useState([]);   // 获取当前分区帖子信息

  const changeZone = (index) => {
    console.log(index);
    // 想后端发送请求分区帖子信息
    // 更新分区信息
    setCurrent(index);
    // setPostData(posts[index]);
    // console.log(postData);
  }

  useEffect(() => {
    setZoneList(zones);
    // setPostData(posts[0]);
    // console.log(postData);
  }, []);

  return (
    <View className='posts-container'>
      <View className='search'>
        <Input
        className='input'
        onInput={(e)=>{setSearchData(e.detail.value)}} />
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
      <AtTabs
        className='posts'
        current={current}
        scroll
        tabList={zoneList}
        onClick={changeZone}
      >
        {/* {
          zoneList.map((item, index) => {
            if(index == current){
              return ( */}
                <AtTabsPane current={current} index={current}>
                  <PostCard postData={postData} />
                </AtTabsPane>
              {/* )
            }else{
              return (
                <AtTabsPane current={current} index={index}>
                </AtTabsPane>
              )
            }
          })
        } */}
      </AtTabs>

    </View>
  )
}