<template>
  <div class="statement">
    <!-- 财务中心 -->
    <div class="FinanceCenter" v-show="visible_Financs == false">
      <h1>财务中心</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_Financs">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>资金池</span>
        </div>
        <div class="vipreceivable" @click="show_marketnancs">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>品项销售统计</span>
        </div>
      </div>
    </div>
    <!-- 资金池分页 -->
    <div class="Customer" v-show="visible_Financs == true">
      <div class="curhotTitle">
        <div class="cursTitle">
          <div class="getrback">
            <i class="el-icon-arrow-left arrows" @click="getBack"></i>
          </div>
          <span>资金池</span>
        </div>
      </div>
      <div class="sousxcTime">
        <!-- <div class="cursxzTimes">
          <el-date-picker
            v-model="value_titleTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          ></el-date-picker>
        </div>-->
      </div>
      <div class="cursmain">
        <div class="curstable">
          <el-table :data="savingsRecordFilter" style="width: 100%">
            <el-table-column label="门店">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.storeName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="支付类型">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.payTypeName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="支付金额">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="支付时间">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="vipexamine(scope.row)">划出</el-button>
                <el-button size="mini" @click="examineout(scope.row)">划入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="jumpPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="pageTotal"
          ></el-pagination>
        </div>
        <!-- 划出 -->
        <PopOver
          custom-class="storageblockshipping"
          :visible.sync="visible_ordershapping"
          @close="closeordershapping"
          width="800px"
        >
          <div class="stgblcktop" slot="top"></div>
          <div class="stgblcktopmain" slot="main">
            <el-table :data="shoppingdataout" style="width: 100%">
              <el-table-column label="划出门店">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.transferToStoreName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="stgblckbottom" slot="bottom">
            <el-pagination
              @size-change="handleSizeChangs"
              @current-change="handleCurrentChangs"
              :current-page.sync="currentPage2"
              :page-size="pageSizeout"
              background
              layout="total, prev, pager, next"
              :total="pageTotalout"
            ></el-pagination>
          </div>
        </PopOver>
        <!-- 划入 -->
        <PopOver
          custom-class="storageblockdar"
          :visible.sync="visible_orderdata"
          @close="closeorderdara"
          width="800px"
        >
          <div class="stgblcktop" slot="top"></div>
          <div class="stgblcktopmain" slot="main">
            <el-table :data="shoppingdatadown" style="width: 100%">
              <el-table-column label="划入门店">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.transferFromStoreName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="支付类型">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="stgblckbottom" slot="bottom">
            <el-pagination
              @size-change="handleSizeChango"
              @current-change="handleCurrentChango"
              :current-page.sync="currentPage3"
              :page-size="pageSizedown"
              background
              layout="total, prev, pager, next"
              :total="pageTotaldown"
            ></el-pagination>
          </div>
        </PopOver>
      </div>
    </div>
    <!-- 品项销售统计分页 -->
    <div class="Customarket" v-show="visible_marketnancs == true">品项销售统计分页</div>
    <!-- 库存 -->
    <div class="inventory">
      <h1>库存</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_tory">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>库存量统计</span>
        </div>
      </div>
    </div>
    <!-- 库存分页 -->
    <div class="Custotory" v-show="visible_tory == true">库存2312</div>
    <!-- 会员 -->
    <div class="member">
      <h1>会员</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_member">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>会员消费排行</span>
        </div>
        <div class="vipreceivable" @click="show_condition">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>会员剩余品项</span>
        </div>
      </div>
    </div>
    <!-- 会员消费排行 -->
    <div class="Customember" v-show="visible_member == true">会员消费排行</div>
    <!-- 会员剩余品项 -->
    <div class="Custcondition" v-show="visible_condition == true">会员剩余品项</div>
  </div>
</template>

<script>
//import XX from '';
export default {
  components: {},
  data() {
    return {
      //会员应收统计
      visible_Financs: false,
      //品项销售统计
      visible_marketnancs: false,
      //库存分页
      visible_tory: false,
      //会员分页
      visible_member: false,
      //会员剩余品项
      visible_condition: false,
      //资金池查看控制开关
      visible_ordershapping: false,
      visible_orderdata: false,
      //搜索时间段
      // value_titleTime: "",
      //当前页
      currentPage1: 1,
      //每页
      pageSize: 10,
      //总页数
      pageTotal: 0,
      //划出页
      currentPage2: 1,
      //每页
      pageSizeout: 10,
      //总页数
      pageTotalout: 0,
      //划入页
      currentPage3: 1,
      //每页
      pageSizedown: 10,
      //总页数
      pageTotaldown: 0,
      capitalPoolIdout: "",
      capitalPoolIddown: "",
      //分页
      handleSizeChange(val) {},
      handleCurrentChange(val) {},
      //划出分页
      handleSizeChangs(val) {},
      handleCurrentChangs(val) {},
      //划入分页
      handleSizeChango(val) {},
      handleCurrentChango(val) {},
      //资金池数据
      savingsRecordFilter: [],
      //划入划出数据
      shoppingdataout: [],
      shoppingdatadown: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    //会员应收统计
    show_Financs() {
      this.visible_Financs = true;
      this.requestwarehouse();
    },
    //资金池返回
    getBack() {
      this.visible_Financs = false;
    },
    //关闭资金池开关
    closeordershapping() {
      this.visible_ordershapping = false;
    },
    //查看划出
    vipexamine(res) {
      console.log(res);
      this.capitalPoolIdout = res.id;
      this.requestuot();
      this.visible_ordershapping = true;
    },
    closeorderdara() {
      this.visible_orderdata = false;
    },
    //划入
    examineout(res) {
      this.capitalPoolIddown = res.id;
      this.requestdown();
      this.visible_orderdata = true;
    },
    //资金池搜索时间
    // changeTime() {
    //   this.requestwarehouse();
    // },
    //品项销售统计
    show_marketnancs() {
      // this.visible_marketnancs = true;
    },
    //库存分页
    show_tory() {
      // this.visible_tory = true;
    },
    //会员分页
    show_member() {
      // this.visible_member = true;
    },
    //会员剩余品项
    show_condition() {
      // this.visible_condition = true;
    },
    //资金池数据
    requestwarehouse() {
      var url = this.$https.walletHost + "/manage/wallet/listCapPool";
      var params = {
        pageNum: this.currentPage1,
        pageSize: this.pageSize,
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            this.savingsRecordFilter = res.data.result.list;
            this.pageTotal = res.data.result.total;
          } else {
            this.pageTotal = 0;
            this.savingsRecordFilter = [];
          }
        })
        .catch(err => {
          this.$message({
            message: res.data.responseStatusType.error.errorMsg,
            type: "warning"
          });
        });
    },
    //资金池划出
    requestuot() {
      var url = this.$https.walletHost + "/manage/wallet/selectTransferOut";
      var params = {
        page: this.currentPage2,
        limit: this.pageSizeout,
        capitalPoolId: this.capitalPoolIdout,
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            this.shoppingdataout = res.data.result.list;
            this.pageTotalout = res.data.result.total;
          } else {
            this.pageTotalout = 0;
            this.shoppingdataout = [];
          }
        })
        .catch(err => {
          this.$message({
            message: res.data.responseStatusType.error.errorMsg,
            type: "warning"
          });
        });
    },
    //资金池划入
    requestdown() {
      var url = this.$https.walletHost + "/manage/wallet/selectTransferIn";
      var params = {
        pageNum: this.currentPage3,
        pageSize: this.pageSizedown,
        capitalPoolId: this.capitalPoolIddown,
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            this.shoppingdatadown = res.data.result.list;
            this.pageTotaldown = res.data.result.total;
          } else {
            this.pageTotaldown = 0;
            this.shoppingdatadown = [];
          }
        })
        .catch(err => {
          this.$message({
            message: res.data.responseStatusType.error.errorMsg,
            type: "warning"
          });
        });
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.statement {
  width: 100%;
  height: 100%;
  .FinanceCenter {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  .inventory {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  .member {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  //切换分页
  .Customer {
    width: 100%;
    height: 100%;
    // display: flex;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 100;
    background-color: #fff;
    .curhotTitle {
      width: 100%;
      margin-top: 30px;
      display: flex;
      .cursTitle {
        width: 250px;
        display: flex;
        justify-content: space-around;
        .getrback {
          width: 30px;
          height: 30px;
          cursor: pointer;
          i {
            font-size: 40px;
          }
        }
        span {
          font-size: 30px;
          font-weight: 600;
        }
      }
    }
    .sousxcTime {
      width: 100%;
      .cursxzTimes {
        width: 400px;
        margin: 0 auto;
      }
    }
    .cursmain {
      width: 100%;
      height: 100%;
      margin-top: 20px;
      .curstable {
        width: 95%;
        margin: 0 auto;
      }
      .jumpPage {
        width: 100%;
        height: 50px;
        .el-pagination {
          text-align: right;
          margin: 10px 30px 0 0;
        }
      }
    }
  }
  .Customarket {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Custotory {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Customember {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Custcondition {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
}
.storageblockshipping {
  .stgblcktop {
    font-size: 22px;
    font-weight: 550;
    display: flex;
    justify-content: space-around;
  }
  .stgblcktopmain {
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  }
  .stgblckbottom {
    text-align: center;
  }
}
.storageblockdar {
  .stgblcktop {
    font-size: 22px;
    font-weight: 550;
    display: flex;
    justify-content: space-around;
  }
  .stgblcktopmain {
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>