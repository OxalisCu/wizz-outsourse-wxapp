import { Model } from 'react-model'
import Mask from './mask'
import Data from './data'
import Zones from './zones'
import Query from './query'

const models = { Mask, Data, Zones, Query }

export const {
  getInitialState,
  useStore,
  getState,
  actions,
  subscribe,
  unsubscribe
} = Model(models)

// 开启react-model-helper 时将下面的语句注释去掉
// window.getState = getState
