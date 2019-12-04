<!-- 定制-->
<template>
  <div class="AddMerchandise">
    <h1>添加商品</h1>
    <div class="merchantitle">
      <el-select v-model="value_project" placeholder="请选择">
        <el-option
          v-for="item in option_project"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="value_online" placeholder="请选择">
        <el-option
          v-for="item in option_online"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="merchantList">
      <el-table :data="storageList" style="width: 100%">
              <el-table-column label="商品名称" width="300">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
                </template>
              </el-table-column>
              <el-table-column label="有效日期">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.repervalidity }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="modiforder(scope.row,scope.$index)">修改</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteorder(scope.row,scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
    </div>
    <!-- <MemberFrame></MemberFrame> -->
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  name: "AddMerchandise",
  components: { MemberFrame },

  data() {
    return {
      //产品列表
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      //产品类型
      option_project: [
        {
          value: "1",
          label: "产品"
        },
        {
          value: "2",
          label: "服务"
        }
      ],
      value_project: "",
      //线上线下
      option_online: [
        {
          value: "1",
          label: "线上"
        },
        {
          value: "2",
          label: "线下"
        }
      ],
      value_online: ""
    };
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
  .merchantitle {
    width: 100%;
    height: 100px;
    line-height: 100px;
    .el-select {
      margin-left: 20px;
    }
  }
  .merchantList {
    width: 100%;
    height: 100%;
    border: 1px solid red;
    .el-table{
        width: 90%;
        height: 100%;
        border: 1px solid red;
        margin: 0 auto;
    }
  }
}
</style>
