import { Model } from 'react-model'

// 刷新当前分区，或首刷新指定分区

interface StateType{
  open: boolean,
  zone: number,
  openSymbol?: symbol
}

interface ActionType{
  refresh: StateType
}

const initialState: StateType = {
  open: false,
  zone: -1,
  openSymbol: Symbol(0)
}

const model: ModelType<StateType, ActionType> = {
  actions: {
    async refresh(data){
      return {
        open: data.open,
        zone: data.zone,
        openSymbol: Symbol(data.zone)
      }
    },
  },
  state: initialState
}

export default Model(model)