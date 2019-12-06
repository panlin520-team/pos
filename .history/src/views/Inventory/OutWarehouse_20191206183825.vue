<!-- 添加入库采购订单 -->
<template>
  <div class="addpurchase">
    <!-- 搜索 -->
    <div class="invenTitle" v-if="groupOpen == false">
      <h1>报废</h1>
      <div class="ordersearch">
        <label>选择日期：</label>
        <el-date-picker
          @blur="searchTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="value_invenT"
          class="herderDatePicker"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <div class="invbtn">
        <el-button type="success" @click="virtures">添加</el-button>
      </div>
    </div>
    <div class="clienList">
      <el-table :data="tableData_enterpurchase" style="width: 100%">
        <el-table-column label="出库人">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.createOperator }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出库单号">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.outStorageNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出库日期">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.outStorageDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showPopOver(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看订单弹出框 -->
      <PopOver
        custom-class="storageblock"
        :visible.sync="visible_examine"
        @close="closePopOver"
        width="800px"
      >
        <div class="stgblcktop" slot="top"></div>
        <div class="stgblcktopmain" slot="main">
          <el-table :data="tableexamine" style="width: 100%">
            <el-table-column label="项目名称">
              <template slot-scope="scope">
                <span>{{ scope.row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.sendNumber }}</div>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.unit }}</div>
              </template>
            </el-table-column>
            <el-table-column label="报废日期">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.outStoregeDate }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <el-button type="info" @click="tallyClick">确认</el-button>
        </div>
      </PopOver>
    </div>
    <div class="paging">
      <div class="pagingbanner">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            @next-click="nextclick"
            @prev-click="prevclick"
            :page-size="pageSize1"
            background
            layout="total, prev, pager, next"
            :total="pagetotal1"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹出层 -->
    <!-- 入库 -->
    <div class="warehousing" v-if="groupOpen == true">
      <div class="wareTitle">
        <div @click="groupOpen = false">
          <img src="../../assets/images/icon-left.png" alt />
        </div>
        <h2>报废订单</h2>
        <div class="btns">
          <el-button type="primary" @click="showorderfrom">新增</el-button>
        </div>
      </div>
      <div class="wareBottom">
        <div class="wareBright">
          <div class="warebrTitles">
            <!-- 添加订单弹出框 -->
            <PopOver
              custom-class="storageblock"
              :visible.sync="visible_orderfrom"
              @close="closeorderfrom"
              width="500px"
            >
              <div class="stgblcktop" slot="top"></div>
              <div class="stgblcktopmain" slot="main">
                <el-form :model="addruleForm" :rules="rules" ref="addruleForm" label-width="100px">
                  <el-form-item label="产品名称：" prop="name">
                    <el-input @focus="seekproductName" v-model="addruleForm.name"></el-input>
                    <div class="seekprbox" v-show="class_seekbox == true">
                      <ul v-for="itemsk in seekList" :key="itemsk.index">
                        <li @click="selcommodity(itemsk)">{{itemsk.name}}</li>
                      </ul>
                    </div>
                  </el-form-item>
                  <el-form-item label="数量：" prop="sendNumber">
                    <el-input v-model="addruleForm.sendNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期：" prop="repertoryTime">
                    <div class="block">
                      <el-date-picker
                        v-model="addruleForm.repertoryTime"
                        type="date"
                        class="herderDatePicker"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择产品有效期"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label="备注：">
                    <textarea rows="10" v-model="remark" class="textarea" cols="30">哈哈哈</textarea>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('addruleForm')">确定</el-button>
                    <el-button @click="resetForm('addruleForm')">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="stgblckbottom" slot="bottom"></div>
            </PopOver>
          </div>
          <div class="wareLists">
            <el-table :data="storageList" style="width: 100%">
              <el-table-column label="商品名称" width="300">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.sendNumber }}</div>
                </template>
              </el-table-column>
              <el-table-column label="出库日期">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.repertoryTime }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="modiforder(scope.row,scope.$index)">修改</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteorder(scope.row,scope.$index)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="waresubmit">
            <el-button type="success" @click="opencommodity">提交</el-button>
          </div>
          <div class="companys">
            <el-select v-model="valcompany" placeholder="请选择公司">
              <el-option
                v-for="item in optio_company"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="timebox">
            <el-date-picker
              v-model="repertoryTimtime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              class="herderDatePicker"
              placeholder="请输入入库时间"
            ></el-date-picker>
          </div>
          <div class="warenavigation">
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page.sync="currentPage2"
                :page-size="pageSize2"
                background
                layout="total, prev, pager, next"
                :total="pagetotal2"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
//import XX from '';
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: { MemberFrame },
  data() {
    return {
      //客户数据
      tableData_enterpurchase: [],
      //公司名字
      storeName: new Date(),
      //选择时间
      createTime: "",
      //仓库编码
      warehouses: "",
      //仓库名字
      stockType: "",
      //商品编码
      productCode: "",
      //返回公司
      valcompany: "",
      //商品名字
      productName: "",
      //子公司名字
      subsidiaryName: "",
      //单位
      unit: "个",
      //数量
      sendableNumber: "",
      sendNumber: "",
      //总价
      totalPrice: "",
      //商品单价
      unitPrice: "",
      //子公司ID
      subCompanyId: "",
      //备注
      remark: "",
      //添加产品数据
      addruleForm: {
        name: "",
        unit: "",
        addrepertory: "",
        sendNumber: "",
        repertoryTime: "",
        repervalidity: ""
      },
      //选择时间
      repertoryTimtime: "",
      //添加产品方法
      rules: {
        name: [{ required: true, message: "请选择产品名称", trigger: "blur" }],
        sendNumber: [
          { required: true, message: "请输入数量", trigger: "blur" }
        ],
        repertoryTime: [
          { required: true, message: "请选择有效期", trigger: "blur" }
        ]
      },

      //添加产品搜索框列表
      seekList: [],
      //添加供应商搜索框列表
      merchantList: [],
      //采购订单搜索
      inputorder: "",
      //出库列表页码
      pageSize1: 10,
      pagetotal1: 0,
      //时间选择器
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      //选择公司
      optio_company: [
        {
          value: "22222222",
          label: ""
        }
      ],
      //入库列表
      storageList: [],
      //入库菜单
      storageMenus: [
        {
          numbersName: "单号",
          num: "14546531",
          storageDay: "入库日期",
          storageWay: "入库方式",
          storagelzg: "入库",
          affiliationStoge: "归属仓库",
          affiliationStbtn: "仓库",
          numberTotal: "数量合计",
          numberTo: 0,
          moneyName: "金额",
          money: 20,
          purchasingPeo: "采购人",
          purchasing: "请选择采购人",
          remark: "备注"
        }
      ],
      //查看其他出库订单详情列表
      tableexamine: [],

      value2: "",
      valueday3: "",
      value_invenT: "",
      //出入库弹出层
      groupOpen: false,
      visible: false,
      visible_examine: false,
      visible_warehouse: false,
      visible_peple: false,
      visible_orderfrom: false,
      class_seekbox: false,
      class_selckbox: false,

      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //分页
      //当前页数
      currentPage1: 1,
      outStorageType: "其他出库",
      //入库
      //入库选择
      ware_box: [
        {
          index: 1,
          symbol: "1-",
          name: "选择伟大的出库"
        },
        {
          index: 2,
          symbol: "2-",
          name: "选择出库"
        },
        {
          index: 3,
          symbol: "3-",
          name: "选择出库23413421"
        }
      ],
      //仓库选择
      ware_home: [
        {
          index: 1,
          symbol: "1-",
          name: "选择仓库"
        },
        {
          index: 2,
          symbol: "2-",
          name: "选择仓库457465"
        },
        {
          index: 3,
          symbol: "3-",
          name: "选择仓库66111"
        }
      ],

      //选择采购人
      ware_people: [
        {
          index: 1,
          symbol: "1-",
          name: "选择采购人"
        },
        {
          index: 2,
          symbol: "2-",
          name: "选择仓库采购人"
        },
        {
          index: 3,
          symbol: "3-",
          name: "采购人66111"
        }
      ],
      //备注
      appear_remarkConnet: "这是一个入库"
    };
  },
  computed: {},
  watch: {},
  methods: {
    //弹出详情切换
    handleClick(tab, event) {},
    //添加产品验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addruleForm.curIndex == undefined) {
            this.addruleForm.totalPrice =
              this.unitPrice * this.addruleForm.sendNumber;
            this.addruleForm.remark = this.remark;
            this.addruleForm.endDate = this.addruleForm.repertoryTime;
            this.addruleForm.inShelfDate = this.createTime;
            this.addruleForm.sendableNumber = this.addruleForm.sendNumber;
            this.addruleForm.sendNumber = this.addruleForm.sendNumber;
            this.addruleForm.productionDate = this.createTime;
            this.storageList.unshift(this.addruleForm);
          } else {
            this.storageList.splice(
              this.addruleForm.curIndex,
              1,
              this.addruleForm
            );
          }
          this.$message({
            message: "添加成功...",
            type: "success"
          });
          this.visible_orderfrom = false;
        } else {
          return false;
        }
      });
    },
    //取消添加
    resetForm(formName) {
      this.visible_orderfrom = false;
      this.$refs[formName].resetFields();
    },
    //修改商品验证
    submitamend(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    resetamend(formName) {
      this.$refs[formName].resetFields();
    },
    //搜索时间
    searchTime() {
      this.restoutinstorage();
    },
    //搜索产品名称
    seekproductName() {
      this.class_seekbox = true;
    },
    //选择某个商品
    selcommodity(res) {
      this.productName = res.name;
      this.unitPrice = res.unitPrice;
      this.productCode = res.productCode;
      this.class_seekbox = false;
      var object = {
        name: res.name,
        // // specification: res.productSpecification,
        productName: res.name,
        productCode: res.productCode,
        // receivableNumber: this.addruleForm.receivedNumber,
        // receivedNumber: this.addruleForm.receivedNumber,
        unit: 1,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1,
        endDate: this.createTime,
        inShelfDate: this.createTime,
        keeperType: 3,
        keeper: this.storeName,
        keeperCode: this.warehouses,
        isSend: false
      };
      this.addruleForm = Object.assign({}, this.addruleForm, object);
      this.class_seekbox = false;
    },
    //搜索供应商
    selcommoName() {
      this.class_selckbox = true;
    },
    //选择某个商品
    selcmerchant(res) {
      this.addruleForm.addrepertory = res.name;
      this.class_selckbox = false;
    },
    //入库保存
    opencommodity() {
      // this.restoutinstorage();
      if (this.storageList.length == 0) {
        this.$message({
          message: "请选择报废商品",
          type: "warning"
        });
      } else if (this.valcompany == "") {
        this.$message({
          message: "请选择公司...",
          type: "warning"
        });
      } else if (this.repertoryTimtime == "") {
        this.$message({
          message: "请选择入库时间",
          type: "warning"
        });
      } else {
        setTimeout(() => {
          this.restoutinstorage();
        }, 300);
        this.submitindent();
        this.groupOpen = false;
      }
    },
    //点击修改入库订单
    modiforder(res, index) {
      this.visible_orderfrom = true;
      this.addruleForm = res;
      this.$set(this.addruleForm, "curIndex", index);
    },
    closeoramend() {
      this.visible_orderfrom = false;
    },
    //点击删除入库订单
    deleteorder(res, index) {
      this.$set(this.addruleForm, "curIndex", index);
      this.storageList.splice(this.addruleForm.curIndex, 1);
    },
    //点击查看订单详情
    showPopOver(res) {
      this.tableexamine = res.outStorageProductList;
      this.visible_examine = true;
    },
    closePopOver() {
      this.visible_examine = false;
    },

    //确认详情订单
    tallyClick() {
      this.visible_examine = false;
    },
    //点击添加订单
    showorderfrom() {
      this.addruleForm = {};
      this.remark = "";

      this.visible_orderfrom = true;
    },
    closeorderfrom() {
      this.visible_orderfrom = false;
    },
    //确认添加订单
    tallyorderfrom() {
      this.visible_orderfrom = false;
    },
    //删除
    handleDelete(index, row) {},
    //外面分页
    handleSizeChange(val) {
      setTimeout(() => {
        this.restoutinstorage();
      }, 300);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.restoutinstorage();
      }, 300);
    },
    //里面分页
    handleSizeChange2(val) {},
    handleCurrentChange2(val) {},
    nextclick() {},
    prevclick() {},
    stgbclik(itemout) {
      this.visible = false;
      this.storageMenu[0].storagelzg = itemout.name;
    },
    //转换时间格式
    // dateFormat() {
    //   var date = new Date();
    //   var Y = date.getFullYear() + "-";
    //   var M =
    //     (date.getMonth() + 1 < 10
    //       ? "0" + (date.getMonth() + 1)
    //       : date.getMonth() + 1) + "-";
    //   var D = date.getDate() > 9 ? date.getDate() + " " : "0" + date.getDate();
    //   this.createTime = Y + M + D + "00:00:00";
    // },
    //入库
    //入库选择
    ware_stgbclik(itemout) {
      this.visible = false;
      this.storageMenus[0].storagelzg = itemout.name;
    },
    //添加
    virtures() {
      //时间
      // this.repertoryTimtime = new Date();
      //子公司
      this.repertoryTimtime = "";
      this.valcompany = "";
      this.storageList = [];
      this.requcompany();
      this.groupOpen = true;
    },
    //仓库选择
    ware_warehouse(itemout) {
      this.visible_warehouse = false;
      this.storageMenus[0].affiliationStbtn = itemout.name;
    },
    //选择采购人
    ware_warepeople(itemout) {
      this.visible_peple = false;
      this.storageMenus[0].purchasing = itemout.name;
    },
    //其他出库列表
    restoutinstorage() {
      var url = this.$https.productHost + "/stock/selectOutstorageList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize1,
        outStorageType: this.outStorageType,
        outStorageDate: this.value_invenT
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.pagetotal1 = res.data.result.total;
            this.tableData_enterpurchase = res.data.result.list;
          } else {
            this.tableData_enterpurchase = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
          res.data.result.list.forEach(function(value) {
            var tableexamin = value.outStorageProductList;
          });
          this.tableData_enterpurchase = res.data.result.list;
        })
        .catch(err => {});
    },
    //请求仓库
    requestwarehouse() {
      var url = this.$https.productHost + "/stock/selectStockList";
      var params = {
        // storeId: localStorage.getItem("storeId"),
        companyType: 3,
        companyId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.warehouses = res.data.result[0].stockCode;
            this.stockType = res.data.result[0].stockType;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("仓库请求错误...");
        });
    },
    //请求公司
    requestcompany() {
      var url = this.$https.storeHost + "/manage/store/selectStoreById";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.storeName = res.data.result.name;
            //子公司ID
            this.subCompanyId = res.data.result.subCompanyId;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //请求子公司
    requcompany() {
      var url = this.$https.storeHost + "/manage/company/selectSubsidiaryByID";
      var params = {
        subsidiaryId: this.subCompanyId
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            //子公司名字
            this.subsidiaryName = res.data.result.subsidiaryName;
            this.optio_company[0].label = this.subsidiaryName;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("公司请求错误...");
        });
    },
    //请求商品
    requestcommodity() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        companyId: localStorage.getItem("storeId"),
        type: 2,
        status: 1,
        productStatus: 1,
        companyType: 3,
        isHoutai: 0
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            res.data.result.list.forEach(value => {
              this.seekList.push({
                name: value.productName,
                id: value.productId,
                productSpecification: value.productSpecification,
                unitPrice: value.unionPrice,
                productCode: value.productCode
              });
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
    //其他出库订单
    submitindent() {
      var url = this.$https.productHost + "/stock/outstorage";
      var text = JSON.stringify(this.storageList);
      var params = {
        storeId: localStorage.getItem("storeId"),
        // supplierCategoryId: 1,
        outStorageType: "其他出库", //入库方式
        invoicesType: "标准其他出库", //单据类型
        businessType: "物料领用",
        outStorageDate: this.repertoryTimtime,
        //公司名字

        receiveGroup: this.subsidiaryName,
        stockGroup: this.warehouses, //仓库CK001
        shipperType: "业务组织", //货主类型（供应商
        shipper: this.storeName, //货主
        shipperCode: this.supplierCodes, //货主编码
        inventoryGroup: this.warehouses, //库存组织
        inventoryWay: "普通", //库存方向（1普通、2退货）
        remark: this.remark, //备注
        outStorageProductJson: text,
        createOperator: localStorage.getItem("trueName"), //创建者
        productType: 1,
        productCode: this.productCode,
        productName: this.productName,
        sendableNumber: this.addruleForm.sendNumber,
        sendNumber: this.addruleForm.sendNumber,
        unit: this.unit,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Success") {
            this.tableData_enterpurchase.push(res.data.result);
            this.$message({
              message: "报废成功...",
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
    this.restoutinstorage();
    //请求商品
    this.requestcommodity();
    //请求公司
    this.requestcompany();
    //时间
    // this.dateFormat();
    //仓库
    this.requestwarehouse();
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.addpurchase {
  width: 100%;
  height: 100%;
  .invenTitle {
    width: 100%;
    height: 150px;
    position: relative;

    display: flex;
    h1 {
      padding-top: 35px;
      margin-left: 20px;
    }
    .el-select {
      font-size: 40px;
    }
    .block {
      margin: 0 auto;
    }
    .ordersearch {
      width: 450px;
      height: 45px;
      line-height: 40px;
      display: flex;
      margin-top: 60px;
      margin-left: 400px;
      .el-date-editor {
        width: 230px;
      }
      label {
        width: 88px;
        color: #333333;
        line-height: 40px;
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
      }
      .el-input {
        border-radius: 4px;
      }
    }
    .invbtn {
      padding-right: 40px;
      position: absolute;
      right: 100px;
      padding-top: 35px;
      .el-button {
        width: 100px;
        font-size: 16px;
      }
    }
  }
  .clienList {
    width: 80%;
    margin: auto;
    border-radius: 6px;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    overflow: auto;
    padding: 10px 50px 20px 50px;
  }
  .paging {
    width: 100%;
    height: 100px;
    margin-top: 20px;
    margin-bottom: 220px;
    line-height: 60px;
    text-align: center;
    .pagingbanner {
      .block {
        margin-top: 20px;
      }
    }
  }
  //入库
  .warehousing {
    width: 100%;
    height: 100%;
    padding: 20px 100px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: #fff;
    .wareTitle {
      width: 100%;
      display: flex;
      margin-top: 50px;
      h2 {
        margin: 0 auto;
      }
      .btns {
        padding: 20px 180px 0 0;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .wareBottom {
      width: 100%;
      display: flex;

      .wareBright {
        flex: 1;
        position: relative;
        .warebrTitles {
          width: 100%;
          height: 60px;
          display: flex;
          font-size: 20px;
          line-height: 70px;
          justify-content: space-between;
          padding: 0 20px;
        }
        .warenavigation {
          text-align: center;
          width: 100%;
          margin: 20px 0 30px 0;
        }
      }
      .wareLists {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
      }
      .waresubmit {
        position: fixed;
        bottom: 200px;
        right: 250px;
        padding: 10px;
      }
      .companys {
        position: fixed;
        bottom: 210px;
        left: 300px;
        border-radius: 4px;
        // border: 1px solid rgb(184, 178, 178);
      }
      .timebox {
        width: 226px;
        height: 42px;
        position: fixed;
        bottom: 212px;
        left: 650px;
        border-radius: 4px;
        .el-date-editor {
          width: 226px;
        }
        .input {
          width: 250px;
        }
      }
    }
  }
}
//出入库弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 16px;
  }
  .stgblcktopmain {
    height: 100%;
    padding: 35px 0 0 40px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .el-input {
      width: 230px;
      // border: 1px solid rgb(184, 178, 178);
      border-radius: 5px;
    }
    .el-form-item__label {
      padding: 0 7px 0 0 !important;
    }
    .textarea {
      background-color: #dad7d7;
      width: 205px;
      height: 150px;
      border-radius: 5px;
      padding: 10px;
    }
    .seekprbox {
      width: 230px;
      height: 80px;
      overflow: auto;
      border: 1px solid rgb(184, 178, 178);
      li {
        width: 100%;
        height: 20px;
        padding-left: 5px;
      }
    }
    .block {
      border-radius: 5px;
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
