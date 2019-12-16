// 防抖
// export default {
//   install (Vue) {
//     Vue.directive('debounce', {
//       inserted (el, binding) {
//         el.addEventListener('click', () => {
//           if (!el.disabled) {
//             el.disabled = true
//             setTimeout(() => {
//               el.disabled = false
//             }, binding.value || 1000)
//           }
//         })
//       }
//     })
//   }
// }

export function debounce (fn, delay) {
  let timer = null
  return function () {
      let arg = arguments
      
      clearTimeout(timer)
      
      timer = setTimeout(() => {
          fn.apply(this, arg)
      }, delay)
  }
