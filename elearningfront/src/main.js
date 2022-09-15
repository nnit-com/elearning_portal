/**
 * 项目的入口文件它执行的时候都是从你的 main.js 从上到下的执行的
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUi from 'element-ui'
import {Message} from 'element-ui'
import {Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import VCharts from 'v-charts'
import 'v-charts/lib/pie.common'
import Vuex from 'vuex'
import locale from 'element-ui/lib/locale/lang/en'
import 'polyfill-array-includes'

Vue.use(VCharts)
Vue.use(ElementUi, {locale})
Vue.use(Vuex)

let client_url_host = 'http://'+window.location.host+'/pc';
let server_url_host = 'http://'+window.location.hostname+':8088';

//Vue.prototype.socketpath="http://localhost:5200",
Vue.prototype.basePath=server_url_host;
//引包http://192.168.0.22:999
import axios from 'axios'

//根目录
axios.defaults.baseURL = server_url_host;

if(localStorage.getItem("loginid") == null || localStorage.getItem("token") == null){
    if(window.location.href != client_url_host+'/#/Login'){
        window.location.href = client_url_host+'/#/Login'
    }
}

/**
 * 封装axios方法
 * @param options
 */
let futureAxios = (options)=>{
    //options.data.token=sessionStorage.getItem("token");
    //options.data.loginid=sessionStorage.getItem("loginid");
    axios({
      url:options.url,
      method:options.method || 'POST',  //默认post方法
      data:options.data,
      params:options.params,
        headers: {
            'token': localStorage.getItem("token"),
            'loginid': localStorage.getItem("loginid"),
        }
    }).then(result=>{
        if(options.success){
         if(result.data.code == 403){
             window.location.href=client_url_host+'/#/Login'
         }else{
             options.success(result.data)//请求成功，返回数据
         }


      }
    }).catch(err=>{
        let msg = err.response ? err.response.data : 'The request exception'
        if (options.error) {
            options.error(msg)
            Message.error({message: msg, offset: 150});
        } else {
            Message.error({message: msg, offset: 150});
        }
    })
}

/**
 * //封装axios方法,为不需要登录操作时使用
 * @param options 配置
 */
let Axios=(options)=>{
    axios({
        url:options.url,
        method:options.method||'POST',
        data: options.data,
        params: options.params
    }).then(result=>{
        if (options.success)  options.success(result.data)
    }).catch(err=>{
        let msg = err.response ? err.response.data:'The request exception'
        if (options.error){
            options.error(msg)
            Message.error({message: msg, offset: 150});
        }else {
            Message.error({message: msg, offset: 150});
        }
    })
}

//需要添加拦截器的
Vue.prototype.$axiosjwt = futureAxios
//不拦截的(不带token)往往用在vue创建前的生命周期中
Vue.prototype.$Axios = Axios

Vue.config.productionTip = false

window.vm  = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.openLoading = function() {
    const loading = this.$loading({           // 声明一个loading对象
      lock: true,                             // 是否锁屏
      text: 'loading...',                     // 加载动画的文字
      spinner: 'el-icon-loading',             // 引入的loading图标
      background: 'rgba(0, 0, 0, 0.3)',       // 背景颜色
      target: '.sub-main',                    // 需要遮罩的区域
      body: true,                              
      customClass: 'mask'                     // 遮罩层新增类名
    })
    setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
      loading.close();                        // 关闭遮罩层
    },60000)
    return loading;
  }
