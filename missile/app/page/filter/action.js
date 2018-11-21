import axios from 'common/axios'
import * as types from './constant'

// Action Creators

export const getList = params => (dispatch, getState) => {
  let newParams = Object.assign(
    getState().getIn(['filter', 'list', 'params']).toJS(),
    params
  )
  return dispatch({
    type: types.QUERY,
    payload: {
      promise: axios.get('/user-filter/filterQuery', { params: newParams }),
      data: { params }
    }
  })
}

export const optStatus = data => dispatch =>
  dispatch({
    type: types.UPDATE_STATUS,
    payload: axios.post('/user-filter/filterStatus', data)
  })
  .then(() => {
    dispatch(getList())
  })

export const optCopy = data => dispatch =>
  dispatch({
    type: types.COPY,
    payload: axios.post('/user-filter/filterCopy', data)
  })
  .then(() => {
    dispatch(getList())
  })

export const optDel = data => dispatch =>
  dispatch({
    type: types.DEL,
    payload: axios.post('/user-filter/filterDel', data)
  })
  .then(() => {
    dispatch(getList())
  })

export const getItem = params => dispatch =>
  dispatch({
    type: types.DETAIL,
    payload: {
      promise: axios.get('/user-filter/filterGet', { params }),
      data: { params }
    }
  })

export const optCheck = data => dispatch =>
  dispatch({
    type: types.CHECK,
    payload: axios.post('/user-filter/filterCheckSQL', data)
  })

export const optAdd = data => dispatch =>
  dispatch({
    type: types.ADD,
    payload: axios.post('/user-filter/filterAdd', data)
  })

export const optEdit = data => dispatch =>
  dispatch({
    type: types.EDIT,
    payload: axios.post('/user-filter/filterUpdate', data)
  })

export const fileAdd = data => dispatch =>
dispatch({
  type: types.FILE_ADD,
  payload: axios.post('/user-filter/filterAdd', data)
})

export const getUploadItem = params => dispatch =>
dispatch({
  type: types.UPLOAD_DETAIL,
  payload: {
    promise: axios.get('/user-filter/filterUploadGet', { params }),
    data: { params }
  }
})
