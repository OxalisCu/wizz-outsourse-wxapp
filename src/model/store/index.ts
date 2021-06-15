import { Model } from 'react-model'
import Modal from './modal'

const models = { Modal }

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
