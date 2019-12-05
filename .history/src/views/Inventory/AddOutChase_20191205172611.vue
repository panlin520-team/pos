<!-- 添加出库采购订单 -->
<template>
  <div class="addpurchase">
    <!-- 搜索 -->
    <div class="invenTitle" v-if="groupOpen == false">
      <h1>出库</h1>
      <div class="ordersearch">
        <label>选择日期：</label>
        <el-date-picker
          @blur="searchTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="value_invenT"
          type="date"
          class="herderDatePicker"
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
        <el-table-column label="采购订单号">
          <template slot-scope="scope">
            <span>{{ scope.row.outStorageNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库时间">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.outStorageDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.invalidStatus }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showPopOver(scope.row)">查看</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
            <el-table-column label="项目名称" width="210">
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
            <el-table-column label="入库日期">
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">{{ scope.row.createTime }}</div>
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
            :current-page.sync="currentPage2"
            @next-click="nextclick"
            @prev-click="prevclick"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next"
            :total="pagetotal"
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
        <h2>添加出库单</h2>
        <div class="btns">
          <el-button type="primary" @click="showorderfrom">新增</el-button>
        </div>
      </div>
      <div class="wareBottom">
        <div class="wareBright">
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
                  <el-input
                    placeholder="请选择产品名称"
                    @focus="seekproductName"
                    v-model="addruleForm.name"
                  ></el-input>
                  <div class="seekprbox" v-if="class_seekbox == true">
                    <ul v-for="itemsk in seekList" :key="itemsk.index">
                      <li @click="selcommodity(itemsk)">{{itemsk.name}}</li>
                    </ul>
                  </div>
                </el-form-item>
                <el-form-item label="数量：" prop="receivedNumber">
                  <el-input v-model.number="addruleForm.receivedNumber" placeholder="请输入数量"></el-input>
                  <!-- <span>剩余库存：(123)</span> -->
                </el-form-item>
                <el-form-item label="收货方：" prop="addrepertory">
                  <el-input
                    @focus="selcommoName"
                    v-model="addruleForm.addrepertory"
                    placeholder="请选择收货方"
                  ></el-input>
                  <div class="seekprbox" v-if="class_selckbox == true">
                    <ul v-for="item in merchantList" :key="item.index">
                      <li @click="selcmerchant(item)">{{item.name}}</li>
                    </ul>
                  </div>
                </el-form-item>
                <el-form-item label="出库日期：" prop="repertoryTime">
                  <div class="block">
                    <el-date-picker
                      v-model="addruleForm.repertoryTime"
                      type="date"
                      class="herderDatePicker"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择出库日期"
                    ></el-date-picker>
                  </div>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
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

          <div class="wareLists">
            <el-table :data="storageList" style="width: 100%">
              <el-table-column label="商品名称" width="300">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
                </template>
              </el-table-column>
              <el-table-column label="入库日期">
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
          <div class="timebox">
            <el-date-picker
              v-model="createTime"
              type="date"
              class="herderDatePicker"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请输入入库时间"
            ></el-date-picker>
          </div>
          <div class="waresupplier">
            <el-cascader
              v-model="supplierCategoryName"
              placeholder="请选择供应商"
              :options="option_supplier"
              filterable
              ref="myCascader"
              :show-all-levels="false"
              @change="onProvincesChange"
            ></el-cascader>
          </div>
          <div class="warenavigation">
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
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
      //添加产品数据
      addruleForm: {
        name: "",
        addrepertory: "",
        sendNumber: "",
        repertoryTime: ""
      },
      //公司名字
      storeName: "",
      //供应商
      supplierCategoryName: "",
      //供应商名字
      supplierName: "",
      //选择时间
      createTime: "",
      //仓库编码
      warehouses: "",
      //仓库名字
      stockType: "",
      //公司名字
      storeName: "",
      //商品编码
      productCode: "",
      //总页数
      pagetotal: 0,
      pagetotal2: 0,
      //页码
      pageSize: 10,
      pageSize2: 10,
      //商品名字
      productName: "",
      //单位
      unit: "",
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
      //添加产品方法
      rules: {
        name: [{ required: true, message: "请选择产品名称", trigger: "blur" }],
        receivedNumber: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 125,
            message: "数量在1--500之间",
            trigger: "blur"
          }
        ],
        addrepertory: [
          { required: true, message: "请选择收货方", trigger: "blur" }
        ],
        repertoryTime: [
          { required: true, message: "请选择出库日期", trigger: "blur" }
        ]
      },
      //供应商
      option_supplier: [
        {
          value: 1,
          label: "第三方供应商",
          children: []
        }
      ],
      //添加产品搜索框列表
      seekList: [],
      //添加供应商搜索框列表
      merchantList: [],
      //采购订单搜索
      inputorder: "",
      //选择日期
      value_invenT: "",
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
      //查看入库订单详情列表
      tableexamine: [],

      value2: "",
      valueday3: "",
      //添加采购
      outStorageType: "销售出库",
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
      currentPage2: 1,

      //入库
      //入库选择
      ware_box: [],

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
      // this.visible_orderfrom = false;
      this.pagetotal2 = this.storageList.length + 1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addruleForm.curIndex == undefined) {
            this.addruleForm.totalPrice =
              this.unitPrice * this.addruleForm.receivedNumber;
            this.addruleForm.remark = this.remark;
            this.addruleForm.endDate = this.createTime;
            this.addruleForm.inShelfDate = this.createTime;
            this.addruleForm.sendNumber = this.addruleForm.receivedNumber;
            this.addruleForm.productionDate = this.createTime;
            this.addruleForm.addrepertory = this.addruleForm.addrepertory;
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
        //计算总价
        this.totalPrice = this.unitPrice * this.addruleForm.receivedNumber;
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
    //添加
    virtures() {
      //时间
      // this.createTime = new Date();
      this.storageList = [];
      this.supplierCategoryName = "";

      //请求门店
      this.requestshop();
      this.groupOpen = true;
    },
    // //转换时间格式
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
    resetamend(formName) {
      this.$refs[formName].resetFields();
    },
    //搜索产品名称
    seekproductName() {
      this.class_seekbox = true;
    },
    //获取供应商数据
    onProvincesChange() {
      let accoers = this.$refs.myCascader.getCheckedNodes()[0].data;
      this.supplierCodes = accoers.supplierCode;
      // this.supplierCategoryName = accoers.supplierCategoryName;
      this.supplierId = accoers.supplierId;
      this.supplierName = accoers.supplierName;
      console.log(accoers);
      console.log(this.supplierCategoryName);
    },
    //选择某个商品
    selcommodity(res) {
      this.unit = res.unit;
      this.productName = res.name;
      this.unitPrice = res.unitPrice;
      this.productCode = res.productCode;
      this.addruleForm.name = res.name;
      this.class_seekbox = false;
      var object = {
        name: res.name,
        // // specification: res.productSpecification,
        productName: res.name,
        productCode: res.productCode,
        sendableNumber: this.addruleForm.receivedNumber,
        sendNumber: this.addruleForm.receivedNumber,
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
    },
    //搜索时间
    searchTime() {
      this.outinstorage();
    },
    //搜索供应商
    selcommoName() {
      this.class_selckbox = true;
    },
    //选择某个商品
    selcmerchant(res) {
      console.log(res);

      this.addruleForm.addrepertory = res.name;
      this.class_selckbox = false;
    },
    //入库保存
    opencommodity() {
      if (this.storageList.length == 0) {
        this.$message({
          message: "请选择出库商品...",
          type: "warning"
        });
      } else if (this.supplierCategoryName == "") {
        this.$message({
          message: "请选择供应商...",
          type: "warning"
        });
      } else if (this.createTime == "") {
        this.$message({
          message: "请选择入库时间",
          type: "warning"
        });
      } else {
        setTimeout(() => {
          this.outinstorage();
        }, 300);
        this.$message({
          message: "提交成功",
          type: "success"
        });
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
      this.pagetotal2 = this.storageList.length - 1;
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
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.currentPage1 = `${val}`;
      this.outinstorage();
    },
    nextclick() {},
    prevclick() {},
    stgbclik(itemout) {
      this.visible = false;
      this.storageMenu[0].storagelzg = itemout.name;
    },
    //入库
    //入库选择
    ware_stgbclik(itemout) {
      this.visible = false;
      this.storageMenus[0].storagelzg = itemout.name;
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
    //请求商品
    requestcommodity() {
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        companyId: localStorage.getItem("storeId"),
        type: 1,
        status: 1,
        productStatus: 1,
        companyType: 3,
        isHoutai: 0
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.list) {
            res.data.result.list.forEach(value => {
              this.seekList.push({
                name: value.productName,
                id: value.productId,
                productSpecification: value.productSpecification,
                unitPrice: value.unionPrice,
                productCode: value.productCode,
                unit: value.unitName
              });
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("商品请求错误...");
        });
    },
    //请求第三供应商列表
    supplierList() {
      var url = this.$https.storeHost + "/manage/supplier/listSupplier ";
      var params = {
        storeId: localStorage.getItem("storeId"),
        supplierCategoryId: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data) {
            res.data.result.list.forEach(value => {
              this.option_supplier[0].children.push({
                label: value.supplierName,
                value: value.supplierId,
                supplierId: value.supplierId,
                supplierName: value.supplierName,
                supplierCategoryName: value.supplierCategoryName,
                supplierCode: value.supplierCode
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
    //采购出库列表
    outinstorage() {
      var url = this.$https.productHost + "/stock/selectOutstorageList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize2,
        outStorageType: this.outStorageType,
        outStorageDate: this.value_invenT
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.pagetotal = res.data.result.total;
            this.tableData_enterpurchase = res.data.result.list;
          } else {
            this.tableData_enterpurchase = [];
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
          res.data.result.list.forEach(function(value) {
            if (value.invalidStatus == 0) {
              value.invalidStatus = "作废";
            } else {
              value.invalidStatus = "未作废";
            }
            //  var tableexamin = value.inStorageProductList;
          });
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
          if (res.data.result !== null) {
            //公司名字
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
    //请求门店
    requestshop() {
      var url = this.$https.storeHost + "/manage/store/selectStoreListNoPage";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            res.data.result.forEach(value => {
              this.merchantList.push({
                name: value.name,
                industryID: value.industryID
              });
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("门店请求错误...");
        });
    },
    //销售出库提交
    submitindent() {
      var url = this.$https.productHost + "/stock/outstorage";
      var text = JSON.stringify(this.storageList);
      var params = {
        storeId: localStorage.getItem("storeId"),
        outStorageType: "销售出库",
        invoicesType: "标准销售出库",
        //出库时间
        outStorageDate: this.createTime,
        settlementCurrency: "人民币",
        marketGroup: this.storeName,
        stockGroup: this.warehouses,
        //系统用户
        client: 1,
        //供应商
        shipper: this.supplierName,
        shipmentGroup: this.storeName,
        outStorageProductJson: text,
        remark: this.remark,
        addrepertory: this.addruleForm.addrepertory,
        // createOperator: "${currentUser.trueName!}"
        createOperator: localStorage.getItem("trueName"),
        //个人信息
        productType: 1,
        productCode: this.productCode,
        productName: this.productName,
        // // barCode:data.barCode,
        // specification: data.productSpecification,
        // // secondaryAttribute:data.secondaryAttribute,
        sendableNumber: this.addruleForm.receivedNumber,
        sendNumber: this.addruleForm.receivedNumber,
        unit: this.unit,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          // this.$message.error("销售出库提交请求错误...");
        });
    }
  },
  created() {
    // this.outinstorage();
    //请求仓库
    this.requestwarehouse();
    //请求公司
    this.requestcompany();
    //时间转换
    // this.dateFormat();
    //请求商品
    this.requestcommodity();
    //请求供应商
    this.supplierList();
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
      margin-top: 65px;
      margin-left: 400px;
      .el-date-editor {
        width: 230px;
      }
      label {
        width: 90px;
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
    margin-bottom: 242px;
    margin-top: 20px;
    line-height: 60px;
    text-align: center;
    .pagingbanner {
      // margin-right: 350px;
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
      // line-height: 110px;
      margin-top: 50px;
      display: flex;
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
      margin-top: 40px;
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
          border-bottom: 1px solid rgba(220, 220, 220, 0.3);
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
      .timebox {
        width: 220px;
        height: 42px;
        position: fixed;

        bottom: 212px;
        left: 590px;
        border-radius: 4px;
      }
      .waresupplier {
        width: 220px;
        height: 50px;
        // border: 1px solid rgb(167, 158, 158);
        position: fixed;
        bottom: 202px;
        border-radius: 4px;
        left: 300px;
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
    .textarea {
      width: 205px;
      height: 150px;
      border-radius: 5px;
      padding: 10px;
    }
    span {
      margin-left: 8px;
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
      background-color: #ada3a3;
      width: 230px;
      border-radius: 5px;
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
