import React, { useEffect, useState } from 'react'
import Taro, { useRouter, useDidShow, useDidHide } from '@tarojs/taro'
import {View} from '@tarojs/components'
import UserCard from '../../../components/posts/userCard'
import ContentCard from '../../../components/posts/contentCard'
import CommentCard from '../../../components/posts/commentCard'
import CommentBar from '../../../components/posts/commentBar'
import Modal from '../../../components/modal/index'
import {getPostDetail, PostMsg, CommentItem, UserExp, delPost} from '../../../model/api/index'
import {useStore} from '../../../model/store/index'

import './index.scss'

export default () => {
  const id = useRouter().params.id;
  const [postData, setPostData] = useState<PostMsg>();
  const [commentMsg, setCommentMsg] = useState<Array<Array<CommentItem>>>([]);

  const [userExp, setUserExp] = useState<UserExp>();
  const [isPay, setIsPay] = useState<boolean>();   

  const [mState, mActions] = useStore('Modal');
  const [oState, oActions] = useStore('Operate');
  const [rState, rActions] = useStore('Refresh');
  const [hState, hActions] = useStore('Hide');

  useEffect(() => {
    try{
      let exp = Taro.getStorageSync('userExp');
      if(exp){
        setUserExp(exp);
        setIsPay(exp.type > 0 && exp.expireTime > new Date().getTime());
      }
    }catch(err){console.log(err)}
  }, [])

  useDidShow(async () => {
    let postRes = await getPostDetail({
      id: id
    })
    if(postRes.data.success){
      setPostData(postRes.data.data);
      setCommentMsg(postRes.data.data.comments);
    }else{
      Taro.showToast({
        title: postRes.data.message,
        icon: 'none'
      })
    }
  })

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
      page: 'postDetail',
      detail: true
    })
    oActions.addComment({
      toId,
      postId: postData.id,
      name: toId == null ? postData.creatorName : toName,
      type: toId == null ? 1 : 0,
      comment: null
    })
  }

  // 管理员、帖子创建者、评论发表者删除评论
  const commentDelete = (toId: number, userId: number, type: number) => {
    if(userExp.type == 6 || userExp.id == postData.creator || userExp.id == userId){
      mActions.openModal({
        mask: 'commentDelete',
        page: 'postDetail',
      })
      oActions.delComment({
        postId: postData.id,
        toId,
        type,
      })
    }
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
          Taro.navigateBack({
            delta: 1,
            success(res){
              rActions.refresh(true);
            }
          })
        }
      })
    }else{
      Taro.showToast({
        title: delRes.data.message,
        icon: 'none'
      })
    }
  } 

  return postData != null && (
    <View className='post-detail-container' onClick={()=>{hActions.hide(Math.random());}}>
      <View className='up'>
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
        
        <ContentCard
          detail
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
        />
      </View>
    
      <View className='bottom'>
        <View className='comment-num'>评论（{commentMsg.length}）</View>
        {
          commentMsg.length != 0 && (
            commentMsg.map((item, index) => {
              return (
                <View className='comment-list' key={item[0].id}>
                  <CommentCard
                    commentItem={item}
                    postId={postData.id}
                    postCreator={postData.creator}
                    commentEditor={commentEditor}
                    commentDelete={commentDelete}
                  />
                </View>
              )
            })
          )
        }
      </View>

      <View onClick={()=>{commentEditor(null, null);}}>
        <CommentBar />
      </View>

      <Modal page='postDetail' />
    </View>
  )
}