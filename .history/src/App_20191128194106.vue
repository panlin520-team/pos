<template>
  <div id="app">
    <div class="header" v-if="$route.meta.menubar"></div>
    <div class="container" :style="" v-if="$route.meta.menubar">
      <div class="aside"></div>
      <div class="main">
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
export default {
  data() {
    return {
      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
