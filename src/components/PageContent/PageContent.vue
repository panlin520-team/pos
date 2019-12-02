<!-- 页面内容区 -->
<template>
  <el-collapse-transition>
    <router-view />
  </el-collapse-transition>
</template>

<script>
import NavMenu from "@/components/NavMenu/NavMenu.vue";
export default {
  name: "Page",
  components: { NavMenu },
  data() {
    return {};
  },
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
