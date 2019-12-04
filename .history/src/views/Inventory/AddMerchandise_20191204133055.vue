<!-- 定制-->
<template>
  <div class="AddMerchandise">
    <h1>添加商品</h1>
    <div class="merchantitle">
      <el-select v-model="value_project" @change="selectpoject" placeholder="请选择">
        <el-option
          v-for="item in option_project"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="value_online" @change="selectwire" placeholder="请选择">
        <el-option
          v-for="item in option_online"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="success" @click="showchans">查看子公司产品池</el-button>
      <PopOver
        custom-class="storageblock"
        :visible.sync="visible_examine"
        @close="closePopOver"
        width="800px"
      >
        <div class="stgblcktop" slot="top">选择产品</div>
        <div class="stgblcktopmain" slot="main">
          <el-select v-model="value_somepojiet" @change="selectsomepejet" placeholder="请选择">
            <el-option
              v-for="item in option_somepojiet"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="success" @click="extractchans">提取选中商品</el-button>

          <div class="merchansomelist">
            <el-table
              ref="multipleTable"
              :data="tableDataout"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column label="商品编码">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChangeout"
              @current-change="handleCurrentChangeout"
              :current-page.sync="currentPage1"
              :page-size="pagesize"
              background
              layout="total, prev, pager, next"
              :total="pagetotal"
            ></el-pagination>
          </div>
        </div>
      </PopOver>
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
      <div class="block">
        <el-pagination
          @size-change="handleSizeChangeside"
          @current-change="handleCurrentChangeside"
          :current-page.sync="currentPage2"
          :page-size="pagesize2"
          background
          layout="total, prev, pager, next"
          :total="pagetotal2"
        ></el-pagination>
      </div>
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
      //里面产品列表
      tableDataout: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: [],
      //外面产品列表
      storageList: [],
      //弹出框
      visible_examine: false,
      //里面产品类型
      option_somepojiet: [
        {
          value: "1",
          label: "产品"
        },
        {
          value: "2",
          label: "服务"
        }
      ],
      //里面翻页
      currentPage1: 1,
      value_somepojiet: "",

      //里面页数
      pagesize: 10,
      pagetotal: 50,
      //外面翻页
      currentPage2: 1,
      pagesize2: 10,
      pagetotal2: 50,
      //外面产品类型
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
      value_project: "1",
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
      value_online: "1"
    };
  },
  computed: {},
  watch: {},
  methods: {
    //操作
    modiforder(res) {},
    //点击选择商品
    showchans() {
      this.visible_examine = true;
    },
    closePopOver() {
      this.visible_examine = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    //里面翻页
    handleSizeChangeout(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChangeout(val) {
      console.log(`当前页: ${val}`);
    },
    //外面翻页
    handleSizeChangeside(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChangeside(val) {
      console.log(`当前页: ${val}`);
    },
    //选中类
    selectpoject() {
      this.commodityoutData();
    },
    //选中线上线下
    selectwire() {
      this.commodityoutData();
    },
    //选中里面类
    selectsomepejet() {
      this.commodityoutData();
    },
    //提取选中商品
    extractchans() {},
    //获取外面商品数据
    commodityoutData() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        companyId: localStorage.getItem("storeId"),
        page: this.currentPage2,
        limit: this.pagesize2,
        type: this.value_project,
        productStatus: this.value_online,
        keyWord: "",
        companyType: 3,
        isHoutai: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res) {
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //获取里面商品数据
    commodityoutData() {
      var url =
        this.$https.productHost + "/manage/product/selectProductListNoPage";
      var params = {
        companyId: localStorage.getItem("storeId"),
        page: this.currentPage2,
        limit: this.pagesize2,
        type: this.value_project,
        productStatus: this.value_online,
        keyWord: "",
        status: 1,
        companyType: 3,
        isHoutai: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res) {
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    }
  },
  created() {},
  mounted() {
    this.commodityoutData();
  }
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
    .el-button {
      margin-left: 50px;
    }
  }
  .merchantList {
    width: 100%;
    height: 100%;
    .block {
      text-align: center;
      margin-top: 20px;
    }
    .el-table {
      width: 90%;
      margin: 0 auto;
      border-radius: 6px;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    }
  }
}
//出入库弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding-top: 10px;
  }
  .stgblcktopmain {
    padding: 15px 0 0 20px;
    height: 100%;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .merchansomelist {
      width: 100%;
      height: 100%;
      margin-top: 15px;
    }
    .el-button {
      margin-left: 30px;
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
