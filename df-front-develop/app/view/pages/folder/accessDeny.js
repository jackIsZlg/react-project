import base from '../../common/baseModule'

base.ajaxList.basic({
  type: 'GET',
  url: `${base.baseUrl}/favorite-content/info`
}, (d) => {
  console.log(d)
})

base.headerChange('white')
