import { Model } from 'react-model'

const initialState = {
  data: {
    id: -1,
  }
}

interface Data{
  id: number,
  name?: string,
  type?: string
}

interface StateType {
  data: Data
}

interface ActionType {
  setData: Data 	
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async setData(dataType) {
      return {
        data: dataType
      }
    },
  },
  state: initialState
}

export default Model(model)
 