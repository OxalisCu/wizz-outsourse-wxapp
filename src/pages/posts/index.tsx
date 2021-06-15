import React, { useEffect, useState } from 'react'
import Taro, {useReachBottom, useDidShow} from '@tarojs/taro'
import {View, Input, Image, Text} from '@tarojs/components'
import {AtTabs, AtTabsPane, AtMessage} from 'taro-ui'
import PostCard from '../../components/posts/postCard/index'
import Modal from '../../components/modal/index'
import { getZones, getPostList, PostMsg, getUserExp, UserExp} from '../../model/api/index'
import LoginModal from '../../components/login/index'

import './index.scss'

import search from '../../images/search.png'
import fatie from '../../images/fatie.png'

// 获取数据演示
import {zonesData, postsData} from '../../data/data'

interface Zone{
  title: string
}

interface PostMap{
  [index: number]: boolean
}

export default () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [trigger, setTrigger] = useState(Symbol());
  const [isLogin, setIsLogin] = useState(false);

  const [userExp, setUserExp] = useState<UserExp>();

  const [searchData, setSearchData] = useState('');   // 搜索框内容

  const [current, setCurrent] = useState(0);    // 当前选择分区
  const [zones, setZones] = useState<Array<Zone>>([]);   // 分区列表

  const [posts, setPosts] = useState<Array<PostMsg>>([]);   // 获取当前分区帖子信息
  const [page, setPage] = useState(1);    // 当前第几页

  let postMap: PostMap = [];    // 存储帖子列表的 id，判重用

  const [loading, setLoading] = useState(false);
  const [bottom, setBottom] = useState(false);

  // 测试数据
  // useEffect(() => {
  //   setZones(zonesData);
  //   actions3.setZones(zonesData);
  //   setPosts(postsData.data.records);
  // }, [])

  // 进入小程序
  useEffect(() => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          // console.log('code',res.code);
          Taro.setStorageSync('code', res.code);
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    })
  }, [])

  // 每次进入页面
  useDidShow(async ()=>{
    let id = Taro.getStorageSync('id');
    if(id){
      setIsLogin(true);
      loadUserExp();
      loadPosts();
    }else{
      setIsLogin(false);
      setOpenLogin(true);
      setTrigger(Symbol());
    }
  })

  // 从 LoginModal 获悉是否登录，登录用户查看帖子信息
  const getIsLogin = (param: boolean) => {
    setIsLogin(param);
    if(param){
      loadUserExp();
      loadPosts();
    }
  }

  // 获取用户经验信息
  const loadUserExp = async ()=>{
    const expRes = await getUserExp({id: Taro.getStorageSync('id')});
    if(expRes.data.success){
      setUserExp(expRes.data.data);
      try{
        Taro.setStorageSync('userExp', expRes.data.data);
      }catch(err){console.log(err);}
      // console.log(expRes.data.data);
    }
  }

  // 获取分区和首页帖子信息
  const loadPosts = async ()=>{
    let zoneRes = await getZones();
    let zoneData = [{title: '全部'}, {title: '精品'}];
    zoneRes.data.data.map((item, index) => {
      zoneData[item.id] = {
        title: item.name
      }
    })
    Taro.setStorageSync('zones', zoneData);
    await nextPage(current, page);
    setZones(zoneData);
  }

  // 换分区
  const changeZone = async (index) => {
    setBottom(false);
    setCurrent(index);
    setPage(1);
    setLoading(true);
    await nextPage(index, 1);
    setLoading(false);
  }

  // 触底加载更多数据
  useReachBottom(async () => {
    setBottom(true);
    // 付费用户加载更多
    if(userExp.type > 0){
      if(await nextPage(current, page + 1)){
        setPage(page + 1);
      }
      setBottom(false);
    }
  })

  // 获取某分区某页帖子信息
  const nextPage = async (index, nowPage) => {
    let postRes = await getPostList({
      zone: index,
      page: nowPage
    })
    if(postRes.data.success){
      let postData = nowPage != 1 ? posts : [];   // 若是换分区则清空 postData 和 postMap
      postMap = nowPage != 1 ? postMap : [];
      postRes.data.data.records.map((item, index) => {
        if(!postMap[item.id]){    // 判重
          postData.push(item);
          postMap[item.id] = true;
        }
      })
      setPosts(postData);
      console.log('postData',postData);
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

  return  (
    <View className='posts-container'>
      <AtMessage></AtMessage>
      {
        !isLogin && (
          <LoginModal open={openLogin} trigger={trigger} getIsLogin={getIsLogin}></LoginModal>
        )
      }
      <View>
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
                      !loading && posts.length != 0 && posts.map((item, i2) => {
                        return (
                          <View className='post-item' key={item.id}>
                            <PostCard
                              postData={item}
                            />
                          </View>
                        )
                      })
                    }
                    {
                      bottom && (
                        userExp.type == 0 ? (
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
    </View>
  )
}