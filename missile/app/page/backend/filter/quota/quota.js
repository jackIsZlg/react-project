import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'missile/quota/QUERY'
const REMOVE = 'missile/quota/REMOVE'
const SHOW_MODAL = 'missile/quota/SHOW_MODAL'
const HIDE_MODAL = 'missile/quota/HIDE_MODAL'
const SAVE = 'missile/quota/SAVE'
const ADD = 'missile/quota/ADD'
const QUERYBUSINESS = 'missile/quota/QUERYBUSINESS'
const REMOVEDATA = 'missile/quota/REMOVEDATA'

// Action Creators

// 查询
export const query = params => (dispatch, getState) => {
  // 更改
  let newParams = getState().getIn(['quota', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/backend/quota/quotaQuery', { params: newParams }),
      data: { params }
    }
  })
}
// 获取数据
export const queryBusiness = params => (dispatch, getState) => {
  dispatch({
    type: QUERYBUSINESS,
    payload: {
      promise: axios.get('backend/business/businessQuery')
    }
  })
}

// 保存
export const save = data => dispatch =>
  dispatch({
    type: SAVE,
    payload: axios.post('/backend/quota/quotaSave', data)
  }).then(() => {
    dispatch(query())
    dispatch(hideModal())
  })

// 新增
export const add = data => dispatch =>
dispatch({
  type: ADD,
  payload: axios.post('/backend/quota/quotaAdd', data)
}).then(() => {
  dispatch(query())
  dispatch(hideModal())
})

// 删除
export const remove = data => dispatch =>
dispatch({
  type: REMOVE,
  payload: axios.post('backend/quota/quotaRemove', data)
}).then(() => {
  dispatch(query())
})

// 删除数据源
export const removeDataSource = data => dispatch =>
dispatch({
  type: REMOVEDATA,
  payload: axios.post('backend/quota/removeDataSource', data)
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
    keyword: ''
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
    [QUERYBUSINESS]: {
      PENDING: (state, action) => {
        return state.update('modal', modal =>
        modal
        .set('loading', true)
        )
      },
      REJECTED: state => state.setIn(['modal', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('modal', modal =>
        modal.set('businessDataSource', fromJS(action.payload)).set('loading', false)
        )
      }
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
    },
    [REMOVE]: {
      PENDING: state => state.setIn(['list', 'loading'], true),
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: state => state.setIn(['list', 'loading'], false)
    },
    [REMOVEDATA]: {
      PENDING: state => state.setIn(['list', 'loading'], true),
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: state => state.setIn(['list', 'loading'], false)
    }
  },
  fromJS(initialState)
)
