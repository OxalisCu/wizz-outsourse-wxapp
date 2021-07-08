import React, { useEffect, useState } from 'react'
import Taro, {useReachBottom, useTabItemTap, usePageScroll, useDidShow} from '@tarojs/taro'
import {View, Input, Image, Text} from '@tarojs/components'
import {AtTabs, AtTabsPane, AtMessage} from 'taro-ui'
import PostCard from '../../../components/posts/postCard/index'
import Modal from '../../../components/modal/index'
import { getZones, getPostList, PostMsg, getUserExp, UserExp, getToken} from '../../../model/api/index'
import LoginModal from '../../../components/login/index'
import { useStore } from '../../../model/store'

import './index.scss'

import search from '../../../images/search.png'
import fatie from '../../../images/fatie.png'

interface Zone{
  title: string
}

export default () => {
  const [isLogin, setIsLogin] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [trigger, setTrigger] = useState(Symbol());

  // const [searchData, setSearchData] = useState('');   // 搜索框内容
  const [userExp, setUserExp] = useState<UserExp>();
  const [zones, setZones] = useState<Array<Zone>>([]);   // 分区列表
  const [posts, setPosts] = useState<Array<Array<PostMsg>>>([]);   // 获取当前分区帖子信息
  const [isPay, setIsPay] = useState<boolean>();    // 是否付费

  const [current, setCurrent] = useState<number>(0);    // 当前选择分区
  const [curSymbol, setCurSymbol] = useState<symbol>(Symbol(0));

  const [page, setPage] = useState(1);    // 当前第几页
  const [loadOnce, setLoadOnce] = useState(false);
  const [postMap, setPostMap] = useState<Array<boolean>>([]);

  const [refresh, setRefresh] = useState(false);    // 显示顶部刷新动效
  const [loadMore, setLoadMore] = useState(false);    // 显示底部加载动效

  const [sticky, setSticky] = useState(false);    // 是否置顶 tabbar

  const [pixelRatio, setPixelRatio] = useState<number>();
  const [contentHeight, setContentHeight] = useState<number>(0);

  const [rState, rActions] = useStore('Refresh');
  const [hState, hActions] = useStore('Hide');

  //  初次进入社区
  useEffect(() => {
    // Taro.setEnableDebug({
    //   enableDebug: true
    // })

    ;(
      async()=>{
        try{
          let id = Taro.getStorageSync('id');
          if(id){
            setIsLogin(true);
            
            // 使用测试 token
            let token = await getToken({id,});
            // console.log(token);
            Taro.setStorageSync('token', token.data);

            await loadUserExp();
            await loadPosts();
          }else{
            setOpenLogin(true);
            setTrigger(Symbol());
          }

          let client = await Taro.getSystemInfo();
          if(client){
            setPixelRatio(client.pixelRatio as number);
            setContentHeight(client.safeArea.height - 86/client.pixelRatio);
          }
        }catch(err){console.log(err)}
      }
    )()
  }, [])

  // 每次切换 tab，验证是否登录
  useTabItemTap((item)=>{
    if(!isLogin){
      try{
        let id = Taro.getStorageSync('id');
        if(id){
          setIsLogin(true);
          loadUserExp();
          loadPosts();
        }else{
          setOpenLogin(true);
          setTrigger(Symbol());
        }
      }catch(err){console.log(err)}
    }
    hActions.hide(Math.random());
  })

  // 每次进入页面更新用户经验信息
  useDidShow(() => {
    loadUserExp();
  })

  // 从 LoginModal 获悉是否登录，登录则加载帖子信息
  const getIsLogin = (param: boolean) => {
    setIsLogin(param);
    if(param){
      loadUserExp();
      loadPosts();
    }
  }

  // 登录后获取用户经验信息
  const loadUserExp = async ()=>{
    const expRes = await getUserExp({id: Taro.getStorageSync('id')});
    if(expRes.data.success){
      setUserExp(expRes.data.data);
      setIsPay(expRes.data.data.type > 0 && expRes.data.data.expireTime > new Date().getTime());
      // console.log('isPay', expRes.data.data.expireTime > new Date().getTime());
      try{
        Taro.setStorageSync('userExp', expRes.data.data);
      }catch(err){console.log(err);}
    }
  }

  // 登录后获取分区和首页帖子信息
  const loadPosts = async ()=>{
    console.log('loadPosts');

    let zoneRes = await getZones();

    let zoneData = [{title: '全部'}, {title: '精品'}];
    zoneRes.data.data.map((item, index) => {
      zoneData[item.id] = {
        title: item.name
      }
    })
    // console.log('zone', zoneRes);
    Taro.setStorageSync('zones', zoneData);
    setRefresh(true);
    setPage(1);
    setCurrent(0);
    setCurSymbol(Symbol(0));
    await loadPage(0, 1, false);
    setZones(zoneData);
    setRefresh(false);
  }

  // 获取某分区某页帖子信息，返回获取成功或失败
  const loadPage = async (index: number, nowPage: number, more: boolean): Promise<boolean> => {
    // 多重数组深拷贝
    function deepcopy(obj) {
      var out = [],i = 0,len = obj.length;
      for (; i < len; i++) {
        if (obj[i] instanceof Array){
          out[i] = deepcopy(obj[i]);
        }
        else out[i] = obj[i];
      }
      return out;
    }

    let postRes = await getPostList({
      zone: index,
      page: nowPage
    })
    console.log(postRes);
    if(postRes.data.success){
      let postData = deepcopy(posts);
      if(!more){    // 若是换分区则清空 postMap
        postData[index] = postRes.data.data.records;
      }else{
        let map = [...postMap];
        postRes.data.data.records.map((item)=>{
          if(!map[item.id]){
            postData[index].push(item);
            map[item.id] = true;
          }
        })
        setPostMap(map);
      }
      setPosts(postData);
      console.log('postData',postData);
      // console.log('page', nowPage);
      return true;
    }else{
      Taro.showToast({
        title: postRes.data.message,
        icon: 'none'
      })
      return false;
    }
  }
  
  // 换分区
  const changeZone = async (index) => {
    setCurrent(index);
    setCurSymbol(Symbol(index));
  }

  useEffect(() => {
    ;(
      async () => {
        setPage(1);
        setRefresh(true);
        Taro.pageScrollTo({
          scrollTop: 0,
          duration: 500
        })
        await loadPage(current, 1, false);
        setRefresh(false);
      }
    )()
  }, [current, curSymbol])

  // 刷新首页
  useEffect(() => {
    ;(
      async() => {
        if(rState != null && rState.open){
          console.log(rState);
          if(rState.zone >= 0){
            setCurrent(rState.zone);
            setCurSymbol(Symbol(rState.zone));
          }else{
            setCurrent(current);
            setCurSymbol(Symbol(current));
          }
          rActions.refresh(null);
        }
      }
    )()
  }, [rState.open, rState.openSymbol])

  // 触底加载更多数据
  useReachBottom(async() => {
    if(!loadOnce){
      setLoadMore(true);
    }
  })

  // tabbar 上划隐藏，下滑显示
  usePageScroll((e) => {
    if(e.scrollTop > 86/pixelRatio){
      sticky || setSticky(true);
    }else{
      sticky && setSticky(false);
    }
  })

  useEffect(() => {
    console.log(loadOnce);
    ;(
      async () => {
        if(loadMore && isPay && !loadOnce){
          setLoadOnce(true);
          await loadPage(current, page + 1, true);
          setPage(page + 1);
          // console.log(page);
          setLoadMore(false);
          setLoadOnce(false);
        }
      }
    )()
   
  }, [loadMore])

  // 创建帖子
  const createPost = () => {    // 创建帖子
    if(isPay){
      Taro.navigateTo({
        url: '../postEditor/index',
      })
    }else{
      Taro.showToast({
        title: '免费用户不能发帖',
        icon: 'none'
      })
    }
  }

  // 付费 btn
  const payBtn = () => {
    
  }

  return  zones != null && (
    <View className='posts-container' onClick={()=>{hActions.hide(Math.random())}}>
      {/* 登录弹窗 */}
      <AtMessage></AtMessage>
      {
        !isLogin && (
          <LoginModal open={openLogin} trigger={trigger} getIsLogin={getIsLogin}></LoginModal>
        )
      }
      <View className='main'>
        {/* 搜索框 */}
        {/* <View className='search'>
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
        </View> */}

        {/* 帖子分区选项卡 */}
        <AtTabs
          className={'posts' + (sticky ? ' sticky' : '')}
          current={current}
          scroll
          // swipeable={false}
          // animated={false} 
          tabList={zones}
          onClick={changeZone}
        >
          {
            zones.length != 0 &&  zones.map((zone, i1) => {
              return (
                <AtTabsPane current={current} index={i1} key={i1}>
                  <View className='post-tabs' style={{minHeight: contentHeight + 'px'}}>
                    {
                      refresh && (
                        <View className='refresh'>刷新...</View>
                      )
                    }
                    {
                      sticky && (
                        <View className='fill-item' />
                      )
                    }
                    {
                      posts[i1] != undefined && posts[i1].length != 0 && posts[i1].map((item, i2) => {
                        return (
                          <View className='post-item' key={item.id}>
                            <PostCard
                              postData={item}
                              curZone={i1}
                            />
                            <View className='post-divider' />
                          </View>
                        )
                      })
                    }
                  </View>
                </AtTabsPane>
              )
            })
          }
        </AtTabs>

        {/* 新建帖子按钮 */}
        <View className='edit-btn' onClick={createPost}>
          <Image className='icon' src={fatie}></Image>
        </View>
      </View>
      {
        loadMore && (
          !isPay ? (
            <View className='bottom-pay'>
              <Text>免费版仅可查看五条结果</Text>
              <Text onClick={payBtn}>升级会员，即可查看更多，前往升级</Text>
            </View>
          ) : (
            <View className='bottom-more'>加载中...</View>
          )
        )
      }
      {/* 导入带蒙层的操作按钮 */}
      <Modal page='posts' />
    </View>
  )
}