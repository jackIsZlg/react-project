import { fromJS } from 'immutable'
import * as types from 'page/marketing/constant'
import reducer from 'page/marketing/reducer'
import createReducer from '../../common'
import { LOCATION_CHANGE } from 'react-router-redux'

const getDefaultProfile = () => {
  return {
    loading: false,
    saved: false,
    fields: {},
    userGroup: []
  }
}

const getDefaultLabel = () => {
  return {
    loading: false,
    saved: false,
    fields: {},
    userGroup: []
  }
}

const initial = fromJS({
  addInfo: {
    loading: false,
    fetching: false,
    fields: {}
  },
  editInfo: {
    loading: false,
    fetching: false,
    fields: {}
  },
  addPeople: {
    tab: {
      profile: 0,
      tag: 0,
      panels: []
    },
    profile: {},
    tag: {}
  }
})

describe('营销活动-添加活动信息（第一步）', () => {
  const action = {
    type: types.ADD_INFO
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)

  it('请求中', async () => {
    expect(pending.getIn(['addInfo', 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(['addInfo', 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(['addInfo', 'loading'])).toBe(false)
  })
  it('表单项变更', async () => {
    const action = {
      type: types.ADD_INFO_FIELDS,
      fields: {
        theme: {
          name: 'theme',
          value: '活动主题',
          touched: true,
          dirty: false,
          validating: false
        }
      }
    }
    const result = createReducer(reducer, initial, action)
    const fields = initial.getIn(['addInfo', 'fields'])
    expect(result.getIn(['addInfo', 'fields'])).toEqual(fields.merge(action.fields))
  })
})

describe('营销活动-编辑获取活动信息', () => {
  it('请求中', () => {
    const action = {
      type: types.QUERY_INFO + '_PENDING'
    }
    const pending = createReducer(reducer, initial, action)
    expect(pending.getIn(['editInfo', 'fetching'])).toBe(true)
  })
  it('失败', () => {
    const action = {
      type: types.QUERY_INFO + '_REJECTED'
    }
    const rejected = createReducer(reducer, initial, action)
    expect(rejected.getIn(['editInfo', 'fetching'])).toBe(false)
  })

  // 分情况创建 action
  const queryInfoSuccAction = (isMultiSelectEmpty) => {
    let payload = {
      'id': 1,
      'activityTheme': 'app周年庆',
      'bizName': '理财',
      'beginTime': 1507910400000,
      'endTime': 1509379200000,
      'isAlways': 0,
      'isDelete': 0,
      'status': null,
      'auditTime': 1508083200000,
      'isAudit': 1,
      'activityType': 1,
      'costCenter': '富数1_富数-研发1,富数2_富数-研发2',
      'costBudget': 100000,
      'activityBackground': '活动背景',
      'createdBy': null,
      'activityGoal': '促销',
      'relatedActivity': '哈哈',
      'attachmentPath': '*',
      'createdTime': 1508688000000,
      'updatedTime': 1508688000000
    }
    if (isMultiSelectEmpty) {
      payload = {
        ...payload,
        'costCenter': null,
        'relatedActivity': null
      }
    }
    return {
      type: types.QUERY_INFO + '_FULFILLED',
      payload
    }
  }
  // 分情况创建 reducer 期待值
  const convertFieldsData = (action) => {
    return fromJS({
      bizName: {
        name: 'bizName',
        value: action.payload.bizName
      },
      costCenter: {
        name: 'costCenter',
        value: action.payload.costCenter
          ? action.payload.costCenter.split(',')
          : []
      },
      related: {
        name: 'related',
        value: action.payload.relatedActivity
          ? action.payload.relatedActivity.split(',')
          : []
      }
    })
  }
  it('成功', () => {
    const action = queryInfoSuccAction(false)
    const emptySelectAction = queryInfoSuccAction(true)
    const result = createReducer(reducer, initial, action)
    const emptySelectResult = createReducer(reducer, initial, emptySelectAction)

    expect(result.getIn(['editInfo', 'fetching'])).toBe(false)
    expect(result.getIn(['editInfo', 'data'])).toEqual(fromJS(action.payload))
    // 测试普通情况下的返回（费用部门和关联活动不为空）
    expect(result.getIn(['editInfo', 'fields'])).toEqual(convertFieldsData(action))
    // 测试另一种情况
    expect(emptySelectResult.getIn(['editInfo', 'fields'])).toEqual(convertFieldsData(emptySelectAction))
  })
})

describe('营销活动-编辑活动信息', () => {
  const action = {
    type: types.EDIT_INFO
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)

  it('请求中', async () => {
    expect(pending.getIn(['editInfo', 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(['editInfo', 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(['editInfo', 'loading'])).toBe(false)
  })
  it('表单项变更', async () => {
    const action = {
      type: types.EDIT_INFO_FIELDS,
      fields: {
        theme: {
          name: 'theme',
          value: '活动主题',
          touched: true,
          dirty: false,
          validating: false
        }
      }
    }
    const result = createReducer(reducer, initial, action)
    const fields = initial.getIn(['editInfo', 'fields'])
    expect(result.getIn(['editInfo', 'fields'])).toEqual(fields.merge(action.fields))
  })
})

// 存储添加过 Tab 的 reducer 用来测试后续
let addedTab

describe('营销活动-添加活动人群-标签页管理（第二步）', () => {
  it('新增（筛选画像）', async () => {
    const action = {
      type: types.ADD_TAB,
      tabType: 'profile',
      title: '筛选画像'
    }
    addedTab = createReducer(reducer, initial, action)
    const type = action.tabType
    const tab = initial.getIn(['addPeople', 'tab'])
    const tabData = initial.getIn(['addPeople', type])
    const nextTypeSize = tab.get(type) + 1
    expect(addedTab.getIn(['addPeople', 'tab'])).toEqual(tab.merge({
      [type]: nextTypeSize,
      panels: tab.get('panels').push(fromJS({
        type,
        title: action.title,
        order: nextTypeSize
      }))
    }))
    expect(addedTab.getIn(['addPeople', type])).toEqual(tabData.merge({
      // object key 无需 toString
      [nextTypeSize]: fromJS(getDefaultProfile())
    }))
  })
  it('新增（跟踪规则）', async () => {
    const action = {
      type: types.ADD_TAB,
      tabType: 'tag',
      title: '跟踪规则'
    }
    // 从刚才已新增筛选画像 Tab 的 reducer 继续新增
    const oldAddedTab = addedTab
    addedTab = createReducer(reducer, oldAddedTab, action)
    const type = action.tabType
    const tab = oldAddedTab.getIn(['addPeople', 'tab'])
    const tabData = oldAddedTab.getIn(['addPeople', type])
    const nextTypeSize = tab.get(type) + 1
    expect(addedTab.getIn(['addPeople', 'tab'])).toEqual(tab.merge({
      [type]: nextTypeSize,
      panels: tab.get('panels').push(fromJS({
        type,
        title: action.title,
        order: nextTypeSize
      }))
    }))
    expect(addedTab.getIn(['addPeople', type])).toEqual(tabData.merge({
      // object key 无需 toString
      [nextTypeSize]: fromJS(getDefaultLabel())
    }))
  })
  it('删除', async () => {
    const action = {
      type: types.DEL_TAB,
      index: 0
    }
    // 用已添加的 reducer 测试
    const result = createReducer(reducer, addedTab, action)
    const tab = addedTab.getIn(['addPeople', 'tab'])

    const item = tab.getIn(['panels', action.index])
    const type = item.get('type')
    const order = item.get('order')
    const tabData = addedTab.getIn(['addPeople', type])
    expect(result.getIn(['addPeople', 'tab'])).toEqual(tab.merge({
      panels: tab.get('panels').delete(action.index)
    }))
    expect(result.getIn(['addPeople', type])).toEqual(tabData.delete(order.toString()))
  })
})

describe('营销活动-添加活动人群-筛选画像', () => {
  const action = {
    type: types.ADD_PROFILE,
    payload: {
      order: 1
    }
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, addedTab, action, 1)

  it('请求中', async () => {
    expect(pending.getIn([
      'addPeople', 'profile', action.payload.order, 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn([
      'addPeople', 'profile', action.payload.order, 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn([
      'addPeople', 'profile', action.payload.order, 'loading'])).toBe(false)
    expect(fulfilled.getIn([
      'addPeople', 'profile', action.payload.order, 'saved'])).toBe(true)
  })
  it('表单项变更', async () => {
    const action = {
      type: types.ADD_PROFILE_FIELDS,
      order: '1', // 索引从 1 开始的
      fields: {
        theme: {
          name: 'profile',
          value: {
            profileId: 19,
            profileName: '用户画像1',
            userAomunt: 1222321
          },
          touched: true,
          dirty: false,
          validating: false
        }
      }
    }
    // 用已添加的 reducer 测试
    const result = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'profile', action.order, 'fields']
    const fields = addedTab.getIn(params)
    expect(result.getIn(params)).toEqual(fields.merge(action.fields))
  })
  let groupAdded
  it('新增用户组', async () => {
    const action = {
      type: types.ADD_PROFILE_GROUP,
      order: '1'
    }
    groupAdded = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'profile', action.order, 'userGroup']
    const list = addedTab.getIn(params)
    expect(groupAdded.getIn(params)).toEqual(list.push(fromJS({
      key: list.size
    })))
  })
  it('删除用户组', async () => {
    const action = {
      type: types.DEL_PROFILE_GROUP,
      order: '1',
      key: 0 // 删除的用户组该行的 key
    }
    // 用已添加用户组的 reducer 测试
    const result = createReducer(reducer, groupAdded, action)
    const params = ['addPeople', 'profile', action.order, 'userGroup']
    const list = addedTab.getIn(params)
    expect(result.getIn(params)).toEqual(list.filter(item => item.get('key') !== action.key))
  })
  it('设置默认用户组', async () => {
    const action = {
      type: types.SET_DEFAULT_PROFILE_GROUP,
      order: '1',
      profileName: '用户画像1',
      userAmount: 30
    }
    const prefix = 'userGroup_0_'
    const result = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'profile', action.order]
    expect(result.getIn(params).get('userGroup')).toEqual(fromJS([{key: 0}]))
    expect(result.getIn(params).get('fields'))
      .toEqual(addedTab.getIn(params).get('fields').merge(fromJS({
        [`${prefix}userGroupName`]: {
          name: `${prefix}userGroupName`,
          value: action.profileName
        },
        [`${prefix}percentage`]: {
          name: `${prefix}percentage`,
          value: 100
        },
        [`${prefix}predictAmount`]: {
          name: `${prefix}predictAmount`,
          value: action.userAmount
        }
      })
    ))
  })
})

describe('营销活动-添加活动人群-跟踪规则', () => {
  const action = {
    type: types.ADD_TAG,
    payload: {
      order: 1
    }
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, addedTab, action, 1)

  it('请求中', async () => {
    expect(pending.getIn([
      'addPeople', 'tag', action.payload.order, 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn([
      'addPeople', 'tag', action.payload.order, 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn([
      'addPeople', 'tag', action.payload.order, 'loading'])).toBe(false)
    expect(fulfilled.getIn([
      'addPeople', 'tag', action.payload.order, 'saved'])).toBe(true)
  })
  it('表单项变更', async () => {
    const action = {
      type: types.ADD_TAG_FIELDS,
      order: '1', // 索引从 1 开始的
      fields: {
        theme: {
          name: 'rule',
          value: {
            ruleId: 5,
            ruleName: '用户已提交基本信息，但未绑定芝麻分'
          },
          touched: true,
          dirty: false,
          validating: false
        }
      }
    }
    // 用已添加的 reducer 测试
    const result = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'tag', action.order, 'fields']
    const fields = addedTab.getIn(params)
    expect(result.getIn(params)).toEqual(fields.merge(action.fields))
  })
  let groupAdded
  it('新增用户组', async () => {
    const action = {
      type: types.ADD_TAG_GROUP,
      order: '1'
    }
    groupAdded = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'tag', action.order, 'userGroup']
    const list = addedTab.getIn(params)
    expect(groupAdded.getIn(params)).toEqual(list.push(fromJS({
      key: list.size
    })))
  })
  it('删除用户组', async () => {
    const action = {
      type: types.DEL_TAG_GROUP,
      order: '1',
      key: 0 // 删除的用户组该行的 key
    }
    // 用已添加用户组的 reducer 测试
    const result = createReducer(reducer, groupAdded, action)
    const params = ['addPeople', 'tag', action.order, 'userGroup']
    const list = addedTab.getIn(params)
    expect(result.getIn(params)).toEqual(list.filter(item => item.get('key') !== action.key))
  })
  it('设置默认用户组', async () => {
    const action = {
      type: types.SET_DEFAULT_TAG_GROUP,
      order: '1',
      ruleName: '用户绑定芝麻分，但未提交审核(无银贷)'
    }
    const prefix = 'userGroup_0_'
    const result = createReducer(reducer, addedTab, action)
    const params = ['addPeople', 'tag', action.order]
    expect(result.getIn(params).get('userGroup')).toEqual(fromJS([{key: 0}]))
    expect(result.getIn(params).get('fields'))
      .toEqual(addedTab.getIn(params).get('fields').merge(fromJS({
        [`${prefix}userGroupName`]: {
          name: `${prefix}userGroupName`,
          value: action.ruleName
        },
        [`${prefix}tagStatus`]: {
          name: `${prefix}tagStatus`,
          value: ''
        }
      })
    ))
  })
})

// 用不着了
addedTab = null

describe('跳转清除', () => {
  const action = {
    type: LOCATION_CHANGE
  }
  const result = createReducer(reducer, initial, action)

  it('清除新增活动信息', async () => {
    expect(result.getIn(['addInfo', 'fields'])).toEqual(fromJS({}))
  })
})
