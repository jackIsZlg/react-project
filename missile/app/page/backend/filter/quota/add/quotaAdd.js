import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'
import { LOCATION_CHANGE } from 'react-router-redux'

// Actions
const QUERYDATABASE = 'missile/quota/add/QUERYDATABASE'
const QUERYDBID = 'missile/quota/add/QUERYDBID'
const QUERYTABLEID = 'missile/quota/add/QUERYTABLEID'
const SAVE = 'missile/quota/add/SAVA'
const UPDATATABLELIST = 'missile/quota/add/UPDATATABLELIST'
const UPDATAAC = 'missile/quota/add/UPDATAAC'

// Action Creators
// 查询
export const queryDataBase = params => (dispatch, getState) => {
  dispatch({
    type: QUERYDATABASE,
    payload: {
      promise: axios.get('/backend/quota/addQuotaQueryDataBase'),
      data: { params }
    }
  })
}

export const queryDbId = params => (dispatch, getState) => {
  let newParams = getState().getIn(['quotaAdd', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERYDBID,
    payload: {
      promise: axios.get('/backend/quota/addQuotaQueryDbId', { params: newParams }),
      data: { params }
    }
  })
}

export const queryTableId = params => (dispatch, getState) => {
  dispatch({
    type: QUERYTABLEID,
    payload: {
      promise: axios.get('/backend/quota/addQuotaQueryTableId', { params }),
      data: { params }
    }
  })
}

// 保存
export const save = data => dispatch =>
dispatch({
  type: SAVE,
  payload: axios.post('/backend/quota/addQuotaSave', data)
})

// 更新list值updataAppendCondition
export const updataAppendCondition = appendCondition => {
  return {
    type: UPDATAAC,
    appendCondition
  }
}

// 更新TableList值
export const updataTableList = tableListData => {
  return {
    type: UPDATATABLELIST,
    tableListData
  }
}

// Reducer
const getDefaultParam = () => {
  return {
    dbId: ''
  }
}
const initialState = {
  list: {
    loading: false,
    params: getDefaultParam(),
    defaultParams: getDefaultParam(),
    dataBaseList: [],
    dbIdList: [],
    tableIdList: {},
    appendCondition: ''
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
    [QUERYDATABASE]: {
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
          list.set('dataBaseList', fromJS(action.payload)).set('loading', false)
        )
      }
    },
    [QUERYDBID]: {
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
          list.set('dbIdList', fromJS(action.payload)).set('loading', false)
        )
      }
    },
    [SAVE]: {
      PENDING: state => state.setIn(['list', 'loading'], true),
      REJECTED: state => state.setIn(['list', 'loading'], false),
      FULFILLED: state => state.setIn(['list', 'loading'], false)
    },
    [UPDATATABLELIST]: (state, action) => {
      return state.update('list', list =>
        list.setIn(['tableIdList', 'dataColumnMetaList'], fromJS(action.tableListData)).set('loading', false)
      )
    },
    [UPDATAAC]: (state, action) => {
      return state.update('list', list =>
        list.setIn(['tableIdList', 'appendCondition'], fromJS(action.appendCondition)).set('loading', false)
      )
    },
    [QUERYTABLEID]: {
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
          list.set('tableIdList', fromJS(action.payload)).set('loading', false)
        )
      }
    },
    [LOCATION_CHANGE]: state => state
    .update('list', list =>
      list
        .set('tableIdList', fromJS({}))
    )
  },
  fromJS(initialState)
)
