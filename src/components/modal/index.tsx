import React from 'react'
import {View} from '@tarojs/components'
import CommentEditor from './commentEditor/index'
import CommentDelete from './commentDelete/index'
import PostCancel from './postCancel/index'
import {useStore} from '../../model/store/index'

import './index.scss'

export default (props) => {
  const page = props.page;

  const [state1, actions1] = useStore('Mask');

  return (
    state1.page == page && state1.mask && (
      <View className='mask' catchMove onClick={(e)=>{actions1.setMask({mask: '', page: ''}); e.stopPropagation();}}>
        {
          state1.mask == 'commentEditor' && (
            <CommentEditor />
          )
        }
        {
          state1.mask == 'commentDelete' && (
            <CommentDelete />
          )
        }
        {
          state1.mask == 'postCancel' && (
            <PostCancel />
          )
        }
      </View>
    )
  )
}