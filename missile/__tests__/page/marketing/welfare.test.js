import { fromJS } from 'immutable'
import * as types from 'page/marketing/constant'
import reducer from 'page/marketing/reducer'
import createReducer from '../../common'

const getDefaultParams = () => {
  return {
    pageSize: 15,
    pageIndex: 1
  }
}

const initial = fromJS({
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
})

describe('营销活动-获取福利信息', () => {
  it('请求中', () => {
    const action = {
      type: types.QUERY_WELFARE + '_PENDING',
      payload: {
        params: {
          pageNum: 2
        }
      }
    }
    const pending = createReducer(reducer, initial, action)
    const expected = initial.getIn(['welfare', 'params']).merge(action.payload.params)
    expect(pending.getIn(['welfare', 'loading'])).toBe(true)
    expect(pending.getIn(['welfare', 'params'])).toEqual(expected)
  })
  it('失败', () => {
    const action = {
      type: types.QUERY_WELFARE + '_REJECTED'
    }
    const rejected = createReducer(reducer, initial, action)
    expect(rejected.getIn(['welfare', 'loading'])).toBe(false)
  })
  it('成功', () => {
    const payload = {
      'totalCount': 6,
      'pageNum': 1,
      'result': [
        {
          'id': 7,
          'userGroupId': 15,
          'userGroupName': '用户组2',
          'welfareType': '卡券',
          'welfareName': 'D',
          'welfareCode': 'fuli4',
          'welfareCost': 0,
          'costCenterCode': 'alalei_cost2',
          'costCenterName': '阿拉蕾cost2',
          'additionLabels': '支付模块:阳光城,用户类型:新用户',
          'updatedTime': 1510644193000,
          'createdTime': 1510644149000,
          'additionLabelColumnList': [
            {
              'additionLabelName': '支付模块',
              'additionLabelValue': '阳光城'
            },
            {
              'additionLabelName': '用户类型',
              'additionLabelValue': '新用户'
            }
          ]
        }
      ],
      'pages': 1
    }
    const action = {
      type: types.QUERY_WELFARE + '_FULFILLED',
      payload
    }
    const fulfilled = createReducer(reducer, initial, action)
    expect(fulfilled.getIn(['welfare', 'loading'])).toBe(false)
    expect(fulfilled.getIn(['welfare', 'dataSource'])).toEqual(fromJS(action.payload))
  })
})

describe('营销活动-福利信息-信息补全', async () => {
  it('显示 Modal', async () => {
    const currentRecord = {
      'id': 7,
      'userGroupId': 15,
      'userGroupName': '用户组2',
      'welfareType': '卡券',
      'welfareName': 'D',
      'welfareCode': 'fuli4',
      'welfareCost': 0,
      'costCenterCode': 'alalei_cost2',
      'costCenterName': '阿拉蕾cost2',
      'additionLabels': '支付模块:阳光城,用户类型:新用户',
      'updatedTime': 1510644193000,
      'createdTime': 1510644149000,
      'additionLabelColumnList': [
        {
          'additionLabelName': '支付模块',
          'additionLabelValue': '阳光城'
        },
        {
          'additionLabelName': '用户类型',
          'additionLabelValue': '新用户'
        }
      ]
    }
    const action = {
      type: types.SHOW_WELFARE_MODAL,
      payload: { currentRecord }
    }
    const result = createReducer(reducer, initial, action)
    const params = ['welfare', 'modal']
    expect(result.getIn(params).get('visible')).toBe(true)
    expect(result.getIn(params).get('key')).toBe(initial.getIn(params).get('key') + 1)
    expect(result.getIn(params).get('currentRecord')).toEqual(fromJS(currentRecord))
  })
  it('隐藏 Modal', async () => {
    const action = {
      type: types.HIDE_WELFARE_MODAL
    }
    const result = createReducer(reducer, initial, action)
    const params = ['welfare', 'modal']
    expect(result.getIn(params).get('visible')).toBe(false)
    expect(result.getIn(params).get('loading')).toBe(false)
  })
})

describe('营销活动-福利信息-获取附加字段', () => {
  const action = {
    type: types.QUERY_ADDITION_BY_BIZ,
    payload: [
      {
        'additionLabelName': '支付模块',
        'additionLabelValue': '金币商场,商场'
      },
      {
        'additionLabelName': '用户类型',
        'additionLabelValue': '新用户,老用户'
      }
    ]
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)
  const params = ['welfare', 'modal']

  it('请求中', async () => {
    expect(pending.getIn(params).get('fetching')).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(params).get('fetching')).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(params).get('fetching')).toBe(false)
    expect(fulfilled.getIn(params).get('addition')).toEqual(fromJS(action.payload))
  })
})

describe('营销活动-福利信息-保存信息补全', async () => {
  const action = {
    type: types.SAVE_WELFARE_MODAL,
    payload: {}
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)
  const params = ['welfare', 'modal', 'loading']

  it('请求中', async () => {
    expect(pending.getIn(params)).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(params)).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(params)).toBe(false)
  })
})
