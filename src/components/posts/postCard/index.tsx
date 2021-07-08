import React, { useEffect, useState } from 'react'
import Taro, {useDidHide, useDidShow} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import UserCard from '../userCard/index'
import ContentCard from '../contentCard/index'
import PostCommentPre from './CommentPreview/index'
import {PostMsg, CommentItem, UserExp, delPost} from '../../../model/api/index'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default (props) => {
  const postData: PostMsg = props.postData;
  const curZone: number = props.curZone;
  const [userExp, setUserExp] = useState<UserExp>();
  const [isPay, setIsPay] = useState<boolean>();

  const [commentMsg, setCommentMsg] = useState<Array<Array<CommentItem>>>([]);

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');
  const [rState, rActions] = useStore('Refresh');

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
        setIsPay(exp.type > 0 && exp.expireTime > new Date().getTime());
      }
    }catch(err){console.log(err)}

    setCommentMsg(postData.comments || []);
  }, [postData])

  // 关闭模态框
  useDidHide(() => {
    mActions.closeModal({
      success: ''
    });
  })

  // 付费用户评论
  const commentEditor = (toId: number | null, toName: string | null) => {
    if(!isPay){
      Taro.showToast({
        title: '免费用户不能评论',
        icon: 'none'
      })
      return;
    }
    mActions.openModal({
      mask: 'commentEditor',
      page: 'posts',
      detail: false
    })
    oActions.addComment({
      toId,
      postId: postData.id,
      name: toId == null ? postData.creatorName : toName,
      type: toId == null ? 1 : 0,
      comment: null
    })
  }

  // 删除或添加评论
  useEffect(()=>{
    let commentList = [];
    if(mState.success == 'commentDelete' && oState.delComment.postId == postData.id){
      commentMsg.map((com, i1) => {   // 删除评论
        if(com[0].id == oState.delComment.toId){   
          return;
        }
        let temp = [];
        com.map((item, i2) => { 
          if(item.id != oState.delComment.toId){   // 删除回复
            temp.push(item);
          }
        })
        commentList.push(temp);
      })
      setCommentMsg(commentList);
      mActions.closeModal({
        success: ''
      })
    }else if(mState.success == 'commentEditor' && oState.addComment.postId == postData.id){
      if(oState.addComment.comment.reply == null){   // 评论，新发表放在最上面
        commentList = [...commentMsg];
        commentList.unshift([oState.addComment.comment]);  
        setCommentMsg(commentList);
      }else{    // 回复，新发表放在最后
        commentMsg.map((comment, i1) => {
          let temp = [];
          let hasReply = false;
          for(let item of comment){
            if(item.id == oState.addComment.comment.reply){
              hasReply = true;
              break;
            }
          }
          if(hasReply){
            temp = [...comment, oState.addComment.comment];
          }else{
            temp = [...comment];
          }
          commentList.push(temp);
        })
        setCommentMsg(commentList);
      }
      mActions.closeModal({
        success: '',
      })
    }
  }, [mState.success])

  // 查看帖子详情
  const viewDetail = () => {  
    if(!isPay){
      Taro.showToast({
        title: '免费用户不能查看帖子详情',
        icon: 'none'
      })
      return;
    }
    Taro.navigateTo({
      url: '../postDetail/index?id=' + postData.id
    })
  } 

  // 编辑帖子，已经过权限判断
  const editPost = () => { 
    Taro.navigateTo({
      url: '../postEditor/index?id=' + postData.id
    })
  }

  // 删除帖子，已经过权限判断
  const deletePost = async () => {  
    const delRes = await delPost({
      id: postData.id
    })
    if(delRes.data.success){
      Taro.showToast({
        title: '帖子删除成功',
        icon: 'none',
        success(res){
          console.log('delete');
          rActions.refresh({
            open: true,
            zone: -1
          });
        }
      })
    }else{
      Taro.showToast({
        title: delRes.data.message,
        icon: 'none'
      })
    }
  } 

  return (
    <View className='post-container'>
      <View className='card-head'>
        <UserCard
          userMsg={{
            creator: postData.creator,
            creatorName: postData.creatorName,
            createTime: postData.createTime,
            avatar: postData.avatar,
            userType: postData.userType
          }}
          editable
          editPost={editPost}
          deletePost={deletePost}
        />
      </View>

      <View className='card-content'>
        <ContentCard
          detail={false}
          userMsg={{
            creator: postData.creator,
            creatorName: postData.creatorName,
            createTime: postData.createTime,
            avatar: postData.avatar,
            userType: postData.userType
          }}
          contentMsg={{
            id: postData.id,
            title: postData.title,
            content: postData.content,
            pictures: postData.pictures,
            files: postData.files,
            last_update: postData.last_update,
            pin: postData.pin
          }}
          zoneMsg={{
            zone: postData.zone,
            awesome: postData.awesome
          }}
          likeMsg={{
            likeCount: postData.likeCount,
            isLiked: postData.isLiked,
            likers: postData.likers,
          }}
          curZone={curZone}
          commentEditor={commentEditor}
          viewDetail={viewDetail}
        />
      </View>

      <View className='card-comment'>
        <PostCommentPre
          previewMsg={commentMsg}
          commentEditor={commentEditor}
          viewDetail={viewDetail}
        />
      </View>
    </View>
  )
}