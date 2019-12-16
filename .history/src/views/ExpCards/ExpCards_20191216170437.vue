<!-- 体验卡 -->
<template>
  <div class="expcardPage">
    <div class="ordersearch">
      <label>体验卡名称：</label>
      <el-input v-model="input_experience" placeholder="请输入要查询的商品" @keyup.enter="enterSearchMember"></el-input>
      <span @click="searchexp" v-debounce v-on:keyup.13.native="submit">
        <!-- <el-button size="medium" type="warning"> -->
        <i class="el-icon-search"></i>
        <!-- </el-button> -->
      </span>
    </div>
    <div class="expxardeCars">
      <div class="somersCar" v-for="item in somersCarshu" :key="item.id" @click="car_smreos(item)">
        <div class="discovery">
          <img src="http://47.108.29.183:8089/vue/icon_tyk2.c74d1521.png" alt />
        </div>
        <div class="dislabel">
          <label>{{item.cardName}}</label>
          <span>{{item.account}}元</span>
        </div>
      </div>
      <!-- 转页 -->
      <div class="positions">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage_one"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next"
          :total="totals"
        ></el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <PopOver
      custom-class="storageblock"
      :visible.sync="visible_examine"
      @close="closePopOver"
      width="1100px"
    >
      <div class="stgblcktop" slot="top">支付信息</div>
      <div class="stgblcktopmain" slot="main">
        <el-table :data="tableData_car" style="width: 100%">
          <el-table-column label="项目" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.productName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="次数">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.useTotalTimes }}</div>
            </template>
          </el-table-column>
          <el-table-column label="期限">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="particularsCar">
          <label>支付价格：</label>
          <el-input v-model="input_money" placeholder="请输入支付价格"></el-input>
          <div class="originalCost">
            销售价格:(
            <span>{{account}}</span>)元
          </div>
          <el-select v-model="value_payment" placeholder="请选择支付方式">
            <el-option
              v-for="item in option_payment"
              :key="item.payType"
              :label="item.label"
              :value="item.payType"
            ></el-option>
          </el-select>
          <el-select v-model="value_employees" @change="clickpeople" placeholder="请选择出售员工">
            <el-option
              v-for="item in option_saleEmployees"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <div class="wotercared">
            <label>水单号：</label>
            <el-input type="text" v-model="woterMemo" clearable placeholder="请输入水单号"></el-input>
          </div>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom">
        <el-button @click="tallyClick">取消</el-button>
        <el-button type="success" @click="purchase">确认购买</el-button>
      </div>
    </PopOver>
    <div style="width:100%;height:220px;background:#f0f2f5"></div>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: { MemberFrame },
  data() {
    return {
      //搜索框
      input_experience: "",
      //选项卡首页
      currentPage_one: 1,
      //每页个数
      pageSize: 9,
      //总数
      totals: 0,
      //销售价格
      account: "",
      //支付方式
      value_payment: "",
      //出售员工
      value_employees: "",
      //保存payType值
      payType: "",
      //创建人
      createOperator: "",
      modifyOperator: "",
      //水单号
      woterMemo: "",
      //体验卡项目卡号
      cardNum: "",
      //支付方式
      amount: "",
      payType: "",
      qqq: "",
      //获取出售员工值
      paymentPeople: [],
      //现金支付输入
      input_money: "",
      //所有卡片
      somersCarshu: [],
      //查看详情
      visible_examine: false,
      //项目列表
      tableData_car: [],
      //支付方式选择
      option_payment: [
        {
          payType: "3",
          label: "现金支付"
        },
        {
          payType: "4",
          label: "刷卡支付"
        }
      ],
      //出售员工选择
      option_saleEmployees: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.expcardCars();
    },
    //点击卡片查看详情
    car_smreos(res) {
      this.woterMemo = "";
      this.input_money = "";
      this.value_payment = "";
      this.value_employees = "";
      this.cardNum = res.cardNum;
      this.cardName = res.cardName;
      this.account = res.account;
      this.createOperator = res.createOperator;
      this.modifyOperator = res.modifyOperator;

      this.sellEmployee();
      this.visible_examine = true;
      this.projectCars();
    },
    closePopOver() {
      this.visible_examine = false;
    },
    //搜索体验卡
    searchexp() {
      this.qqq = this.input_experience;
      if (this.qqq !== this.input_experience) {
        this.searchCars();
        console.log();
        
      }else{
        console.log("一样的");
      }
    },
    //取消
    tallyClick() {
      this.visible_examine = false;
    },
    //获取出售员工值
    clickpeople(val) {
      this.option_saleEmployees.forEach(value => {
        if (value.name == val) {
          this.paymentPeople[0] = {
            beauticianName: value.name,
            postId: value.postId,
            beauticianId: value.beauticianId
          };
        }
      });
    },
    //确认购买
    purchase() {
      if (!localStorage.getItem("memberName")) {
        this.$message.error("错了哦，请先选择下方会员姓名...");
      }
      if (this.input_money == "") {
        this.$message.error("请选择支付价格");
      } else if (this.value_payment == "") {
        this.$message.error("请选择支付方式");
      } else if (this.value_employees == "") {
        this.$message.error("请选择出售员工");
      } else if (this.woterMemo == "") {
        this.$message.error("请选择水单号");
      } else {
        //请求
        this.addOrderform();
        this.visible_examine = false;
      }
    },

    expcardCars() {
      var url =
        this.$https.storeHost +
        "/manage/experienceCard/selectExperienceCardList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageSize: this.pageSize,
        pageNum: this.currentPage_one
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result.list) {
            this.totals = res.data.result.total;
            this.somersCarshu = res.data.result.list;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //搜索体验卡
    searchCars() {
      var url =
        this.$https.storeHost +
        "/manage/experienceCard/selectExperienceCardList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        keyWordCardName: this.input_experience
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result !== null) {
            this.somersCarshu = res.data.result.list;
          } else {
            this.somersCarshu = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //请求体验卡项目
    projectCars() {
      var url =
        this.$https.storeHost +
        "/manage/experienceCard/selectExpCardProductListByCarNum ";
      var params = {
        cardNum: this.cardNum
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.tableData_car = res.data.result.list;
          } else {
            this.tableData_car = [];
            this.visible_examine = false;

            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //添加体验卡订单
    addOrderform() {
      this.paymentTylp = [
        {
          amount: this.input_money,
          payType: this.value_payment
        }
      ];

      var url =
        this.$https.storeHost + "/manage/experienceCard/addExpCardOrder";
      var params = {
        account: this.input_money,
        cardName: this.cardName,
        cardNum: this.cardNum,
        memoNum: this.woterMemo,
        createOperator: localStorage.getItem("trueName"),
        linkPhone: localStorage.getItem("memberNumber"),
        purchaserName: localStorage.getItem("memberName"),
        storeId: localStorage.getItem("storeId"),
        memberNum: localStorage.getItem("membership"),
        beauticians: JSON.stringify(this.paymentPeople),
        payTypeAndAmount: JSON.stringify(this.paymentTylp)
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.$message({
              message: res.data.result,
              type: "success",
              duration: 5000
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //出售员工请求
    sellEmployee() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianListNoPage";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result !== null) {
            this.option_saleEmployees = res.data.result;
          } else {
            this.option_saleEmployees = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    submit() {
      this.searchexp();
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
    //体验卡
    this.expcardCars();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.expcardPage {
  width: 100%;
  height: 100%;
  padding: 15px 15px 50px 0;
  background-color: #f0f2f5;
  display: flex;
  flex-flow: column;
  .ordersearch {
    width: 700px;
    height: 42px;
    display: flex;
    position: relative;
    margin: 15px auto;
    label {
      width: 143px;
      color: #333333;
      line-height: 40px;
      font-size: 17px;
      font-family: PingFang SC;
      font-weight: bold;
    }
    .el-input {
      border: 1px solid #feb019;
      border-radius: 4px;
    }
    span {
      width: 65px;
      height: 34px;
      padding-top: 7px;
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
  .expxardeCars {
    width: 1182px;
    margin: 0 auto;
    padding-bottom: 55px;
    display: flex;
    border-radius: 6px;
    background-color: #fff;
    flex-wrap: wrap;
    position: relative;
    .somersCar {
      width: 250px;
      height: 184px;
      margin: 25px 25px 25px 20px;
      border: 2px solid rgba(238, 238, 238, 1);
      position: relative;
      bottom: 0;
      transition: 0.5s;
      -webkit-transition: 0.5s;
      .discovery {
        width: 247px;
        height: 141px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .dislabel {
        width: 220px;
        height: 30px;
        display: flex;
        margin: 8px;
        justify-content: space-around;
      }
      p {
        padding: 8px 0 0 15px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(85, 85, 85, 1);
      }
    }
    .somersCar:hover {
      cursor: pointer;
      bottom: 10px;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    }
    .positions {
      position: absolute;
      bottom: 10px;
      left: 40%;
    }
  }
}
//弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 16px;
  }
  .stgblcktopmain {
    padding: 35px 0 0 40px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);

    .particularsCar {
      height: 50px;
      margin-top: 20px;
      line-height: 50px;
      display: flex;
      .originalCost {
        margin-left: 15px;
        line-height: 50px;
      }
      .wotercared {
        margin-left: 10px;
      }
      label {
        line-height: 46px;
      }
      .el-input {
        width: 180px;
        height: 46px;
        border-radius: 4px;
      }
      .el-select {
        margin-left: 15px;
        border-radius: 5px;
        height: 45px;
        width: 168px;
      }
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>

