import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'missile/cost/QUERY'
const CLOSE = 'missile/cost/CLOSE'
const SHOW_MODAL = 'missile/cost/SHOW_MODAL'
const HIDE_MODAL = 'missile/cost/HIDE_MODAL'
const SAVE = 'missile/cost/SAVE'

// Action Creators

// 查询
export const query = params => (dispatch, getState) => {
  let newParams = getState().getIn(['cost', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/backend/cost/costQuery', { params: newParams }),
      data: { params }
    }
  })
}

// 保存
export const save = data => dispatch =>
  dispatch({
    type: SAVE,
    payload: axios.post('/backend/cost/costSave', data)
  }).then(() => {
    dispatch(query())
    dispatch(hideModal())
  })

// 开启、关闭
export const close = data => dispatch =>
dispatch({
  type: CLOSE,
  payload: axios.post('/backend/cost/costUpdate', data)
}).then(() => {
  dispatch(query())
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
    pageSize: 10,
    pageNum: 1,
    keyword: '',
    status: '1'
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
      FULFILLED: (state, action) => {
        return state.update('list', list =>
          list.set('dataSource', fromJS(action.payload)).set('loading', false)
        )
      }
    },
    [CLOSE]: {
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
