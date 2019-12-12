 <!-- 业绩查询 -->
<template>
  <div class="PerformanceQuery">
    <div class="titlebtn">
      <el-button @click="moneyClick" type="success">切换为金额业绩统计方式</el-button>
      <el-button @click="sizeClick" type="success">切换为个数业绩统计方式</el-button>
    </div>
    <div class="naver" v-if="visible_merchande == true">
      <div class="Employees" id="main_recharge"></div>
      <div class="Employs" id="main_rechargess"></div>
    </div>
    <div class="navers" v-if="visible_merchandes == true">
      <div class="Employees" id="main_recharge"></div>
      <div class="Employs" id="main_rechargess"></div>
    </div>

    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";
//import XX from '';

export default {
  components: { MemberFrame },
  data() {
    return {
      //员工
      allStorebeauticianList: [],
      amountListTodayPay: [],
      amountListTodayRecharge: [],
      nameList: [],
      dixinList: [],
      totalList: [],
      tichengList: [],
      visible_merchande: true,
      visible_merchandes: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    //切换金额
    moneyClick() {
      this.initChartsdata();
      // this.visible_merchande = true;
      // this.initCharts();
      // this.initCharts2();
    },
    //切换个数
    sizeClick() {
      this.initCsizedata();
      this.visible_merchande = false;
      this.visible_merchandes = true;
    },
    // var height = document.getElementById("div").offsetHeight;
    clicktop() {
      var height = document.getElementById("divp").offsetHeight;
    },
    //柱状图
    initCharts() {
      var myChart = this.$echarts.init(
        document.getElementById("main_recharge")
      );
      // 绘制图表
      let option = {
        title: {
          text: "当日员工业绩统计(点击查看业绩详情)"
          // x: 'center'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["支付业绩", "储值业绩"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: this.allStorebeauticianList
        },
        series: [
          {
            name: "支付业绩",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.amountListTodayPay
          },
          {
            name: "储值业绩",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.amountListTodayRecharge
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }, //柱状图
    initCharts2() {
      var myChart = this.$echarts.init(
        document.getElementById("main_rechargess")
      );
      // 绘制图表
      let option = {
        title: {
          text: "员工工资表",
          subtext: "数据为上月工资统计"
          // x: 'center'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["底薪", "提成", "总工资"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: this.nameList
        },
        series: [
          {
            name: "底薪",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.dixinList
          },
          {
            name: "提成",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.tichengList
          },
          {
            name: "总工资",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: this.totalList
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //绑定图1数据金额显示
    initChartsdata() {
      var url =
        this.$https.dataHost + "/performance/selectLadderDetailedListColumnar";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          // this.initChartsdatow()
          if (res.data.result) {
            //人员
            this.allStorebeauticianList =
              res.data.result.allStorebeauticianList;
            this.amountListTodayPay = res.data.result.amountListTodayPay;
            this.amountListTodayRecharge =
              res.data.result.amountListTodayRecharge;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //绑定图1数据个数显示
    initCsizedata() {
      var url =
        this.$https.dataHost +
        "/performance/selectLadderDetailedListColumnarForNumber";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            // this.allStorebeauticianList =
            //   res.data.result.allStorebeauticianList;
            // this.amountListTodayPay = res.data.result.allNumberList;
            // this.amountListTodayRecharge =
            //   res.data.result.amountListTodayRecharge;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //绑定图2数据
    initChartsdatow() {
      var url = this.$https.dataHost + "/statistic/selectSalaryList";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          this.initChartsdata();

          if (res.data.result) {
            this.nameList = res.data.result.nameList;
            this.dixinList = res.data.result.dixinList;
            this.tichengList = res.data.result.tichengList;
            this.totalList = res.data.result.totalList;
            this.tichengList = res.data.result.tichengList;
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
    this.initChartsdatow();
  },
  mounted() {
    setTimeout(() => {
      this.initCharts();
    }, 400);
    setTimeout(() => {
      this.initChartsdata();
    }, 200);
    setTimeout(() => {
      this.initCharts2();
      // this.initChartsdatow();
    }, 200);
  }
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.PerformanceQuery {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  .titlebtn {
    padding: 25px 0 25px 50px;
  }
  .naver {
    width: 100%;
    height: 100%;
    border: 1px solid red;
  }
  .Employees {
    width: 80%;
    margin: 0 auto;
    border-radius: 6px;
    background-color: #fff;
    height: 350px;
    border: 1px solid rgb(194, 191, 191);
    padding: 50px;
    box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
  }
  .Employs {
    width: 80%;
    height: 350px;
    margin: 0 auto;
    border-radius: 6px;
    background-color: #fff;
    border: 1px solid rgb(190, 186, 186);
    margin-top: 25px;
    box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
    padding: 50px;
  }
}
</style>
