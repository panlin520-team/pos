<!-- 定制-->
<template>
  <div class="AddMerchandise">
    <h1>添加商品</h1>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  name: "AddMerchandise",
  components: { MemberFrame },

  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang='scss'>
.AddMerchandise {
  width: 100%;
  height: 100%;
}
</style>
