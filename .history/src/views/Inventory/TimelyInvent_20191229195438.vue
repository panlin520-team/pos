<!-- 定制-->
<template>
  <div class="AddMerchandise">
    <h1>即时库存</h1>
    <div class="merchantitle">
      <el-select v-model="value_project" @change="selectpoject" placeholder="请选择">
        <el-option
          v-for="item in option_project"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <el-select v-model="value_online" @change="selectwire" placeholder="请选择">
        <el-option
          v-for="item in option_online"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
    </div>
    <div class="merchantList">
      <el-table :data="storageList">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="编号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="showpoject(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChangeside"
          @current-change="handleCurrentChangeside"
          :current-page.sync="currentPage2"
          :page-size="pagesize2"
          background
          layout="total, prev, pager, next"
          :total="pagetotal2"
        ></el-pagination>
         <PopOver
      custom-class="storageblockcard"
      :visible.sync="visible_card"
      @close="closePopcard"
      width="500px"
    >
      <div class="stgblcktop" slot="top">{{vardName}}</div>
      <div class="stgblcktopmain" slot="main">
        <div class="cardlist">
          <label>销量：</label>
          <span>{{salesVolume}}</span>
        </div>
        <div class="cardlist">
          <label>剩余库存：</label>
          <span>{{stockNum}}</span>
        </div>
        <div class="cardlist">
          <label>截止日期：</label>
          <span>{{purchaseDeadline}}</span>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom"></div>
    </PopOver>
      </div>
    </div>

    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  name: "AddMerchandise",
  components: { MemberFrame },

  data() {
    return {
      multipleSelection: [],
      //外面产品列表
      storageList: [],
      //弹出框
      visible_examine: false,
      flag: true,
      //里面类
      value_somepojiet: "1",

      //外面翻页
      currentPage2: 1,
      pagesize2: 10,
      pagetotal2: 0,
      //当前商品productCode
      productCode: "",
      //线上线下
      value_online2: "2",
      //外面产品类型
      option_project: [
        {
          value: "1",
          label: "产品"
        },
        {
          value: "2",
          label: "服务"
        }
      ],
      value_project: "1",
      //线上线下
      option_online: [
        {
          value: "1",
          label: "上架"
        },
        {
          value: "2",
          label: "下架"
        }
      ],
      value_online: "1",
      //新数组
      multiplelist: [],
      //下架
      btnText: "下架",
      productCods: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //外面翻页
    handleSizeChangeside(val) {
      setTimeout(() => {
        this.commodityoutData();
      }, 300);
    },
    handleCurrentChangeside(val) {
      setTimeout(() => {
        this.commodityoutData();
      }, 300);
    },
    //选中外面类
    selectpoject() {
      this.commodityoutData();
    },
    //查看
    showpoject(res) {
      this.productCods = res.productCode;
      this.commodityose();
    },
    //提取选中商品
    extractchans() {
      this.multiplelist = [];
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach(value => {
          this.multiplelist.push(value.productCode);
        });
        //获取选中商品
        this.extractData();
      } else {
        this.$message({
          message: "请选择商品",
          type: "warning"
        });
      }
    },
    //查看即时库存
    commodityose() {
      var url = this.$https.productHost + "/stock/selectProductNumber";
      var params = {
        stock: localStorage.getItem("stockCode"),
        productCode: this.productCods
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //获取外面商品数据
    commodityoutData() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        companyId: localStorage.getItem("storeId"),
        page: this.currentPage2,
        limit: this.pagesize2,
        type: this.value_project,
        productStatus: this.value_online,
        keyWord: "",
        companyType: 3,
        isHoutai: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
            this.storageList = res.data.result.list;
            this.pagetotal2 = res.data.result.total;
            this.pagesize2 = res.data.result.size;
          } else {
            this.storageList = [];
            this.pagetotal2 = 0;
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //下架
    soldOut() {
      var url = this.$https.productHost + "/manage/product/onOffSale";
      var params = {
        companyId: localStorage.getItem("storeId"),
        productCode: this.productCode,
        productStatus: this.value_online2,
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Success") {
            this.commodityoutData();
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //提交商品
    extractData() {
      var url = this.$https.productHost + "/manage/product/addProductStore";
      var params = {
        storeId: localStorage.getItem("storeId"),
        productCode: JSON.stringify(this.multiplelist),
        type: this.value_somepojiet
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result == null) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.visible_examine = false;
            // location.reload();
            this.commodityoutData();
          } else {
            this.$message({
              message:
                "提取成功！但是以下商品已经存在无法提取" +
                JSON.stringify(res.data.result),
              type: "warning"
            });
          }
        })
        .catch(err => {});
    }
  },
  created() {},
  mounted() {
    this.commodityoutData();
  }
};
</script>

<style lang='scss'>
.AddMerchandise {
  width: 100%;
  h1 {
    padding: 50px 0 0 50px;
  }
  .merchantitle {
    width: 100%;
    height: 100px;
    padding-top: 40px;
    margin-bottom: 30px;

    .el-select {
      margin-left: 70px;
    }
    .el-button {
      margin-left: 50px;
    }
  }
  .merchantList {
    width: 100%;
    height: 100%;
    .block {
      text-align: center;
      margin-top: 20px;
    }
    .el-table {
      width: 90%;
      margin: 0 auto;
      border-radius: 6px;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    }
  }
}
//出入库弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    padding-top: 10px;
  }
  .stgblcktopmain {
    padding: 15px 0 0 20px;
    height: 100%;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .merchansomelist {
      width: 100%;
      height: 300px;
      overflow: auto;
      margin-top: 15px;
    }
    .el-button {
      margin-left: 30px;
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
