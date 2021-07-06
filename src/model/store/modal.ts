import { Model } from 'react-model'
import { delComment } from '../api'

// 显示模态框和蒙层（显示的页面和模态框信息）

type maskType = 
    | ''
    | 'commentEditor'
    | 'commentDelete'
    | 'postCancel'

type pageType = 
    | ''
    | 'posts'
    | 'postEditor'
    | 'postDetail'
    | 'commentDetail'

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

interface OpenModal {
  mask: maskType,
  page: pageType,
}

interface CloseModal{
  success: maskType
}

interface StateType extends OpenModal, CloseModal{
  delComment: DelComment | null,
  addComment: AddComment | null
}

interface ActionType {
  openModal: OpenModal,
  closeModal: CloseModal,
  addComment: AddComment,
  delComment: DelComment
}

const initialState: StateType = {
  mask: '',
  page: '',
  success: '',
  addComment: null,
  delComment: null
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async openModal(data){
      return {
        mask: data.mask,
        page: data.page,
        success: ''
      }
    },
    async closeModal(data){
      return {
        mask: '',
        page: '',
        success: data.success,
      }
    },
    async addComment(data){
      return {
        addComment: data
      }
    },
    async delComment(data){
      return {
        delComment: data
      }
    }
  },
  state: initialState
}

export default Model(model)
