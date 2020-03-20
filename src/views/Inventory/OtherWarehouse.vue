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
        <el-table-column label="供货组织" min-width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.outstorageOrgName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库方向" min-width="100">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.inventoryWays }}</div>
          </template>
        </el-table-column>
        <el-table-column label="入库单号" min-width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.inStorageNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库日期" min-width="165">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.inStorageDate }}</div>
          </template>
        </el-table-column>
        <el-table-column label="作废状态" min-width="100">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">{{ scope.row.invalidStatus }}</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="100">
          <template slot-scope="scope">
            <div
              slot="reference"
              :class="scope.row.suppIsAudit == '待审核' ? 'active1' : 'active2'"
              class="name-wrapper"
            >{{ scope.row.suppIsAudit }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <div class="InventryOperation">
              <div class="inventsome1" @click="showPopOver(scope.row)">查看</div>
              <div
                class="inventsome2"
                @click="handleDelete(scope.row)"
                :class="scope.row.invalidStatus == '未作废' && scope.row.afterAuditInStorageId == null ? 'active' : 'acc'"
              >作废</div>
              <div
                class="inventsome3"
                :class="scope.row.confirmStatus !== 'null' && scope.row.confirmStatus == 0 ? 'active' : 'acc'"
                @click="confirmPopOver(scope.row)"
              >确认收货</div>
            </div>
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
                <div slot="reference" class="name-wrapper">{{ scope.row.unitName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div
                  class="inventsome4"
                  :class="scope.row.afterAuditInStorageId !== null ? 'active' : 'acc'"
                  @click="salesretrun(scope.row)"
                >退货</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <el-button type="info" size="small" @click="tallyClick">确认</el-button>
        </div>
      </PopOver>
      <!--退货 -->
      <PopOver
        custom-class="storageblocks"
        :visible.sync="visible_times"
        @close="closeTime"
        width="450px"
      >
        <div class="stgblcktop" slot="top">退货</div>
        <div class="stgblcktopmain" slot="main">
          <div class="optionDate">
            <label>退货数量：</label>
            <el-input
              placeholder="请输入退货数量"
              oninput="value=value.replace(/[^\d]/g, '')"
              v-model="value_return"
              clearable
            ></el-input>
          </div>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <el-button @click="confirm_true" size="small" type="success">确定</el-button>
          <el-button @click="confirm_false" size="small" type="info">取消</el-button>
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
                  <el-form-item label="项目名称：">
                    <el-input @focus="seekproductName" v-model="addruleForm.name"></el-input>
                    <div class="seekprbox" v-show="class_seekbox == true">
                      <ul v-for="itemsk in seekListFilter" :key="itemsk.index">
                        <li @click="selcommodity(itemsk)">{{itemsk.name}}</li>
                      </ul>
                    </div>
                  </el-form-item>
                  <div class="unitfrom">
                    <label>单位：</label>
                    <span>（{{unitName}}）</span>
                  </div>
                  <el-form-item label="入库数量：" prop="receivedNumber">
                    <el-input placeholder="请输入入库数量" v-model.number="addruleForm.receivedNumber"></el-input>
                  </el-form-item>
                  <el-form-item label="有效时间：" prop="repertoryTime">
                    <div class="block">
                      <el-date-picker
                        v-model="addruleForm.repertoryTime"
                        type="date"
                        placeholder="请输入有效时间"
                        class="herderDatePicker"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions0"
                      ></el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <div class="stgbLisarea">
                      <textarea rows="10" v-model="remark" class="textarea" cols="30">哈哈哈</textarea>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <div class="stgblckbottom" slot="bottom">
                <el-button type="primary" @click="submitForm('addruleForm')">确定</el-button>
                <el-button @click="resetForm('addruleForm')">取消</el-button>
              </div>
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
            <el-select v-model="valueshop" @change="valshape" placeholder="请选择部门">
              <el-option
                v-for="item in optionsShops"
                :key="item.k3Number"
                :label="item.name"
                :value="item.k3Number"
              ></el-option>
            </el-select>
          </div>
          <div class="department">
            <el-cascader
              v-model="supplierCategoryName"
              placeholder="请选择供应商"
              :options="option_supplier"
              filterable
              ref="myCascader"
              :show-all-levels="false"
              @expand-change="onProvincesChange"
              @change="onProvincesChanges"
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
          <!-- <div class="warenavigation">
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
          </div>-->
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
      //产品有效期验证
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      //客户数据
      tableData_enterpurchase: [],
      //首页点击查看详情
      pageSize: 5,
      pagetotals: 10,
      //单位
      unit: "",
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
      supplierCategoryNames: "",
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
        // {
        //   value: 1,
        //   label: "第三方供应商",
        // children: []
        // }
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
      //退货
      value_return: "",
      //添加产品搜索框列表
      seekList: [],
      //采购订单搜索
      inputorder: "",
      confirmStatus: "",
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
      //门店选择
      valueshop: "",
      optionsShops: [],
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
      visible_times: false,
      visible_orderfrom: false,
      class_seekbox: false,
      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //分页
      //当前入库页数
      currentPage1: 1,
      inStorageProductID: "",
      //其他入库页码
      pageSize: 10,
      pagetotal: 0,
      //单位
      unitName: "",
      //商品单位
      unitDatas: [],
      //其他入库
      inStorageType: "其他入库",
      inStorageIdsss: "",
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
  computed: {
    //模糊查询商品
    seekListFilter: function() {
      const input_nurse = this.addruleForm.name;
      if (input_nurse) {
        return this.seekList.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(input_nurse) > -1;
          });
        });
      }
      return this.seekList;
    }
  },
  watch: {},
  methods: {
    //弹出详情切换
    handleClick(tab, event) {},
    //添加产品验证
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.class_seekbox == false && this.addruleForm.name) {
            if (this.addruleForm.curIndex == undefined) {
              this.addruleForm.totalPrice =
                this.unitPrice * this.addruleForm.receivedNumber;
              this.addruleForm.remark = this.remark;
              this.addruleForm.endDate = this.addruleForm.repertoryTime;
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
            this.class_seekbox = false;
            this.visible_orderfrom = false;
          } else {
            this.$message({
              message: "请选择正确的商品",
              type: "warning"
            });
          }
        } else {
          return false;
        }

        //计算总价
        this.totalPrice = this.unitPrice * this.addruleForm.receivedNumber;
      });
    },
    //获取供应商当前字段
    onProvincesChange(reo) {
      this.supplierCategoryName = [...reo];
      //请求第二段供应商
      this.supplierTowList();
    },
    onProvincesChanges() {
      let accoers = this.$refs.myCascader.getCheckedNodes()[0].data;
      this.supplierCodes = accoers.supplierCode;
      this.supplierCategoryNames = accoers.supplierCode;
    },
    //确定退货
    confirm_true() {
      //请求退货
      this.requestsres();
      this.visible_times = false;
      this.value_return = "";
    },
    //取消退货
    confirm_false() {
      this.visible_times = false;
      this.value_return = "";
    },

    //订单详情页分页
    handleSizeChckbo(val) {},
    handleCurrentChckbo(val) {},
    //添加入库
    addfriends() {
      //当前时间
      // this.createTime = new Date();
      this.valueshop = "";
      this.supplierCategoryName = "";
      this.supplierCategoryNames = "";
      this.seekList = [];
      this.createTime = "";
      this.option_supplier = [];
      //请求商品
      this.requestcommodity();
      //请求仓库
      this.requestwarehouse();
      //请求供应商
      this.supplierList();
      //请求门店
      this.Requeststores();
      //请求公司
      this.requestcompany();
      this.groupOpen = true;
      this.storageList = [];
    },
    //取消添加
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible_orderfrom = false;
      this.class_seekbox = false;
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
    //部门
    valshape(res) {},
    //确认收货
    confirmPopOver(res) {
      this.inStorageId = res.inStorageId;

      this.confirmStatus = 1;
      if (res.confirmStatus !== null && res.confirmStatus == 0) {
        this.$confirm("您确定是否已收到货？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.confirmReceipt();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消收货"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "该商品已收货"
        });
      }
    },
    //退货
    closeTime() {
      this.visible_times = false;
      this.value_return = "";
    },
    //退货按钮
    salesretrun(res) {
      this.inStorageProductID = res.inStorageProductID;

      if (res.inventoryWay == "GENERAL" && res.afterAuditInStorageId !== null) {
        this.visible_times = true;
      } else {
         this.$message({
          type: "warning",
          message: "该商品已退货!"
        });
      }
    },
    //作废
    handleDelete(res) {
      this.inStorageId = res.inStorageId;
      if (res.invalidStatus == "未作废" && res.afterAuditInStorageId == null) {
        this.$confirm("您是否确认作废？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.cancellation();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消作废"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "该商品已作废了喔!"
        });
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
      this.productName = res.name;
      this.unitPrice = res.unitPrice;
      this.productCode = res.productCode;
      this.class_seekbox = false;
      this.unit = res.unit;
      var object = {
        name: res.name,
        productName: res.name,
        productCode: res.productCode,
        receivableNumber: this.addruleForm.receivedNumber,
        receivedNumber: this.addruleForm.receivedNumber,
        unit: res.unit,
        unitPrice: this.unitPrice,
        totalPrice: this.totalPrice,
        stock: this.warehouses,
        stockStatus: 1,
        productType: res.productType,
        endDate: this.createTime,
        inShelfDate: this.createTime,
        keeperType: 3,
        keeper: this.storeName,
        keeperCode: this.warehouses,
        isSend: false
      };
      this.addruleForm = Object.assign({}, this.addruleForm, object);
      this.class_seekbox = false;
      //循环单位
      this.unitDatas.forEach(value => {
        if (res.unit == value.unitId) {
          this.unitName = value.unitName;
          this.unit = value.unitId;
        }
      });
    },
    //入库保存
    opencommodity() {
      if (this.storageList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择入库商品",
          type: "warning"
        });
      } else if (this.supplierCategoryNames == "") {
        this.$message({
          message: "请选择供应商",
          type: "warning"
        });
      } else if (this.valueshop == "") {
        this.$message({
          message: "请选择部门",
          type: "warning"
        });
      } else if (this.createTime == "") {
        this.$message({
          message: "请选择入库时间",
          type: "warning"
        });
      } else {
        //提交
        this.submitindent();
        this.groupOpen = false;
        // setTimeout(() => {
        //   this.otherinstorage();
        // }, 300);
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
    showPopOver(item) {
      this.inStorageIdsss = item.inStorageId;
      let someritm = item.inStorageProductList;
      for (let i = 0; i < someritm.length; i++) {
        someritm[i].inventoryWay = item.inventoryWay;
        someritm[i].afterAuditInStorageId = item.afterAuditInStorageId;
      }
      this.visible_examine = true;
      this.tableexamine = item.inStorageProductList;
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
      this.unitName = "";
      this.visible_orderfrom = true;
    },
    closeorderfrom() {
      this.visible_orderfrom = false;
      this.class_seekbox = false;
    },
    //确认添加订单
    tallyorderfrom() {
      this.visible_orderfrom = false;
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
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
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: "收获成功",
              type: "success"
            });
            //刷新列表
            this.otherinstorage();
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
    //请求退货
    requestsres() {
      var url = this.$https.productHost + "/stock/instoragePreAuditReturn";
      var params = {
        inStorageId: this.inStorageIdsss,
        number: this.value_return,
        inStorageProductID: this.inStorageProductID
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              type: "success",
              message: res.data.result
            });
            this.visible_examine = false;
            this.otherinstorage();
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
            message: "退货失败"
          });
        }
      );
    },
    //请求门店
    Requeststores() {
      var url =
        this.$https.storeHost + "/manage/department/listDepartmentNoPage";
      var params = {
        companyType: 3,
        companyId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.optionsShops = res.data.result;
          }
        },
        error => {
          this.$message({
            type: "error",
            message: "门店请求失败"
          });
        }
      );
    },
    //作废请求
    cancellation() {
      var url = this.$https.productHost + "/stock/cancelInstoragePreAudit";
      var params = {
        inStorageId: this.inStorageId,
        invalid: localStorage.getItem("trueName")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result == null) {
            this.$message({
              message: "作废成功",
              type: "warning"
            });
            //刷新列表
            this.otherinstorage();
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
    //单位
    unitData() {
      var url = this.$https.productHost + "/unit/selectUnitListNoPage";
      var params = {};
      this.$https.fetchPost(url).then(
        res => {
          if (res) {
            this.unitDatas = res.data.result;
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
        inventoryGroup: localStorage.getItem("stockCode"),
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
            this.pagetotal = 0;
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
            if (value.inventoryWay == "RETURN") {
              value.inventoryWays = "退货";
            } else {
              value.inventoryWays = "普通";
            }
            if (value.afterAuditInStorageNumber == null) {
              value.inStorageNumber = value.inStorageNumber;
            } else {
              value.inStorageNumber = value.afterAuditInStorageNumber;
            }
            if (value.suppIsAudit == 0) {
              value.suppIsAudit = "待审核";
            } else {
              value.suppIsAudit = "已审核";
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
                unit: value.unitId,
                productType: value.productType
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
      var url = this.$https.storeHost + "/manage/supplier/selectSuppTypeList";
      var params = {
        // storeId: localStorage.getItem("storeId"),
        // supplierCategoryId: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            let resd = res.data.result;
            for (let i in resd) {
              this.option_supplier.push({
                label: resd[i],
                value: i,
                children: []
              });
            }
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //二级供应商
    supplierTowList() {
      var url = this.$https.storeHost + "/manage/supplier/listSupplierNoPage";
      var params = {
        supplierType: this.supplierCategoryName[0],
        companyId: localStorage.getItem("storeId"),
        companyType: 3
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            res.data.result.forEach(value => {
              this.option_supplier.forEach(value2 => {
                value2.children = [];
                value2.children.push({
                  label: value.supplierName,
                  value: value.supplierId,
                  supplierCode: value.supplierCode
                });
              });
            });
          } else {
            this.option_supplier.forEach(value2 => {
              value2.children = [];
            });
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
      var url = this.$https.productHost + "/stock/instoragePreAudit";
      var text = JSON.stringify(this.storageList);
      var params = {
        // storeId: localStorage.getItem("storeId"),
        supplierCategoryId: 1,
        inStorageType: "其他入库", //入库方式
        invoicesType: "标准其他入库", //单据类型
        inStorageDate: this.createTime, //入库日期
        provider: this.supplierCategoryNames, //供应商
        branch: this.valueshop, //部门
        companyType: 3,
        companyId: localStorage.getItem("storeId"),
        //purchaseBranch: $("#instorage input[name='purchaseBranch']").val(), 入库部门
        stockGroup: this.warehouses, //仓库CK001
        shipperType: "业务组织", //货主类型（供应商
        orgK3Number: localStorage.getItem("orgK3Number"),
        stockId: localStorage.getItem("stockId"),
        branch: this.valueshop,
        shipper: localStorage.getItem("storeName"), //货主
        shipperCode: localStorage.getItem("storeId"), //货主编码
        inventoryGroup: this.warehouses, //库存组织
        inventoryWay: "GENERAL", //库存方向（1普通、2退货）
        inStorageProductJson: text,
        remark: this.remark, //备注
        instorageOrgName: localStorage.getItem("storeName"),
        createOperator: localStorage.getItem("trueName") //创建者
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
            this.tableData_enterpurchase.push(res.data.result);
            this.$message({
              message: res.data.result,
              type: "success"
            });
            this.otherinstorage();
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
    this.unitData();
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
    min-width: 1154px;
    box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    padding: 10px 50px 20px 50px;
    overflow: auto;
    border-radius: 6px;
    margin: 0 auto;
    .active1 {
      color: red;
    }
    .active2 {
      color: rgb(134, 214, 6);
    }
    .InventryOperation {
      display: flex;
      max-width: 235px;
      justify-content: space-between;

      .inventsome1 {
        padding: 0 15px;
        height: 28px;
        line-height: 25px;
        border: 1px solid rgb(187, 181, 181);
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
      }
      .inventsome2 {
        height: 28px;
        padding: 0 15px;
        line-height: 26px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        &.active {
          background-color: #ec2323;
        }
        &.acc {
          background-color: #a39898;
        }
      }

      .inventsome3 {
        height: 28px;
        padding: 2px 15px;
        line-height: 25px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        &.active {
          display: block;
          background-color: #68fc06;
        }
        &.acc {
          display: none;
          background-color: #a39898;
        }
      }
    }
  }
  .paging {
    width: 100%;
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
      margin-top: 40px;
      .wareBright {
        width: 100%;
        position: relative;
        // .warebrTitles {
        //   width: 100%;
        //   height: 60px;
        //   display: flex;
        //   font-size: 20px;
        //   line-height: 70px;
        //   justify-content: space-between;
        //   padding: 0 20px;
        // }
        .warenavigation {
          text-align: center;
          width: 100%;
          margin: 20px 0 30px 0;
        }
      }
      .wareLists {
        width: 80%;
        margin: 0 auto;
        overflow: auto;
        padding: 20px;
        max-height: 450px;
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
        position: fixed;
        bottom: 200px;
        left: 190px;
        border-radius: 4px;
      }
      .department {
        width: 220px;
        height: 42px;
        position: fixed;
        bottom: 210px;
        border-radius: 4px;
        left: 430px;
      }
      .timebox {
        width: 220px;
        height: 42px;
        position: fixed;
        bottom: 210px;
        border-radius: 4px;
        left: 700px;
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
    .inventsome4 {
      height: 28px;
      width: 60px;
      line-height: 28px;
      text-align: center;
      border-radius: 4px;
      color: #fff;
      background-color: #73f707;
      cursor: pointer;
      &.active {
        background-color: #ec2323;
      }
      &.acc {
        background-color: #525351;
      }
    }

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
        cursor: pointer;
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
    width: 100%;
    max-height: 360px;
    overflow: auto;
    // .el-button {
    //   margin-top: 20px;
    // }
  }
}
//退货
.storageblocks {
  .stgblcktop {
    text-align: center;
    font-size: 22px;
    font-weight: 550;
  }
  .stgblcktopmain {
    height: 200px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    .optionDate {
      padding: 50px 0 0 30px;
      display: flex;
      label {
        font-weight: 550;
        font-size: 19px;
        line-height: 40px;
      }
      .el-input {
        width: 200px;
      }
    }
  }
  .stgblckbottom {
    text-align: center;
  }
}
</style>
