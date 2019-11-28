<!-- 水单号 -->
<template>
  <div class="memoPage fluid">
    <div class="pageTop">
      <div class="title">门店水单</div>
      <div class="absRight">
        <el-button type="success" @click="openNewMemo">新增</el-button>
      </div>
    </div>
    <div class="pageMain">
      <div class="headers">
        <div class="headerItem" style="flex:0.5">序号</div>
        <div class="headerItem" style="flex:1.5">开始水单号</div>
        <div class="headerItem" style="flex:1.5">结束水单号</div>
        <div class="headerItem">创建时间</div>
        <div class="headerItem">创建人</div>
        <div class="headerItem">查询</div>
      </div>
      <div class="list scrollY" :style="{'height': (virtualHeight-125)+'px'}">
        <div class="listItem" v-for="(item,index) in memoList">
          <div style="flex:0.5" class="nowrap">{{index+1}}</div>
          <div style="flex:1.5" class="nowrap">{{item.memoNumStart}}</div>
          <div style="flex:1.5" class="nowrap">{{item.memoNumEnd}}</div>
          <div style="flex:1" class="nowrap">{{item.createTime}}</div>
          <div style="flex:1" class="nowrap">{{item.modifyOperator}}</div>
          <div style="flex:1" class="nowrap">
            <el-button type="success" size="mini" @click="fetchMemoSeries(item)">查询</el-button>
          </div>
        </div>
      </div>
    </div>

    <pop-over
      :visible.sync="newMemoPop"
      @close="newMemoPop = false"
      width="500px"
      custom-class="newMemoPop"
    >
      <div class="top" slot="top">
        <div class="title">新增水单号本</div>
      </div>
      <div class="main" slot="main">
        <el-form
          :model="newMemo"
          :rules="rules"
          ref="newMemoForm"
          label-width="100px"
          class="newMemoForm"
        >
          <el-form-item label="开始水单号" prop="memoNumStart">
            <el-input v-model="newMemo.memoNumStart"></el-input>
          </el-form-item>
          <el-form-item label="结束水单号" prop="memoNumEnd">
            <el-input v-model="newMemo.memoNumEnd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('newMemoForm')">创建</el-button>
            <el-button @click="resetForm('newMemoForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </pop-over>

    <pop-over
      :visible.sync="memoPop"
      @close="memoPop = false"
      width="760px"
      marginTop="5vh"
      custom-class="memoPop"
    >
      <div class="top" slot="top">
        <div class="title">使用情况</div>
      </div>
      <div class="main" slot="main">
        <div class="warnValue" v-if="warnValue == 0">*水单号存在未连续使用情况</div>
        <div class="headers">
          <div class="headerItem" style="flex: 0.5;">序号</div>
          <div class="headerItem" style="flex: 1;">水单号</div>
          <div class="headerItem" style="flex: 1;">订单号</div>
          <div class="headerItem" style="flex: 1;">创建时间</div>
        </div>
        <div class="list scrollY" :style="{'height': (virtualHeight/2)+'px','min-height': '200px'}">
          <div class="listItem" v-for="(item,index) in orderList">
            <div style="flex:0.5" class="nowrap">{{index+1}}</div>
            <div style="flex:1" class="nowrap">{{item.memoNum}}</div>
            <div style="flex:1" class="nowrap">{{item.orderNumber}}</div>
            <div style="flex:1" class="nowrap">{{item.createTime}}</div>
          </div>
        </div>
      </div>
    </pop-over>
  </div>
</template>

<script>
export default {
  name: "Odd",
  data() {
    return {
      // 水单号本
      memoList: null,
      // 水单号使用列表
      orderList: null,

      // 水单号本连续使用情况
      warnValue: 1,

      // 新增水单号本
      newMemo: {
        memoNumStart: "",
        memoNumEnd: ""
      },

      rules: {
        memoNumStart: [
          {
            required: true,
            message: "请输入开始水单号",
            trigger: "blur"
          }
        ],
        memoNumEnd: [
          {
            required: true,
            message: "请输入结束水单号",
            trigger: "blur"
          }
        ]
      },

      // 弹窗
      // 水单号使用情况
      memoPop: false,
      // 新增水单号本
      newMemoPop: false,

      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  created() {
    this.fetchMemoBook();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var url = this.$https.storeHost + "/manage/store/addStoreMemoNum";
          var params = {
            memoNumStart: this.newMemo.memoNumStart,
            memoNumEnd: this.newMemo.memoNumEnd,
            storeId: localStorage.getItem("storeId")
          };
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.responseStatusType.message == "Success") {
                this.newMemoPop = false;
                this.$refs[formName].resetFields();
                this.$message({
                  message: "成功新增水单号本",
                  type: "success"
                });
                this.fetchMemoBook();
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
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 新增水单号本
    openNewMemo() {
      this.newMemoPop = true;
    },
    // 查询水单号本使用情况
    fetchMemoSeries(item) {
      var url = this.$https.storeHost + "/manage/store/checkMenoContinuous";
      var params = {
        memoNumStart: item.memoNumStart,
        memoNumEnd: item.memoNumEnd,
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.memoPop = true;
            this.warnValue = res.data.result.isContinuous;
            this.orderList = res.data.result.orderList;
          } else {
            this.orderList = null;
            this.warnValue = 1;
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
    // 门店水单号本
    fetchMemoBook() {
      var url = this.$https.storeHost + "/manage/store/listStoreMemo";
      var params = { storeId: localStorage.getItem("storeId") };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result.list) {
            this.memoList = res.data.result.list;
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
    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchEmployees();
    }
  }
};
</script>

<style lang='scss' scoped>
.pageTop {
  .title{
    margin
  }
  .absRight {
    position: absolute;
    top: 25px;
    right: 15px;
    height: 40px;
  }
}

.pageMain {
  padding: 15px 0;
}

.headers {
  position: relative;
  display: flex;
  margin: 0 20px;

  .headerItem {
    flex: 1;
    text-align: center;
    line-height: 50px;
    color: #8a8a8a;
  }
}

.list {
  position: relative;
  margin: 0 20px;

  .listItem {
    position: relative;
    display: flex;
    line-height: 50px;
    font-size: 14px;
    text-align: center;

    &:nth-child(odd) {
      background-color: #f8f8f8;
    }

    div {
      flex: 1;
      width: 0;
    }
  }
}

.memoPop {
  .top {
    padding: 7px 0 0 0;
  }
  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
  }
}

.newMemoPop {
  .top {
    padding: 7px 0 0 0;
  }
  .title {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
  }

  .newMemoForm {
    width: 460px;
    margin: 0 auto;
  }
}

.warnValue {
  color: red;
  padding: 5px 20px;
  text-align: right;
}
</style>
