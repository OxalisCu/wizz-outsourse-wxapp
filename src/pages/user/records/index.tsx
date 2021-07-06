import React, {useEffect, useState} from 'react'
import Taro,{ useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabs, AtTabsPane} from 'taro-ui'
import RecordCard from '../../../components/user/recordCard'
import {getRecords, RecordMsg} from '../../../model/api/index'

import './index.scss'

export default () => {

  const recordTabs = [
    {title: '发表的'},
    {title: '点赞和评论'},
    {title: '最近浏览'}
  ]

  const type = [
    'post',
    'like',
    'history'
  ]

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [records,setRecords] = useState<Array<Array<RecordMsg>>>([]);
  const [loadMore, setLoadMore]  = useState<boolean>(false);

  useEffect(() => {
    setLoadMore(true);
    loadRecord(0, 1, false);
    setLoadMore(false);
  }, [])

  const loadRecord = async (index: number, nowPage: number, more: boolean): Promise<boolean> => {
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

    let recordRes = await getRecords({
      type: type[index],
      page: nowPage
    })
    if(recordRes.data.success){
      let recordList = deepcopy(records);
      if(more){
        recordList[index] = [...records[index], ...recordRes.data.data.records];
      }else{
        recordList[index] = recordRes.data.data.records;
      }
      setRecords(recordList);
      console.log(recordList);
      return true;
    }else{
      Taro.showToast({
        title: recordRes.data.message,
        icon: 'none'
      })
      return false;
    }
  }

  const changeTab = async (index: number) => {  
    setCurrent(index);
    setPage(1);
    setLoadMore(true);
    await loadRecord(index, 1, false);
    setLoadMore(false);
  } 

  useReachBottom(async () => {
    setLoadMore(true);
    if(await loadRecord(current, page + 1, true)){
      setPage(page + 1);
    }
    setLoadMore(false);
  })

  return (
    <View className='records-container'>
      <AtTabs 
        className='record-tabs'
        current={current}
        tabList={recordTabs}
        swipeable={false}
        onClick={changeTab}
      >
        {
          recordTabs.map((item, index) => {
            return (
              <AtTabsPane className='record-pane' current={current} index={index} key={index}>
                {
                  records[current] != undefined && records[current].length != 0 && records[current].map((item) => {
                    return (
                      item.createTime != null && item.content != null && (
                        <View className='out-container' key={item.id}>
                          <RecordCard
                            recordMsg={{
                              id: item.id,
                              creator: item.creator,
                              creatorName: item.creatorName,
                              avatar: item.avatar,
                              content: item.content,
                              createTime: item.createTime,
                              last_update: item.last_update
                            }} 
                          />
                        </View>
                      )
                    )
                  })
                }
                {
                  loadMore && (
                    <View className='bottom-more'>加载中...</View>
                  )
                }
              </AtTabsPane>
            )
          })
        }
      </AtTabs>
    </View>
  )
}