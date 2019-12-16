<!-- IncomeQuery -->
<template>
  <div class="IncomeQuery">
    <div class="incomeheadline">收益</div>
    <div class="incomeTitle">
      <div class="OrderQuantity1">
        <div class="orderherder">
          <label>下单量</label>
          <div>天</div>
        </div>
        <div class="ordermenneu">{{totalcapacity}}</div>
        <div class="orderbottom">
          <label>
            单位：
            <span></span>个
          </label>
        </div>
      </div>
      <div class="OrderQuantity2">
        <div class="orderherder">
          <label>会员</label>
          <div>天</div>
        </div>
        <div class="ordermenneu">
          <div class="flashs">
            <label>新会员:</label>
            <span>{{newVIP}}</span>
          </div>
          <div class="flashs">
            <label>散客:</label>
            <span>{{isNotVIP}}</span>
          </div>
        </div>
        <div class="orderbottom">
          <label>
            单位：
            <span></span>个
          </label>
        </div>
      </div>
      <div class="OrderQuantity3">
        <div class="orderherder">
          <label>支付订单总收入</label>
          <div>天</div>
        </div>
        <div class="ordermenneu">
          <div class="ordermenneuss">
            <div class="flashs">
              <label>总收入:</label>
              <span>{{allPayPrice}}</span>
            </div>
            <div class="flashs">
              <label>现金收入:</label>
              <span>{{allCashPayPrice}}</span>
            </div>
          </div>
          <div class="clickdetail">
            <el-button type="info" @click="click_cash" size="mini">现金明细-纸币</el-button>
            <el-button type="info" @click="click_poss" size="mini">现金明细-POSS</el-button>
          </div>
        </div>
        <div class="orderbottom">
          <label>
            单位：
            <span></span>元
          </label>
        </div>
      </div>
      <PopOver
        custom-class="storageblock"
        :visible.sync="visible_cash"
        @close="close_stgbcash"
        width="600px"
      >
        <div class="stgblcktop" slot="top">现金明细-纸币</div>
        <div class="stgblcktopmain" slot="main">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="订单号" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.orderTypeName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" width="180">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="80">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="pagetotal"
          ></el-pagination>
        </div>
      </PopOver>
      <PopOver
        custom-class="storageblock"
        :visible.sync="visible_poss"
        @close="close_stgbposs"
        width="600px"
      >
        <div class="stgblcktop" slot="top">现金明细-POSS</div>
        <div class="stgblcktopmain" slot="main">
          <el-table :data="tableData2" style="width: 100%">
            <el-table-column label="订单号" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.orderTypeName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" width="180">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="80">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="stgblckbottomIP" slot="bottom">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="currentPage2"
            :page-size="pageSize2"
            background
            layout="total, prev, pager, next"
            :total="pagetotal2"
          ></el-pagination>
        </div>
      </PopOver>
      <div class="OrderQuantity4">
        <div class="orderherder">
          <label>储蓄订单总收入</label>
          <div>天</div>
        </div>
        <div class="ordermenneu">{{storedvalue}}</div>
        <div class="orderbottom">
          <label>
            单位：
            <span></span>元
          </label>
        </div>
      </div>
    </div>
    <div class="racherdrawing">
      <!-- <h2>订单统计</h2> -->
      <div class="reecherass">
        <div class="rachers" id="main_recharge"></div>
      </div>
      <div class="piechart" id="main_piechert"></div>
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
      //总单量
      appointmentOrder: "",
      customOrder: "",
      productOrder: "",
      rechargeOrder: "",
      serviceOrder: "",
      isNotVIP: "",
      newVIP: "",
      allPayPrice: "",
      allCashPayPrice: "",
      storedvalue: "",
      totalcapacity: "",
      visible_cash: false,
      visible_poss: false,
      //现金当前页
      currentPage1: 1,
      pageSize: 10,
      pagetotal: 0,
      //POSS当前页
      currentPage2: 1,
      pageSize2: 10,
      pagetotal2: 0,
      tichengList: [],

      //现金明细
      tableData: [
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        },
        {
          orderNum: "122134124234",
          orderTypeName: "213",
          createTime: "12312",
          amount: "12"
        }
      ],
      tableData2: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    //现金明细
    click_cash() {
      this.cashdetail();
      this.visible_cash = true;
    },
    close_stgbcash() {
      this.visible_cash = false;
    },
    handleSizeChange(val) {
      setTimeout(() => {
        this.cashdetail();
      }, 200);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.cashdetail();
      }, 200);
    },
    //现金明细
    click_poss() {
      this.storedguantitys();
      this.visible_poss = true;
    },
    close_stgbposs() {
      this.visible_poss = false;
    },
    handleSizeChange2(val) {
      setTimeout(() => {
        this.storedguantitys();
      }, 200);
    },
    handleCurrentChange2(val) {
      setTimeout(() => {
        this.storedguantitys();
      }, 200);
    },
    //下单量数据
    Ordequantity() {
      var url = this.$https.dataHost + "/manage/order/selectTodayOrderList";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.appointmentOrder = res.data.result.appointmentOrder;
            this.customOrder = res.data.result.customOrder;
            this.productOrder = res.data.result.productOrder;
            this.rechargeOrder = res.data.result.rechargeOrder;
            this.serviceOrder = res.data.result.serviceOrder;
            this.isNotVIP = res.data.result.serviceOrder;
            this.newVIP = res.data.result.newVIP;
            this.totalcapacity =
              res.data.result.appointmentOrder +
              res.data.result.customOrder +
              res.data.result.productOrder +
              res.data.result.rechargeOrder +
              res.data.result.serviceOrder;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //收入数据
    earninguantity() {
      var arr = [];

      var url = this.$https.orderHost + "/order/selectTodayReceipt";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.allPayPrice = res.data.result.allPayPrice;
            // this.tichengList = [res.data.result];
            for (var key in res.data.result) {
              var str = {};
              str.value = res.data.result[key];
              str.name = key;
              arr.push(str);
            }
            this.tichengList = arr;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //收入数据
    saaearninguantity() {
      var url = this.$https.orderHost + "/order/selectTodayCashReceipt";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.allCashPayPrice = res.data.result.allCashPayPrice;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //储蓄总收入
    storedguantity() {
      var url = this.$https.walletHost + "/manage/wallet/selectSumAmount";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data) {
            this.storedvalue = res.data.result;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //现金明细
    cashdetail() {
      var url = this.$https.orderHost + "/order/selectOrderByCash";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize,
        cash: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.tableData = res.data.result.list;
            this.pagetotal = res.data.result.list.length;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //POSS明细
    storedguantitys() {
      var url = this.$https.orderHost + "/order/selectOrderByCash";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage2,
        pageSize: this.pageSize2,
        cash: 4
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.tableData2 = res.data.result.list;
            this.pagetotal2 = res.data.result.list.length;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //柱状图
    initCharts() {
      var myChart = this.$echarts.init(
        document.getElementById("main_recharge")
      );
      // 绘制图表
      let option = {
        title: {
          text: "订单统计"
        },
        toolbox: {
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ["服务订单", "产品订单", "充值订单", "预约订单", "定制订单"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单详情",
            data: [
              this.serviceOrder,
              this.productOrder,
              this.rechargeOrder,
              this.appointmentOrder,
              this.customOrder
            ],
            type: "bar"
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //饼状图
    piewchart() {
      var myChart = this.$echarts.init(
        document.getElementById("main_piechert")
      );
      // 绘制图表
      let option = {
        backgroundColor: "#808080",

        title: {
          text: "支付订单收入占比",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: "现金收入",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data:
              // [
              //   { value: 335, name: "直接访问" },
              //   { value: 310, name: "邮件营销" },
              //   { value: 274, name: "联盟广告" },
              //   { value: 235, name: "视频广告" },
              //   { value: 400, name: "搜索引擎" }
              // ]
              this.tichengList.sort(function(a, b) {
                return a.value - b.value;
              }),
            roseType: "radius",
            label: {
              normal: {
                textStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //绑定图1数据
    initChartsdatow() {
      var url = this.$https.dataHost + "/statistic/selectSalaryList";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.nameList = res.data.result.nameList;
            this.dixinList = res.data.result.dixinList;
            this.tichengList = res.data.result.tichengList;
            this.totalList = res.data.result.totalList;
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
  created() {
    this.earninguantity();
    this.saaearninguantity();
    this.storedguantity();
    //
    // setTimeout(() => {
    //   location.reload()
    // }, 200);
  },
  mounted() {
    setTimeout(() => {
      this.initCharts();
      this.Ordequantity();
    }, 400);
    setTimeout(() => {
      this.piewchart();
      this.initChartsdatow();
    }, 200);
  }
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.IncomeQuery {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  .incomeheadline {
    font-size: 24px;
    padding: 30px;
    font-weight: bold;
  }
  .incomeTitle {
    width: 100%;
    padding: 0 50px;
    display: flex;
    justify-content: space-around;
    .OrderQuantity1 {
      width: 28%;
      height: 180px;
      background-color: #fff;
      border: 1px solid rgb(182, 179, 179);
      border-radius: 4px;
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      margin-right: 30px;
      .orderherder {
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid rgb(207, 207, 207);
        display: flex;
        justify-content: space-between;
      }
      .ordermenneu {
        width: 100%;
        height: 100px;
        font-size: 30px;
        padding-left: 10px;
        line-height: 90px;
      }
      .orderbottom {
        display: flex;
        padding: 0 10px;
        line-height: 36px;
        justify-content: space-between;
      }
    }
    .OrderQuantity2 {
      width: 28%;
      height: 180px;
      background-color: #fff;
      border: 1px solid rgb(182, 179, 179);
      border-radius: 4px;
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      margin-right: 30px;
      .orderherder {
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid rgb(207, 207, 207);
        display: flex;
        justify-content: space-between;
      }
      .ordermenneu {
        width: 100%;
        height: 100px;

        display: flex;
        padding-left: 10px;
        line-height: 90px;
        .flashs {
          margin-left: 8px;
          font-size: 16px;
          span {
            font-size: 20px;
            margin-left: 5px;
          }
        }
      }
      .orderbottom {
        display: flex;
        padding: 0 10px;
        line-height: 36px;
        justify-content: space-between;
      }
    }
    .OrderQuantity3 {
      width: 28%;
      height: 180px;
      background-color: #fff;
      border: 1px solid rgb(182, 179, 179);
      border-radius: 4px;
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      margin-right: 30px;
      .orderherder {
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid rgb(207, 207, 207);
        display: flex;
        justify-content: space-between;
      }
      .ordermenneu {
        width: 100%;
        height: 90px;
        padding-left: 10px;
        margin-top: 10px;
        line-height: 60px;
        .ordermenneuss {
          display: flex;
          height: 70px;
          .flashs {
            margin-left: 8px;
            font-size: 16px;
            span {
              font-size: 20px;
              margin-left: 5px;
            }
          }
        }
        .clickdetail {
          margin-bottom: 5px;
          height: 30px;
          display: flex;
        }
      }
      .orderbottom {
        display: flex;
        padding: 0 10px;
        margin-top: 5px;
        line-height: 36px;
        justify-content: space-between;
      }
    }
    .OrderQuantity4 {
      width: 28%;
      height: 180px;
      background-color: #fff;
      border: 1px solid rgb(182, 179, 179);
      border-radius: 4px;
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      margin-right: 30px;
      .orderherder {
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid rgb(207, 207, 207);
        display: flex;
        justify-content: space-between;
      }
      .ordermenneu {
        width: 100%;
        height: 100px;
        font-size: 30px;
        padding-left: 10px;
        line-height: 90px;
      }
      .orderbottom {
        display: flex;
        padding: 0 10px;
        line-height: 36px;
        justify-content: space-between;
      }
    }
  }
  .racherdrawing {
    width: 100%;
    margin: 0 20px;
    display: flex;
    justify-content: space-around;
    // margin-bottom: 100px;
    .reecherass {
      width: 750px;
      height: 500px;
      margin: 40px 0 0 -5px;
      background-color: #fff;
      .rachers {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        border: 1px solid rgb(216, 214, 214);
        box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      }
    }

    .piechart {
      width: 600px;
      height: 500px;
      margin: 40px 100px 0 0;
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
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
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  }
  .stgblckbottomIP {
    margin-left: 195px;
  }
  .stgblckbottom {
    margin-left: 195px;
  }
}
</style>
