/**
 * @descriptionts代码的时候注意逻辑的严谨性
 *  例如if else要一一对应 
 */

import { Model } from 'react-model'

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

interface StateType {
  mask: maskType
  page: pageType
}

interface ActionType {
  setMask: StateType
}

const initialState: StateType = {
  mask: '',
  page: ''
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async setMask(maskData) {
      return {
        mask: maskData.mask,
        page: maskData.page
      }
    },
  },
  state: initialState
}

export default Model(model)
