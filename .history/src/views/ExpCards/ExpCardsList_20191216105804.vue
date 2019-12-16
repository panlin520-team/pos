<!-- 添加护理订单 -->
<template>
  <div class="expcarList">
    <div class="herderLit">
      <label>体验卡名称：</label>
      <el-input v-model="input_header" placeholder="请输入体验卡名称"></el-input>
      <span @click="seekinvtey">
        <i class="el-icon-search"></i>
      </span>
      
    </div>
    <div class="carlistnerve">
      <div class="carHeader">
        <div class="carheTile">
          <span>日期：</span>
          <el-date-picker
            v-model="value_time"
            type="daterange"
            align="right"
            unlink-panels
            class="herderDatePicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @blur="selectionTime"
          ></el-date-picker>
        </div>

        <div class="herderInput">
          <label>会员姓名：</label>
          <el-input v-model="input_vipname" @blur="seekvainame" clearable placeholder="请输入会员姓名"></el-input>
          <!-- <span>
          <el-button type="success" size="medium">
            <i class="el-icon-search"></i>
          </el-button>
          </span>-->
        </div>
        <div class="herderInput">
          <label>手机号：</label>
          <el-input v-model="input_penober" @blur="seeknumber" clearable placeholder="请输入手机号"></el-input>
          <!-- <span>
          <el-button type="success" size="medium">
            <i class="el-icon-search"></i>
          </el-button>
          </span>-->
        </div>
      </div>
      <div class="carContent">
        <el-table :data="tableData_content" style="width: 100%">
          <el-table-column label="体验卡名称">
            <template slot-scope="scope">
              <span>{{ scope.row.cardName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="会员卡号">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.cardNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.linkPhone }}</div>
            </template>
          </el-table-column>
          <el-table-column label="购买日期">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagintion">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="currentPage4"
          :page-size="pagecarlist"
          layout="total,prev, pager, next"
          :total="pagecartotal"
        ></el-pagination>
      </div>
    </div>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: {MemberFrame},
  data() {
    return {
      //选择时间
      value_time: "",
      //选择开始时间
      startDate: "",
      //选择结束时间
      endDate: "",
      //搜索会员姓名
      input_vipname: "",
      //专业
      pagecarlist: 10,
      //总数
      pagecartotal: 0,
      //搜索体验卡名称
      input_header: "",
      //当前页
      currentPage4: 1,
      //总页数
      pageSize: 20,
      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //搜索手机号
      input_penober: "",
      //当前页面
      // currentPages: 2,
      //消费列表
      tableData_content: [

      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    //切换页面
    handleSizeChange(val) {
      setTimeout(() => {
        this.connectorCarlist();
      }, 300);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.connectorCarlist();
      }, 300);
    },
    //搜索体验卡名称
    seekinvtey() {
      this.tableData_content.forEach(value => {
        if (this.input_header !== value.cardName) {
          this.tableData_content = [];
          this.pagecartotal = this.tableData_content.length;
        } else {
          this.pagecartotal = this.tableData_content.length;
        }
      });

      //体验卡列表
      this.connectorCarlist();
    },
    //搜索名字
    seekvainame() {
      this.tableData_content.forEach(value => {
        if (this.input_vipname !== value.cardName) {
          this.tableData_content = [];
          this.pagecartotal = this.tableData_content.length;
        } else {
          this.pagecartotal = this.tableData_content.length;
        }
      });
      //体验卡列表
      this.connectorCarlist();
    },
    //搜索手机号
    seeknumber() {
      this.tableData_content.forEach(value => {
        if (this.input_penober !== value.cardName) {
          this.tableData_content = [];
          this.pagecartotal = this.tableData_content.length;
        } else {
          this.pagecartotal = this.tableData_content.length;
        }
      });
      //体验卡列表
      this.connectorCarlist();
    },
    //获取选择开始结束时间
    selectionTime() {
      if (this.value_time == "") {
        this.$message({
          message: "警告，请选择时间",
          type: "warning"
        });
        return;
      } else {
        // --时间处理
        this.startDate = this.value_time[0];
        this.endDate = this.value_time[1];
      }
      this.tableData_content.forEach(value => {
        if (this.input_penober !== value.cardName) {
          this.tableData_content = [];
        }
      });
      this.connectorCarlist();
    },

    //体验卡列表
    connectorCarlist() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/selectExpCardOrder";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage4,
        pageSize: this.pageSize,
        keyWordLinkPhone: this.input_penober,
        keyWordLinkName: this.input_vipname,
        cardName: this.input_header,
        startdate: this.startDate,
        endDate: this.endDate
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.tableData_content = res.data.result.list;
            this.pagecartotal = this.tableData_content.length;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          //  this.$message.error("体验卡列表提交请求错误...");
        });
    }
  },
  created() {
    //体验卡列表
    this.connectorCarlist();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.expcarList {
  // display: flex;
  // flex-flow: column;
  height: 100%;
  width: 100%;
  padding: 15px 15px 30px 0;
  background-color: #f0f2f5;
  .herderLit {
    width: 900px;
    flex: 1;
    margin-bottom: 20px;
    padding: 50px 0 0 230px;
    display: flex;
    position: relative;
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
      right: 0;
      border-radius: 0 4px 4px 0;
      i {
        color: #fff;
        font-size: 25px;
      }
    }
  }
  .carlistnerve {
    width: 1250px;
    margin-left: 100px;
    border-radius: 4px;
    background-color: #fff;
    .carHeader {
      width: 1250px;
      padding: 25px 0 25px 30px;
      display: flex;
      .carheTile {
        margin-top: 5px;
        span {
          width: 35px;
          height: 15px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
        }
      }
      .herderInput {
        margin-left: 40px;
        display: flex;

        span {
          width: 65px;
          height: 40px;
          .el-button {
            margin-top: 4px;
            border-radius: 0 4px 4px 0;
            i {
              color: #fff;
              font-size: 19px;
            }
          }
        }
        label {
          width: 90px;
          height: 16px;
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 400;
          padding-top: 10px;
          color: rgba(0, 0, 0, 1);
        }
        .el-input {
          width: 180px;
          line-height: 45px;
          // background: rgba(255, 255, 255, 1);
          // border: 1px solid rgb(219, 215, 215);
          border-radius: 4px 0 0 4px;
        }
      }
    }
    .carContent {
      width: 85%;
      flex: 1;
      margin: 25px 0 50px 80px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(238, 238, 238, 1);
      box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
      border-radius: 4px;
    }
    .pagintion {
      // margin: 0 auto;
      // margin: 50px auto;
      text-align: center;
      padding-bottom: 35px;
    }
  }
}
</style>