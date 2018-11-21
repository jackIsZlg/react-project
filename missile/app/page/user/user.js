import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'papaya/user/QUERY'
const REMOVE = 'papaya/user/REMOVE'

const SHOW_MODAL = 'papaya/user/SHOW_MODAL'
const HIDE_MODAL = 'papaya/user/HIDE_MODAL'
const SAVE = 'papaya/user/SAVE'

// Action Creators

// 查询
export const query = params => (dispatch, getState) => {
  let newParams = Object.assign(
    getState()
      .user.getIn(['list', 'params'])
      .toJS(),
    params
  )

  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/user/query', { params: newParams }),
      data: { params }
    }
  })
}

// 保存
export const save = data => dispatch =>
  dispatch({
    type: SAVE,
    payload: axios.post('/user/save', data)
  }).then(() => {
    dispatch(query())
    dispatch(hideModal())
  })

// 删除
export const remove = id => dispatch =>
  dispatch({
    type: REMOVE,
    payload: axios.post('/user/remove', { id })
  }).then(() => {
    query()
  })

// 显示详情
export function showModal (currentRecord) {
  return {
    type: SHOW_MODAL,
    payload: { currentRecord }
  }
}

// 关闭详情
export function hideModal () {
  return {
    type: HIDE_MODAL
  }
}

// Reducer

const getDefaultParams = () => {
  return {
    pageSize: 12,
    pageIndex: 1,

    nickname: '',
    status: ''
  }
}

const initialState = {
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: []
  },
  modal: {
    key: 0,
    visible: false,
    currentRecord: {},
    loading: false
  }
}

export default typeToReducer(
  {
    [QUERY]: {
      PENDING: (state, action) => {
        const { params } = action.payload

        return state.update('list', list =>
          list
            .update('params', value => value.merge(params))
            .set('loading', true)
        )
      },
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: (state, action) =>
        state.update('list', list =>
          list.set('dataSource', fromJS(action.payload)).set('loading', false)
        )
    },
    [REMOVE]: {
      PENDING: state => state.setIn(['list', 'loading'], true),
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: state => state.setIn(['list', 'loading'], false)
    },
    [SHOW_MODAL]: (state, action) => {
      const { currentRecord } = action.payload

      return state.update('modal', modal =>
        modal
          .set('visible', true)
          .set('key', modal.get('key') + 1)
          .set('currentRecord', fromJS(currentRecord))
      )
    },
    [HIDE_MODAL]: state =>
      state.update('modal', modal =>
        modal.set('visible', false).set('loading', false)
      ),
    [SAVE]: {
      PENDING: state => state.setIn(['modal', 'loading'], true),
      REJECTED: state => state.setIn(['modal', 'loading'], false),
      FULFILLED: state => state.setIn(['modal', 'loading'], false)
    }
  },
  fromJS(initialState)
)
