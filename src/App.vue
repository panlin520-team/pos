<template>
  <div id="app">
    <div class="header" v-if="$route.meta.menubar"></div>
    <div class="container">
      <div class="aside" v-if="$route.meta.menubar"></div>
      <div class="main">
        <el-collapse-transition>
          <router-view />
        </el-collapse-transition>
      </div>
    </div>
    <div class="footer" v-if="$route.meta.menubar"></div>
    <router-view v-else="!$route.meta.menubar" />
  </div>
</template>

<style lang="scss" scoped>
</style>
