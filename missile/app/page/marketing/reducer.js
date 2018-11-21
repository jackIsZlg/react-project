/*
 * Author: linglan
 * Date: 2017-11-06 14:51:12
 * Email: linglan@wacai.com
 */

import { fromJS } from 'immutable'
import typeToReducer from 'type-to-reducer'
import moment from 'moment'
import { LOCATION_CHANGE } from 'react-router-redux'
import * as types from './constant'

// Reducer

const getDefaultParams = () => {
  return {
    pageSize: 15,
    pageIndex: 1
  }
}

const getDefaultProfile = () => {
  return {
    loading: false,
    saved: false,
    added: false,
    fields: {},
    userGroup: []
  }
}
const getDefaultLabel = () => {
  return {
    loading: false,
    saved: false,
    added: false,
    fields: {},
    userGroup: []
  }
}
const getDefaultPeople = () => {
  return {
    tab: {
      profile: 0,
      tag: 0,
      panels: []
    },
    profile: {},
    tag: {}
  }
}

const initialState = {
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: []
  },
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
  people: getDefaultPeople(),
  detail: {
    loading: false,
    data: {}
  },
  welfare: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: {},
    modal: {
      key: 0,
      visible: false,
      currentRecord: {},
      loading: false,
      fetching: false,
      addition: []
    }
  }
}

const convertPeopleData = (data) => {
  const profile = data.profileBaseInfoUserGroupInfoList
  const tag = data.ruleBaseInfoUserGroupInfoList
  let profileData = {}
  let tagData = {}
  const profilePanels = profile.map((item, index) => {
    const order = index + 1
    const currProfile = profileData[order.toString()] = getDefaultProfile()
    const {
      profileId,
      profileName,
      userAmount,
      updateType,
      updateProfileTime
    } = item
    currProfile.added = true
    currProfile.saved = true
    currProfile.fields = {
      profile: {
        name: 'profile',
        value: {
          profileId,
          profileName,
          userAmount
        }
      },
      updateType: {
        name: 'updateType',
        value: updateType
      },
      updateProfileTime: {
        name: 'updateProfileTime',
        value: moment(updateProfileTime)
      }
    }
    item.profileUserGroupBaseInfoList.forEach((group, index) => {
      const prefix = `userGroup_${index}_`
      currProfile.userGroup.push({key: index})
      currProfile.fields = {
        ...currProfile.fields,
        [`${prefix}userGroupId`]: {
          name: `${prefix}userGroupId`,
          value: group.userGroupId
        },
        [`${prefix}userGroupName`]: {
          name: `${prefix}userGroupName`,
          value: group.userGroupName
        },
        [`${prefix}percentage`]: {
          name: `${prefix}percentage`,
          value: group.percentage
        },
        [`${prefix}percentage`]: {
          name: `${prefix}percentage`,
          value: group.percentage
        },
        [`${prefix}predictAmount`]: {
          name: `${prefix}predictAmount`,
          value: group.predictAmount
        },
        [`${prefix}system`]: {
          name: `${prefix}system`,
          value: {
            sysCode: group.sysCode,
            sysName: group.sysName
          }
        }
      }
    })
    return {
      type: 'profile',
      title: '筛选画像',
      order
    }
  })
  const tagPanels = tag.map((item, index) => {
    const order = index + 1
    const currTag = tagData[order.toString()] = getDefaultLabel()
    const {
      ruleId,
      ruleName
    } = item
    currTag.added = true
    currTag.saved = true
    currTag.fields = {
      rule: {
        name: 'rule',
        value: {
          ruleId,
          ruleName
        }
      }
    }
    item.relatedRuleUserGroupInfoList.forEach((group, index) => {
      const prefix = `userGroup_${index}_`
      currTag.userGroup.push({key: index})
      currTag.fields = {
        ...currTag.fields,
        [`${prefix}userGroupId`]: {
          name: `${prefix}userGroupId`,
          value: group.userGroupId
        },
        [`${prefix}userGroupName`]: {
          name: `${prefix}userGroupName`,
          value: group.userGroupName
        },
        [`${prefix}tagStatus`]: {
          name: `${prefix}tagStatus`,
          value: {
            tagId: group.tagId,
            tagName: group.tagName,
            appStatusId: group.appStatusId,
            appStatusName: group.appStatusName
          }
        }
      }
    })
    return {
      type: 'tag',
      title: '跟踪规则',
      order
    }
  })
  return {
    tab: {
      profile: profile.length,
      tag: tag.length,
      panels: profilePanels.concat(tagPanels)
    },
    profile: profileData,
    tag: tagData
  }
}

export default typeToReducer(
  {
    [types.QUERY]: {
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
          list
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.ADD_INFO]: {
      PENDING: state => state.setIn(['addInfo', 'loading'], true),
      REJECTED: state => state.setIn(['addInfo', 'loading'], false),
      FULFILLED: state => state.setIn(['addInfo', 'loading'], false)
    },
    [types.ADD_INFO_FIELDS]: (state, action) => {
      return state.updateIn(['addInfo', 'fields'], fields =>
        fields.merge(action.fields)
      )
    },
    [types.QUERY_INFO]: {
      PENDING: (state, action) => state.setIn(['editInfo', 'fetching'], true),
      REJECTED: (state, action) => state.setIn(['editInfo', 'fetching'], false),
      FULFILLED: (state, action) => {
        const data = action.payload
        return state.update('editInfo', list =>
          list
            .set('data', fromJS(data))
            .set('fields', fromJS({
              bizName: {
                name: 'bizName',
                value: data.bizName
              },
              costCenter: {
                name: 'costCenter',
                value: data.costCenter ? data.costCenter.split(',') : []
              },
              related: {
                name: 'related',
                value: data.relatedActivity ? data.relatedActivity.split(',') : []
              }
            }))
            .set('fetching', false)
        )
      }
    },
    [types.EDIT_INFO]: {
      PENDING: state => state.setIn(['editInfo', 'loading'], true),
      REJECTED: state => state.setIn(['editInfo', 'loading'], false),
      FULFILLED: state => state.setIn(['editInfo', 'loading'], false)
    },
    [types.EDIT_INFO_FIELDS]: (state, action) => {
      return state.updateIn(['editInfo', 'fields'], fields =>
        fields.merge(action.fields)
      )
    },
    [types.ADD_TAB]: (state, action) => {
      const type = action.tabType
      return state.update('people', people => {
        const nextTypeSize = people.get('tab').get(type) + 1
        return people
          .update('tab', tab => {
            return tab
              .set(type, nextTypeSize)
              .update('panels', panels => panels.push(fromJS({
                type,
                title: action.title,
                order: nextTypeSize
              })))
          })
          .update(type, map => {
            let getDefault = () => {}
            if (type === 'profile') getDefault = getDefaultProfile
            if (type === 'tag') getDefault = getDefaultLabel
            return map.set(nextTypeSize.toString(), fromJS(getDefault()))
          })
      })
    },
    [types.DEL_TAB]: (state, action) => {
      const index = action.index
      return state.update('people', people => {
        const item = people.get('tab').get('panels').get(index)
        const type = item.get('type')
        const order = item.get('order')
        return people
          .update('tab', tab => {
            return tab
            // 应为自增index，只可新增不可修改
            // .set(type, tab.get(type) - 1)
            .update('panels', panels => panels.delete(index))
          })
          .update(type, map => map.delete(order.toString()))
      })
    },
    [types.ADD_PROFILE]: {
      PENDING: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false)
        .setIn(['people', 'profile', action.payload.order, 'added'], true)
        .setIn(['people', 'profile', action.payload.order, 'saved'], true)
    },
    [types.EDIT_PROFILE]: {
      PENDING: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false)
        .setIn(['people', 'profile', action.payload.order, 'saved'], true)
    },
    [types.DESTROY_PROFILE]: {
      PENDING: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'profile', action.payload.order, 'loading'], false)
    },
    [types.CHANGE_PROFILE_FIELDS]: (state, action) => {
      return state.updateIn(['people', 'profile'], map => {
        const profile = map.get(action.order)
        const newTab = profile
          .update('fields', fields => fields.merge(action.fields))
          .set('saved', false)
        return map.set(action.order, newTab)
      })
    },
    [types.ADD_PROFILE_GROUP]: (state, action) => {
      return state
      .updateIn(['people', 'profile', action.order, 'userGroup'], list =>
        list.push(fromJS({
          key: list.size
        }))
      )
    },
    [types.DEL_PROFILE_GROUP]: (state, action) => {
      return state
        .updateIn(['people', 'profile', action.order], item => {
          return item
          .update('userGroup', list => {
            return list.filter(item => item.get('key') !== action.key)
          })
          .update('fields', fields => {
            return fields.filter((value, key) => !key.includes(`userGroup_${action.key}`))
          })
          .set('saved', false)
        }
      )
    },
    [types.SET_DEFAULT_PROFILE_GROUP]: (state, action) => {
      const prefix = 'userGroup_0_'
      return state
        .updateIn(['people', 'profile', action.order], item => {
          return item
          .set('userGroup', fromJS([{key: 0}]))
          .update('fields', fields => {
            return fields.merge(fromJS({
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
            }))
          })
        }
      )
    },
    [types.ADD_TAG]: {
      PENDING: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false)
        .setIn(['people', 'tag', action.payload.order, 'added'], true)
        .setIn(['people', 'tag', action.payload.order, 'saved'], true)
    },
    [types.EDIT_TAG]: {
      PENDING: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false)
        .setIn(['people', 'tag', action.payload.order, 'saved'], true)
    },
    [types.DESTROY_TAG]: {
      PENDING: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], true),
      REJECTED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false),
      FULFILLED: (state, action) => state
        .setIn(['people', 'tag', action.payload.order, 'loading'], false)
    },
    [types.CHANGE_TAG_FIELDS]: (state, action) => {
      return state.updateIn(['people', 'tag'], map => {
        const tag = map.get(action.order)
        const newTab = tag
          .update('fields', fields => fields.merge(action.fields))
          .set('saved', false)
        return map.set(action.order, newTab)
      })
    },
    [types.ADD_TAG_GROUP]: (state, action) => {
      return state
      .updateIn(['people', 'tag', action.order, 'userGroup'], list =>
        list.push(fromJS({
          key: list.size
        }))
      )
    },
    [types.DEL_TAG_GROUP]: (state, action) => {
      return state
        .updateIn(['people', 'tag', action.order], item => {
          return item
          .update('userGroup', list => {
            return list.filter(item => item.get('key') !== action.key)
          })
          .update('fields', fields => {
            return fields.filter((value, key) => !key.includes(`userGroup_${action.key}`))
          })
          .set('saved', false)
        }
      )
    },
    [types.SET_DEFAULT_TAG_GROUP]: (state, action) => {
      const prefix = 'userGroup_0_'
      return state
        .updateIn(['people', 'tag', action.order], item => {
          return item
          .set('userGroup', fromJS([{key: 0}]))
          .update('fields', fields => {
            return fields.merge(fromJS({
              [`${prefix}userGroupName`]: {
                name: `${prefix}userGroupName`,
                value: action.ruleName
              },
              [`${prefix}tagStatus`]: {
                name: `${prefix}tagStatus`,
                value: ''
              }
            }))
          })
        }
      )
    },
    [types.QUERY_PEOPLE]: {
      PENDING: (state, action) => state.setIn(['people', 'fetching'], true),
      REJECTED: (state, action) => state.setIn(['people', 'fetching'], false),
      FULFILLED: (state, action) => {
        const data = convertPeopleData(action.payload)
        return state.update('people', people => {
          return people
            .set('tab', fromJS(data.tab))
            .set('profile', fromJS(data.profile))
            .set('tag', fromJS(data.tag))
        })
      }
    },
    [types.QUERY_DETAIL]: {
      PENDING: (state, action) => state.setIn(['detail', 'loading'], true),
      REJECTED: (state, action) => state.setIn(['detail', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('detail', list =>
          list
            .set('data', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.QUERY_WELFARE]: {
      PENDING: (state, action) => {
        const { params } = action.payload
        return state.update('welfare', welfare =>
          welfare
            .update('params', value => value.merge(params))
            .set('loading', true)
        )
      },
      REJECTED: state => state.setIn(['welfare', 'loading'], false),
      FULFILLED: (state, action) => {
        return state.update('welfare', welfare =>
          welfare
            .set('dataSource', fromJS(action.payload))
            .set('loading', false)
        )
      }
    },
    [types.SHOW_WELFARE_MODAL]: (state, action) => {
      const { currentRecord } = action.payload
      return state.updateIn(['welfare', 'modal'], modal =>
        modal
          .set('visible', true)
          .set('key', modal.get('key') + 1)
          .set('currentRecord', fromJS(currentRecord))
        )
    },
    [types.HIDE_WELFARE_MODAL]: state => {
      return state.updateIn(['welfare', 'modal'], modal =>
        modal
          .set('visible', false)
          .set('loading', false)
      )
    },
    [types.QUERY_ADDITION_BY_BIZ]: {
      PENDING: (state, action) => state.setIn(['welfare', 'modal', 'fetching'], true),
      REJECTED: (state, action) => state.setIn(['welfare', 'modal', 'fetching'], false),
      FULFILLED: (state, action) => {
        return state.update('welfare', list =>
          list
            .setIn(['modal', 'addition'], fromJS(action.payload))
            .setIn(['modal', 'fetching'], false)
        )
      }
    },
    [types.SAVE_WELFARE_MODAL]: {
      PENDING: (state, action) => state.setIn(['welfare', 'modal', 'loading'], true),
      REJECTED: (state, action) => state.setIn(['welfare', 'modal', 'loading'], false),
      FULFILLED: (state, action) => state.setIn(['welfare', 'modal', 'loading'], false)
    },
    [LOCATION_CHANGE]: state => state
      .setIn(['addInfo', 'fields'], fromJS({}))
      .set('people', fromJS(getDefaultPeople()))
  },
  fromJS(initialState)
)
