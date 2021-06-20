import { Model } from 'react-model'

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

interface StateType {
  mask: maskType
  page: pageType
  id: number,
  name?: string,
  type?: string
  success: maskType,
  comment: CommentItem
}

interface OpenModal {
  mask: maskType,
  page: pageType,
  id?: number,
  name?: string,
  type?: string,
}

interface CloseModal{
  success: maskType
}

interface ActionType {
  openModal: OpenModal,
  closeModal: CloseModal,
  commentMsg: CommentItem,
}

const initialState: StateType = {
  mask: '',
  page: '',
  id: -1,
  success: '',
  comment: null
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async openModal(data){
      return {
        mask: data.mask,
        page: data.page,
        id: data.id || 0,
        name: data.name || '',
        type: data.type || '',
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
    async commentMsg(data){
      return {
        comment: data
      }
    }
  },
  state: initialState
}

export default Model(model)
