<!-- 店铺设置 -->

<template>
  <div class="Salesreturn">
    <div class="SalesreTop">
      <div class="searchBoxs">
        <label>姓名：</label>
        <el-input v-model="input_name" @blur="blurName" placeholder="请输入姓名"></el-input>
      </div>
      <div class="searchBoxs">
        <label>电话号码：</label>
        <el-input v-model="input_numBer" @blur="blurNumber" placeholder="请输入电话号码"></el-input>
      </div>
      <div class="searchBoxs">
        <label>时间：</label>
        <el-date-picker
          v-model="value_tinemve"
          @blur="searchTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>
    <div class="salereBottom" :style="{'height': (virtualHeight-213)+'px'}">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="单号">
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
        <el-table-column label="金额">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.membershipLevelName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.membershipLevelName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="vipexamine(scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="pageTotal"
    ></el-pagination>
    <!-- 退货弹出框 -->
    <PopOver
      custom-class="storageblock"
      :visible.sync="visible_VIP"
      @close="close_stgbVip"
      width="430px"
    >
      <div class="recharge_top" slot="top">退款</div>
      <div class="recharge_main" style="height:160px" slot="main">
        <div class="stgbListtallyVip">
          <label>退款金额：</label>
          <el-input v-model="input_monely" placeholder="请输入退款金额"></el-input>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom">
        <el-button type="success" @click="VipClick">确定</el-button>
      </div>
    </PopOver>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      //浏览器高度
      virtualHeight: window.innerHeight,
      //搜索姓名
      input_name: "",
      //退款金额
      input_monely: "",
      //电话号码
      input_numBer: "",
      //分页
      currentPage1: 1,
      pageTotal: 40,
      pageSize: 20,
      //搜索时间段
      value_tinemve: "",
      visible_VIP: false,
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
    //页码
    handleSizeChange() {},
    handleCurrentChange() {},
    close_stgbVip() {
      this.visible_VIP = false;
      this.input_monely = "";
    },
    //退货操作
    vipexamine(res) {
      console.log(res);
      this.visible_VIP = true;
    },
    //搜索名字
    blurName() {},
    //搜索号码
    blurNumber() {},
    //搜索时间
    searchTime() {
      console.log(this.value_tinemve);
    },
    //退款确定
    VipClick() {
      this.input_monely = "";
      this.visible_VIP = false;
    },
    //客户退款列表
    savingAccount() {
      var url =
        this.$https.walletHost + "/manage/wallet/selectRechargeRefuseList";
      var params = {
        // pageNum: this.currentPage1,
        // pageSize: this.pageSize,
        // memberNum: this.cardNumber
        name: "",
        mobile: "",
        startdate: "",
        endDate: ""
      };
      this.$https.fetchPost(url, params).then(res => {
        if (res.data.result) {
          this.tableData = res.data.result.list;
        } else {
          this.$message({
            message: res.data.responseStatusType.error.errorMsg,
            type: "warning"
          });
        }
      });
    }
  },
  created() {
    //请求列表
    this.savingAccount();
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
    margin-left: 2px;
    display: flex;
    .searchBoxs {
      height: 50px;
      margin: 30px;
      label {
        font-size: 18px;
        font-weight: 550;
      }
      .el-input {
        width: 210px;
      }
    }
  }
  .salereBottom {
    width: 100%;
    padding: 0 20px;
  }
}
//退货弹出框
.storageblock {
  .recharge_top {
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid rgba(231, 228, 228, 0.5);
  }
  .recharge_main {
    .stgbListtallyVip {
      width: 300px;
      height: 50px;
      margin: 50px;
      .label {
        font-weight: 550;
        font-size: 18px;
      }
      .el-input {
        width: 215px;
      }
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
