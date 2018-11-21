import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'missile/info/QUERY'
const CLOSE = 'missile/info/CLOSE'
const SHOW_MODAL = 'missile/info/SHOW_MODAL'
const HIDE_MODAL = 'missile/info/HIDE_MODAL'
const SAVE = 'missile/info/SAVE'
const INPUTUPDATA = 'missile/info/INPUTUPDATA'
const QUERYBUSINESS = 'missile/info/QUERYBUSINESS'
const ADD = 'missile/info/ADD'

// Action Creators

// 查询
export const query = params => (dispatch, getState) => {
  let newParams = getState().getIn(['info', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/backend/info/infoQuery', { params: newParams }),
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
    payload: axios.post('/backend/info/infoSave', data)
  }).then(() => {
    dispatch(query())
    dispatch(hideModal())
  })

// modal中input数据更改
export function inputUpdata (currentRecord) {
  return {
    type: INPUTUPDATA,
    payload: { currentRecord }
  }
}

// 新增
export const add = data => dispatch =>
dispatch({
  type: ADD,
  payload: axios.post('/backend/info/infoAdd', data)
}).then(() => {
  dispatch(query())
  dispatch(hideModal())
})

// 开启、关闭
export const close = data => dispatch =>
dispatch({
  type: CLOSE,
  payload: axios.post('/backend/info/infoUpdate', data)
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
    status: '-1'
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
    [INPUTUPDATA]: (state, action) => {
      const { currentRecord } = action.payload
      return state.update('modal', modal =>
        modal
          .set('visible', true)
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
