<!-- 菜单 -->
<template>
  <el-menu
    class="el-menu-demo navmenu"
    mode="horizontal"
    :default-active="curIndex"
    text-color="#ffffff"
    background-color="#23A547"
    active-text-color="#ffffff"
    router
    @select="handleMenu"
  >
    <el-menu-item index="/">收银</el-menu-item>
    <el-menu-item index="/appointment">预约</el-menu-item>
    <el-menu-item index="/project">项目定制</el-menu-item>
    <el-menu-item index="/employees">员工管理</el-menu-item>
    <el-menu-item index="/experienceManage">体验卡</el-menu-item>
    <el-menu-item index="/inquireManage">财务</el-menu-item>
    <el-menu-item index="/customer">客户管理</el-menu-item>
    <el-menu-item index="/stockManage">库存</el-menu-item>
    <el-menu-item index="/statement">报表</el-menu-item>
    <el-menu-item index="/memo">水单号</el-menu-item>
    <el-menu-item index="/setting">设置</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "MenuBar",
  data() {
    return {
      // 默认当前路由
      curIndex: "/"
    };
  },
  watch: {
    $route: "fetchNavData"
  },
  created() {
    this.fetchNavData();
  },
  destroyed() {},
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
        } else {
          var splitPath = cur_path.split("/");
          nav_name = splitPath[1];
        }
      }
      this.$store.state.leftNavState = nav_name;
      if (nav_name == "") {
        this.curIndex = "/";
      } else {
        this.curIndex = "/" + this.$store.state.leftNavState;
      }
    },
    // 主菜单点击
    handleMenu(index) {
      this.$store.state.leftNavState = index;
      this.curIndex = "/" + this.$store.state.leftNavState;
    }
  }
};
</script>

<style lang='scss' scoped>
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
</style>
