import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
// 添加商品
const AddMerchandise = () => import( /* webpackChunkName: "OutWarehouse" */ '../views/Inventory/AddMerchandise.vue');
// 报表
const Statement = () => import( /* webpackChunkName: "Statement" */ '../views/Statement/Statement.vue');
// 水单号
const Memo = () => import( /* webpackChunkName: "Memo" */ '../views/Memo/Memo.vue');
// 设置
const Setting = () => import( /* webpackChunkName: "Setting" */ '../views/Setting/Setting.vue');
// 登录
const Login = () => import( /* webpackChunkName: "Login" */ '../views/Login/Login.vue');

// PageContent
const PageContent = () => import( /* webpackChunkName: "Login" */ '../components/PageContent/PageContent.vue');


const routes = [
  // 收银
  {
    path: '/',
    name: 'Money',
    component: Money,
    meta: {
      title: '收银',
      requiresAuth: true,
      menubar: true,
      navbar: false
    }
  },

  // 预约
  {
    path: '/appointment',
    name: 'appointment',
    component: Appointment,
    meta: {
      title: '预约',
      requiresAuth: true,
      menubar: true,
      navbar: false
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
      menubar: true,
      navbar: false
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
      menubar: true,
      navbar: false
    }
  },

  // 体验卡
  {
    path: '/experienceManage',
    name: 'experienceManage',
    component: PageContent,
    redirect: '/experienceManage/expcards',
    meta: {
      title: '体验卡',
      requiresAuth: true,
      menubar: true,
      navbar: true
    },
    children: [{
      path: '/experienceManage/expcards',
      name: 'ExpCards',
      component: ExpCards,
      meta: {
        title: '体验卡',
        requiresAuth: true,
        menubar: true,
        navbar: true
      }
    }, {
      path: '/experienceManage/expcardslist',
      name: 'ExpCardsList',
      component: ExpCardsList,
      meta: {
        title: '体验卡销售记录',
        requiresAuth: true,
        menubar: true,
        navbar: true
      }
    }]
  },

  // 查询
  {
    path: '/inquireManage',
    name: 'inquireManage',
    component: PageContent,
    redirect: '/inquireManage/performance',
    meta: {
      title: '财务',
      requiresAuth: true,
      menubar: true,
      navbar: true
    },
    children: [{
      // 业绩查询
      path: '/inquireManage/performance',
      name: 'Performance',
      component: Performance,
      meta: {
        title: '业绩查询',
        requiresAuth: true,
        menubar: true,
        navbar: true
      }
    }, {
      // 收益查询
      path: '/inquireManage/income',
      name: 'Income',
      component: Income,
      meta: {
        title: '收益查询',
        requiresAuth: true,
        menubar: true,
        navbar: true
      }
    },{
      // 退货搜索
      path: '/inquireManage/income',
      name: 'Income',
      component: Income,
      meta: {
        title: '收益查询',
        requiresAuth: true,
        menubar: true,
        navbar: true
      }
    }]
  },

  // 客户管理
  {
    path: '/customer',
    name: 'Customer',
    component: Customer,
    meta: {
      title: '客户管理',
      requiresAuth: true,
      menubar: true,
      navbar: false
    }
  },

  // 库存
  {
    path: '/stockManage',
    name: 'stockManage',
    component: PageContent,
    redirect: "/stockManage/timelyinvent",
    meta: {
      title: '查询',
      requiresAuth: true,
      menubar: true,
      navbar: true
    },
    children: [
      //即时库存
      {
        path: '/stockManage/timelyinvent',
        name: 'TimelyInvent',
        component: TimelyInvent,
        meta: {
          title: '即时库存',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      },
      //其他入库
      {
        path: '/stockManage/Otherwarehouse',
        name: 'OtherWarehouse',
        component: OtherWarehouse,
        meta: {
          title: '其他入库',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      },

      //添加入库采购
      {
        path: '/stockManage/addpurchase',
        name: 'AddPurchase',
        component: AddPurchase,
        meta: {
          title: '添加入库采购',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      },

      //添加出库采购
      {
        path: '/stockManage/addoutchase',
        name: 'AddOutChase',
        component: AddOutChase,
        meta: {
          title: '添加出库采购',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      },
      //报废
      {
        path: '/stockManage/outwarehouse',
        name: 'OutWarehouse',
        component: OutWarehouse,
        meta: {
          title: '报废',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      },
      //添加商品
      {
        path: '/stockManage/addmerchandise',
        name: 'AddMerchandise',
        component: AddMerchandise,
        meta: {
          title: '添加商品',
          requiresAuth: true,
          menubar: true,
          navbar: true
        }
      }
    ]
  },

  // 报表
  {
    path: '/statement',
    name: 'Statement',
    component: Statement,
    meta: {
      title: '报表',
      requiresAuth: true,
      menubar: true,
      navbar: false
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
      menubar: true,
      navbar: false
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
      menubar: true,
      navbar: false
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
  },

  // 404 redirect to home
  {
    path: '*',
    name: '404',
    component: Money,
    meta: {
      title: '收银',
      requiresAuth: true,
      menubar: true,
      navbar: false
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})

export default router
