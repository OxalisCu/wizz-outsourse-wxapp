import { Model } from 'react-model'
import { delComment } from '../api'

// 评论、点赞操作，通过全局变量触发多个页面数据更新

interface CommentItem{
  id: number,
  content: string,
  createTime: number,
  reply: number | null,
  user: number,
  userAvatar: string,
  userName: string,
  userType: number
}

interface AddComment{
  postId?: number,     // 对应帖子的 id
  toId?: number,   // 被评论者或被删除者 id
  name?: string,   // 被评论者昵称
  type?: number,   // 评论或回复（1或0）
  comment?: CommentItem | null
}

interface DelComment{
  postId?: number,
  toId?: number,
}

interface LikeOperate{
  postId: number,
  open: boolean
}

interface StateType{
  delComment: DelComment | null,
  addComment: AddComment | null,
  likeOperate: LikeOperate | null
}

interface ActionType {
  addComment: AddComment,
  delComment: DelComment,
  likeOperate: LikeOperate
}

const initialState: StateType = {
  addComment: null,
  delComment: null,
  likeOperate: null
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async addComment(data){
      return {
        addComment: data
      }
    },
    async delComment(data){
      return {
        delComment: data
      }
    },
    async likeOperate(data){
      return {
        likeOperate: data
      }
    }
  },
  state: initialState
}

export default Model(model)
