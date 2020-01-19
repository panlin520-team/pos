<template>
  <div class="statement">
    <!-- 财务中心 -->
    <div class="FinanceCenter" v-show="visible_Financs == false">
      <h1>财务中心</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_Financs">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>会员应收统计</span>
        </div>
        <div class="vipreceivable" @click="show_marketnancs">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>品项销售统计</span>
        </div>
      </div>
    </div>
    <!-- 会员应收统计分页 -->
    <div class="Customer" v-show="visible_Financs == true">
      
    </div>
    <!-- 品项销售统计分页 -->
    <div class="Customarket" v-show="visible_marketnancs == true">品项销售统计分页</div>
    <!-- 库存 -->
    <div class="inventory" v-show="visible_tory == false">
      <h1>库存</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_tory">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>库存量统计</span>
        </div>
      </div>
    </div>
    <!-- 库存分页 -->
    <div class="Custotory" v-show="visible_tory == true">库存</div>
    <!-- 会员 -->
    <div class="member" v-show="visible_member == false">
      <h1>会员</h1>
      <div class="FinanceList">
        <div class="vipreceivable" @click="show_member">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>会员消费排行</span>
        </div>
        <div class="vipreceivable" @click="show_condition">
          <p>
            <img src="../../assets/images/icon_bb02.png" alt />
          </p>
          <span>会员剩余品项</span>
        </div>
      </div>
    </div>
    <!-- 会员消费排行 -->
    <div class="Customember" v-show="visible_member == true">会员消费排行</div>
    <!-- 会员剩余品项 -->
    <div class="Custcondition" v-show="visible_condition == true">会员剩余品项</div>
  </div>
</template>

<script>
//import XX from '';
export default {
  components: {},
  data() {
    return {
      //会员应收统计
      visible_Financs: false,
      //品项销售统计
      visible_marketnancs: false,
      //库存分页
      visible_tory: false,
      //会员分页
      visible_member: false,
      //会员剩余品项
      visible_condition: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    //会员应收统计
    show_Financs(itemcar) {
      // this.visible_Financs = true;
    },
    //品项销售统计
    show_marketnancs() {
      // this.visible_marketnancs = true;
    },
    //库存分页
    show_tory(itemcar) {
      // this.visible_tory = true;
    },
    //会员分页
    show_member(itemcar) {
      // this.visible_member = true;
    },
    //会员剩余品项
    show_condition() {
      // this.visible_condition = true;
    }
  },
  created() {},
  mounted() {
  }
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.statement {
  width: 100%;
  height: 100%;
  .FinanceCenter {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  .inventory {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  .member {
    width: 100%;
    height: 250px;
    padding: 30px 0 0 30px;
    .FinanceList {
      display: flex;
      padding: 20px;
      .vipreceivable {
        width: 120px;
        height: 120px;
        margin-right: 50px;
        text-align: center;
        padding-top: 10px;
      }
    }
  }
  //切换分页
  .Customer {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Customarket {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Custotory {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Customember {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
  .Custcondition {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
  }
}
</style>