// 防抖
export default {
  install (Vue) {
    Vue.directive('debounce', {
      inserted (el, binding) {
        el.addEventListener('click', () => {
          if (!el.disabled) {
            el.disabled = true
            setTimeout(() => {
              el.disabled = false
            }, binding.value || 1000)
          }
        })
      }
    })
  }
}