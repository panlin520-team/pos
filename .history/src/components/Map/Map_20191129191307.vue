<template>
  <div class="amap-page-container">
    <div :style="{width:'100%',height:'300px'}">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
      </el-amap>
    </div>


    <div class="toolbar">
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
      <span v-else>正在定位</span>
    </div>
    <div
      v-on:click="req_post()"
    >
      查询周边
    </div>
  </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" sc>

</style>