import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import axios from 'common/axios'

// Actions
const BIZ = 'missile/common/infolist/BIZ'
const COST_CENTER = 'missile/common/infolist/COST_CENTER'
const ACTIVITY = 'missile/common/infolist/ACTIVITY'
const FILTER_PROFILE = 'missile/common/infolist/FILTER_PROFILE'
const SYSTEM = 'missile/common/infolist/SYSTEM'
const RULE = 'missile/common/infolist/RULE'
const RULE_STATUS = 'missile/common/infolist/RULE_STATUS'

// Action Creators

export const queryBiz = params => dispatch => {
  dispatch({
    type: BIZ,
    payload: {
      promise: axios.get('backend/business/businessQuery', { params })
    }
  })
}
export const queryCostCenter = params => dispatch => {
  dispatch({
    type: COST_CENTER,
    payload: {
      promise: axios.get('backend/cost/costQuery', { params })
    }
  })
}
export const querySystem = params => dispatch => {
  dispatch({
    type: SYSTEM,
    payload: {
      promise: axios.get('backend/system/systemQuery', { params })
    }
  })
}
export const queryActivity = params => dispatch => {
  dispatch({
    type: ACTIVITY,
    payload: {
      promise: axios.get('marketing-activity/list/query', { params })
    }
  })
}
export const queryFilterProfile = params => dispatch => {
  dispatch({
    type: FILTER_PROFILE,
    payload: {
      promise: axios.get('user-filter/filterAllQuery', { params })
    }
  })
}
export const queryRule = params => dispatch => {
  dispatch({
    type: RULE,
    payload: {
      promise: axios.get('marketing-activity/rule/queryDefine', { params })
    }
  })
}
export const queryRuleStatus = params => dispatch => {
  dispatch({
    type: RULE_STATUS,
    payload: {
      promise: axios.get('marketing-activity/rule/queryStatus', { params })
    }
  })
}

// Reducer

const initialState = {
  bizList: {
    loading: false,
    dataSource: []
  },
  costCenterList: {
    loading: false,
    dataSource: []
  },
  systemList: {
    loading: false,
    dataSource: []
  },
  activityList: {
    loading: false,
    dataSource: []
  },
  profileList: {
    loading: false,
    dataSource: []
  },
  ruleList: {
    loading: false,
    dataSource: []
  },
  ruleStatusList: {
    loading: false,
    dataSource: []
  }
}

export default typeToReducer(
  {
    [BIZ]: {
      PENDING: state => state.setIn(['bizList', 'loading'], true),
      REJECTED: state => state.setIn(['bizList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('bizList', list =>
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [COST_CENTER]: {
      PENDING: state => state.setIn(['costCenterList', 'loading'], true),
      REJECTED: state => state.setIn(['costCenterList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('costCenterList', list =>
          list
            .set('dataSource', fromJS(action.payload.result))
            .set('loading', false)
        )
      }
    },
    [SYSTEM]: {
      PENDING: state => state.setIn(['systemList', 'loading'], true),
      REJECTED: state => state.setIn(['systemList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('systemList', list =>
          list
            .set('dataSource', fromJS(action.payload.result))
            .set('loading', false)
        )
      }
    },
    [ACTIVITY]: {
      PENDING: state => state.setIn(['activityList', 'loading'], true),
      REJECTED: state => state.setIn(['activityList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('activityList', list =>
          list
            .set('dataSource', fromJS(action.payload.result))
            .set('loading', false)
        )
      }
    },
    [FILTER_PROFILE]: {
      PENDING: state => state.setIn(['profileList', 'loading'], true),
      REJECTED: state => state.setIn(['profileList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('profileList', list =>
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [RULE]: {
      PENDING: state => state.setIn(['ruleList', 'loading'], true),
      REJECTED: state => state.setIn(['ruleList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('ruleList', list =>
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [RULE_STATUS]: {
      PENDING: state => state.setIn(['ruleStatusList', 'loading'], true),
      REJECTED: state => state.setIn(['ruleStatusList', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('ruleStatusList', list =>
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    }
  },
  fromJS(initialState)
)
