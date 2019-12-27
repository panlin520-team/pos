<template>
  <div id="app">
    <div class="topBand" v-if="$route.meta.menubar">
      <div class="logo">
        <img src="http://47.108.29.183:8089/vue/logo.750ee0fb.png" />
      </div>
      <MenuBar></MenuBar>
      <div class="CompanyName">{{this.$store.state.storeName}}</div>
      <el-dropdown class="user" @command="handleCommand">
        <span class="el-dropdown-link">
          {{this.$store.state.trueName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div
      class="container"
      v-if="$route.meta.menubar"
      :style="{'min-height': (virtualHeight-80)+'px'}"
    >
      <NavMenu v-if="$route.meta.menubar"></NavMenu>
      <div :class="$route.meta.navbar == false ? 'main' : 'main active'">
        <PageContent></PageContent>
      </div>
    </div>

    <router-view v-else="!$route.meta.menubar" />
  </div>
</template>

<script>
import MenuBar from "@/components/MenuBar/MenuBar.vue";
import NavMenu from "@/components/NavMenu/NavMenu.vue";
import PageContent from "@/components/PageContent/PageContent.vue";
export default {
  components: { MenuBar, NavMenu, PageContent },
  data() {
    return {
      //店铺名称
      storeName: "",
      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  created() {},
  methods: {
    // 退出登录
    handleCommand(command) {
      if (command == "logout") {
        this.$confirm("确认退出登录吗？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({ path: "/login" });
            localStorage.removeItem("member");
            localStorage.removeItem("remark");
            localStorage.removeItem("memberName");
            localStorage.removeItem("memberNumber");
            localStorage.removeItem("membership");
            localStorage.removeItem("grade");
            localStorage.removeItem("list");
        localStorage.removeItem("headImgUrl");

            this.accounBalance = [];
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.topBand {
  .logo {
    margin: 10px 10px 0 30px;
    width: 200px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.CompanyName {
  width: 170px;
  white-space: pre-wrap;
  height: 80px;
  padding-top: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
}
.user {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 15px;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 20px;

  span {
    font-weight: 700;
  }
}
</style>
