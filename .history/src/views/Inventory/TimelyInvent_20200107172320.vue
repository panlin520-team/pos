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
        <el-table-column label="数量">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.stockQuantity }}</div>
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
          custom-class="storageblock2"
          :visible.sync="visible_carLise"
          @close="close_carLise"
          width="900px"
        >
          <div class="stgblcktop" slot="top">客户项目信息</div>
          <div class="stgblcktopmain" slot="main">
            <div class="projcttop">
              <div class="projtright">
                <div
                  class="someprojts"
                  @click="closeClick(item)"
                  v-for="item in someData"
                  :class="item.index == someIndex ? 'active' : ''"
                  :key="item.index"
                >{{item.name}}</div>
              </div>
              <!-- <div class="projectcar">
                <el-button size="mini" type="success" @click="experienceCard">入库单</el-button>
              </div>
              <div class="projectcars">
                <el-button size="mini" type="success" @click="experienization">入库商品</el-button>
              </div>
              <div class="projectcws">
                <el-button size="mini" type="success" @click="experieniserw">出库单</el-button>
              </div>
              <div class="projectrtf">
                <el-button size="mini" type="success" @click="experienisqgr">出库商品</el-button>
              </div>-->
            </div>
            <!-- 入库总数 -->
            <div class="projctbottom" v-if="storageNustog">
              <el-table :data="storageNumber" style="width: 100%">
                <el-table-column label="类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.type }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="单据类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.storageType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作人">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.operator }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="编号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.storageNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.storageDate }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 出库总数 -->
            <div class="projctbottom" v-if="experiennumber">
              <el-table :data="tableDatanumber" style="width: 100%">
                <el-table-column label="类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.type }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品编号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.number }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 护肤产品 -->
            <div class="projctbottom" v-if="dasdfcnnumber">
              <!-- <el-table :data="tableDatanumshtew" style="width: 100%">
                <el-table-column label="产品名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品编码">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.number }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购单号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.batchNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.dataChangeLastTime }}</div>
                  </template>
                </el-table-column>
              </el-table> -->
              <el-table :data="Datas" style="width: 100%">
                <el-table-column label="产品名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="产品编码">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="数量">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.number }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购单号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.batchNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 入库分散 -->
            <div class="projctbottom" v-if="experiencehaha">
              <el-table :data="tableData_details" style="width: 100%">
                <el-table-column label="入库人">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.receiveGroup }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="入库类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.businessType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购单号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.inStorageNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="采购时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.inStorageDate }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="projctbottom" v-if="experienceheihei">
              <el-table :data="tableData_rieniza" style="width: 100%">
                <el-table-column label="商品名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="商品编号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="入库数量">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="入库时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="projctbottom" v-if="experietow">
              <el-table :data="tableDqdwqedails" style="width: 100%">
                <el-table-column label="出库人">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.shipmentGroup }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出库类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.invoicesType }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出库编号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.outStorageNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出库时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="projctbottom" v-if="experiencsert">
              <el-table :data="tableData_rdasniza" style="width: 100%">
                <el-table-column label="商品名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="商品编号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productCode }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出库数量">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.sendNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="出库时间">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
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
      visible_carLise: false,
      experienceheihei: false,
      experiencehaha: false,
      experietow: false,
      experiencsert: false,
      storageNustog: true,
      experiennumber: false,
      dasdfcnnumber: false,
      //入库总数
      storageNumber: [
        {
          receiveGroup: "312",
          businessType: "312",
          inStorageNumber: "312",
          inStorageDate: "312"
        }
      ],
      //11111
      tableData_details: [],
      //22222
      tableData_rieniza: [],
      //33333
      tableDqdwqedails: [],
      //444444
      tableData_rdasniza: [],
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
      //按钮切换
      someData: [
        {
          index: 1,
          name: "单据"
        },
        {
          index: 2,
          name: "商品"
        },
        {
          index: 3,
          name: "库存变化"
        },
        {
          index: 4,
          name: "入库单"
        },
        {
          index: 5,
          name: "入库商品"
        },
        {
          index: 6,
          name: "出库单"
        },
        {
          index: 7,
          name: "出库商品"
        }
      ],
      //出库总数
      tableDatanumber: [
        {
          receiveGroup: "出库总数",
          businessType: "出库总数",
          inStorageNumber: "出库总数",
          inStorageDate: "出库总数"
        },
        {
          receiveGroup: "出库总数",
          businessType: "出库总数",
          inStorageNumber: "出库总数",
          inStorageDate: "出库总数"
        }
      ],
      tableDatanumshtew: [],
      Datas: [
        {
          productName: "1",
          productCode: "2",
          number: "3",
          batchNumber: "4",
          createTime: "5"
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
      someIndex: "",
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
    //点击切换
    closeClick(res) {
      this.someIndex = res.index;
      if (res.index == 1) {
        this.storageNustog = true;
        this.experiencehaha = false;
        this.experienceheihei = false;
        this.experietow = false;
        this.experiencsert = false;
        this.dasdfcnnumber = false;
        this.experiennumber = false;
      } else if (res.index == 2) {
        this.storageNustog = false;
        this.experiencehaha = false;
        this.experienceheihei = false;
        this.experietow = false;
        this.dasdfcnnumber = false;
        this.experiennumber = true;
        this.experiencsert = false;
      } else if (res.index == 3) {
        this.dasdfcnnumber = true;
        this.storageNustog = false;
        this.experiencehaha = false;
        this.experienceheihei = false;
        this.experietow = false;
        this.experiennumber = false;
        this.experiencsert = false;
      } else if (res.index == 4) {
        this.storageNustog = false;
        this.experiencehaha = true;
        this.experienceheihei = false;
        this.experietow = false;
        this.dasdfcnnumber = false;
        this.experiennumber = false;
        this.experiencsert = false;
      } else if (res.index == 5) {
        this.storageNustog = false;
        this.experiencehaha = false;
        this.experienceheihei = true;
        this.experietow = false;
        this.dasdfcnnumber = false;

        this.experiennumber = false;
        this.experiencsert = false;
      } else if (res.index == 6) {
        this.storageNustog = false;
        this.experiencehaha = false;
        this.experienceheihei = false;
        this.experietow = true;
        this.dasdfcnnumber = false;

        this.experiennumber = false;
        this.experiencsert = false;
      } else if (res.index == 7) {
        this.storageNustog = false;
        this.experiencehaha = false;
        this.experienceheihei = false;
        this.experietow = false;
        this.dasdfcnnumber = false;
        this.experiennumber = false;
        this.experiencsert = true;
      }
    },
    // //
    // experienceCard() {
    //   this.experiencehaha = true;
    //   this.experienceheihei = false;
    //   this.experietow = false;
    //   this.experiencsert = false;
    // },
    // //
    // experienization() {
    //   this.experiencehaha = false;
    //   this.experienceheihei = true;
    //   this.experietow = false;
    //   this.experiencsert = false;
    // },
    // //
    // experieniserw() {
    //   this.experiencehaha = false;
    //   this.experienceheihei = false;
    //   this.experietow = true;
    //   this.experiencsert = false;
    // },
    // //
    // experienisqgr() {
    //   this.experiencehaha = false;
    //   this.experienceheihei = false;
    //   this.experietow = false;
    //   this.experiencsert = true;
    // },

    //选中外面类
    selectpoject() {
      this.commodityoutData();
    },
    close_carLise() {
      this.visible_carLise = false;
    },
    //查看
    showpoject(res) {
      this.someIndex = 1;
      this.visible_carLise = true;
      this.storageNustog = true;
      this.experiencehaha = false;
      this.experienceheihei = false;
      this.experietow = false;
      this.experiencsert = false;
      this.dasdfcnnumber = false;
      this.experiennumber = false;
      this.productCods = res.productCode;
      this.commodityose();
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
          if (res.data.result) {
            this.storageNumber = res.data.result.productStorageVOList;
            this.tableDatanumber = res.data.result.productStorageProductVOList;
            this.tableDatanumshtew = res.data.result.stockProductList;
            this.tableData_details = res.data.result.instorageList;
            this.tableData_rieniza = res.data.result.inStorageProductList;
            this.tableDqdwqedails = res.data.result.outstorageList;
            this.tableData_rdasniza = res.data.result.outStorageProductList;
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
//弹出框
.storageblock2 {
  width: 100%;
  .stgblcktop {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
  .stgblcktopmain {
    width: 100%;
    overflow: auto;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);

    .projcttop {
      width: 100%;
      height: 30px;
      display: flex;
      position: relative;
      .projtright {
        width: 550px;
        height: 30px;
        display: flex;
        border: 1px solid rgb(253, 2, 2);
        .someprojts {
          width: 76px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          background-color: #23a547;
          border-radius: 4px;
          margin-left: 5px;
          color: #fff;
          cursor: pointer;
          &.active {
            background-color: rgb(252, 137, 7);
            font-weight: 700;
          }
        }
      }
      .projectcar {
        margin: 0 10px;
        position: absolute;
        right: 300px;
      }
      .projectcars {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 198px;
      }
      .projectcws {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 110px;
      }
      .projectrtf {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 10px;
      }
    }

    .projctbottom {
      width: 100%;
    }
  }
}
</style>
