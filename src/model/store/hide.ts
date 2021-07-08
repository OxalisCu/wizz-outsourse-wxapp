import { Model } from 'react-model'

// 捕捉全局点击，关闭编辑帖子操作框

interface StateType{
  hide: number
}

interface ActionsType{
  hide: number
}

const initialState: StateType = {
  hide: 0
}

const model: ModelType<StateType, ActionsType> = {
  actions: {
    async hide(random){
      return {
        hide: random,
      }
    },
  },
  state: initialState
}

export default Model(model)