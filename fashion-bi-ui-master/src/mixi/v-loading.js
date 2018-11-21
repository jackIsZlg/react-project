import Vue from 'vue'
import Loading from './loading.vue'
const Mask = Vue.extend(Loading)
function toggleLoading (el, binding) {
  if (binding.value) {
    el.appendChild(el.mask)
  } else {
    el.removeChild(el.mask)
  }
}
Vue.directive('loading', {
  bind: function (el, binding, vnode) {
    const textExr = el.getAttribute('element-loading-text')
    const backgroundExr = el.getAttribute('element-loading-background')
    const customClassExr = el.getAttribute('element-loading-custom-class')
    const vm = vnode.context
    const mask = new Mask({
      el: document.createElement('div'),
      data: {
        text: (vm && vm[textExr]) || textExr,
        background: (vm && vm[backgroundExr]) || backgroundExr,
        customClass: (vm && vm[customClassExr]) || customClassExr
      }
    })
    el.instance = mask
    el.mask = mask.$el
    el.maskStyle = {}

    binding.value && toggleLoading(el, binding)
  },

  update: function (el, binding) {
    el.instance.setText(el.getAttribute('element-loading-text'))
    if (binding.oldValue !== binding.value) {
      toggleLoading(el, binding)
    }
  },

  unbind: function (el, binding) {
    if (el.domInserted) {
      el.mask &&
        el.mask.parentNode &&
        el.mask.parentNode.removeChild(el.mask)
      toggleLoading(el, { value: false, modifiers: binding.modifiers })
    }
  }
})
