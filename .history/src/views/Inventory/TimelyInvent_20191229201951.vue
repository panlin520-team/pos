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
          custom-class="storageblock2"
          :visible.sync="visible_carLise"
          @close="close_carLise"
          width="900px"
        >
          <div class="stgblcktop" slot="top">客户项目信息</div>
          <div class="stgblcktopmain" slot="main">
            <div class="projcttop">
              <div class="projectcar">
                <el-button size="mini" type="warning" @click="experienceCard">111</el-button>
              </div>
              <div class="projectcars">
                <el-button size="mini" type="success" @click="experienization">222</el-button>
              </div>
              <div class="projectcws">
                <el-button size="mini" type="success" @click="experieniserw">3333</el-button>
              </div>
              <div class="projectrtf">
                <el-button size="mini" type="success" @click="experienisqgr">4444</el-button>
              </div>
            </div>
            <div class="projctbottom" v-if="experiencehaha">
              <el-table :data="tableData_details" style="width: 100%">
                <el-table-column label="项目名称">
                  <template slot-scope="scope">
                    <div
                      slot="reference"
                      class="name-wrapper"
                    >{{ scope.row.experiencecardProductName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="商品小类">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.subClassName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="项目类型">
                  <template slot-scope="scope">
                    <div
                      slot="reference"
                      class="name-wrapper"
                    >{{ scope.row.experiencecardProductTypeName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用总数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.totalTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用次数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="vipexdetails(scope.row)">划卡</el-button>
                    <el-button size="mini" type="success" @click="userdetails(scope.row)">使用详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="projctbottom" v-if="experienceheihei">
              <!-- <el-table :data="tableData_rieniza" style="width: 100%">
                <el-table-column label="项目名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="项目类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productTypeName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用总数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.totalTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用次数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="rienizatails(scope.row)">划卡</el-button>
                    <el-button size="mini" type="success" @click="rienizauss(scope.row)">使用详情</el-button>
                  </template>
                </el-table-column>
              </el-table>-->
              2222
            </div>
            <div class="projctbottom" v-if="experietow">
              <!-- <el-table :data="tableData_details" style="width: 100%">
                <el-table-column label="项目名称">
                  <template slot-scope="scope">
                    <div
                      slot="reference"
                      class="name-wrapper"
                    >{{ scope.row.experiencecardProductName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="商品小类">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.subClassName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="项目类型">
                  <template slot-scope="scope">
                    <div
                      slot="reference"
                      class="name-wrapper"
                    >{{ scope.row.experiencecardProductTypeName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用总数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.totalTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用次数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="vipexdetails(scope.row)">划卡</el-button>
                    <el-button size="mini" type="success" @click="userdetails(scope.row)">使用详情</el-button>
                  </template>
                </el-table-column>
              </el-table>-->
              33333
            </div>
            <div class="projctbottom" v-if="experiencsert">
              <!-- <el-table :data="tableData_rieniza" style="width: 100%">
                <el-table-column label="项目名称">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="项目类型">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.productTypeName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用总数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.totalTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="使用次数" width="80">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useTimes }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="有效期" width="180">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="rienizatails(scope.row)">划卡</el-button>
                    <el-button size="mini" type="success" @click="rienizauss(scope.row)">使用详情</el-button>
                  </template>
                </el-table-column>
              </el-table>-->
              44444
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
      experiencehaha: true,
      experietow: false,
      experiencsert: false,
      flag: true,
      //里面类
      value_somepojiet: "1",
      //11111
      tableData_details:[],
      //22222
      tableData_details:[],
      //33333
      tableData_details:[],
      //444444
      tableData_details:[],
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
    //
    experienceCard() {
      this.experiencehaha = true;
      this.experienceheihei = false;
      this.experietow = false;
      this.experiencsert = false;
    },
    //
    experienization() {
      this.experiencehaha = false;
      this.experienceheihei = true;
      this.experietow = false;
      this.experiencsert = false;
    },
    //
    experieniserw() {
      this.experiencehaha = false;
      this.experienceheihei = false;
      this.experietow = true;
      this.experiencsert = false;
    },
    //
    experienisqgr() {
      this.experiencehaha = false;
      this.experienceheihei = false;
      this.experietow = false;
      this.experiencsert = true;
    },

    //选中外面类
    selectpoject() {
      this.commodityoutData();
    },
    close_carLise() {
      this.visible_carLise = false;
    },
    //查看
    showpoject(res) {
      this.visible_carLise = true;
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
    max-height: 465px;
    overflow: auto;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);

    .projcttop {
      width: 100%;
      height: 30px;
      display: flex;
      position: relative;
      .projectcar {
        margin: 0 10px;
        position: absolute;
        right: 10px;
      }
      .projectcars {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 100px;
      }
      .projectcws {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 200px;
      }
      .projectrtf {
        height: 30px;
        margin: 0 10px;
        position: absolute;
        right: 315px;
      }
    }

    .projctbottom {
      width: 100%;
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>
