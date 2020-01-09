import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading

function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    text: "请稍候...",
    target: document.querySelector('.loading-area') //设置加载动画区域
  });
}

function endLoading() {
  loading.close();
}

// 声明对象用于存储请求个数
let needLoadingRequestCount = 0

// 打开请求loading
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};

// 关闭请求loading
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// 请求地址
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
console.log(axios.defaults.baseURL)
// 请求头            
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 响应时长10秒
axios.defaults.timeout = 10000;

// 请求地址与端口
const authHost = process.env.VUE_APP_BASE_API + ":83";
const accountHost = process.env.VUE_APP_BASE_API + ":82";
const storeHost = process.env.VUE_APP_BASE_API + ":86";
const walletHost = process.env.VUE_APP_BASE_API + ":89";
const orderHost = process.env.VUE_APP_BASE_API + ":85";
const productHost = process.env.VUE_APP_BASE_API + ":84";
const dataHost = process.env.VUE_APP_BASE_API + ":88";
const payHost = process.env.VUE_APP_BASE_API + ":90";
const systemHost = process.env.VUE_APP_BASE_API + ":91";

// 请求拦截器
axios.interceptors.request.use((config) => {
  showFullScreenLoading();
  // POST传参序列化
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  tryHideFullScreenLoading();
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use((res) => {
  tryHideFullScreenLoading();
  if (!res.data.success) {
    return Promise.resolve(res);
  }
  return res;
}, (error) => {
  tryHideFullScreenLoading();
  // 相应错误状态信息报告
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:
        error.message = '未授权，请重新登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器内部错误'
        break
      case 501:
        error.message = '服务未实现'
        break
      case 502:
        error.message = '网关错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网关超时'
        break
      case 505:
        error.message = 'HTTP版本不受支持'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = '网络出现问题，请稍后再试'
  }
  return Promise.reject(error.message);
});

// get请求封装
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: param
      })
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// post请求封装
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 导出
export default {
  fetchPost,
  fetchGet,
  authHost,
  accountHost,
  storeHost,
  walletHost,
  orderHost,
  productHost,
  dataHost,
  payHost,
  systemHost
}
