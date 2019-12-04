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
      <el-button type="success">查看子公司产品池</el-button>
    </div>
    <div class="merchantList">
      <el-table :data="storageList">
        <el-table-column label="商品名称" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品编号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="modiforder(scope.row)">操作</el-button>
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
      storageList: [
        {
          receivedNumber: "3214342342",
          name: "王小虎",
          receivedNumber: "23",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          receivedNumber: "3214342342",
          name: "王小虎",
          receivedNumber: "23",
          address: "上海市普陀区金沙江路 1518 弄"
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
  methods: {
    //操作
    modiforder(res) {}
  },
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
    padding-top: 40px;
    margin-bottom: 30px;

    .el-select {
      margin-left: 70px;
    }
    .el-button{
        margin-left: 50px;
    }
  }
  .merchantList {
    width: 100%;
    height: 100%;
    .el-table {
      width: 90%;
      margin: 0 auto;
      border-radius: 6px;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    }
  }
}
</style>
