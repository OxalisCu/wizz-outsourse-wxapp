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

interface OpenModal {
  mask: maskType,
  page: pageType,
  detail?: boolean    // 是否为详情页，调整 textarea 与键盘高度用
}

interface CloseModal{
  success: maskType
}

interface StateType extends OpenModal, CloseModal{
}

interface ActionType {
  openModal: OpenModal,
  closeModal: CloseModal,
}

const initialState: StateType = {
  mask: '',
  page: '',
  success: '',
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async openModal(data){
      return {
        mask: data.mask,
        page: data.page,
        detail: data.detail || false,
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
  },
  state: initialState
}

export default Model(model)
