module.exports = {
  'success': true,
  'error': null,
  'data': {
    'profileBaseInfoUserGroupInfoList': [
      {
        'profileId': 19,
        'profileName': '用户画像1',
        'userAmount': 1222321,
        'updateType': 1,
        'updateProfileTime': 1510826400000,
        'profileUserGroupBaseInfoList': [
          {
            'userGroupId': 15,
            'userGroupName': '用户组1',
            'percentage': 80,
            'predictAmount': 0,
            'sysCode': 'alalei',
            'sysName': '阿拉蕾'
          },
          {
            'userGroupId': 16,
            'userGroupName': '用户组2',
            'percentage': 20,
            'predictAmount': 0,
            'sysCode': '111222',
            'sysName': '理财支付中心'
          }
        ]
      },
      {
        'profileId': 22,
        'profileName': '用户画像11',
        'userAmount': 0,
        'updateType': 0,
        'profileUserGroupBaseInfoList': [
          {
            'userGroupId': 17,
            'userGroupName': '用户组1',
            'percentage': 80,
            'predictAmount': 220100,
            'sysCode': 'common',
            'sysName': '公共'
          },
          {
            'userGroupId': 22,
            'userGroupName': '用户组2',
            'percentage': 20,
            'predictAmount': 20100,
            'sysCode': 'alalei',
            'sysName': '阿拉蕾'
          },
          {
            'userGroupId': 25,
            'userGroupName': '用户组4',
            'percentage': 100,
            'predictAmount': 0,
            'sysCode': 'uwdc',
            'sysName': '统一福利发放平台'
          }
        ]
      }
    ],
    'ruleBaseInfoUserGroupInfoList': [
      {
        'ruleId': 1,
        'ruleName': '用户已注册未提交基本信息',
        'relatedRuleUserGroupInfoList': [
          {
            'tagId': 4,
            'tagName': '15分钟',
            'appStatusId': 2,
            'appStatusName': '未退出app',
            'percentage': 100,
            'sysCode': 0,
            'sysName': '',
            'userGroupName': '用户已提交基本信息，但未绑定芝麻分(无银贷)'
          }
        ]
      }
    ]
  },
  'code': 0
}
