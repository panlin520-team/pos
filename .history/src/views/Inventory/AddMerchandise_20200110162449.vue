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
                <template slot-scope="scope">{{ scope.row.productCode }}</template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称">
                <template slot-scope="scope">{{ scope.row.productName }}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <!-- <div class="block">
            <el-pagination
              @size-change="handleSizeChangeout"
              @current-change="handleCurrentChangeout"
              :current-page.sync="currentPage1"
              :page-size="pagesize"
              background
              layout="total, prev, pager, next"
              :total="pagetotal"
            ></el-pagination>
          </div>-->
        </div>
      </PopOver>
    </div>
    <div class="merchantList">
      <el-table :data="storageList">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="success" @click="showpoject(scope.row)">查看</el-button> -->
            <el-button size="mini" type="warning" @click="showsoldOut(scope.row)">{{btnText}}</el-button>
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

    <MemberFrame></MemberFrame>
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
      tableDataout: [],
      multipleSelection: [],
      //外面产品列表
      storageList: [],
      //弹出框
      visible_examine: false,
      flag: true,
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
      //里面类
      value_somepojiet: "1",

      //外面翻页
      currentPage2: 1,
      pagesize2: 10,
      pagetotal2: 0,
      //当前商品productCode
      productCode: "",
      //线上线下
      value_online2: "2",
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
          label: "上架"
        },
        {
          value: "2",
          label: "下架"
        }
      ],
      value_online: "1",
      //新数组
      multiplelist: [],
      //下架
      btnText: "下架"
    };
  },
  computed: {},
  watch: {},
  methods: {
    //点击选择商品
    showchans() {
      this.commoditysideData();
      this.value_somepojiet = "";
      console.log(this.value_somepojiet);

      this.visible_examine = true;
    },
    closePopOver() {
      this.visible_examine = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //外面翻页
    handleSizeChangeside(val) {
      setTimeout(() => {
        this.commodityoutData();
      }, 300);
    },
    handleCurrentChangeside(val) {
      setTimeout(() => {
        this.commodityoutData();
      }, 300);
    },
    //选中外面类
    selectpoject() {
      this.commodityoutData();
    },
    //选中线上线下
    selectwire() {
      this.flag = !this.flag;
      if (this.flag == true) {
        this.btnText = "下架";
      } else if (this.flag == false) {
        this.btnText = "上架";
      }
      if (this.value_online == 1) {
        this.value_online2 = 2;
      } else {
        this.value_online2 = 1;
      }
      this.commodityoutData();
    },
    //选中里面类
    selectsomepejet() {
      this.commoditysideData();
      console.log(this.value_somepojiet);
    },
    //查看
    showpoject() {},
    //下架
    showsoldOut(res) {
      this.productCode = res.productCode;
      this.$confirm("您确定此操作？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "已成功!"
          });
          this.soldOut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //提取选中商品
    extractchans() {
      this.multiplelist = [];
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach(value => {
          this.multiplelist.push(value.productCode);
        });
        //获取选中商品
        this.extractData();
      } else {
        this.$message({
          message: "请选择商品",
          type: "warning"
        });
      }
    },
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
          if (res.data.result !== null) {
            this.storageList = res.data.result.list;
            this.pagetotal2 = res.data.result.total;
            this.pagesize2 = res.data.result.size;
          } else {
            this.storageList = [];
            this.pagetotal2 = 0;
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //下架
    soldOut() {
      var url = this.$https.productHost + "/manage/product/onOffSale";
      var params = {
        companyId: localStorage.getItem("storeId"),
        productCode: this.productCode,
        productStatus: this.value_online2,
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Success") {
            this.commodityoutData();
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
    commoditysideData() {
      var url =
        this.$https.productHost + "/manage/product/selectProductListNoPage";
      var params = {
        companyId: localStorage.getItem("storeId"),
        type: this.value_somepojiet,
        productStatus: 1,
        status: 1,
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
            this.tableDataout = res.data.result;
          } else {
            this.tableDataout = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //提交商品
    extractData() {
      var url = this.$https.productHost + "/manage/product/addProductStore";
      var params = {
        storeId: localStorage.getItem("storeId"),
        productCode: JSON.stringify(this.multiplelist),
        type: this.value_somepojiet
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result == null) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.visible_examine = false;
            // location.reload();
            this.commodityoutData();
          } else {
            this.$message({
              message:
                "提取成功！但是以下商品已经存在无法提取" +
                JSON.stringify(res.data.result),
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
  h1 {
    padding: 50px 0 0 50px;
  }
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
      height: 300px;
      overflow: auto;
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
