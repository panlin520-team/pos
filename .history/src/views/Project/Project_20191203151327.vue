<!-- 定制-->
<template>
  <div class="customization-page_root">
    <el-row>
      <el-col>
        <p class="title">收银产品</p>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.commodityTypeID"
            :label="item.commodityTypeName"
            :name="item.commodityTypeName"
          >
            <el-tabs
              type="border-card"
              v-if="visible_common == false"
              v-model="activeName_common"
              @tab-click="commonleClick"
            >
              <!-- 项目盒子 -->
              <el-tab-pane
                v-for="(item) in productbleTabs"
                :key="item.commoTypeID"
                :label="item.subclassName"
                :name="item.subclassName"
              >
                <!-- {{item.content}} -->
                <el-row :gutter="20" class="el_carconnent">
                  <div class="carBox">
                    <div
                      class="grid-content"
                      v-for="item in productmodel"
                      :key="item.index"
                      @click="car_smreos(item)"
                    >
                      <div class="pd-content">
                        <span>{{item.productName}}</span>
                      </div>
                      <div class="bottom-content">
                        <span class="left-list">
                          <span class="figure-title">￥：</span>
                          <span class="figure">{{item.retailPrice}}</span>
                          元
                        </span>
                        <span class="right-list">
                          <span class="figure-title">库存：</span>
                          <span class="figure">{{item.stockNum}}</span>个
                        </span>
                      </div>
                    </div>
                  </div>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <!-- 商品 -->
            <el-tabs
              type="border-card"
              v-if="visible_merchandise == true"
              v-model="activeName_common"
              @tab-click="commonleClis"
            >
              <!-- 项目盒子 -->
              <el-tab-pane
                v-for="(item) in productbleTabdise"
                :key="item.productTypeId"
                :label="item.productTypeName"
                :name="item.productTypeName"
              >
                <!-- {{item.content}} -->
                <el-row :gutter="20" class="el_carconnent">
                  <div class="carBox">
                    <div
                      class="grid-content"
                      v-for="item in productmodtab"
                      :key="item.index"
                      @click="car_smreos(item)"
                    >
                      <div class="pd-content">
                        <span>{{item.productName}}</span>
                      </div>
                      <div class="bottom-content">
                        <span class="left-list">
                          <span class="figure-title">￥：</span>
                          <span class="figure">{{item.retailPrice}}</span>
                          元
                        </span>
                        <span class="right-list">
                          <span class="figure-title">库存：</span>
                          <span class="figure">{{item.stockNum}}</span>个
                        </span>
                      </div>
                    </div>
                  </div>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <!-- 体验卡 -->
          </el-tab-pane>

          <!-- <el-tab-pane label="产品" name="second">产品</el-tab-pane> -->
        </el-tabs>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next"
          :total="pageTotal"
        ></el-pagination>
      </el-col>
      <!-- 右边内容 -->
      <el-col>
        <div class="list-content-right">
          <div class="project-header">
            <p class="project-title">项目定制订单</p>
            <div class="project-name">
              <img src="../../assets/images/member.png" alt />
              <span class="name">
                姓名：
                <span class="name-message">{{userNames}}</span>
              </span>
            </div>
          </div>
          <!-- 列表 -->
          <div class="list-content">
            <el-table :data="tableDataList" class="table-box">
              <el-table-column label="项目名称" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.productName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <input
                      @change="changeNumer(scope.row)"
                      type="number"
                      v-model="scope.row.amount"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <input
                      type="number"
                      @change="changeRefer(scope.row)"
                      v-model="scope.row.retailPrice"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="原价" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.retailPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="总价" width="80">
                <template slot-scope="scope">
                  <div
                    slot="reference"
                    class="name-wrapper"
                  >{{ scope.row.amount * scope.row.retailPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="compile" label="编辑">
                <template slot-scope="scope">
                  <el-button @click="removeBtn(scope.row,scope.$index)" type="danger" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 底部信息 -->
          <div class="bottom-box">
            <div class="demo-input-suffix">
              备注：
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="display-box">
              <div class="price-display">
                <p>
                  原价：
                  <span class="price">{{totalPrice}}</span>
                  <span class="price-unit">元</span>
                </p>
                <p>
                  总价：
                  <span class="price">{{totalPrice}}</span>
                  <span class="price-unit">元</span>
                </p>
              </div>
              <div class="button-srue">
                <el-button @click="placeOrder " type="warning">确认定制</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 产品弹出框 -->
    <!-- 弹出框 -->
    <PopOver
      custom-class="storageblock"
      :visible.sync="visible_examine"
      @close="closePopOver"
      width="518px"
    >
      <div class="stgblcktop" slot="top">支付信息</div>
      <div class="stgblcktopmain" slot="main">
        <div class="paymentprice">
          <div class="stgeprice">
            <label>原价：</label>
            <span>{{totalPrice}}元</span>
          </div>
          <div class="stgeprice">
            <label>总价：</label>
            <span>{{totalPrice}}元</span>
          </div>
        </div>
        <div>
          <div class="catalysis">
            <el-radio-group @change="input_radio" v-model="input_cataly" size="mini" class="ratio">
              <el-radio :label="3">线下</el-radio>
              <el-radio :label="4">线上</el-radio>
            </el-radio-group>
            <el-input v-model="input_present" placeholder="请输入储蓄支付"></el-input>
          </div>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom">
        <el-button @click="cancel_storage">取消</el-button>
        <el-button @click="confirm_storage" type="success">确认购买</el-button>
      </div>
    </PopOver>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  name: "Navnu",
  components: { MemberFrame },
  data() {
    return {
      activeName: "项目",
      activeName_common: "洗吹",
      currentPage3: 5,
      input: "",
      //当前页
      pageSize: 9,
      //会员名
      userNames: "",
      //总页
      pageTotal: 0,
      //单选
      radio: "1",
      //赠送支付
      input_present: "",
      //ID
      commodityTypeID: "",
      //kind
      productKindId: "1",
      //线上或线下
      payTypeName: "",
      //密码
      secret: "",
      //计算总价
      totalPrice: "0",
      //NAME
      commodityTypeName: "",
      //ID
      subclassID: "",
      //NAME
      subclassName: "",
      //储蓄支付
      input_cataly: "",
      //弹出框
      visible_examine: false,
      visible_common: false,
      visible_merchandise: false,
      //新数组
      newtableDatas: [],
      //商品
      productbleTabdise: [],
      //默认数量
      amount: "1",
      kind: "",
      //库存数量
      stockNum: "",
      tableDataList: [],
      //收银产品项目
      editableTabs: [
        {
          name: "haha"
        }
      ],
      productbleTabs: [],
      //项目单个数据
      productmodel: [],
      //商品内容
      productmodtab: []
    };
  },
  computed: {},
  watch: {
  },
  methods: {
    calcTotalPrice: function() {
      this.totalPrice = 0; //总金额进行清零
      this.tableDataList.forEach((item, index) => {
        if (item) {
          this.totalPrice += item.amount * item.retailPrice; //累加的
        }
      });
    },
    //点击添加订单
    car_smreos(res) {
      var object = {
        amount: this.amount,
        productCode: res.productCode,
        subclassId: res.subClassID,
        productType: res.productType,
        productNum: this.amount,
        productName: res.productName,
        retailPrice: res.retailPrice,
        originalPrice: res.retailPrice,
        discount: 1,
        discountPrice: res.retailPrice
      };
      res = Object.assign({}, object);
      this.tableDataList.push(res);
      //计算
      this.calcTotalPrice();
    },
    handleClick(tab, event) {
      if (event.target.getAttribute("id") == "tab-项目") {
        this.commodityTypeID = 1;
        this.commodityTypeName = "项目";
        //小类
        this.projectsubclass();
        this.visible_common = false;
        this.visible_merchandise = false;
      } else if (event.target.getAttribute("id") == "tab-商品") {
        this.commodityTypeID = 2;
        this.commodityTypeName = "商品";
        this.merchandise();
        this.visible_common = true;
        this.visible_merchandise = true;
      } else if (event.target.getAttribute("id") == "tab-卡项") {
        this.commodityTypeID = 3;
        this.commodityTypeName = "卡项";
        //小类
        this.projectsubclass();
      } else if (event.target.getAttribute("id") == "tab-test") {
        this.commodityTypeID = 4;
        this.commodityTypeName = "test";
        //小类
        this.projectsubclass();
      }
    },

    //项目里面点击切换
    commonleClick(tab) {
      if (event.target.getAttribute("id") == "tab-洗吹") {
        this.subclassID = 1;
        this.subclassName = "洗吹";
      } else if (event.target.getAttribute("id") == "tab-洗剪吹") {
        this.subclassID = 2;
        this.subclassName = "洗剪吹";
      } else if (event.target.getAttribute("id") == "tab-烫发") {
        this.subclassID = 3;
        this.subclassName = "烫发";
      } else if (event.target.getAttribute("id") == "tab-染发") {
        this.subclassID = 4;
        this.subclassName = "染发";
      } else if (event.target.getAttribute("id") == "tab-剪发") {
        this.subclassID = 5;
        this.subclassName = "剪发";
      }
      this.projectsubsmall();
    },
    //点击商品切换s
    commonleClis(tab) {
      if (event.target.getAttribute("id") == "tab-美容") {
        this.productKindId = 1;
      } else if (event.target.getAttribute("id") == "tab-护肤") {
        this.productKindId = 2;
      }
      this.merchandisess();
    },
    //分页
    handleSizeChange(val) {
      setTimeout(() => {
        this.merchandisess();
      }, 300);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.merchandisess();
      }, 300);
    },
    //改变数量
    changeNumer(res) {
      if (res.amount < 1) {
        res.amount = 1;
      }
      //计算
      this.calcTotalPrice();
    },
    //改变数量
    changeRefer(res) {
      if (res.retailPrice < 1) {
        res.retailPrice = 1;
      }
      //计算
      this.calcTotalPrice();
    },
    //改变Value值
    input_radio() {
      if (this.input_cataly == 3) {
        this.payTypeName = "线下";
      } else {
        this.payTypeName = "线上";
      }
    },
    //点击删除订单
    removeBtn(res, index) {
      this.amount = res.amount;
      // this.stockNum += 1;
      this.stockNum = parseInt(this.stockNum) + parseInt(this.amount);
      this.tableDataList.splice(index, 1);
      //计算
      this.calcTotalPrice();
    },

    closePopOver() {
      this.visible_examine = false;
    },
    //确认添加
    confirm_storage() {
      if (this.input_cataly !== "") {
        if (this.input_present !== "") {
          this.endOrder();
          this.PlacementPrivate();
          this.projectsubclass();
          this.projectsubsmall();
          this.merchandise();
          this.merchandisess();
          setTimeout(() => {
            location.reload();
          }, 1500);

          this.tableDataList = [];
          this.visible_examine = false;
        } else {
          this.$message({
            message: "警告哦，请选择支付金额...",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "警告哦，请选择支付方式...",
          type: "warning"
        });
      }
    },
    cancel_storage() {
      this.visible_examine = false;
    },
    //确认下单
    placeOrder() {
      if (this.totalPrice > 0) {
        this.$confirm("是否确认下单...", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.$message({
            //   type: "success",
            //   message: "确定下单！"
            // });
            this.visible_examine = true;
            //下单
            this.affirmplOrder();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消下单！"
            });
          });
      } else {
        this.$message({
          message: "警告哦，请选择商品...",
          type: "warning"
        });
      }
    },

    //获取定制项目列表
    PlacementPrivate() {
      var url = this.$https.dataHost + "/commodityType/selectCommodityTypeList";
      var params = {
        isDingzhi: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            this.editableTabs = res.data.result.list;
            this.projectsubclass(res.data.result.list[0].commodityTypeID);
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("定制项目列表请求错误...");
        });
    },
    //项目小类
    projectsubclass() {
      var url =
        this.$https.dataHost + "/commodityType/selectSubclassByCondition";
      var params = {
        commodityTypeID: this.commodityTypeID
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.productbleTabs = res.data.result.list;
            this.projectsubsmall(res.data.result.list[0].subclassID);
          } else {
            // this.productbleTabs = []
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("项目小类列表提交请求错误...");
        });
    },
    //项目小类中小项目
    projectsubsmall() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        subClassId: this.subclassID,
        storeId: localStorage.getItem("storeId"),
        type: 2,
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.productmodel = res.data.result.list;
            this.pageTotal = res.data.result.total;
          } else {
            this.productmodel = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("项目小类中小项目列表提交请求错误...");
        });
    },
    //商品分类
    merchandise() {
      const _this = this;
      var url = this.$https.productHost + "/productKind/selectProductKind";
      var params = {};

      this.$https
        .fetchPost(url, params)

        .then(res => {
          // debugger;
          if (res.data.result) {
            _this.productbleTabdise = res.data.result;
            _this.kind = res.data.result[0].productKindId;
            this.merchandisess(res.data.result[0].productKindId);
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("商品提交请求错误...");
        });
    },
    //商品
    merchandisess() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        kind: this.productKindId,
        storeId: localStorage.getItem("storeId"),
        type: 1,
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            this.productmodtab = res.data.result.list;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("商品提交请求错误...");
        });
    },
    //确认下单
    affirmplOrder() {
      var url = this.$https.orderHost + "/order/createServiceOrder";
      var params = {
        orderType: 4,
        channel: 2,
        storeId: localStorage.getItem("storeId"),
        cardNum: localStorage.getItem("membership"),
        orderLink: localStorage.getItem("memberName"),
        mobile: localStorage.getItem("memberNumber"),
        totalPrice: this.totalPrice,
        industryID: 1,

        productIds: JSON.stringify(this.tableDataList)
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.secret = res.data.result;
            // this.$message({
            //   message: "下单成功...",
            //   type: "warning"
            // });
            this.$message({
              message: "下单成功",
              type: "success"
            });
          } else {
            this.visible_examine = false;

            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("确认下单请求错误...");
        });
    },
    //最后支付
    endOrder() {
      var arr = {
        payType: this.input_cataly,
        amount: this.input_present,
        payTypeName: this.payTypeName
      };
      var url = this.$https.orderHost + "/order/payOrder";
      var params = {
        payTypeAndAmount: JSON.stringify([arr]),
        productIds: JSON.stringify(this.tableDataList),
        payPrice: this.input_present,
        orderNumber: this.secret
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.$message({
              message: res.data.result.order,
              type: "warning"
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("最后支付请求错误...");
        });
    }
  },
  created() {
    //会员名
    // this.userNames = localStorage.getItem("memberName");
    this.init();
    //体验卡列表
    this.PlacementPrivate();
  },
  mounted() {}
};
</script>

<style lang='scss'>
.customization-page_root {
  padding: 30px 0 0 20px;
  position: relative;
  margin-bottom: 220px;
  .title {
    font-size: 24px;
    color: #101010;
    margin-bottom: 25px;
  }

  .el-tabs {
    width: 790px !important;
  }
  .el-tabs__item.is-active {
    color: #222222 !important;
  }
  .el-tabs__item {
    color: #222222 !important;
  }
  .el-tabs__active-bar {
    background-color: #feb019;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #23a547 !important;
    background-color: #f8f8f8 !important;
    border-right-color: #f8f8f8 !important;
    border-left-color: #f8f8f8 !important;
  }
  .el-tabs--border-card > .el-tabs__header {
    border-bottom: 1px solid #f8f8f8 !important;
  }
  .el-tabs--border-card {
    border: 1px solid #ffffff !important;
  }
  // 内容盒子部分
  .el-row {
    display: flex;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 35px 0 40px 0 !important;
  }

  // 移入效果
  .content-box:hover {
    bottom: 10px;
    color: #23a547;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
  }

  .el_carconnent {
    display: flex;
    .carBox {
      width: 100%;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .grid-content {
        width: 208px;
        height: 170px;
        border-radius: 5px;
        margin-left: 50px;
        border-radius: 4px;
        min-height: 36px;
        margin-bottom: 30px;
        background: rgb(239, 240, 241);
        position: relative;
        bottom: 0;
        transition: 0.5s;
        .pd-content {
          padding-top: 50px;
          text-align: center;

          width: 200px;
          height: 130px;
          span {
            width: 100%;
            height: 25px;
            margin-top: 50px;
            text-align: center;
          }
        }
      }
      .grid-content:hover {
        cursor: pointer;
        bottom: 10px;
        box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
      }
    }
  }

  // 价格显示
  .bottom-content {
    height: 40px;
    width: 100%;
    padding-top: 10px;
    background: #e2e1e1;
    display: flex;
    border-radius: 5px;
    justify-content: space-between;
    .left-list {
      width: 90px;
      height: 40px;
    }
    .right-list {
      width: 100px;
      height: 40px;
    }
  }
  .figure-title {
    font-size: 14px;
    color: #555;
  }
  .figure {
    color: #feb019;
    font-weight: 700;
  }
  // 页码
  .el-pagination {
    width: 800px !important;
    margin: 0 auto !important;
    margin: 0px !important;
    text-align: center;
  }
  // 右边部分
  .list-content-right {
    width: 610px;
    margin-left: 100px;
    border: 1px solid #eee;
    .list-content {
      height: 470px;
      overflow: auto;
      .table-box {
        width: 95%;
        margin: 20px auto 0 auto;
        box-shadow: 0px 0px 13px 3px rgba(221, 248, 229, 1);
        border-radius: 4px;
        position: relative;
      }
    }
    .project-header {
      background: #218e47;
      padding: 17px 17px 24px 29px;
      border-radius: 4px 0px 0px 0px;
      margin-bottom: 30px;
      .project-name {
        margin-top: 20px;
        display: inline-flex;
        padding-left: 34px;
        color: #fff;
        img {
          width: 21px;
          height: 21px;
        }
        .name {
          // color: #fff;
          display: inline-block;
          font-size: 16px;
          margin: 0 0 0 20px;
        }
        .name-message {
          // color: #fff;
          font-size: 14px;
        }
      }
      .project-title {
        color: #fff;
        font-size: 18px;
      }
    }
    .el-table thead {
      background: #eeeeee !important;
      color: #333 !important;
    }
    .is-leaf {
      background: #eee !important;
    }
    .el-table th {
      font-size: 16px !important;
      padding: 8px 0 !important;
    }
    .el-table .cell {
      color: #555 !important;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #e6fbe8 !important;
    }
    // 底部盒子
    .bottom-box {
      width: 609px;
      // position: absolute;
      // bottom: 0;
      // background: #222222;
      border-top: 1px solid #eee;
      border-left: 1px solid #eee;
      padding: 40px 30px 14px 50px;
      .remark {
        display: inline-block;
      }
      .el-input {
        width: 90%;
      }
      .el-input__inner {
        border: 1px solid #eee !important;
      }
      .el-input__inner:focus {
        outline: none;
        border-color: #23a547 !important;
      }
      .display-box {
        margin-top: 45px;
        float: right;
        margin-right: 30px;
      }
      .demo-input-suffix {
        // width: 40%;
      }
      .button-srue {
        display: inline-block;
        padding-top: 6px;
      }
      .price-display {
        display: inline-block;
        width: 150px;
        float: left;
        p {
          color: #000;
          font-size: 18px;
        }
        .price {
          color: #d3971e;
          font-size: 16px;
          font-weight: 700;
        }
        .price-unit {
          font-size: 12px;
        }
      }
    }
    .del-icon {
      position: absolute;
      width: 100px;
      height: 100px;
    }
  }
}
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 16px;
  }
  .stgblcktopmain {
    height: 300px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .paymentprice {
      width: 100%;
      display: flex;
      height: 45px;
      justify-content: space-around;
      border-bottom: 1px solid rgba(220, 220, 220, 0.7);
      .stgeprice {
        width: 110px;
        height: 16px;
        font-size: 16px;
        padding: 10px 0;

        span {
          font-size: 18px;
          color: #ecab1e;
        }
      }
    }
    .catalysis {
      width: 400px;
      height: 60px;
      margin: 50px 0 0 40px;
      display: flex;
      .ratio {
        width: 150px;
      }
      label {
        width: 80px;
        margin-top: 12px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }
      .el-input {
        margin-top: 10px;
        width: 180px;
        height: 45px;
        border: 1px solid rgba(177, 173, 173, 0.7);
        border-radius: 5px;
      }
      .el-radio {
        margin-left: 20px;
      }
    }
    .catalysiss {
      width: 400px;
      height: 60px;
      margin: 30px 0 0 40px;
      display: flex;
      label {
        width: 80px;
        margin-top: 12px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
      }
      .el-input {
        width: 180px;
        height: 45px;
        border-radius: 5px;
        border: 1px solid rgba(177, 173, 173, 0.7);
      }
      .el-radio {
        margin-left: 20px;
      }
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
