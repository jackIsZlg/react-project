module.exports = {
  'success': true,
  'error': null,
  'data': {
    'id': 22,
    'profileName': '用户画像11',
    'userConditionJson': null,
    'userConditionSql': "SELECT count(DISTINCT sA.uid) as TOTAL FROM  (SELECT DISTINCT st.uid FROM stat_fin.agg_fin_user_order_freq_current st WHERE 1 = 1 AND first_buy_time > '2017-10-22' AND uid is not null ) sA",
    'status': 0,
    'userAmount': 0,
    'profilePoint': 'UID',
    'profileType': '无参数画像',
    'createType': 'SQL创建',
    'createdBy': 'admin',
    'copyBy': null,
    'createdTime': 1509379200000,
    'updatedTime': 1509465600000
  },
  'code': 0
}
