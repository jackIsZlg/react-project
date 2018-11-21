/*
 * Author: linglan
 * Date: 2017-11-06 14:51:12
 * Email: linglan@wacai.com
 */

import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as types from './constant'

// Reducer

const getDefaultParams = () => {
  return {
    pageSize: 15,
    pageIndex: 1
  }
}

const initialState = {
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: []
  },
  add: {},
  detail: {
    loading: false,
    data: {}
  }
}

export default typeToReducer(
  {
    [types.QUERY]: {
      PENDING: (state, action) => {
        const { params } = action.payload
        return state.update('list', list =>
          list
            .update('params', value => value.merge(params))
            .set('loading', true)
        )
      },
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('list', list =>
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.DETAIL]: {
      PENDING: state => state.setIn(['detail', 'loading'], true),
      REJECTED: state => state.setIn(['detail', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('detail', detail =>
          detail
            .set('data', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.UPLOAD_DETAIL]: {
      PENDING: state => state.setIn(['detail', 'loading'], true),
      REJECTED: state => state.setIn(['detail', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('detail', detail =>
          detail
            .set('data', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.CHECK]: {
      PENDING: state => state.setIn(['add', 'validating'], true),
      REJECTED: state => state.update('add', add => {
        return add
          .set('validating', false)
          .set('validated', false)
      }),
      FULFILLED: state => state.update('add', add => {
        return add
          .set('validating', false)
          .set('validated', true)
      })
    },
    [types.ADD]: {
      PENDING: state => state.setIn(['add', 'loading'], true),
      REJECTED: state => state.setIn(['add', 'loading'], false),
      FULFILLED: state => state.setIn(['add', 'loading'], false)
    },
    [types.FILE_ADD]: {
      PENDING: state => state.setIn(['add', 'loading'], true),
      REJECTED: state => state.setIn(['add', 'loading'], false),
      FULFILLED: state => state.setIn(['add', 'loading'], false)
    },
    [LOCATION_CHANGE]: state => state
      .update('add', add =>
        add
          .set('validating', undefined)
          .set('validated', undefined)
      )
      .update('detail', detail =>
        detail
          .set('data', fromJS({}))
          .set('loading', false)
      )
  },
  fromJS(initialState)
)
