import React from 'react'
import {View} from '@tarojs/components'
import CommentEditor from './commentEditor/index'
import CommentDelete from './commentDelete/index'
import PostCancel from './postCancel/index'
import {useStore} from '../../model/store/index'

import './index.scss'

export default (props) => {
  const page = props.page;

  const [mState, mActions] = useStore('Modal');

  return (
    mState.page == page && mState.mask && (
      <View className='mask' catchMove onClick={(e)=>{mActions.closeModal({success: ''}); e.stopPropagation();}}>
        {
          mState.mask == 'commentEditor' && (
            <CommentEditor />
          )
        }
        {
          mState.mask == 'commentDelete' && (
            <CommentDelete />
          )
        }
        {
          mState.mask == 'postCancel' && (
            <PostCancel />
          )
        }
      </View>
    )
  )
}