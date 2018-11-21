/*
 * Author: linglan
 * Date: 2017-11-15 14:38:11
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, Spin } from 'antd'
import upperFirst from 'lodash/upperFirst'
import isEqual from 'lodash/isEqual'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  queryBiz,
  queryCostCenter,
  querySystem,
  queryActivity,
  queryFilterProfile,
  queryRule,
  queryRuleStatus
} from './infolist'

const Option = Select.Option

/*
 * 公共变量列表，使用 Antd Select
 * type: 列表类型，参数见 listTypeAction
 * infoList: reducer 中的列表数据
 * onChange: onChange 回调
 * onBlur: onBlur 回调
 * valueKey: value 根据此字段取值
 * valueType: value 的取值类型，当接收 'object' 时返回 JSON 字符串化后的整条数据，默认为 string
 * jsonKeys: 和 valueType 配合使用，只 JSON 化接受的 keys
 *** -------------------------------------------------
 *** jsonKeys 食用如下
 *** 如果 jsonKeys 是字符串，直接获取 item 相对的 key
 *** 反之是对象，按照此格式获取 key 并拼接
 *** {
 ***  combineKey[string]: 拼接的 key 名称
 ***  sourceKey[array]: 拼接的源 key 名称
 ***  connectSymbol[string]: 中间的连接符，不传为空字符串
 *** }
 *** 案例需求:【营销活动-新建/编辑活动人群-跟踪规则】
 *** 案例地址: .../marketing/update/component/activity-people/tag.js
 *** -------------------------------------------------
 * selectProps: antd 支持的 select 参数
 * whiteList: 列表项白名单
 * blackList: 列表项黑名单
 * filterKey: 白名单/黑名单根据此字段过滤
 * fetchParam: 附加请求参数
 * attachItems: 追加选项
 * attachPosition: 追加选项位置，top/bottom
 * firstDefault: 默认选中第一项
 * allowEmpty: 允许列表为空
 * formatter: 列表项文字格式化
 * getInfoOptions: 提供外部组件获取所有options的方式
 */

const listTypeAction = {
  biz: 'bizList',                     // 业务线
  costCenter: 'costCenterList',       // 费用部门
  system: 'systemList',               // 输出系统
  activity: 'activityList',           // 营销活动
  profile: 'profileList',             // 营销活动
  rule: 'ruleList',                   // 营销活动
  ruleStatus: 'ruleStatusList'        // 营销活动
}

@connect(
  state => ({ infoList: state.get('infolist') }),
  dispatch => ({
    fetchBizList: bindActionCreators(queryBiz, dispatch),
    fetchCostCenterList: bindActionCreators(queryCostCenter, dispatch),
    fetchSystemList: bindActionCreators(querySystem, dispatch),
    fetchActivityList: bindActionCreators(queryActivity, dispatch),
    fetchProfileList: bindActionCreators(queryFilterProfile, dispatch),
    fetchRuleList: bindActionCreators(queryRule, dispatch),
    fetchRuleStatusList: bindActionCreators(queryRuleStatus, dispatch)
  })
)
export default class InfoList extends Component {
  static get propTypes () {
    return {
      type: PropTypes.string,
      infoList: PropTypes.object,
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      valueKey: PropTypes.string,
      valueType: PropTypes.string,
      jsonKeys: PropTypes.array,
      selectProps: PropTypes.object,
      whiteList: PropTypes.array,
      blackList: PropTypes.array,
      filterKey: PropTypes.string,
      fetchParam: PropTypes.object,
      attachItems: PropTypes.array,
      attachPosition: PropTypes.string,
      firstDefault: PropTypes.bool,
      allowEmpty: PropTypes.bool,
      formatter: PropTypes.func,
      getInfoOptions: PropTypes.func
    }
  }
  componentDidMount () {
    this.fetchList()
  }
  componentWillReceiveProps (nextProps) {
    const nextParam = nextProps.fetchParam || {}
    const thisParam = this.props.fetchParam || {}
    if (!isEqual(nextParam, thisParam)) {
      // console.log('fetch Param update: ', nextProps)
      this.fetchList()
    }
    // set first option as default value
    const { infoList, type, selectProps = {}, firstDefault, onChange } = nextProps
    const list = infoList.get(listTypeAction[type])
    if (list && !selectProps.value && firstDefault && onChange) {
      let firstValue
      if (typeof list.get(0) === 'string') {
        firstValue = list.get(0)
      } else if (typeof list.get(0) === 'object' && list.getIn(0, 'id')) {
        firstValue = list.getIn(0, 'id')
      }
      firstValue && onChange(firstValue)
    }
  }
  fetchList () {
    const { type, fetchParam = {} } = this.props
    const action = 'fetch' + upperFirst(listTypeAction[type])
    this.props[action]({
      ...fetchParam
    })
  }
  renderOptions (item, type) {
    const { valueKey, valueType, formatter, jsonKeys } = this.props
    if (type === 'activity') item = item.get('activityBaseInfo')
    let id = item.get('id')
    id = typeof id === 'number' ? id.toString() : id

    let value
    if (valueType === 'object') {
      if (jsonKeys) {
        let json = {}
        jsonKeys.forEach(key => {
          if (typeof key === 'string') {
            json[key] = item.get(key)
          } else {
            json[key.combineKey] = key.sourseKey.map(k => item.get(k))
              .join(key.connectSymbol || '')
          }
        })
        value = JSON.stringify(json)
      } else {
        value = JSON.stringify(item)
      }
    } else {
      value = item.get(valueKey) || id
    }

    switch (type) {
      case 'biz':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('bizName')
        }
      case 'costCenter':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('costCenterName')
        }
      case 'system':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('sysName')
        }
      case 'activity':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('activityTheme')
        }
      case 'profile':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('profileName')
        }
      case 'rule':
        return {
          key: id,
          value,
          label: formatter ? formatter(item) : item.get('ruleName')
        }
      case 'ruleStatus':
        return {
          key: id,
          value,
          label: formatter
            ? formatter(item)
            : item.get('moment') + item.get('unit') + item.get('appStatusName')
        }
      default:
        return {
          key: item,
          value: item,
          label: formatter ? formatter(item) : item
        }
    }
  }
  renderSelect (infoList) {
    const {
      type, onChange, onBlur, selectProps = {},
      // whiteList, blackList, filterKey, attachItems, attachPosition,
      getInfoOptions
    } = this.props

    let list = infoList
    // if (whiteList) {
    //   list = infoList.filter((item) => whiteList.includes(item[filterKey || 'id']))
    // } else if (blackList) {
    //   list = infoList.filter((item) => !blackList.includes(item[filterKey || 'id']))
    // }
    // if (attachItems) {
    //   switch (attachPosition) {
    //     case 'top':
    //       list = attachItems.concat(list)
    //       break
    //     default:
    //       list = list.concat(attachItems)
    //   }
    // }
    const options = list.map((item) => this.renderOptions(item, type)).toJS()
    getInfoOptions && list.size > 0 && getInfoOptions(type, options)

    return (
      <Select
        showSearch
        size='large'
        style={{ width: '100%' }}
        placeholder='请选择'
        mode='multiple'
        onChange={onChange}
        onBlur={onBlur}
        filterOption={(input, option) => {
          const children = option.props.children
          return children && option.props.children.indexOf(input) >= 0
        }}
        {...selectProps}>
        {
          options.map(option => (
            <Option
              key={option.key}
              value={option.value}>
              {option.label}
            </Option>
          ))
        }
      </Select>
    )
  }
  render () {
    const { infoList, type, allowEmpty } = this.props
    const data = infoList.get(listTypeAction[type])
    const list = data.get('dataSource')
    const loading = data.get('loading')

    // 默认情况不渲染空列表，接受参数 allowEmpty = true 时，允许渲染
    return (
      list.size > 0 || allowEmpty === true
      ? this.renderSelect(list)
      : (loading ? <Spin size='small' /> : null)
    )
  }
}
