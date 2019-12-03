<template>
  <div id="app">
    <div class="header" v-if="$route.meta.menubar">
      <div class="logo">
        <img src="./assets/images/logo.png" />
      </div>
      <el-menu
        class="el-menu-demo navmenu"
        mode="horizontal"
        :default-active="curIndex"
        @select="handleMenu"
        
        text-color="#ffffff"
        background-color="#23A547"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/">收银</el-menu-item>
        <el-menu-item index="/appointment">预约</el-menu-item>
        <el-menu-item index="/project">项目定制</el-menu-item>
        <el-menu-item index="/employees">员工管理</el-menu-item>
        <el-menu-item index="/expcards">体验卡</el-menu-item>
        <el-menu-item index="/performance">财务</el-menu-item>
        <el-menu-item index="/customer">客户管理</el-menu-item>
        <el-menu-item index="/timelyinvent">库存</el-menu-item>
        <el-menu-item index="/statement">报表</el-menu-item>
        <el-menu-item index="/memo">水单号</el-menu-item>
        <el-menu-item index="/setting">设置</el-menu-item>
      </el-menu>
      <el-dropdown class="user" @command="handleCommand">
        <span class="el-dropdown-link">
          {{trueName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div
      class="container"
      v-if="$route.meta.menubar"
      :style="{'min-height': (virtualHeight-80)+'px'}"
    >
      <!-- <el-menu
        :default-active="$route.path"
        text-color="#66C56C"
        background-color="#ffffff"
        active-text-color="#101010"
        router
        class="aside"
        v-if="$route.meta.navbar"
      >
        <template v-for="(issue,index) in $router.options.routes">
          <template v-if="issue.name === $store.state.leftNavState">
            <template v-for="(item,index) in issue.children">
              <el-menu-item :index="item.path" @click="clicknav(item)">
                <span slot="title">{{item.meta.title}}</span>
              </el-menu-item>
            </template>
          </template>
        </template>
      </el-menu> -->
      <is-cope></is-cope>
      <div :class="$route.meta.navbar == false ? 'main' : 'main active'">
        <el-collapse-transition>
          <router-view />
        </el-collapse-transition>
      </div>
    </div>
    <!-- <div class="footer" v-if="$route.meta.menubar"></div> -->
    <router-view v-else="!$route.meta.menubar" />
  </div>
</template>

<script>
import Cope from "./components/Cope/Cope"
export default {
  data() {
    return {
      // 默认当前路由
      curIndex: "/",

      trueName: localStorage.getItem("trueName"),
      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  components: {
    "is-cope": Cope
  },
  created() {
    this.fetchNavData();
  },
  watch: {
    $route: "fetchNavData",
  },
  mounted() {
    this.defaultLeftNav();
  },
  methods: {
    // 主菜单
    fetchNavData() {
      var cur_path = this.$route.path;
      var routers = this.$router.options.routes;
      var nav_name = "";
      for (var i = 0; i < routers.length; i++) {
        var children = routers[i].children;
        if (children) {
          for (var j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              nav_name = routers[i].name;
              break;
            }
          }
        }
      }
      if (nav_name == "/") {
        this.curIndex = "/";
      } else {
        this.curIndex = cur_path;
      }
      this.$store.state.leftNavState = nav_name;
    },

    // 子菜单
    defaultLeftNav() {
      let cur_path = this.$route.path;
      let routers = this.$router.options.routes;
      console.log(routers[4].children);

      // for (let i = 0; i < routers.length; i++) {
      //   let children = routers[i].children;
      //   if (children) {
      //     for (let j = 0; j < children.length; j++) {
      //       if (children[j].path === cur_path) {
      //         break;
      //       }
      //     }
      //   }
      // }
    },
    //点击菜单事件
    clicknav(res) {
      console.log(res.path);
      console.log(this.$route.path);
      // if (res.path != "ExpCards") {
      //   this.$route.path = "/expcardslist"
      // }
    },

    // 主菜单点击
    handleMenu(index) {
      this.curIndex = index;
    },

    // 退出登录
    handleCommand(command) {
      this.$confirm("确认退出登录吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({ path: "/login" });
          localStorage.setItem("isLogin", false);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;

  .logo {
    margin: 0 40px;

    img {
      width: 200px;
      height: 60px;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.navmenu {
  flex: 1;

  &.el-menu--horizontal {
    border-bottom: none;
  }

  .el-menu-item.is-active {
    background-color: #66c56c !important;
  }

  .el-menu-item {
    line-height: 80px;
    height: 80px;
  }
}

.aside {
  .el-menu-item.is-active {
    background-color: #66c56c !important;
  }
}

.user {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 15px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 40px;
}
</style>
