<!-- 登录 -->
<template>
  <div class="loginPage">
    <div class="loginForm">
      <div class="title">俪凝美聚</div>
      <!-- <div class="label" @click="storeDrawer = true">
        <input type="text" v-model="storeName" placeholder="选择门店" disabled class="btn-pointer" />
        <i class="el-icon-arrow-right"></i>
      </div>-->
      <div class="label">
        <input type="text" v-model="userName" placeholder="用户名" @keyup.enter="login" />
      </div>
      <div class="label">
        <input type="password" v-model="password" placeholder="密码" @keyup.enter="login" />
      </div>
      <div class="label">
        <div class="btn-pointer btn-login" @click="login">登录</div>
      </div>
    </div>
    <!-- 门店列表 -->
    <!-- <el-drawer
      custom-class="storeDrawer"
      :show-close="false"
      :visible.sync="storeDrawer"
      :modal="false"
      size="300px"
    >
      <div class="title" slot="title">选择店铺</div>
      <div class="search">
        <el-input placeholder="店铺编号" v-model="storeValue">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="btn-pointer btn-search" @click="fetchStore(storeValue)">查询</div>
      </div>
      <div class="results">
        <div
          class="resultItem"
          v-for="(item,index) in storeData"
          :key="index"
          @click="setStore(item)"
        >{{item.code}}-{{item.name}}</div>
      </div>
    </el-drawer>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 数据
      // 门店名称
      storeName: "",
      // 门店编号
      storeCode: "",
      // 门店id
      storeId: "",
      // 用户名
      userName: "",
      // 密码
      password: "",
      // 门店编号搜索输入值
      storeValue: "",
      // 门店搜索结果数据
      storeData: null,

      // 抽屉弹框
      //  显示查询门店
      storeDrawer: false
    };
  },
  created() {
    this.logined();
  },
  methods: {
    login() {
      this.storeName = localStorage.getItem("storeName");
    },
    // 登录
    login() {
      var url = this.$https.authHost + "/manager/authority/storeLogin";
      var params = {
        // storeCode: this.storeCode,
        userName: this.userName,
        password: this.password
      };

      // if (this.storeCode == "") {
      //   this.$message.error("请选择店铺");
      //   this.storeDrawer = true;
      //   return false;
      // }

      if (this.username == "") {
        this.$message.error("请输入用户名");
        return false;
      }

      if (this.password == "") {
        this.$message.error("请输入密码");
        return false;
      }

      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            // 避免错误出现阻止跳转
            this.$router.replace({ path: "/" }).catch(err => {});
            // 本地存储
            localStorage.setItem("storeCode", res.data.result.storeCode);
            localStorage.setItem("storeId", res.data.result.companyId);
            localStorage.setItem("userName", res.data.result.userName);
            localStorage.setItem("userId", res.data.result.id);
            localStorage.setItem("industryID", res.data.result.industry);
            localStorage.setItem("trueName", res.data.result.trueName);
            localStorage.setItem("storeName", res.data.result.companyName);
            localStorage.setItem("stockCode", res.data.result.stockCode);
            localStorage.setItem("orgK3Number", res.data.result.orgK3Number);
            localStorage.setItem("stockId", res.data.result.stockId);
            localStorage.setItem("parentParentCompanyId", res.data.result.parentParentCompanyId);
            this.$store.commit("setTrueName", res.data.result.trueName);
            this.$store.commit("setStoreName", res.data.result.companyName);
            localStorage.setItem("isLogin", "true");
          } else {
            this.$message.error(res.data.responseStatusType.error.errorMsg);
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

    // 选择门店
    // setStore(i) {
    //   localStorage.setItem("storeName", i.name);
    //   this.storeName = i.name;
    //   this.storeCode = i.code;
    //   this.storeDrawer = false;
    // },

    // 查询门店数据获取
    // fetchStore(value) {
    //   if (value) {
    //     var params = {
    //       code: value
    //     };
    //     var url =
    //       this.$https.storeHost + "/manage/store/selectStoreByCodeOrName";
    //     this.$https.fetchPost(url, params).then(
    //       res => {
    //         if (res.data.result) {
    //           this.storeData = res.data.result;
    //         } else {
    //           this.$message({
    //             message: res.data.responseStatusType.error.errorMsg,
    //             type: "warning"
    //           });
    //           this.storeData = null;
    //         }
    //       },
    //       error => {
    //         this.$message({
    //           type: "error",
    //           message: error
    //         });
    //       }
    //     );
    //   } else {
    //     this.$message({
    //       type: "warning",
    //       message: "请输入门店编号"
    //     });
    //   }
    // },

    // 获取本地登录信息
    logined() {
      if (localStorage.getItem("isLogin") == "true") {
        this.storeName = localStorage.getItem("storeName");
        this.storeCode = localStorage.getItem("storeCode");
        this.userName = localStorage.getItem("userName");
        this.userId = localStorage.getItem("userId");
        this.storeId = localStorage.getItem("storeId");
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.loginPage {
  position: relative;
  background: url("http://47.108.29.183:8089/vue/loginBack.png") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;

  .loginForm {
    width: 360px;
    height: 360px;
    padding: 5px 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 5px;
    background: rgba(35, 165, 71, 0.8);

    .title {
      height: 80px;
      font-size: 26px;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 80px;
    }

    .label {
      position: relative;
      height: 50px;
      line-height: 50px;
      margin-bottom: 30px;
      border-radius: 5px;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      input {
        display: block;
        width: 100%;
        height: 50px;
        text-align: center;

        &:disabled {
          color: #101010;
          -webkit-text-fill-color: #101010;
        }
      }

      i {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
      }

      .btn-login {
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 5px;
        margin: 0 auto;
        background: #feb019;
        color: #ffffff;
      }
    }
  }
}

.storeDrawer {
  .title {
    font-size: 17px;
    text-align: center;
  }

  .search {
    position: relative;
    display: flex;
    margin: 0 15px;

    .btn-search {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #ffffff;
      background: #23a547;
      border-radius: 5px;
      margin-left: 5px;
    }
  }

  .results {
    margin: 15px;

    .resultItem {
      cursor: pointer;
      padding: 15px 0;
      line-height: 20px;
      font-size: 14px;
      border-bottom: 1px dashed #bbb;
    }
  }
}
</style>
