import { Model } from 'react-model'

// 操作是否刷新首页

interface StateType{
  open: boolean
}

interface ActionType{
  refresh: boolean
}

const initialState: StateType = {
  open: false
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async refresh(data){
      return {
        open: data,
      }
    },
  },
  state: initialState
}

export default Model(model)