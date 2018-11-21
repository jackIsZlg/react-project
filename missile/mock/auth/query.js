// 获取用户权限相关数据

module.exports = function () {
  const underlings = []

  const user = {
    canAssign: 1,
    id: 33,
    mobile: '15128873843',
    nickname: 'admin',
    nicknameCn: '管理员',
    station: 'MISSILE',
    status: 1,
    userType: 1
  }

  const roleList = [
    {
      id: 9,
      status: 1,
      appCode: 'MISSILE',
      code: 'MISSILE_ADMIN',
      name: 'MISSILE管理员'
    }
  ]

  const resourceList = [
    // 一级菜单
    {
      id: 1,
      level: 0,
      status: 1,
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER',
      name: '用户筛选',
      resourceType: 1,
      resourceUrl: `
      /filter/add
      
      `,
      resourceExt: '{"icon": "filter"}'
    },
    {
      id: 2,
      level: 0,
      status: 1,
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING',
      name: '营销活动',
      resourceType: 1,
      resourceUrl: ``,
      resourceExt: '{"icon": "appstore"}'
    },
    {
      id: 3,
      level: 0,
      status: 1,
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND',
      name: '后台管理',
      resourceType: 1,
      resourceUrl: '',
      resourceExt: '{"icon": "appstore"}'
    },
    /**
     * 用户筛选
     */
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_ADD',
      comment: '',
      id: 100,
      level: 1,
      modifier: '',
      name: '新建画像列表',
      parentCode: 'MISSILE_USER_FILTER',
      resourceExt: '{"icon":"folder-open"}',
      resourceType: 1,
      resourceUrl: `
      /filter/add
      POST::/user-filter/filterAdd
      POST::/user-filter/filterUploadTable
      POST::/user-filter/filterCheckSQL`,
      status: 1
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_LIST',
      comment: '',
      id: 101,
      level: 1,
      modifier: '',
      name: '筛选画像列表',
      parentCode: 'MISSILE_USER_FILTER',
      resourceExt: '{"icon":"folder-open"}',
      resourceType: 1,
      resourceUrl: `
      /filter
      /filter/list
      GET::/user-filter/filterQuery
      `,
      status: 1
    },
    // 内嵌页面
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_EDIT',
      comment: '',
      id: 102,
      level: 1,
      modifier: '',
      name: '筛选画像列表-编辑',
      parentCode: 'MISSILE_USER_FILTER_LIST',
      resourceType: 3,
      resourceExt: '{"show":false}',
      resourceUrl: `
      /filter/edit
      POST::/user-filter/filterUpdate
      POST::/user-filter/filterCheckSQL`
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_DETAIL',
      comment: '',
      id: 103,
      level: 1,
      modifier: '',
      name: '筛选画像列表-详情',
      parentCode: 'MISSILE_USER_FILTER_LIST',
      resourceType: 3,
      resourceExt: '{"show":false}',
      resourceUrl: `
      /filter/detail
      GET::/user-filter/filterGet
      GET::/user-filter/filterUploadGet
      `
    },
    // 操作
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_UPDATE_STATUS',
      id: 104,
      level: 1,
      name: '用户筛选-画像列表-启用/停用',
      parentCode: 'MISSILE_USER_FILTER_LIST',
      resourceType: 2,
      resourceUrl: `
      POST::/user-filter/filterStatus
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_COPY',
      id: 105,
      level: 1,
      name: '筛选画像列表-复制',
      parentCode: 'MISSILE_USER_FILTER_LIST',
      resourceType: 2,
      resourceUrl: `
      POST::/user-filter/filterCopy
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_USER_FILTER_DEL',
      id: 105,
      level: 1,
      name: '筛选画像列表-删除',
      parentCode: 'MISSILE_USER_FILTER_LIST',
      resourceType: 2,
      resourceUrl: `
      POST::/user-filter/filterDel
      `
    },
    /**
     * 营销活动
     */
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_ADD',
      id: 201,
      level: 1,
      name: '新建营销活动',
      parentCode: 'MISSILE_MARKETING',
      resourceExt: '{"icon":"inbox"}',
      resourceType: 1,
      resourceUrl: `
      /marketing/add
      POST::/marketing-activity/update/updateInfo
      POST::/marketing-activity/update/addProfile
      POST::/marketing-activity/update/addTag
      GET::/user-filter/filterAllQuery
      GET::/marketing-activity/rule/queryDefine
      GET::/marketing-activity/rule/queryStatus
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_LIST',
      id: 202,
      level: 1,
      name: '营销活动列表',
      parentCode: 'MISSILE_MARKETING',
      resourceExt: '{"icon":"inbox"}',
      resourceType: 1,
      resourceUrl: `
      /marketing
      /marketing/list
      GET::/marketing-activity/list/query
      `
    },
    // 内嵌页面
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_EDIT',
      id: 203,
      level: 1,
      name: '营销活动列表-编辑',
      parentCode: 'MISSILE_MARKETING_LIST',
      resourceType: 3,
      resourceUrl: `
      /marketing/edit
      GET::/marketing-activity/update/getInfo
      POST::/marketing-activity/update/updateInfo
      GET::/marketing-activity/update/getPeople
      POST::/marketing-activity/update/editProfile
      POST::/marketing-activity/update/editTag
      POST::/marketing-activity/update/delProfile
      POST::/marketing-activity/update/delTag
      GET::/marketing-activity/rule/queryDefine
      GET::/marketing-activity/rule/queryStatus
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_DETAIL',
      id: 204,
      level: 1,
      name: '营销活动列表-详情',
      parentCode: 'MISSILE_MARKETING_LIST',
      resourceType: 3,
      resourceUrl: `
      /marketing/detail
      GET::/marketing-activity/list/detail
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_WELFARE',
      id: 207,
      level: 1,
      name: '营销活动列表-福利信息',
      parentCode: 'MISSILE_MARKETING_LIST',
      resourceType: 3,
      resourceUrl: `
      GET::/marketing-activity/welfare/query
      GET::/marketing-activity/welfare/additionByBiz
      POST::/marketing-activity/welfare/edit
      `
    },
    // 操作
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_DEL',
      id: 205,
      level: 1,
      name: '营销活动列表-删除',
      parentCode: 'MISSILE_MARKETING_LIST',
      resourceType: 2,
      resourceUrl: `
      POST::/marketing-activity/list/del
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_MARKETING_UPDATE_STATUS',
      id: 206,
      level: 1,
      name: '营销活动列表-启用/停用',
      parentCode: 'MISSILE_MARKETING_LIST',
      resourceType: 2,
      resourceUrl: `
      POST::/marketing-activity/list/updateStatus
      `
    },
    /**
     * 后台管理
     */
    {
      appCode: 'BACKEND',
      code: 'MISSILE_BACKEND_GENERAL',
      id: 301,
      level: 1,
      name: '通用',
      parentCode: 'MISSILE_BACKEND',
      resourceExt: '{"icon":"inbox"}',
      resourceType: 1,
      resourceUrl: `
      /backend
      /backend/general
      GET::/backend/business/businessQuery
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_BUSINESS_SAVE',
      id: 141,
      level: 1,
      name: '通用-业务线管理-保存',
      parentCode: 'MISSILE_BACKEND_GENERAL',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/business/businessSave
      POST::/backend/business/businessAdd
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_FILTER',
      id: 302,
      level: 1,
      name: '用户筛选管理',
      parentCode: 'MISSILE_BACKEND',
      resourceExt: '{"icon":"inbox"}',
      resourceType: 1,
      resourceUrl: `
      /backend/filter
      /backend/filter/quota
      /backend/filter/quota/add
      /backend/filter/compare
      /backend/filter/compare/add
      /backend/filter/system
      GET::/backend/system/systemQuery
      GET::/backend/compare/compareQuery
      GET::/backend/compare/addCompareQuery
      POST::/backend/compare/addCompareSave
      POST::/backend/compare/addCompareRemove
      GET::/backend/quota/quotaQuery
      GET::/backend/quota/addQuotaQueryDataBase
      GET::/backend/quota/addQuotaQueryDbId
      GET::/backend/quota/addQuotaQueryTableId
      POST::/backend/quota/addQuotaSave
      GET::/backend/business/businessQuery
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_QUOTA_SAVE',
      id: 307,
      level: 1,
      name: '用户筛选-画像指标-保存',
      parentCode: 'MISSILE_BACKEND_FILTER',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/quota/quotaSave
      POST::/backend/quota/quotaAdd
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_QUOTA_REMOVE',
      id: 308,
      level: 1,
      name: '用户筛选-画像筛选列表-删除',
      parentCode: 'MISSILE_BACKEND_FILTER',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/quota/quotaRemove
      POST::/backend/quota/removeDataSource
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_SYSTEM_SAVE',
      id: 303,
      level: 1,
      name: '用户筛选-输出系统-保存',
      parentCode: 'MISSILE_BACKEND_FILTER',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/system/systemSave
      POST::/backend/system/systemAdd
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_SYSTEM_REMOVE',
      id: 304,
      level: 1,
      name: '用户筛选-输出系统-删除',
      parentCode: 'MISSILE_BACKEND_FILTER',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/system/systemRemove
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_COMPARE_SAVE',
      id: 500,
      level: 1,
      name: '用户筛选-动态比较值-保存',
      parentCode: 'MISSILE_BACKEND_MAEKETING',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/compare/compareSave
      POST::/backend/compare/compareAdd
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_COMPARE_REMOVE',
      id: 501,
      level: 1,
      name: '用户筛选-动态比较值-删除',
      parentCode: 'MISSILE_BACKEND_FILTER',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/compare/compareRemove
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_MAEKETING',
      id: 305,
      level: 1,
      name: '营销活动管理',
      parentCode: 'MISSILE_BACKEND',
      resourceExt: '{"icon":"inbox"}',
      resourceType: 1,
      resourceUrl: `
      /backend/marketing
      /backend/marketing/info
      /backend/marketing/cost
      GET::/backend/cost/costQuery
      GET::/backend/info/infoQuery
      GET::/backend/business/businessQuery
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_COST_SAVE',
      id: 141,
      level: 1,
      name: '营销活动-费用-保存',
      parentCode: 'MISSILE_BACKEND_MAEKETING',
      resourceType: 2,
      resourceUrl: 'POST::/backend/cost/costSave'
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_COST_UPDATE',
      id: 142,
      level: 1,
      name: '营销活动-费用-更新状态',
      parentCode: 'MISSILE_BACKEND_MAEKETING',
      resourceType: 2,
      resourceUrl: 'POST::/backend/cost/costUpdate'
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_INFO_SAVE',
      id: 143,
      level: 1,
      name: '营销活动-附加字段-保存',
      parentCode: 'MISSILE_BACKEND_MAEKETING',
      resourceType: 2,
      resourceUrl: `
      POST::/backend/info/infoSave
      POST::/backend/info/infoAdd
      `
    },
    {
      appCode: 'MISSILE',
      code: 'MISSILE_BACKEND_INFO_UPDATE',
      id: 144,
      level: 1,
      name: '营销活动-费用-更新状态',
      parentCode: 'MISSILE_BACKEND_MAEKETING',
      resourceType: 2,
      resourceUrl: 'POST::/backend/info/infoUpdate'
    }
  ]

  return {
    code: 0,
    data: { underlings, roleList, resourceList, user }
  }
}
