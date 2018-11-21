import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'missile/business/QUERY'
const SHOW_MODAL = 'missile/business/SHOW_MODAL'
const HIDE_MODAL = 'missile/business/HIDE_MODAL'
const SAVE = 'missile/business/SAVE'
const ADD = 'missile/business/ADD'
// Action Creators

// 获取数据
export const query = params => (dispatch, getState) => {
  let newParams = getState().getIn(['business', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('backend/business/businessQuery', { params: newParams }),
      data: { params }
    }
  })
}

// 编辑
export const save = data => dispatch =>
  dispatch({
    type: SAVE,
    payload: axios.post('/backend/business/businessSave', data)
  }).then(() => {
    dispatch(query())
    dispatch(hideModal())
  })

// 新增
export const add = data => dispatch =>
dispatch({
  type: ADD,
  payload: axios.post('/backend/business/businessAdd', data)
}).then(() => {
  dispatch(query())
  dispatch(hideModal())
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
    pageSize: 2,
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
    },
    [ADD]: {
      PENDING: state => state.setIn(['modal', 'loading'], true),
      REJECTED: state => state.setIn(['modal', 'loading'], false),
      FULFILLED: state => state.setIn(['modal', 'loading'], false)
    }
  },
  fromJS(initialState)
)
