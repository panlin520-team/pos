<template>
  <div class="cope">
    <!-- 
        default-active="2"  默认选中的菜单项,值为菜单的index属性值
        @open="handleOpen"  菜单打开时的事件监听
        @close="handleClose"菜单关闭时的事件监听
        unique-opened  : 是否唯一开启一个菜单
        router    :      是否以当前选中菜单的index来作为路由地址

    -->
    <el-menu
      :default-active="$route.fullPath"
      class="el-menu-vertical-demo"
      unique-opened
      router
      background-color="#23A547"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu :index="cope.index" v-for="cope in treelist" :key="cope.index">
        <template slot="title">
          <i :class="cope.cls"></i>
          <span>{{cope.title}}</span>
        </template>
        <el-menu-item-group v-for="memane in cope.children" :key="memane.index">
          <el-menu-item :index="memane.index">{{memane.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 动态菜单创建
      treelist: [
        {
          index: "1",
          cls: "el-icon-s-cooperation",
          title: "体验卡",
          tit
          children: [
            { index: "/expcards", name: "体验卡卡片" },
            { index: "/expcardslist", name: "体验卡卡片列表" }
          ]
        },
       {
          index: "2",
          cls: "el-icon-s-goods",
          title: "库存",
          children: [
            { index: "/timelyinvent", name: "即时库存" },
            { index: "/Otherwarehouse", name: "其他入库" },
            { index: "/AddPurchase", name: "添加入库采购" },
            { index: "/AddOutChase", name: "添加出库采购" },
            { index: "/OutWarehouse", name: "报废" },

          ]
        },
        
      ]
    };
  }
};
</script>
<style lang="scss">
.menu {
  height: 100%;

  ul.el-menu {
    height: 100%;
  }
}
</style>