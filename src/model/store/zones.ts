import { Model } from 'react-model'

interface Zone{
  title: string
}

const initialState = {
  zones: []
}

interface StateType {
  zones: Array<Zone>
}

interface ActionType {
  setZones: Array<Zone> 	
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async setZones(dataType) {
      return {
        zones: dataType
      }
    },
  },
  state: initialState
}

export default Model(model)
 