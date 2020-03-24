<!-- 退货查询 -->

<template>
  <div class="Salesreturn">
    <div class="salesTitle">退货查询</div>
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
    <div class="carContent">
      <el-table :data="tableData_content" style="width: 100%">
        <el-table-column label="单号">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo }}</span>
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
            <div slot="reference" class="name-wrapper">{{ scope.row.amount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="pageSize"
      background
      layout="total, prev, pager, next"
      :total="pageTotal"
    ></el-pagination>

    <!-- 退货弹出框 -->
    <!-- <PopOver
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
    </PopOver>-->
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
      //电话号码
      input_numBer: "",
      //分页
      currentPage1: 1,
      pageTotal: 0,
      pageSize: 10,
      //搜索时间段
      value_tinemve: "",
      //退货列表
      tableData_content: []
    };
  },

  computed: {},
  watch: {},
  methods: {
    //页码
    handleSizeChange() {},
    handleCurrentChange() {},

    //搜索名字
    blurName() {
      this.input_numBer = "";
      this.savingAccount();
    },
    //搜索号码
    blurNumber() {
      this.input_name = "";
      this.savingAccount();
    },
    //搜索时间
    searchTime() {
      this.savingAccount();
    },
    //客户退款列表
    savingAccount() {
      var url =
        this.$https.walletHost + "/manage/wallet/selectRechargeRefuseList";
      var params = {
        // pageNum: this.currentPage1,
        // pageSize: this.pageSize,
        name: this.input_name,
        mobile: this.input_numBer,
        startdate: this.value_tinemve[0],
        endDate: this.value_tinemve[1]
      };
      this.$https.fetchPost(url, params).then(res => {
        if (res.data.result) {
          this.tableData_content = res.data.result.list;
          this.pageTotal = res.data.result.total;
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
  .salesTitle {
    width: 200px;
    height: 60px;
    text-align: center;
    line-height: 80px;
    font-size: 25px;
    font-weight: 600;
  }
  .SalesreTop {
    width: 100%;
    height: 115px;
    margin-left: 2px;
    display: flex;
    padding-left: 100px;
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
  .carContent {
    width: 90%;
    flex: 1;
    margin: 25px 0 15px 80px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
    border-radius: 4px;
  }
  .el-pagination {
    float: right;
    margin-right: 20px;
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
