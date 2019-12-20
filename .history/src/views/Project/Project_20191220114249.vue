<!-- 定制-->
<template>
  <div class="customization-page_root">
    <el-row>
      <!-- 左边 -->
      <div class="elleft">
        <p class="title">收银产品</p>
        <!-- 大类 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            class="cashierTitle"
            v-for="(item) in editableTabs"
            :key="item.commodityTypeID"
            :label="item.commodityTypeName"
            :name="item.commodityTypeID"
          >
            <!-- 项目小类 -->
            <el-tabs
              type="border-card"
              v-if="visible_merchande == true"
              v-model="activeName_common"
              @tab-click="commonleClick"
            >
              <!-- 项目盒子 -->
              <el-tab-pane
                v-for="(item) in productbleTabs"
                :key="item.subclassID2"
                :label="item.subclassName"
                :name="item.subclassID2"
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
          </el-tab-pane>
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
      </div>
      <!-- 右边内容 -->
      <div class="elright">
        <div class="list-content-right">
          <div class="project-header">
            <p class="project-title">项目定制订单</p>
            <div class="project-name">
              <img src="../../assets/images/member.png" alt />
              <span class="name" v-if="this.$store.state.member == null"></span>
              <span class="name" v-if="this.$store.state.member !== null">
                姓名：
                <span class="name-message">{{this.$store.state.member.userName}}</span>
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
              水单号：
              <el-input v-model="input_woreter" placeholder="请输入水单号"></el-input>
            </div>
            <div class="demo-input-suffix2">
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
                <el-button @click="placeOrder" type="warning">确认定制</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <!-- 产品弹出框 -->
    <!-- 弹出框 -->
    <PopOver
      custom-class="storageblock"
      :visible.sync="visible_examine"
      @close="closePopOver"
      width="450px"
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
            <!-- <el-radio-group @change="input_radio" v-model="input_cataly" size="mini" class="ratio">
              <el-radio :label="3">线下</el-radio>
              <el-radio :label="4">线上</el-radio>
            </el-radio-group>-->
            <div>
              <label>支付方式：</label>
              <el-select @change="input_radio" v-model="input_cataly" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.payTypeId"
                  :label="item.payTypeName"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div>
              <label>支付金额：</label>
              <el-input v-model="input_present" placeholder="请输入储蓄支付"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom">
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
      activeName: "",
      //当前页
      currentPage3: 1,
      input: "",
      pageSize: 9,
      //会员名
      // userName: "",
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
      //水单号
      input_woreter: "",
      //NAME
      commodityTypeName: "",
      //ID
      subclassID: "",
      //NAME
      subclassName: "",
      activeName_common: "",
      //储蓄支付
      input_cataly: "",
      //弹出框
      visible_examine: false,
      visible_merchande: false,
      //新数组
      newtableDatas: [],
      //默认数量
      amount: "1",
      kind: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      //库存数量
      stockNum: "",
      //商品ID
      serviceProductId: "",
      tableDataList: [],
      //收银产品项目
      editableTabs: [],
      productbleTabs: [],
      //项目单个数据
      productmodel: [],
      //商品项目
      typep: ""
    };
  },
  computed: {},
  watch: {},
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
      console.log(res);

      this.serviceProductId = res.serviceProductId;
      this.stockNum = res.stockNum;
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
        discountPrice: res.retailPrice,
        serviceProductId: res.serviceProductId
      };
      res = Object.assign({}, object);
      if (this.stockNum !== 0) {
        this.tableDataList.push(res);
        console.log(this.tableDataList);
      } else {
        this.$message({
          message: "该商品没有库存...",
          type: "warning"
        });
      }
      //计算
      this.calcTotalPrice();
    },
    handleClick(tab) {
      this.commodityTypeID = tab.name;
      this.visible_merchande = true;
      this.projectsubclass();
    },

    //项目里面点击切换
    commonleClick(tab) {
      this.subclassID = tab.name;
      this.projectsubsmall();
    },

    //分页
    handleSizeChange(val) {
      setTimeout(() => {
        this.projectsubsmall();
      }, 300);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.projectsubsmall();
      }, 300);
    },

    //改变数量
    changeNumer(res) {
      res.productNum = res.amount;
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
      console.log(this.input_cataly);

      // if (this.input_cataly == 3) {
      //   this.payTypeName = "线下";
      // } else {
      //   this.payTypeName = "线上";
      // }
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
    //确认购买
    confirm_storage() {
      if (this.input_present == "") {
        this.$message({
          message: "请输入支付金额...",
          type: "warning"
        });
      } else if (this.input_cataly == "") {
        this.$message({
          message: "请选择支付方式...",
          type: "warning"
        });
      } else if (this.input_present == this.totalPrice) {
        this.endOrder();
        setTimeout(() => {
          this.projectsubsmall();
        }, 600);
        this.input_woreter = "";
        this.tableDataList = [];
        this.totalPrice = "0";
        this.visible_examine = false;
      } else {
        this.$message({
          message: "请输入正确的商品总价",
          type: "warning"
        });
      }
    },
    //确认定制
    placeOrder() {
      this.input_present = "";
      if (this.totalPrice <= 0) {
        this.$message({
          message: "警告哦，请选择商品...",
          type: "warning"
        });
      } else if (this.input_woreter == "") {
        this.$message({
          message: "警告哦，请输入水单号..",
          type: "warning"
        });
      } else if (this.$store.state.member == null) {
        this.$message({
          message: "请先选择下方会员..",
          type: "warning"
        });
      } else {
        this.$confirm("是否确认下单...", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.visible_examine = true;
            this.morepayment();
            this.affirmplOrder();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消下单！"
            });
          });
      }
    },
    //支付方式
    morepayment() {
      var url = this.$https.payHost + "/manage/payment/selectPayTypeList";
      var params = {
        memberNum: localStorage.getItem("membership"),
        industryId: localStorage.getItem("industryID"),
        subClassId: ""
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.options = res.data.result;
          }
        })
        .catch(err => {});
    },
    //获取定制项目列表
    PlacementPrivate() {
      var url = this.$https.dataHost + "/commodityType/selectCommodityTypeList";
      var params = {
        isDingzhi: 1,
        commodityTypeIndustryID: localStorage.getItem("industryID")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            res.data.result.list.forEach(value => {
              if (value.isShowInPos == 1) {
                this.editableTabs.push({
                  commodityTypeID: value.commodityTypeID + "",
                  commodityTypeIndustryID: value.commodityTypeIndustryID,
                  commodityTypeName: value.commodityTypeName,
                  createOperator: value.createOperator,
                  status: value.status
                });
              }
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
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
            let arr = res.data.result.list;
            for (let i = 0; i < arr.length; i++) {
              arr[i].subclassID2 = arr[i].subclassID + "";
              arr[i].subclassID3 = arr[i].subclassID + "";
            }
            this.productbleTabs = res.data.result.list;
          } else {
            this.productbleTabs = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //项目小类中小项目
    projectsubsmall() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        // subClassId: this.subclassID,
        companyId: localStorage.getItem("storeId"),
        subClassId: this.subclassID,
        isHoutai: 0,
        companyType: 3,
        productStatus: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.total !== 0) {
            this.productmodel = res.data.result.list;
            this.pageTotal = res.data.result.total;
          } else {
            this.productmodel = [];
            this.pageTotal = 0;
            this.$message({
              message: "未找到商品",
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },

    //确认下单
    affirmplOrder() {
      var url = this.$https.orderHost + "/order/createServiceOrder";
      var params = {
        orderType: 4,
        channel: 2,
        memoNum: this.input_woreter,
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
        .catch(err => {});
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
        orderNumber: this.secret,
        industryId: this.input_cataly,
        createOperator: localStorage.getItem("trueName")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.$message({
              message: res.data.result.order,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    }
  },
  created() {
    //体验卡列表
    this.PlacementPrivate();
  },
  mounted() {}
};
</script>

<style lang='scss'>
.customization-page_root {
  position: relative;
  .title {
    font-size: 24px;
    color: #101010;
    margin-bottom: 25px;
    font-weight: bold;
  }
  .el-tabs__nav-scroll {
    font-size: 18px;
  }
  .el-tabs__item {
    color: #222222 !important;
    font-size: 18px;
    font-weight: 550;
  }
  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #23a547 !important;
    background-color: #f8f8f8 !important;
    border-right-color: #f8f8f8 !important;
    border-left-color: #f8f8f8 !important;
  }
  .el-tabs--border-card {
    border: 1px solid #ffffff !important;
  }
  // 内容盒子部分
  .el-row {
    display: flex;
    justify-content: space-around;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .elleft {
    border-radius: 4px;
    width: 45%;
    padding: 15px 0 0 15px;
  }
  .elright {
    border-radius: 4px;
    width: 42%;
    padding: 15px 0 0 15px;
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
        background: #f8f8f8;
        position: relative;
        box-shadow: 0 2px 2px 1px #dddddd;
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
    background: #f4f4f4;
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
    text-align: center;
  }
  // 右边部分
  .list-content-right {
    min-width: 580px;
    margin-left: 30px;
    margin-right: 20px;
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
      width: 90%;
      margin: 0 auto;
      border-top: 1px solid #eee;
      padding: 20px 30px 14px 50px;
      .remark {
        display: inline-block;
      }
      .el-input {
        width: 80%;
      }
      .el-input__inner {
        border: 1px solid #eee !important;
      }
      .el-input__inner:focus {
        outline: none;
        border-color: #23a547 !important;
      }
      .display-box {
        margin-top: 25px;
        float: right;
        margin-right: 30px;
      }
      .demo-input-suffix {
        margin-top: 10px;
      }
      .demo-input-suffix2 {
        margin-top: 10px;
        .el-input {
          width: 80%;
          margin-left: 13px;
        }
      }
      .button-srue {
        display: inline-block;
        padding-top: 6px;
      }
      .price-display {
        display: inline-block;
        width: 150px;
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
    font-size: 20px;
    font-weight: 550;
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
      margin: 50px 0 0 40px;
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
