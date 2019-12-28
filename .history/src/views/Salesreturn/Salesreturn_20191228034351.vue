<!-- 店铺设置 -->

<template>
  <div class="Salesreturn">
    <div class="SalesreTop">
      <div class="searchBoxs"></div>
      <div class="searchBoxs"></div>
      <div class="searchBoxs"></div>
    </div>
    <div class="salereBottom" :style="{'height': (virtualHeight-213)+'px'}">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="卡号">
          <template slot-scope="scope">
            <span>{{ scope.row.memberNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="星级">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.membershipLevelName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" ty @click="vipexamine(scope.row)">退货</el-button>
          </template>
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
      virtualHeight: window.innerHeight,
      //退货列表
      tableData: [
        {
          memberNum: "2016-05-02",
          name: "王小虎",
          mobile: "213411412",
          membershipLevelName: "上海市普陀区金沙江路 1518 弄"
        },
        {
          memberNum: "2016-05-02",
          name: "王小虎",
          mobile: "213411412",
          membershipLevelName: "上海市普陀区金沙江路 1518 弄"
        },
        {
          memberNum: "2016-05-02",
          name: "王小虎",
          mobile: "213411412",
          membershipLevelName: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },

  computed: {},
  watch: {},
  methods: {
    //退货操作
    vipexamine(res) {
      console.log(res);
    }
  }
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
