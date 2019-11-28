<!-- 登录 -->
<template>
  <div class="loginPage">
    <!-- 登录 -->
    <!-- <div class="logo">
      <img src="http://47.108.29.183:8089/vue/logo.5d1ff05b.png" alt />
    </div>-->
     <!-- <div class="loginlogo">
      <img src="../../assets/images/icon_loginlogo.png" alt />
    </div>
   <div class="loginCircle">
      <img src="../../assets/images/icon_loginCircle.png" alt />
    </div>
    <div class="loginhome">
      <img src="../../assets/images/icon_loginhone.png" alt />
    </div>
    <div class="loginmountain">
      <img src="../../assets/images/icon_loginmountain.png" alt />
    </div>
    <div class="mountainone">
      <img src="../../assets/images/icon_mountain1.png" alt />
    </div>
    <div class="mountaintwo">
      <img src="../../assets/images/icon_mountain2.png" alt />
    </div> -->
    <div class="loginBlank">
      <div class="logintop">系统Post平台</div>
      <div class="btn inputs" @click="drawer = true">
        <input type="text" v-model="storeName" placeholder="选择门店" disabled />
        <span class="el-icon-arrow-right"></span>
      </div>
      <div class="inputs">
        <input type="text" v-model="userName" placeholder="用户名" />
      </div>
      <div class="inputs">
        <input type="password" v-model="password" placeholder="密码" />
      </div>
      <div class="btnGroup">
        <div class="btn" @click="login">登录</div>
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
  components: {},
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
  // padding-top: 100px;
  // text-align: center;
  position: relative;
  background: url('../../assets/images/icon_icon2.png') no-repeat;
  // background: linear-gradient(
  //   225deg,
  //   rgba(35, 165, 71, 1),
  //   rgba(102, 197, 108, 1)
  // );
  .loginlogo {
    padding: 35px;
  }
  .loginhome {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .loginCircle {
    position: absolute;
    bottom: 280px;
  }
  .mountainone {
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    img {
      width: 100%;
    }
  }
  .mountaintwo {
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
    img {
      width: 100%;
    }
  }
  .loginmountain {
    position: absolute;
    bottom: 50px;
    z-index: 100;
  }
  .loginBlank {
    display: inline-block;
    margin-top: 50px;
    width: 335px;
    height: 425px;
    position: absolute;
    right: 550px;
    top: 150px;
    border-radius: 4px;
    background: rgba(35, 165, 71, 1);
    .logintop {
      height: 85px;
      font-size: 29px;
      font-family: SimHei;
      font-weight: 400;
      text-align: center;
      color: rgba(255, 255, 255, 1);
      line-height: 76px;
    }
    .inputs {
      position: relative;
      width: 266px;
      height: 50px;
      margin-left: 30px;
      border-radius: 5px;
      margin-bottom: 15px;
      padding: 10px;
      background-color: #ffffff;
      border: 1px solid #dcdfe6;
      input {
        width: 100%;
        height: 30px;
        padding: 0;
        line-height: 30px;
        background-color: transparent;
        text-align: center;

        &:disabled {
          color: #333;
          -webkit-text-fill-color: #333;
        }
      }

      &.btn input {
        cursor: pointer;
      }

      span {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
      }
    }
    .btnGroup {
      width: 200px;
      height: 40px;
      background: #feb019;
      border-radius: 6px;
      margin: 50px auto;
      line-height: 40px;
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
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
