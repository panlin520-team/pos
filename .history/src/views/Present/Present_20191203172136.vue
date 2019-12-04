<!-- 赠送管理 -->
<template>
  <div class="Present">
    <h1>赠送管理</h1>
    <div id="container" style=" width: 100%;height: 100%;border:1px solid red;"></div>

  <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: {MemberFrame},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init: function() {
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
