<!-- 添加入库采购订单 -->
<template>
  <div class="addpurchase">
    <!-- 搜索 -->
    <div class="invenTitle" v-if="groupOpen == false">
      <h1>采购订单列表</h1>
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
        <el-table-column label="入库人">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.createOperator }}</div>
          </template>
        </el-table-column>
        <el-table-column label="采购订单号">
          <template slot-scope="scope">
            <span>{{ scope.row.inStorageNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购时间">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.inStorageDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="作废状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.invalidStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否收货">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.confirmStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="showPopOver(scope.row)">查看</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
            :total="totalSizes"
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
        <h2>添加采购订单</h2>
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
                        <li @click="selcommodity(itemsk)">
                          <span>{{itemsk.name}}</span>
                        </li>
                      </ul>
                    </div>
                  </el-form-item>
                  <el-form-item label="数量：" prop="receivedNumber">
                    <el-input v-model.number="addruleForm.receivedNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期：" prop="repervalidity">
                    <div class="block">
                      <el-date-picker
                        v-model="addruleForm.repervalidity"
                        type="date"
                        placeholder="选择产品有效期"
                        class="herderDatePicker"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>
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
              <el-table-column label="有效日期">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.repervalidity }}</div>
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
            <!-- <el-cascader :options="options" :show-all-levels="false"></el-cascader> -->
          </div>
          <div class="waresuppTime">
            <el-date-picker
              v-model="createTime"
              type="date"
              placeholder="选择入库日期"
              class="herderDatePicker"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
          <div class="waresubmit">
            <el-button type="success" @click="opencommodity">提交</el-button>
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
                :total="totalSize"
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

      //店铺名称
      storeName: "",
      //子公司名称
      subCompanyId: "",
      //仓库代码
      warehouses: "",
      //仓库名
      stockType: "",
      //获取人名币
      moneypeople: "",
      //供应商类型
      supplierCode: [],
      //页数
      pageSize2: 10,
      //页数
      pageSize1: 10,
      //总页个数
      totalSize: 0,
      //总也个数2
      totalSizes: 0,
      //总公司
      subsidiaryName: "",
      //添加产品数据
      addruleForm: {},
      addrepersss: "",
      //供应商名字
      supplierName: "",
      //供应商cold
      supplierCodes: "",
      //供应商ID
      supplierId: "",
      //供应商
      supplierCategoryName: "",
      //入库日期
      createTime: "",
      //商品编码
      productCode: "",
      //商品名字
      productName: "",
      //商品码
      productSpecification: "",
      //定义供应商数组
      suppings: {},
      //商品单价
      unitPrice: "",
      //单位
      unit: "",
      //時間
      repervalidity: "",
      //当前条的ID
      inStorageId: "",
      //当前条数的状态
      confirmStatus: "",
      //商品总价
      totalPrice: "",
      //子公司Cold
      chainCode: "",
      //数量
      // receivableNumber: "",
      // receivedNumber: "",
      //添加产品方法
      rules: {
        name: [{ required: true, message: "请选择产品", trigger: "blur" }],
        receivedNumber: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 500,
            message: "请输入数字,数量在1--500之间",
            trigger: "blur"
          }
        ],
        repervalidity: [
          { required: true, message: "请选择有效期", trigger: "blur" }
        ]
      },
      //添加产品搜索框列表
      seekList: [],
      //添加供应商搜索框列表
      merchantList: [
        {
          index: "7",
          name: "哈哈7"
        }
      ],
      //采购订单搜索
      inputorder: "",
      //时间选择
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
      //添加采购列表
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
      tableexamine: [
        {
          itemname: "哇哇哇",
          itemnum: "12",
          itemunit: "上海市金沙江路18",
          itemday: "2016-05-02"
        },
        {
          itemname: "哇哇哇",
          itemnum: "12",
          itemunit: "上海市金沙江路",
          itemday: "2016-05-02"
        },
        {
          itemname: "哇哇哇",
          itemnum: "12",
          itemunit: "普陀区金沙江路",
          itemday: "2016-05-02"
        },
        {
          itemname: "哇哇哇",
          itemnum: "12",
          itemunit: "金沙江路1518",
          itemday: "2016-05-02"
        }
      ],

      value2: "",
      valueday3: "",

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
      //弹出框页数
      currentPage2: 1,

      //入库
      inStorageType: "采购入库",
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
      appear_remarkConnet: "这是一个入库",
      //供应商
      // option_supplier: [
      //   {
      //     value: "smCompany",
      //     label: "子公司",
      //     children: [
      //       {
      //         value: 0,
      //         label: "子公司",
      //         supplierCode: "",
      //         supplierId: "",
      //         supplierName: "",
      //         supplierCategoryName: ""
      //       }
      //     ]
      //   },
      //   {
      //     value: 1,
      //     label: "第三方供应商",
      //     children: []
      //   }
      // ],

      option_supplier: [
        {
          value: "smCompany",
          label: "子公司",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则"
            }
          ]
        },
        {
          value: "1",
          label: "第三方供应商",
          children: [
            // {
            //   value: "basic",
            //   label: "Basic",
            //   children: [
            //     {
            //       value: "layout",
            //       label: "Layout 布局"
            //     }
            //   ]
            // },
            // {
            //   value: "others",
            //   label: "Others",
            //   children: [
            //     {
            //       value: "dialog",
            //       label: "Dialog 对话框"
            //     },
            //     {
            //       value: "tooltip",
            //       label: "Tooltip 文字提示"
            //     }
            //   ]
            // }
          ]
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    //弹出详情切换
    handleClick(tab, event) {},
    //添加产品验证
    submitForm(formName) {
      this.totalSize = this.storageList.length + 1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addruleForm.curIndex == undefined) {
            this.addruleForm.totalPrice =
              this.unitPrice * this.addruleForm.receivedNumber;
            this.addruleForm.endDate = this.addruleForm.repervalidity;
            this.addruleForm.inShelfDate = this.createTime;
            this.addruleForm.receivableNumber = this.addruleForm.receivedNumber;
            // this.addruleForm.productionDate = new Date();
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
    //搜索时间
    searchTime() {
      this.purchinstorage();
    },
    //添加
    virtures() {
      //时间
      // this.createTime = new Date();
      this.seekList = [];
      this.createTime = "";
      // this.supplierCategoryName = "";
      // this.option_supplier[0].children = [];

      //子公司
      this.totalSize = 0;
      this.storageList = [];
      this.requcompany();
      //请求供应商
      this.supplierList();
      //请求商品
      this.requestcommodity();
      //请求第三供应商
      this.goyisList();
      this.groupOpen = true;
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
          alert("submit!");
        } else {
          return false;
        }
      });
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
      this.unit = res.unit;
      this.specification = res.productSpecification;
      this.productName = res.name;
      this.unitPrice = res.unitPrice;
      this.productCode = res.productCode;
      this.class_seekbox = false;
      var object = {
        name: res.name,
        // specification: res.productSpecification,
        productName: res.name,
        // unitPrice: res.productSpecification,
        productCode: res.productCode,
        unit: this.unit,
        productType: 1,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1,
        keeperType: 3,
        totalPrice: this.totalPrice,
        endDate: this.createTime,
        inShelfDate: this.createTime,
        keeper: this.storeName,
        keeperCode: this.warehouses,
        isSend: false
      };
      this.addruleForm = Object.assign({}, this.addruleForm, object);
    },

    //搜索供应商
    selcommoName() {
      this.class_selckbox = true;
    },
    //选择供应商
    selcmerchant(res) {
      this.addruleForm.addrepertory = res.name;
      this.class_selckbox = false;
    },

    //入库保存
    opencommodity() {
      this.receivableNumber = this.createTime;
      this.receivedNumber = this.createTime;
      if (this.storageList.length == 0) {
        this.$message({
          message: "请选择采购商品...",
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
        this.submitindent();
        this.groupOpen = false;
        this.$message({
          message: "提交成功",
          type: "success"
        });
        setTimeout(() => {
          this.purchinstorage();
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
      this.totalSize = this.storageList.length - 1;
      this.$set(this.addruleForm, "curIndex", index);
      this.storageList.splice(this.addruleForm.curIndex, 1);
    },
    //点击查看订单详情
    showPopOver(res) {
      this.tableexamine.createTime = res.inStorageDate;
      this.tableexamine = res.inStorageProductList;
      this.visible_examine = true;
      this.pagetotals = this.tableexamine.length;
    },
    //确认收货
    confirmPopOver(res) {
      this.inStorageId = res.inStorageId;
      if (res.confirmStatus == "未收货") {
        this.confirmStatus = 0;
      } else {
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
            this.purchinstorage();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消收货"
            });
          });
      }
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
      this.visible_orderfrom = true;
    },
    closeorderfrom(formName) {
      this.visible_orderfrom = false;
    },
    //确认添加订单
    tallyorderfrom() {
      this.visible_orderfrom = false;
    },
    //删除
    handleDelete(index, row) {
      this.$set(this.storageList, "curIndex", index);
      this.tableData_enterpurchase.splice(this.storageList.curIndex, 1);
    },
    //获取当前字段
    onProvincesChange() {
      let accoers = this.$refs.myCascader.getCheckedNodes()[0].data;
      this.supplierCodes = accoers.supplierCode;
      // this.supplierCategoryName = accoers.supplierCategoryName;
      this.supplierId = accoers.supplierId;
      this.supplierName = accoers.supplierName;
      console.log(accoers);
    },

    //分页
    handleSizeChange(val) {
      setTimeout(() => {
        this.purchinstorage();
      }, 300);
    },
    handleCurrentChange(val) {
      setTimeout(() => {
        this.purchinstorage();
      }, 300);
    },
    nextclick() {
      setTimeout(() => {
        this.purchinstorage();
      }, 300);
    },
    prevclick() {
      setTimeout(() => {
        this.purchinstorage();
      }, 300);
    },
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
    //入库采购列表
    purchinstorage() {
      var url = this.$https.productHost + "/stock/selectInstorageList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage1,
        pageSize: this.pageSize1,
        inStorageType: this.inStorageType,
        inStorageDate: this.value_invenT
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result.list) {
            this.totalSizes = res.data.result.total;
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
            if (value.InStorageStatus == 0) {
              value.InStorageStatus = "待审核";
            } else {
              value.InStorageStatus = "已审核";
            }
            if (value.confirmStatus == 0) {
              value.confirmStatus = "待收货";
            } else {
              value.confirmStatus = "已收货";
            }
          });
          //获取人名币
          this.moneypeople = res.data.result.list[0].settlementCurrency;
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },
    //请求仓库
    requestwarehouse() {
      var url = this.$https.productHost + "/stock/selectStockList";
      var params = {
        // storeId: localStorage.getItem("storeId"),
        companyType: 3,
        companyId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.warehouses = res.data.result[0].stockCode;
            this.stockType = res.data.result[0].stockType;
          } else {
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
    //请求公司
    requestcompany() {
      var url = this.$https.storeHost + "/manage/store/selectStoreById";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          // console.log("请求公司",res.data.result);
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
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
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
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result.list) {
            res.data.result.list.forEach(value => {
              this.seekList.push({
                name: value.productName,
                id: value.productId,
                productSpecification: value.productSpecification,
                unitPrice: value.unionPrice,
                productCode: value.productCode,
                unit: 1
              });
            });
          } else {
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

    //请求子公司
    requcompany() {
      var url = this.$https.storeHost + "/manage/company/selectSubsidiaryByID";
      var params = {
        subsidiaryId: this.subCompanyId
      };
      this.$https.fetchPost(url, params).then(
        res => {
          // console.log("子公司", res.data.result);
          if (res.data.result) {
            // this.option_supplier[0].children[0].supplierCode =
            //   res.data.result.chainCode;
            // this.subsidiaryName = res.data.result.subsidiaryName;
            // this.option_supplier[0].children[0].label = this.subsidiaryName;
            // this.option_supplier[0].children[0].supplierId =
            //   res.data.result.subsidiaryId;
            // this.option_supplier[0].children[0].supplierName =
            //   res.data.result.subsidiaryName;
          } else {
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
    //请求第三供应商列表
    supplierList() {
      var url = this.$https.storeHost + "/manage/supplier/listSupplier";
      var params = {
        storeId: localStorage.getItem("storeId"),
        supplierCategoryId: 1
      };
      this.$https.fetchPost(url, params).then(
        res => {
          // console.log("第三供应商", res.data.result);
          if (res.data.result !== null) {
            // res.data.result.list.forEach(value => {
            //   this.option_supplier[1].children.push({
            //      label: value.supplierName,
            //     value: value.supplierId,
            //     supplierId: value.supplierId,
            //     supplierName: value.supplierName,
            //     supplierCategoryName: value.supplierCategoryName,
            //     supplierCode: value.supplierCode
            //   });
            // });
          } else {
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
    //请求供应商列表
    goyisList() {
      var url =
        this.$https.storeHost + "/manage/supplier/listSupplierCategoryNoPage";
      var params = {};
      this.$https.fetchPost(url, params).then(
        res => {
          console.log("请求供应商列表", res.data.result);
          var data2 = [];
          if (res.data.result) {
            res.data.result.forEach(value => {
              console.log(value);

              this.option_supplier[1].children.push({
                label: value.supplierCategoryName,
                supplierCategoryId: value.supplierCategoryId,
                value: value.supplierCategoryName,
                children: value.supplierList
              });
              // console.log(value.supplierList);

              data2.push({
                label: value.supplierCategoryName,
                supplierCategoryId: value.supplierCategoryId,
                value: value.supplierCategoryName,
                children: value.supplierList
              });

              console.log("res", data2);

              value.supplierList.forEach(value2 => {
                // console.log('data',value2);
              });
              // this.option_supplier[1].children[0].children.forEach(value2 =>{
              //   console.log(value2);
              //   // this.option_supplier[1].children.push({
              //   //   // label:value2.name
              //   // })
              // })
            });

            for(var i=0;i<data2.length;i++){
              var child = data2[i].children;
              // child.forEach(item => {
              //   console.log(item);
              //   item.name = item.supplierName
              // })
              // console.log('erwr',child);
              for(var j=0;j<child.length;j++){
                console.log('res',child[j]);
                 child[j].label = value.supplierCategoryName,
                child[j].supplierCategoryId = value.supplierCategoryId,
                child[j].value =  value.supplierCategoryName,
                child[j].children: value.supplierList
                child[j].value =  child[j].supplierName;
                console.log('chi1',child[j]);
              }
            }

            // console.log('fuck',data2);

            // this.option_supplier[1].children.supplierList[1].forEach(value2 =>{
            //   console.log(value2.children);

            // })
            // console.log(this.option_supplier[1].children[1]);
            // this.option_supplier[0].children[0].supplierCategoryName =
            //   res.data.result.list[0].supplierCategoryName;
          } else {
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
    //提交采购订单
    submitindent() {
      var url = this.$https.productHost + "/stock/instorage";
      var text = JSON.stringify(this.storageList);
      var params = {
        storeId: localStorage.getItem("storeId"),
        supplierCategoryId: 1,
        inStorageType: "采购入库",
        invoicesType: "标准采购入库",
        businessType: "标准采购",
        inStorageDate: this.createTime,
        receiveGroup: this.storeName,
        stockGroup: this.warehouses,
        needGroup: this.storeName,
        purchaseGroup: this.warehouses,
        purchaseBranch: this.stockType,
        provider: this.supplierId,
        providerName: this.supplierName,
        settlementGroup: this.storeName,
        settlementCurrency: "人民币",
        shipperType: this.supplierCategoryName,
        shipper: this.supplierName,
        shipperCode: this.supplierCodes,
        inStorageProductJson: text,
        // createOperator: localStorage.getItem("trueName"),
        productType: 1,
        // productionDate: new Date(),
        //个人
        productCode: this.productCode,
        productName: this.productName,
        specification: this.productSpecification,
        endDate: this.createTime,
        inShelfDate: this.createTime,
        receivableNumber: this.addruleForm.receivedNumber,
        receivedNumber: this.addruleForm.receivedNumber,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1,
        keeperType: 3,
        keeper: this.storeName,
        keeperCode: this.warehouses,
        isSend: false
      };

      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result !== null) {
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
          // this.tableData_enterpurchase = res.data.result
          this.tableData_enterpurchase.push(res.data.result);
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    }
  },
  created() {
    //采购入库
    this.purchinstorage();
    //请求仓库
    this.requestwarehouse();
    //请求公司
    this.requestcompany();
    // //请求商品
    // this.requestcommodity();
    //时间转换
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
  display: flex;
  flex-flow: column;
  .invenTitle {
    width: 100%;
    height: 150px;
    // border-bottom: 1px solid #f6f6f6;
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
      margin-left: 25%;
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
    // overflow: auto;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    padding: 10px 50px 20px 50px;
    margin: 0 auto;
    border-radius: 6px;
  }
  .paging {
    width: 100%;
    height: 100px;
    margin-top: 35px;
    margin-bottom: 220px;
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
      height: 100%;
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
        border-radius: 4px;
        padding: 20px;
        box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
      }
      .waresupplier {
        width: 230px;
        height: 50px;
        border-radius: 4px;
        // border: 1px solid rgb(167, 158, 158);
        position: fixed;
        bottom: 170px;
        left: 300px;
      }
      .waresubmit {
        position: absolute;
        bottom: 258px;
        right: 100px;
        padding: 10px;
      }
      .waresuppTime {
        width: 232px;
        height: 50px;
        position: fixed;
        bottom: 170px;
        border-radius: 4px;
        left: 600px;
        .el-date-editor {
          width: 230px;
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
    padding: 35px 0 0 40px;
    height: 100%;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .el-input {
      width: 230px;
      // border: 1px solid rgb(184, 178, 178);
      border-radius: 5px;
    }
    .el-cascader {
      border: 1px solid rgb(184, 178, 178);
      border-radius: 5px;
    }
    .el-radio {
      margin: 5px 0;
    }
    .seekprbox {
      width: 230px;
      height: 80px;
      overflow: auto;
      border: 1px solid rgb(184, 178, 178);
      li {
        width: 100%;
        height: 20px;
        margin-left: 10px;
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
