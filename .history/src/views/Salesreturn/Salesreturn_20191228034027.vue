<!-- 店铺设置 -->

<template>
  <div class="Salesreturn">
    <div class="SalesreTop">
      <div class="searchBoxs"></div>
      <div class="searchBoxs"></div>
      <div class="searchBoxs"></div>
    </div>
    <div class="salereBottom" :style="{'height': (virtualHeight-213)+'px'}">
         <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      //浏览器高度
      virtualHeight: window.innerHeight
    };
  },

  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang='scss' scoped>
.Salesreturn {
  width: 100%;
  height: 100%;
  .SalesreTop {
    width: 100%;
    height: 115px;
    border: 1px solid red;
    margin-left: 2px;
    display: flex;
    .searchBoxs {
      width: 300px;
      height: 50px;
      border: 1px solid red;
      margin: 30px;
    }
  }
  .salereBottom {
    width: 100%;
    border: 1px solid red;
    padding: 0 20px;
  }
}
</style>
