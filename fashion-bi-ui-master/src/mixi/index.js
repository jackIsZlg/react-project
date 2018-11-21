import Vue from 'vue'
import propertyMothods from './common-ui'
import $axios from './$axios'
import filters from './filters'
import components from '../components/'
import './v-loading'
for (const key in propertyMothods) {
  if (propertyMothods.hasOwnProperty(key)) {
    Vue.prototype['$' + key] = propertyMothods[key]
  }
}
Vue.mixin({
  filters,
  components: { ...components }
})

Vue.prototype.$axios = $axios
