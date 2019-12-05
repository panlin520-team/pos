<!-- 添加入库采购订单 -->
<template>
  <div class="addpurchase">
    <!-- 搜索 -->
    <div class="invenTitle" v-if="groupOpen == false">
      <h1>其他入库订单列表</h1>
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
        <el-button type="success" @click="addfriends">添加</el-button>
      </div>
    </div>
    <div class="clienList">
      <el-table :data="tableData_enterpurchase" style="width: 100%">
        <el-table-column label="入库人" width="140">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.createOperator }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库单号" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.inStorageNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" width="165">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.inStorageDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="作废状态" width="100">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.invalidStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否收货" width="100">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.confirmStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="showPopOver(scope.row)">查看详情</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">作废</el-button>
            <el-button size="mini" @click="confirmPopOver(scope.row)" type="success">确认收货</el-button>
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
                <div slot="reference" class="name-wrapper">{{ scope.row.receivedNumber }}</div>
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
          <el-pagination
            @size-change="handleSizeChckbo"
            @current-change="handleCurrentChckbo"
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="pagetotals"
          ></el-pagination>
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
        <h2>添加其他入库</h2>
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
              width="550px"
            >
              <div class="stgblcktop" slot="top"></div>
              <div class="stgblcktopmain" slot="main">
                <el-form :model="addruleForm" :rules="rules" ref="addruleForm" label-width="100px">
                  <el-form-item label="项目名称：" prop="name">
                    <el-input @focus="seekproductName" v-model="addruleForm.name"></el-input>
                    <div class="seekprbox" v-show="class_seekbox == true">
                      <ul v-for="itemsk in seekList" :key="itemsk.index">
                        <li @click="selcommodity(itemsk)">{{itemsk.name}}</li>
                      </ul>
                    </div>
                  </el-form-item>
                  <div class="unitfrom">
                    <label>单位：</label>
                    <span>（项）</span>
                  </div>
                  <el-form-item label="入库数量：" prop="receivedNumber">
                    <el-input placeholder="请输入入库数量" v-model.number="addruleForm.receivedNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="有效时间：" prop="repertoryTime">
                    <div class="block">
                      <el-date-picker
                        v-model="addruleForm.repertoryTime"
                        type="date"
                        placeholder="请输入入库时间"
                        class="herderDatePicker"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <div class="stgbLisarea">
                      <textarea rows="10" v-model="remark" class="textarea" cols="30">哈哈哈</textarea>
                    </div>
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
            <el-button type="success" size="medium" @click="opencommodity">提交</el-button>
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
          <div class="timebox">
            <el-date-picker
              v-model="createTime"
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
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
import MemberFrame from "@/components/MemberFrame/MemberFrame";

//import XX from '';
export default {
  components: { MemberFrame },
  data() {
    return {
      //客户数据
      tableData_enterpurchase: [],
      //首页点击查看详情
      pageSize: 5,
      pagetotals: 10,
      //单位
      unit: "项",
      //商品编码
      productCode: "",
      //商品名字
      productName: "",
      //仓库cold
      warehouses: "",
      //供应商名字
      supplierName: "",
      //供应商cold
      supplierCodes: "",
      //供应商ID
      supplierId: "",
      //供应商
      supplierCategoryName: "",
      //普通仓库
      stockType: "",
      //公司名字
      storeName: "",
      //数量
      receivableNumber: "",
      receivedNumber: "",
      //总价
      totalPrice: "",
      //商品单价
      unitPrice: "",
      //子公司ID
      subCompanyId: "",
      //备注
      remark: "",
      //供应商
      option_supplier: [
        {
          value: 1,
          label: "第三方供应商",
          children: []
        }
      ],

      //添加产品数据
      addruleForm: {
        name: "",
        // unit: "",
        receivedNumber: "",
        repertoryTime: "",
        remark: ""
      },
      //入库日期
      createTime: "",

      //添加产品方法
      rules: {
        name: [{ required: true, message: "请选择项目名称", trigger: "blur" }],
        receivedNumber: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 500,
            message: "数量在1--500之间",
            trigger: "blur"
          }
        ],
        repertoryTime: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ]
      },
      value_invenT: "",
      //添加产品搜索框列表
      seekList: [],
      //采购订单搜索
      inputorder: "",
      confirmStatus:"",
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

      //当前条ID
      inStorageId: "",

      //出入库弹出层
      groupOpen: false,
      visible: false,
      visible_examine: false,
      visible_warehouse: false,
      visible_peple: false,
      visible_orderfrom: false,
      class_seekbox: false,

      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //分页
      //当前入库页数
      currentPage1: 1,
      //其他入库页码
      pageSize: 10,
      pagetotal: 0,
      pageSize2: 10,
      pagetotal2: 0,
      //弹出框页数
      currentPage2: 1,
      //其他入库
      inStorageType: "其他入库",
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
      this.pagetotal2 = this.storageList.length + 1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addruleForm.curIndex == undefined) {
            this.addruleForm.totalPrice =
              this.unitPrice * this.addruleForm.receivedNumber;
            this.addruleForm.remark = this.remark;
            this.addruleForm.endDate = this.createTime;
            this.addruleForm.inShelfDate = this.createTime;
            this.addruleForm.receivableNumber = this.addruleForm.receivedNumber;
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

        //计算总价
        this.totalPrice = this.unitPrice * this.addruleForm.receivedNumber;
      });
    },
    //获取供应商当前字段
    onProvincesChange() {
      let accoers = this.$refs.myCascader.getCheckedNodes()[0].data;
      this.supplierCodes = accoers.supplierCode;
      // this.supplierCategoryName = accoers.supplierCategoryName;
      this.supplierId = accoers.supplierId;
      this.supplierName = accoers.supplierName;
    },

    //订单详情页分页
    handleSizeChckbo(val) {},
    handleCurrentChckbo(val) {},
    //添加入库
    addfriends() {
      //当前时间
      // this.createTime = new Date();
      this.seekList = [];
      this.createTime = "";
      this.supplierCategoryName = "";
      this.option_supplier[0].children = [];
      //请求商品
      this.requestcommodity();
      //请求仓库
      this.requestwarehouse();
      //请求供应商
      this.supplierList();
      //请求公司
      this.requestcompany();
      this.groupOpen = true;
      this.pagetotal2 = 0;
      this.storageList = [];
    },
    //取消添加
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible_orderfrom = false;
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
    //确认收货
    confirmPopOver(res) {
      this.inStorageId = res.inStorageId;
      if (res.confirmStatus == "待收货") {
        this.confirmStatus = 1;
        this.$confirm("您确定是否已收到货？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "收货成功!"
            });
            this.confirmReceipt();
            setTimeout(() => {
              this.otherinstorage();
            }, 200);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消收货"
            });
          });
      } else {
      }
    },
    //作废
    handleDelete(res) {
      this.inStorageId = res.inStorageId;
      if (res.invalidStatus == "未作废") {
        this.$confirm("您是否确认作废？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.cancellation();
            setTimeout(() => {
              this.otherinstorage();
            }, 200);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消作废"
            });
          });
      } else {
      }
    },
    //搜索时间
    searchTime() {
      this.otherinstorage();
    },
    resetamend(formName) {
      this.$refs[formName].resetFields();
    },
    //搜索产品名称
    seekproductName() {
      this.class_seekbox = true;
    },
    //选择某个商品
    selcommodity(res) {
      // this.unit = res.unit;
      this.productName = res.name;
      this.unitPrice = res.unitPrice;
      this.productCode = res.productCode;
      this.class_seekbox = false;
      var object = {
        name: res.name,
        // // specification: res.productSpecification,
        productName: res.name,
        productCode: res.productCode,
        receivableNumber: this.addruleForm.receivedNumber,
        receivedNumber: this.addruleForm.receivedNumber,
        unit: this.unit,
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
      console.log(this.addruleForm);
      console.log(res);
    },
    //入库保存
    opencommodity() {
      if (this.storageList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择入库商品",
          type: "warning"
        });
      } else if (this.supplierCategoryName == "") {
        this.$message({
          message: "请选择供应商",
          type: "warning"
        });
      } else if (this.createTime == "") {
        this.$message({
          message: "请选择入库时间",
          type: "warning"
        });
      } else {
        this.submitindent();
        this.groupOpen = false;
        this.$message({
          message: "提交成功",
          type: "success"
        });
        setTimeout(() => {
          this.otherinstorage();
        }, 300);
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
    showPopOver(item) {
      console.log(item);

      this.visible_examine = true;
      this.tableexamine = item.inStorageProductList;
      // this.pagetotals = this.tableexamine;
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

    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      console.log(123);
      this.otherinstorage();
    },
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
    //确认收货
    confirmReceipt() {
      var url = this.$https.productHost + "/stock/confirm";
      var params = {
        inStorageId: this.inStorageId,
        confirm: localStorage.getItem("trueName"),
        confirmStatus: this.confirmStatus
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //作废请求
    cancellation() {
      var url = this.$https.productHost + "/stock/auditInstorage";
      var params = {
        inStorageId: this.inStorageId,
        invalid: localStorage.getItem("trueName")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result == null) {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "error"
            });
          }
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //其他入库列表
    otherinstorage() {
      var url = this.$https.productHost + "/stock/selectInstorageList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize,
        inStorageType: this.inStorageType,
        inStorageDate: this.value_invenT
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
            if (value.confirmStatus == 0) {
              value.confirmStatus = "待收货";
            } else {
              value.confirmStatus = "已收货";
            }
          });
        })
        .catch(err => {});
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
                id: value.serviceProductId,
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
        .catch(err => {});
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
          if (res.data.result) {
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
            //公司名字
            this.storeName = res.data.result.name;
            //子公司ID
            this.subCompanyId = res.data.result.subCompanyId;
            //公司编码
            // this.wwww = res.data.result.list.erpStock;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //提交入库订单
    submitindent() {
      var url = this.$https.productHost + "/stock/instorage";
      var text = JSON.stringify(this.storageList);
      var params = {
        storeId: localStorage.getItem("storeId"),
        supplierCategoryId: 1,
        inStorageType: "其他入库", //入库方式
        invoicesType: "标准其他入库", //单据类型
        inStorageDate: this.createTime, //入库日期
        //purchaseBranch: $("#instorage input[name='purchaseBranch']").val(), 入库部门
        stockGroup: this.warehouses, //仓库CK001
        shipperType: "第三方供应商", //货主类型（供应商
        shipper: this.supplierName, //货主
        shipperCode: this.supplierCodes, //货主编码
        inventoryGroup: this.warehouses, //库存组织
        inventoryWay: "普通", //库存方向（1普通、2退货）
        inStorageProductJson: text,
        remark: this.remark, //备注
        createOperator: localStorage.getItem("trueName") //创建者
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
            this.tableData_enterpurchase.push(res.data.result);
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
    this.otherinstorage();
    // this.dateFormat();
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
      margin-left: 20%;
      label {
        width: 86px;
        color: #333333;
        line-height: 45px;
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
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
    min-width: 1024px;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    padding: 10px 50px 20px 50px;
    overflow: auto;
    border-radius: 6px;
    margin: 0 auto;
  }
  .paging {
    width: 100%;
    height: 100px;
    margin-bottom: 220px;
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
        width: 100%;
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
      .waresupplier {
        width: 220px;
        height: 50px;
        // border: 1px solid rgb(167, 158, 158);
        position: fixed;
        bottom: 180px;
        left: 300px;
        border-radius: 4px;
      }
      .timebox {
        width: 220px;
        height: 42px;
        position: fixed;
        bottom: 190px;
        border-radius: 4px;
        left: 600px;
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
      border-radius: 5px;
    }
    .stgbLisarea {
      width: 220px;
      height: 100px;
      .textarea {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        padding: 5px 0 0 5px;
      }
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
    span {
      color: #ada3a3;
    }
    .unitfrom {
      width: 315px;
      height: 40px;
      margin-bottom: 10px;
      line-height: 40px;
      span {
        color: black;
      }
      label {
        padding-left: 45px;
      }
    }
  }
  .stgblckbottom {
    text-align: center;
    .el-button {
      margin-top: 20px;
    }
  }
}
</style>
