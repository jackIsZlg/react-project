import axios from 'common/axios'
import * as types from './constant'

// Action Creators

/* 列表页面 */
export const getList = params => (dispatch, getState) => {
  let newParams = Object.assign(
    getState().getIn(['activity', 'list', 'params']).toJS(),
    params
  )
  return dispatch({
    type: types.QUERY,
    payload: {
      promise: axios.get('/marketing-activity/list/query', { params: newParams }),
      data: { params }
    }
  })
}

export const optStatus = data => dispatch => {
  return dispatch({
    type: types.UPDATE_STATUS,
    payload: axios.post('/marketing-activity/list/updateStatus', data)
  })
  .then(() => {
    dispatch(getList())
  })
}

export const optDel = data => dispatch => {
  return dispatch({
    type: types.DEL,
    payload: axios.post('/marketing-activity/list/del', data)
  })
  .then(() => {
    dispatch(getList())
  })
}

/* 添加活动信息 */
export const optAddInfo = data => dispatch => {
  return dispatch({
    type: types.ADD_INFO,
    payload: axios.post('/marketing-activity/update/updateInfo', data)
  })
}

export const optEditInfo = data => dispatch => {
  return dispatch({
    type: types.EDIT_INFO,
    payload: axios.post('/marketing-activity/update/updateInfo', data)
  })
}

export const getInfo = data => dispatch => {
  return dispatch({
    type: types.QUERY_INFO,
    payload: axios.get('/marketing-activity/update/getInfo', { params: data })
  })
}

export const changeAddInfoFields = fields => ({
  type: types.ADD_INFO_FIELDS,
  fields
})

export const changeEditInfoFields = fields => ({
  type: types.EDIT_INFO_FIELDS,
  fields
})

/* 添加活动人群 */
export const optAddTab = (type, title) => ({
  type: types.ADD_TAB,
  tabType: type,
  title
})

export const optDelTab = (listIndex) => ({
  type: types.DEL_TAB,
  index: listIndex
})

export const getPeople = data => dispatch => {
  return dispatch({
    type: types.QUERY_PEOPLE,
    payload: axios.get('/marketing-activity/update/getPeople', { params: data })
  })
}

// 筛选画像

export const optAddProfile = (order, data) => dispatch => {
  return dispatch({
    type: types.ADD_PROFILE,
    payload: {
      promise: axios.post('/marketing-activity/update/addProfile', data)
        .then(data => ({data, order}))
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optEditProfile = (order, data) => dispatch => {
  return dispatch({
    type: types.EDIT_PROFILE,
    payload: {
      promise: axios.post('/marketing-activity/update/editProfile', data)
        .then(data => ({data, order}))
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optDestroyProfile = (order, index, data) => dispatch => {
  return dispatch({
    type: types.DESTROY_PROFILE,
    payload: {
      promise: axios.post('/marketing-activity/update/delProfile', data)
        .then(data => {
          dispatch(optDelTab(index))
          return {data, order}
        })
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optAddProfileGroup = (order) => ({
  type: types.ADD_PROFILE_GROUP,
  order
})

export const optDelProfileGroup = (order, key) => ({
  type: types.DEL_PROFILE_GROUP,
  order,
  key
})

export const changeProfileFields = (order, fields) => ({
  type: types.CHANGE_PROFILE_FIELDS,
  order,
  fields
})

export const setDefaultProfileGroup = (order, profileName, userAmount) => ({
  type: types.SET_DEFAULT_PROFILE_GROUP,
  order,
  profileName,
  userAmount
})

export const setDefaultTagGroup = (order, ruleName) => ({
  type: types.SET_DEFAULT_TAG_GROUP,
  order,
  ruleName
})

// 跟踪规则

export const optAddTag = (order, data) => dispatch => {
  return dispatch({
    type: types.ADD_TAG,
    payload: {
      promise: axios.post('/marketing-activity/update/addTag', data)
        .then(data => ({data, order}))
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optEditTag = (order, data) => dispatch => {
  return dispatch({
    type: types.EDIT_TAG,
    payload: {
      promise: axios.post('/marketing-activity/update/editTag', data)
        .then(data => ({data, order}))
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optDestroyTag = (order, index, data) => dispatch => {
  return dispatch({
    type: types.DESTROY_TAG,
    payload: {
      promise: axios.post('/marketing-activity/update/delTag', data)
        .then(data => {
          dispatch(optDelTab(index))
          return {data, order}
        })
        .catch(e => {
          e.order = order
          throw e
        }),
      data: { order }
    }
  })
}

export const optAddTagGroup = (order) => ({
  type: types.ADD_TAG_GROUP,
  order
})

export const optDelTagGroup = (order, key) => ({
  type: types.DEL_TAG_GROUP,
  order,
  key
})

export const changeTagFields = (order, fields) => ({
  type: types.CHANGE_TAG_FIELDS,
  order,
  fields
})

/* 活动详情 */

export const getDetail = data => dispatch => {
  return dispatch({
    type: types.QUERY_DETAIL,
    payload: axios.get('/marketing-activity/list/detail', { params: data })
  })
}

export const getWelfare = params => (dispatch, getState) => {
  let newParams = Object.assign(
    getState().getIn(['activity', 'welfare', 'params']).toJS(),
    params
  )
  return dispatch({
    type: types.QUERY_WELFARE,
    payload: {
      promise: axios.get('/marketing-activity/welfare/query', { params: newParams }),
      data: { params }
    }
  })
}

export function showWelfareModal (currentRecord) {
  return {
    type: types.SHOW_WELFARE_MODAL,
    payload: { currentRecord }
  }
}

export function hideWelfareModal () {
  return {
    type: types.HIDE_WELFARE_MODAL
  }
}

export const saveWelfareModal = data => dispatch =>
  dispatch({
    type: types.SAVE_WELFARE_MODAL,
    payload: axios.post('/marketing-activity/welfare/edit', data)
  }).then(() => {
    dispatch(getWelfare())
    dispatch(hideWelfareModal())
  })

export const getAdditionByBiz = data => dispatch => {
  return dispatch({
    type: types.QUERY_ADDITION_BY_BIZ,
    payload: axios.get('/marketing-activity/welfare/additionByBiz', { params: data })
  })
}
