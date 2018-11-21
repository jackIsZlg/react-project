import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const QUERY = 'missile/compare/add/QUERY'

// Action Creators
// 查询
export const query = params => (dispatch, getState) => {
  let newParams = getState().getIn(['add', 'list', 'params']).merge(params).toJS()
  dispatch({
    type: QUERY,
    payload: {
      promise: axios.get('/backend/compare/addCompareQuery', { params: newParams }),
      data: { params }
    }
  })
}

// 保存
export const save = data => dispatch =>
dispatch({
  payload: axios.post('/backend/compare/addCompareSave', data)
})

// 删除
export const remove = id => dispatch =>
dispatch({
  payload: axios.post('backend/compare/addCompareRemove', { id })
})

// Reducer
const url = decodeURIComponent(window.location.search)
const menu = url.substring(6)
const getDefaultParams = () => {
  return {
    menu: menu
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
    }
  },
  fromJS(initialState)
)
