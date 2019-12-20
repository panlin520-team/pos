<!-- 即时库存 -->
<template>
  <div class="addpurchase">
    <!-- 搜索 -->
    <div class="invenTitle">
      <h1>即时库存</h1>
      <div class="ordersearch">
        <label>商品名称：</label>
        <el-input v-model="inputorder" placeholder="请输入要查询的商品"></el-input>
        <span @click="seekinvtey" v-on:keyup.13.native="submit">
          <i class="el-icon-search"></i>
        </span>
      </div>
    </div>
    <div class="clienList">
      <el-table :data="tableData_enterpurchase" style="width: 100%">
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.number }}</div>
          </template>
        </el-table-column>
        <el-table-column label="批号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.batchNumber }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging">
      <div class="pagingbanner">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            @next-click="nextclick"
            @prev-click="prevclick"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="pagetotal"
          ></el-pagination>
        </div>
      </div>
    </div>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
//import XX from '';
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: { MemberFrame },
  data() {
    return {
      pageSize: 10,
      pagetotal: 0,
      //客户数据
      tableData_enterpurchase: [],
      //采购订单搜索
      inputorder: "",
      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //分页
      //当前页数
      currentPage1: 0
    };
  },
  computed: {},
  watch: {},
  methods: {
    //点击即时库存搜索
    seekinvtey() {
      //搜索接口
      this.seekjustinventry(); 
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.justinventory();
    },
    nextclick() {},
    prevclick() {}, 
    //即时库存列表
    justinventory() {
      var url = this.$https.productHost + "/stock/selectStockProductList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.pagetotal = res.data.result.total;
          } else {
            this.pagetotal1
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
          this.tableData_enterpurchase = res.data.result.list;
        })
        .catch(err => {});
    },
    //即时库存搜索
    seekjustinventry() {
      var url =
        this.$https.productHost + "/stock/selectStockProductListByProductName";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize,
        productName: this.inputorder
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Success") {
            this.tableData_enterpurchase = res.data.result.list;
            this.pagetotal = res.data.result.total;
          } else {
            this.pagetotal = 0;
            this.tableData_enterpurchase = [];
            this.$message({
              type: "error",
              message: res.data.responseStatusType.error.errorMsg
            });
          }
        })
        .catch(err => {});
    },
    submit() {
      this.seekinvtey();
    }
  },
  created() {
    var _this = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 13) {
        _this.submit();
      }
    };
    //即时库存列表
    this.justinventory();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.addpurchase {
  width: 100%;
  height: 100%;
  .invenTitle {
    width: 100%;
    height: 150px;
    // border-bottom: 1px solid #f6f6f6;
    position: relative;

    display: flex;
    h1 {
      padding-top: 35px;
      margin-left: 20px;
    }
    .el-select {
      font-size: 40px;
    }
    .block {
      margin: 0 auto;
    }
    .ordersearch {
      width: 600px;
      height: 44px;
      display: flex;
      margin-top: 60px;
      margin-left: 240px;
      position: relative;
      label {
        width: 110px;
        color: #333333;
        line-height: 44px;
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
      }
      .el-input {
        border-radius: 6px;
        border: 2px solid #feb019;
      }
      span {
        width: 65px;
        height: 35px;
        padding-top: 9px;
        text-align: center;
        position: absolute;
        background-color: #feb019;
        border-radius: 0 4px 4px 0;
        right: 0;
        i {
          color: #fff;
          font-size: 25px;
        }
      }
    }
    .invbtn {
      padding-right: 40px;
      position: absolute;
      right: 100px;
      padding-top: 35px;
      .el-button {
        width: 100px;
        font-size: 16px;
      }
    }
  }
  .clienList {
    width: 80%;
    margin: auto;
    border-radius: 6px;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    overflow: auto;
    padding: 10px 50px 20px 50px;
  }
  .paging {
    width: 100%;
    height: 100px;
    margin-top: 20px;
    line-height: 60px;
    text-align: center;
    .pagingbanner {
      .block {
        margin-top: 20px;
      }
    }
  }
  //入库
  .warehousing {
    width: 100%;
    height: 100%;
    padding: 20px 100px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #fff;
    .wareTitle {
      width: 100%;
      height: 90px;
      line-height: 110px;
      padding: 0 20px;
      display: flex;
      h2 {
        margin: 0 auto;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .wareBottom {
      width: 100%;
      height: 100%;
      display: flex;

      .wareBright {
        flex: 1;
        position: relative;
        .warebrTitles {
          width: 100%;
          height: 60px;
          display: flex;
          font-size: 20px;
          line-height: 70px;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid rgba(220, 220, 220, 0.3);
        }
        .warenavigation {
          position: absolute;
          text-align: center;
          width: 100%;
          bottom: 150px;
        }
      }
      .wareLists {
        box-shadow: 20px;
        border: 1px solid rgba(220, 220, 220, 0.7);
      }
      .waresubmit {
        position: absolute;
        bottom: 220px;
        right: 100px;
        padding: 10px;
      }
    }
  }
}
//出入库弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 16px;
  }
  .stgblcktopmain {
    padding: 35px 0 0 40px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .el-input {
      width: 215px;
      border: 1px solid rgb(184, 178, 178);
      border-radius: 5px;
    }
    .seekprbox {
      width: 215px;
      height: 80px;
      overflow: auto;
      border: 1px solid rgb(184, 178, 178);
      li {
        width: 100%;
        height: 16px;
      }
    }
    .block {
      background-color: #ada3a3;
      width: 215px;
      border-radius: 5px;
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
