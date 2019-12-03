<template>
 
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
            { index: "addpurchase", name: "添加入库采购" },
            { index: "addoutchase", name: "添加出库采购" },
            { index: "outwarehouse", name: "报废" }
          ]
        }
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