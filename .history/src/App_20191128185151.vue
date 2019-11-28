<template>
  <div id="app">
    <div class="header" v-if="$route.meta.menubar"></div>
    <div class="container" v-if="$route.meta.menubar">
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
export default


</script>
<style lang="scss" scoped>
</style>
