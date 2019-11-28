<!-- 登录 -->
<template>
  <div class="loginPage">
    <div class="loginForm">
      <div class="title">系统Post平台</div>
      <div class="label" @click="drawer = true">
        <input type="text" v-model="storeName" placeholder="选择门店" disabled class="btn-pointer" />
        <span class="el-icon-arrow-right"></span>
      </div>
      <div class="label">
        <input type="text" v-model="userName" placeholder="用户名" />
      </div>
      <div class="label">
        <input type="password" v-model="password" placeholder="密码" />
      </div>
      <div class="label">
        <div class="btn-login" @click="login">登录</div>
      </div>
    </div>
    <!-- 门店列表 -->
    <el-drawer
      custom-class="storeDrawer"
      :show-close="false"
      :visible.sync="drawer"
      :modal="false"
      size="23%"
    >
      <div class="title" slot="title">选择店铺</div>
      <div class="search">
        <span class="icon el-icon-search"></span>
        <input v-model="storeValue" type="text" placeholder="店铺编号查询" />
        <div class="btn btn-search" @click="fetchStore(storeValue)">查询</div>
      </div>
      <div class="results" v-if="storeData != ''">
        <div
          class="resultItem"
          v-for="(item,index) in storeData"
          :key="index"
          @click="setStore(item)"
        >{{item.code}}-{{item.name}}</div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      storeData: [],

      // 门店显示(抽屉)
      drawer: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 登录
    login() {
      var url = this.$https.authHost + "/manager/authority/storeLogin";
      var params = {
        storeCode: this.storeCode,
        userName: this.userName,
        password: this.password
      };
      if (!params.storeCode || params.storeCode == "") {
        this.$message.error("请选择店铺");
        this.drawer = true;
        return false;
      }
      if (params.username == "") {
        this.$message.error("请输入用户名");
        return false;
      }
      if (params.password == "") {
        this.$message.error("请输入密码");
        return false;
      }
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            // 避免错误出现阻止跳转
            this.$router.replace({ path: "/" }).catch(err => {});
            // 设置本地存储
            localStorage.setItem("storeName", this.storeName);
            localStorage.setItem("storeCode", res.data.result.storeCode);
            localStorage.setItem("storeId", res.data.result.storeId);
            localStorage.setItem("userName", res.data.result.userName);
            localStorage.setItem("userId", res.data.result.id);
            localStorage.setItem("trueName", res.data.result.trueName);
            localStorage.setItem("isLogin", true);
          } else {
            this.$message.error(res.data.responseStatusType.error.errorMsg);
          }
        })
        .catch(err => {
          this.$message.error("登录失败，网络出现错误!");
        });
    },
    // 选择门店
    setStore(i) {
      this.storeName = i.name;
      this.storeCode = i.code;
      this.drawer = false;
    },
    // 查询门店数据获取
    fetchStore(i) {
      if (i != "") {
        var params = {
          code: i
        };
        var url =
          this.$https.storeHost + "/manage/store/selectStoreByCodeOrName";
        this.$https
          .fetchPost(url, params)
          .then(res => {
            if (res.data.result) {
              this.storeData = res.data.result;
            } else {
              this.$message({
                message: res.data.responseStatusType.error.errorMsg,
                type: "warning"
              });
              this.storeData = [];
            }
          })
          .catch(err => {
            this.$message.error("查询门店数据获取失败");
          });
      } else {
        this.$message.error("请输入门店编号查询");
      }
    },
    // 是否已登录
    logined() {
      if (localStorage.getItem("isLogin") != null) {
        this.storeName = localStorage.getItem("storeName");
        this.storeCode = localStorage.getItem("storeCode");
        this.userName = localStorage.getItem("userName");
        this.userId = localStorage.getItem("userId");
        this.storeId = localStorage.getItem("storeId");
      }
    }
  },
  created() {
    this.logined();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
.loginPage {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("../../assets/images/icon_icon2.png") no-repeat;

  .loginForm {
    width: 360px;
    height: 400px;
    padding: 5px 30px;
    position: absolute;
    right: 400px;
    top: 200px;
    border-radius: 5px;
    background: #23a547;

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
      
      span {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
      }

      .btn-login {
        font-size: 16px;
        height: 40px;
        line-height: 40px;
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
  background: #47bf7c;

  .title {
    font-weight: 700;
    text-align: center;
  }

  .search {
    position: relative;
    display: flex;
    overflow: hidden;
    border-radius: 6px;

    .icon {
      position: absolute;
      top: 12px;
      left: 0;
      font-size: 16px;
      color: #bbb;
    }

    input {
      flex: 1;
      padding-left: 25px;
    }

    .btn-search {
      cursor: pointer;
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #ffffff;
      background: #47bf7c;
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
