import Vue from 'vue'
import VueRouter from 'vue-router'
import AMap from "amap";
Vue.use(VueRouter)
Vue.use(AMap);

// 收银 
const Money = () => import( /* webpackChunkName: "Money" */ '@/views/Money/Money.vue');
// 预约
const Appointment = () => import( /* webpackChunkName: "Appointment" */ '../views/Appointment/Appointment.vue');
// 项目定制
const Project = () => import( /* webpackChunkName: "Project" */ '../views/Project/Project.vue');
// 员工管理
const Employees = () => import( /* webpackChunkName: "Employees" */ '../views/Employees/Employees.vue');
// 体验卡卡片
const ExpCards = () => import( /* webpackChunkName: "ExpCars" */ '../views/ExpCards/ExpCards.vue');
// 体验卡卡片列表
const ExpCardsList = () => import( /* webpackChunkName: "Money" */ '../views/ExpCards/ExpCardsList.vue');
// 业绩查询 
const Performance = () => import( /* webpackChunkName: "Performance" */ '../views/Performance/Performance.vue');
// 收益查询
const Income = () => import( /* webpackChunkName: "Income" */ '../views/Income/Income.vue');
// 赠送管理
const Present = () => import( /* webpackChunkName: "Present" */ '../views/Present/Present.vue');
// 客户管理
const Customer = () => import( /* webpackChunkName: "Customer" */ '../views/Customer/Customer.vue');
// 即时库存
const TimelyInvent = () => import( /* webpackChunkName: "timelyinvent" */ '../views/Inventory/TimelyInvent.vue');
// 其他入库
const OtherWarehouse = () => import( /* webpackChunkName: "OtherWarehouse" */ '../views/Inventory/OtherWarehouse.vue');
// 添加入库采购
const AddPurchase = () => import( /* webpackChunkName: "AddPurchase" */ '../views/Inventory/AddPurchase.vue');
// 添加出库采购
const AddOutChase = () => import( /* webpackChunkName: "AddOutChase" */ '../views/Inventory/AddOutChase.vue');
// 报废
const OutWarehouse = () => import( /* webpackChunkName: "OutWarehouse" */ '../views/Inventory/OutWarehouse.vue');
// 报表
const Statement = () => import( /* webpackChunkName: "Statement" */ '../views/Statement/Statement.vue');
// 水单号
const Memo = () => import( /* webpackChunkName: "Memo" */ '../views/Memo/Memo.vue');
// 设置
const Setting = () => import( /* webpackChunkName: "Setting" */ '../views/Setting/Setting.vue');
// 登录
const Login = () => import( /* webpackChunkName: "Login" */ '../views/Login/Login.vue');

const routes = [
  // 收银
  {
    path: '/',
    name: 'Money',
    component: Money,
    meta: {
      title: '收银台',
      requiresAuth: true,
      menubar: true
    }
  },

  // 预约
  {
    path: '/appointment',
    name: 'Appointment',
    component: Appointment,
    meta: {
      title: '预约',
      requiresAuth: true,
      menubar: true
    }
  },

  // 项目定制
  {
    path: '/project',
    name: 'Project',
    component: Project,
    meta: {
      title: '项目定制',
      requiresAuth: true,
      menubar: true
    }
  },

  // 员工管理
  {
    path: '/employees',
    name: 'Employees',
    component: Employees,
    meta: {
      title: '员工管理',
      requiresAuth: true,
      menubar: true
    }
  },

  // 体验卡卡片
  {
    path: '/expcards',
    name: 'ExpCards',
    component: ExpCards,
    meta: {
      title: '体验卡卡片',
      requiresAuth: true,
      menubar: true
    }
  },

  // 体验卡列表
  {
    path: '/expcardslist',
    name: 'ExpCardsList',
    component: ExpCardsList,
    meta: {
      title: '体验卡列表',
      requiresAuth: true,
      menubar: true
    }
  },

  // 业绩查询
  {
    path: '/performance',
    name: 'Performance',
    component: Performance,
    meta: {
      title: '业绩查询',
      requiresAuth: true,
      menubar: true
    }
  },

  // 收益查询
  {
    path: '/income',
    name: 'Income',
    component: Income,
    meta: {
      title: '收益查询',
      requiresAuth: true,
      menubar: true
    }
  },

  // 赠送管理
  {
    path: '/present',
    name: 'Present',
    component: Present,
    meta: {
      title: '赠送管理',
      requiresAuth: true,
      menubar: true
    }
  },

  // 客户管理
  {
    path: '/customer',
    name: 'Customer',
    component: Customer,
    meta: {
      title: '客户管理',
      requiresAuth: true,
      menubar: true
    }
  },

  //即时库存
  {
    path: '/timelyinvent',
    name: 'TimelyInvent',
    component: TimelyInvent,
    meta: {
      title: '即时库存',
      requiresAuth: true,
      menubar: true
    }
  },

  //其他入库
  {
    path: '/Otherwarehouse',
    name: 'OtherWarehouse',
    component: OtherWarehouse,
    meta: {
      title: '其他入库',
      requiresAuth: true,
      menubar: true
    }
  },

  //添加入库采购
  {
    path: '/addpurchase',
    name: 'AddPurchase',
    component: AddPurchase,
    meta: {
      title: '添加入库采购',
      requiresAuth: true,
      menubar: true
    }
  },

  //添加出库采购
  {
    path: '/addoutchase',
    name: 'AddOutChase',
    component: AddOutChase,
    meta: {
      title: '添加出库采购',
      requiresAuth: true,
      menubar: true
    }
  },

  //报废
  {
    path: '/outwarehouse',
    name: 'OutWarehouse',
    component: OutWarehouse,
    meta: {
      title: '报废',
      requiresAuth: true,
      menubar: true
    }
  },

  // 报表
  {
    path: '/statement',
    name: 'Statement',
    component: Statement,
    meta: {
      title: '报表',
      requiresAuth: true,
      menubar: true
    }
  },

  // 水单号
  {
    path: '/memo',
    name: 'Memo',
    component: Memo,
    meta: {
      title: '水单号',
      requiresAuth: true,
      menubar: true
    }
  },

  // 设置
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {
      title: '设置',
      requiresAuth: true,
      menubar: true
    }
  },

  // 登录
  {
    path: '/login',
    name: "Login",
    component: Login,
    meta: {
      title: '登录'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  externals
})


export default router
