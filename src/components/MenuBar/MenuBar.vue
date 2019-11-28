<!-- 菜单 -->
<template>
  <el-menu
    :default-active="$route.path"
    router
    :unique-opened="true"
    class="el-menu-vertical-demo menubar"
    active-text-color="#47bf7c"
    :style="{'height': (virtualHeight-125)+'px'}"
  >
    <el-menu-item index="/">
      <span slot="title">收银台</span>
    </el-menu-item>

    <el-menu-item index="/appointment">
      <span slot="title">预约</span>
    </el-menu-item>

    <el-menu-item index="/project">
      <span slot="title">定制项目</span>
    </el-menu-item>

    <el-menu-item index="/employees">
      <span slot="title">员工</span>
    </el-menu-item>

    <el-submenu index="3">
      <template slot="title">
        <span>体验卡</span>
      </template>
      <el-menu-item index="/expCards">体验卡</el-menu-item>
      <el-menu-item index="/expcarList">体验卡列表</el-menu-item>
    </el-submenu>

    <el-submenu index="4">
      <template slot="title">
        <span>财务</span>
      </template>
      <el-menu-item index="/performancequery">业绩</el-menu-item>
      <el-menu-item index="/incomequery">收益</el-menu-item>
    </el-submenu>

    <el-menu-item index="/customer">
      <span slot="title">客户</span>
    </el-menu-item>

    <el-submenu index="6">
      <template slot="title">
        <span>库存</span>
      </template>
      <el-menu-item index="/addpurchase">采购入库</el-menu-item>
      <el-menu-item index="/Otherwarehouse">其他入库</el-menu-item>
      <el-menu-item index="/timelyinvent">即时库存</el-menu-item>
      <el-menu-item index="/addoutchase">出库</el-menu-item>
      <el-menu-item index="/outwarehouse">报废</el-menu-item>
    </el-submenu>

    <el-menu-item index="/statement">
      <span slot="title">报表</span>
    </el-menu-item>
    
     <el-menu-item index="/memo">
      <span slot="title">水单号</span>
    </el-menu-item>

    <el-menu-item index="/setting">
      <span slot="title">设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "MenuBar",
  data() {
    return {
      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  created() {},
  destroyed() {},
  methods: {}
};
</script>

<style lang='scss' scoped>
.el-menu {
  border-right: 0;
  height: 100%;
}

.menubar {
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 15px;
}
</style>
