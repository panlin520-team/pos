<!-- 赠送管理 -->
<template>
  <div class="Present">
    <h1>赠送管理</h1>
    <div id="container" style=" width: 100%;height: 100%;border:1px solid red;"></div>
  <VueAMap></VueAMap>
  </div>
</template>
<!-- 
<script src="https://webapi.amap.com/maps?v=1.4.15&key=3a0220bd39558a75550c3b0e48727ef8"></script>
 -->

<script>
import VueAMap from '@/com'
import VueAMap from "@/components/Map/MemberFrame";

export default {
  components: {VueAMap,},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init: function() {
      console.log(123);
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.Present {
  width: 100%;
  height: 100%;
  // #container {
  //   width: 1000px;
  //   height: 600px;
  //   border: 1px solid red;
  //   margin: 100px;
  // }
}
</style>
