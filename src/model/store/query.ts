import { Model } from 'react-model'

interface StateType{
  id: number
}

interface ActionType{
  setQuery: number
}

const initialState: StateType = {
  id: -1
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async setQuery(queryData) {
      return {
        id: queryData
      }
    },
  },
  state: initialState
}

export default Model(model)