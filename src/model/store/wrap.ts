import { Model } from 'react-model'

// 存储加载的帖子内容是否需要折叠，帖子 id 建立映射

interface StateType{
  wrap: Array<boolean>
}

interface ActionType{
  setWrap: Array<boolean>
}

const initialState: StateType = {
  wrap: []
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async setWrap(data){
      return {
        wrap: data
      }
    },
  },
  state: initialState
}

export default Model(model)