/**
 * 根 reducer
 */
import routerReducer from './routerReducer'
import user from '../page/user/user'
import cost from '../page/backend/marketing/cost/cost'
import business from '../page/backend/general/business'
import system from '../page/backend/filter/system/system'
import info from '../page/backend/marketing/info/info'
import compare from '../page/backend/filter/compare/compare'
import add from '../page/backend/filter/compare/add/add'
import quota from '../page/backend/filter/quota/quota'
import quotaAdd from '../page/backend/filter/quota/add/quotaAdd'
import filter from '../page/filter/filter'
import activity from '../page/marketing/reducer'
import infolist from '../page/common/infolist/infolist'

export default {
  infolist,
  user,
  cost,
  business,
  system,
  info,
  filter,
  activity,
  compare,
  add,
  quota,
  quotaAdd,
  routing: routerReducer
}
