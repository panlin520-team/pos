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
          title: "体验卡",
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
            { index: "timelyinvent", name: "即时库存" },
            { index: "/Otherwarehouse", name: "其他入库" },
            { index: "/Inventory/AddPurchase", name: "添加入库采购" }
          ]
        }
        // {
        //   index: "3",
        //   cls: "el-icon-circle-plus",
        //   title: "进货管理",
        //   children: [
        //     { index: "/home/stockControl", name: "添加库存" },
        //     { index: "/home/addRepertory", name: "库存管理" },
        //     { index: "/home/statement", name: "统计报表" }

        //   ]
        // },
        // {
        //   index: "4",
        //   cls: "el-icon-remove",
        //   title: "出货管理",
        //   children: [
        //     { index: "/home/marketList", name: "销售列表" },
        //     { index: "/home/clearout", name: "商品出库" },
        //     { index: "/home/sales", name: "商品退货" },
        //   ]
        // },
        // {
        //   index: "5",
        //   cls: "el-icon-s-data",
        //   title: "统计管理",
        //   children: [
        //     { index: "/home/sta", name: "销售统计" },
        //     { index: "/home/stocksta", name: "进货统计" }
        //   ]
        // },
        // {
        //   index: "6",
        //   cls: "el-icon-s-custom",
        //   title: "会员管理",
        //   children: [
        //     { index: "/home/xxxx", name: "账号管理" },
        //     { index: "/home/yyyyy", name: "添加账号" }
        //   ]
        // },
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