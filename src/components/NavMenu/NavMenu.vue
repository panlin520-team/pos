<!--  -->
<template>
  <el-menu
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
          <el-menu-item :index="item.path" :key="item.path">
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </template>
  </el-menu>
</template>

<script>
//import XX from '';
export default {
  name: "XXX",
  components: {},
  data() {
    return {
      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.defaultLeftNav();
  },
  computed: {},
  watch: {},
  methods: {
    // 子菜单
    defaultLeftNav() {
      let cur_path = this.$route.path;
      let routers = this.$router.options.routes;
      for (let i = 0; i < routers.length; i++) {
        let children = routers[i].children;
        if (children) {
          for (let j = 0; j < children.length; j++) {
            if (children[j].path === cur_path) {
              break;
            }
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.aside {
  .el-menu-item {
    height: 40px;
    line-height: 40px;

    &.is-active {
      background-color: #66c56c !important;
    }
  }
}
</style>
