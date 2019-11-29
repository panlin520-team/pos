<!-- 预约 -->
<template>
  <div class="appointmentPage">
    <div class="topSection">
      <div class="left">员工预约</div>
      <div class="center">
        <el-date-picker
          v-model="currentDate"
          :editable="false"
          :clearable="false"
          align="center"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          popper-class="datePop"
          class="datePicker"
          @change="dateHandleChange()"
        ></el-date-picker>
      </div>
      <div class="right">
        <div class="btn el-icon-plus" @click="createAppointment"></div>
      </div>
    </div>

    <!-- 营业时间段 -->
    <div class="adjSection" :style="{'width': (virtualWidth-150)+'px'}">
      <div class="blank"></div>
      <div class="list" ref="scroll" @scroll="handleScroll()">
        <div class="item" v-for="(item,index) in storeTimes" :key="index">{{item}}</div>
      </div>
    </div>

    <div class="mainSection" :style="{'width': (virtualWidth-150)+'px','padding-top': '135px'}">
      <div class="content">
        <div class="empList">
          <div class="empItem" v-for="item in storeEmployeesList" :key="item.beauticianId">
            <div class="name">{{item.name}}</div>
            <div class="job">{{item.postName}}</div>
          </div>
        </div>
        <div class="timeList" ref="scroll2" @scroll="handleScroll2()">
          <!-- 预约列 -->
          <div class="timeRow" v-for="(itemTime,index) in storeTimes" :key="index">
            <!-- 预约格 -->
            <div class="timeGrid" v-for="item in storeEmployeesList" :key="item.beauticianId"></div>
          </div>

          <!-- 员工预约 -->
          <div
            class="appointmentGrid btn-pointer"
            v-for="item in appointmentList"
            v-if="item.appointmentOrder.appointmentStatus != 3"
            :class="[{'reserved':item.appointmentOrder.appointmentStatus===1},{'bill':item.appointmentOrder.appointmentStatus===2}]"
            :style="{'z-index': 100+item.sortIndex,'width': item.width+ 'px','top': item.top+'px','left': item.left+'px'}"
            @click="showAppointmemtDetails(item)"
          >
            <div class="name nowrap">{{item.orderLink}}</div>
            <div class="phone nowrap">{{item.mobile}}</div>
            <div class="projects nowrap">
              <span v-for="product in item.productOrderList">{{product.productName}}&nbsp&nbsp;</span>
            </div>
          </div>

          <!-- 时间截止线 -->
          <div class="deadline" :style="{'left': deadPos+ 'px'}"></div>
        </div>
      </div>
    </div>

    <!-- 预约状态说明   -->
    <div class="status">
      <div class="statusItem">
        <label class="label-reserved"></label>已预约
      </div>
      <div class="statusItem">
        <label class="label-bill"></label>已支付
      </div>
    </div>

    <!-- 预约弹层 -->
    <el-collapse-transition>
      <div class="popPage setPage" v-if="setValue == true">
        <div class="left">
          <!-- 切换 -->
          <div class="tab">
            <div class="btn-pointer btn-close el-icon-close" @click="setValue = false;emptyData"></div>
            <div class="tabItem active">项目</div>
          </div>

          <!-- 项目菜单 -->
          <div class="submenu">
            <div
              class="submenuItem btn-pointer"
              v-for="item in serviceMenu"
              :key="item.subclassID"
              :class="item.subclassID == currentServiceMenuId ? 'active' : ''"
              @click="fetchServiceItemsById(item.subclassID)"
            >{{item.subclassName}}</div>
          </div>
          <!-- 项目列表 -->
          <div class="box scrollY" :style="{'height': (virtualHeight-135)+'px'}">
            <div
              class="boxItem btn-pointer"
              v-for="(item,index) in serviceItems"
              @click="fetchServiceParams(item)"
            >
              <div class="name">{{item.productName}}</div>
              <div class="info">
                <div class="price">
                  ¥:
                  <span>{{item.retailPrice}}</span>元
                </div>
                <div class="stockNum">
                  库存:
                  <span>{{item.stockNum}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right orderView">
          <div class="orderInfoView">
            <div class="upside">
              <label>预约信息</label>
              <div class="switch">
                <div
                  class="name btn-pointer"
                  :class="memberValue == false ? 'active' : ''"
                  @click="switchMember"
                >散客</div>
                <div
                  class="name btn-pointer"
                  :class="memberValue == true ? 'active' : ''"
                  @click="switchMember"
                >会员</div>
              </div>
            </div>
            <div class="customer" v-if="memberValue == false">
              <div class="label">
                <label>顾客电话</label>
                <el-input placeholder="联系电话" v-model="member.mobile" clearable class="info"></el-input>
              </div>
              <div class="label">
                <label>顾客姓名</label>
                <el-input placeholder="顾客姓名" v-model="member.orderLink" clearable class="info"></el-input>
              </div>
            </div>
            <div class="customer" v-if="memberValue == true">
              <div class="label">
                <label>会员电话</label>
                <el-input placeholder="联系电话" v-model="member.mobile" clearable class="info"></el-input>
              </div>
              <div class="label">
                <label>会员姓名</label>
                <el-input placeholder="顾客姓名" v-model="member.orderLink" clearable class="info"></el-input>
              </div>
            </div>
            <div class="orderList scrollY" :style="{'height': (virtualHeight-329)+'px'}">
              <div class="orderItem" v-for="(item,index) in serviceList" :key="index">
                <div class="btn-pointer btn-delete" @click="deleteService(index,item.productName)"></div>
                <div class="content btn-pointer" @click="openChangeService(index,item)">
                  <div class="name">
                    <span>{{item.productName}}</span>
                    x {{item.productNum}}
                  </div>
                  <div class="price">
                    <span class="discount" v-if="item.discount != 1">{{item.discount * 10}}折</span>
                    <span>¥ {{item.productNum * item.discountPrice}}</span>
                  </div>
                </div>
                <div class="empList">
                  <div
                    class="empItem"
                    v-if="item.postAndBeautician.length != 0"
                    v-for="(emp,index) in item.postAndBeautician"
                    :key="index"
                  >
                    <label class="label-name nowrap">{{emp.beauticianName}}</label>
                    <label class="label-dateTime nowrap">{{emp.nursingDate}}</label>
                    <label class="label-duration nowrap">{{emp.duration}}分钟</label>
                    <label class="label-job nowrap">{{emp.beauticanJob}}</label>
                  </div>
                  <div class="service-warning" v-if="item.postAndBeautician.length == 0">未设置服务人员</div>
                </div>
              </div>
            </div>
            <div class="orderInfo">
              <el-input placeholder="备注(选填)" v-model="remark" clearable class="remark"></el-input>
            </div>
          </div>
          <div class="bottom">
            <div class="orderPrice">
              <div class="original">原价：¥{{originalPrice}}</div>
              <div class="total">总价：¥{{realPrice}}</div>
            </div>
            <div class="checkout">
              <div class="btn-pointer" @click="submitAppointment">确认预约</div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>

    <!--  对话框 -->
    <!-- 预约信息 -->
    <pop-over
      :visible.sync="appointmentDetailsPop"
      @close="appointmentDetailsPop = false"
      width="450px"
      bottomPadding="0"
      custom-class="appointmentDetailsPop"
    >
      <div class="top" slot="top">
        <div class="title">预约信息</div>
      </div>
      <div class="main labels" slot="main">
        <div class="labelItem">
          <label>订单号</label>
          <div class="text">{{appointmentInfo.orderNumber}}</div>
        </div>
        <div class="labelItem">
          <label>顾客姓名</label>
          <div class="text">{{appointmentInfo.orderLink}}</div>
        </div>
        <div class="labelItem">
          <label>顾客电话</label>
          <div class="text">{{appointmentInfo.mobile}}</div>
        </div>
        <div class="labelItem">
          <label>预约项目</label>
          <div class="text">
            <span v-for="item in appointmentInfo.productOrderList">{{item.productName}}&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class="labelItem">
          <label>预约员工</label>
          <div class="text">
            <span v-for="item in appointmentInfo.beauticians">{{item.beauticianName}}&nbsp;&nbsp;</span>
          </div>
        </div>
        <div class="labelItem">
          <label>到店时间</label>
          <div class="text">{{appointmentInfo.nursingDate}}</div>
        </div>
        <div class="labelItem">
          <label>预约时长</label>
          <div class="text">{{appointmentOrder.duration}}分钟</div>
        </div>
        <div class="labelItem">
          <label>预约备注</label>
          <div class="text">{{appointmentOrder.remark}}</div>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div
          class="btn-cancel btn-pointer"
          v-if="appointmentOrder.appointmentStatus==1"
          @click="cancelAppointment(appointmentOrder.appointmentId)"
        >取消预约</div>
        <div
          class="btn-settle btn-pointer"
          v-if="appointmentOrder.appointmentStatus==1"
          @click="payAppointment(appointmentInfo)"
        >开单</div>
        <div class="btn-settled btn-pointer" v-if="appointmentOrder.appointmentStatus==2">已支付</div>
      </div>
    </pop-over>

    <!-- 对话框 结算方式 -->
    <pop-over
      :visible.sync="accountPopver"
      @close="accountPopver = false"
      width="500px"
      custom-class="accountPop"
    >
      <div class="top" slot="top">
        <div class="title">结算</div>
      </div>
      <div class="main" slot="main">
        <div class="orderNumber">订单号:{{accountInfo.orderNumber}}</div>
        <div class="member">
          <div class="normal" v-if="memberValue == false">
            顾客姓名：
            <span>{{accountInfo.orderLink}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;电话号码：
            <span>{{accountInfo.mobile}}</span>
          </div>
          <div class="personal" v-if="memberValue == true">
            会员姓名：
            <span>{{accountInfo.orderLink}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;电话号码：
            <span>{{accountInfo.mobile}}</span>
          </div>
        </div>
        <div class="price">
          <div class="real">
            总价：
            <span class="active">{{accountInfo.realPrice}}</span>
            <span class="symbol">元</span>
          </div>
        </div>
        <div class="pay">
          <div class="label">
            <label>现金支付</label>
            <InputNumber
              :point="2"
              placeholder="使用金额"
              v-model.number="cashValue"
              class="inputModel"
            ></InputNumber>
            <el-radio-group v-model="cashOption" size="mini" class="ratio">
              <el-radio :label="3">线下</el-radio>
              <el-radio :label="4">线上</el-radio>
            </el-radio-group>
          </div>
          <div class="label" v-for="(item,index) in payTypes" v-if="item.amount > 0">
            <label>{{item.accountType}}</label>
            <InputNumber
              :point="2"
              placeholder="使用金额"
              v-model.number="item.value"
              class="inputModel"
            ></InputNumber>
            <div class="account">
              <el-checkbox v-model="item.checked"></el-checkbox>
              <div class="value">
                余额：
                <span class="active">{{item.amount}}</span>
                <span class="symbol">元</span>
              </div>
            </div>
          </div>
          <div class="label">
            <label>水单号</label>
            <input placeholder="水单号" v-model="accountInfo.memoNum" class="inputModel" />
          </div>
          <div class="label">
            <label>备注</label>
            <input placeholder="备注(选填)" v-model="accountInfo.remark" class="inputModel" />
          </div>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div class="btn-pointer btn-submit" @click="settleAccounts">结算</div>
      </div>
    </pop-over>

    <!-- 对话框 会员查询-->
    <pop-over
      :visible.sync="memberPopver"
      @close="memberPopver = false"
      width="500px"
      custom-class="memberPop"
    >
      <div class="top" slot="top">
        <div class="title">会员查询</div>
      </div>
      <div class="main" slot="main">
        <div class="find">
          <el-select v-model="employeeValue" class="find-option">
            <el-option
              v-for="item in employeeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input :placeholder="employeeText" v-model="employees" class="findBtn"></el-input>
          <div class="btn-pointer btn-search" @click="selectStoreMember(employees)">查询</div>
        </div>
        <!-- 查询结果表格 -->
        <div class="result" v-if="clientList != ''">
          <el-table :data="clientList" style="width: 100%">
            <el-table-column label="姓名" width="100">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="手机号" width="120">
              <template slot-scope="scope">{{ scope.row.mobile }}</template>
            </el-table-column>
            <el-table-column label="卡号" width="180">
              <template slot-scope="scope">{{ scope.row.idCard }}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="handleAffirm(scope.row)">确认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </pop-over>

    <!-- 对话框 选择服务项目员工 -->
    <pop-over
      :visible.sync="servicePopover"
      @close="servicePopover = false"
      width="960px"
      custom-class="servicePop"
      id="pop"
    >
      <div class="top" slot="top">
        <div class="title">{{productName}}</div>
      </div>
      <div class="main" slot="main">
        <div class="setEmp" v-for="(items,index) in empSet" :key="index">
          <div class="label">{{items.postCategoryName}}:</div>
          <el-select
            v-model="items.staffNumber"
            value-key="name"
            placeholder="请选择员工"
            class="setEmpPicker"
          >
            <el-option
              v-for="(item,index) in items.beauticianList"
              :key="item.staffNumber"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="items.nursingDate"
            :editable="false"
            :clearable="false"
            align="center"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="setEmpDatePicker"
            @change="judgeTime(items.nursingDate)"
          ></el-date-picker>
          <el-select v-model="items.time" placeholder="请选择时间" class="setEmpPicker">
            <el-option
              v-for="item in judgeTimeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-select v-model="items.duration" placeholder="请选择时长" class="setEmpPicker">
            <el-option
              v-for="item in durations"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div class="count">
          数量：
          <el-input-number v-model="productNum" :min="1" :step="1" label="数量"></el-input-number>
        </div>
        <div class="amount">
          总价：
          <span>¥ {{ productNum ? productNum*productPrice : 0*productPrice }}</span>
        </div>
        <div class="btn btn-submit" @click="pushService">确认</div>
      </div>
    </pop-over>

    <!-- 对话框 修改服务项目数量、价格 -->
    <pop-over
      :visible.sync="servicePricePopver"
      @close="servicePricePopver = false"
      width="400px"
      custom-class="pricePop"
      id="pricePop"
    >
      <div class="top" slot="top">
        <div class="title">{{productName}}修改</div>
      </div>
      <div class="main" slot="main">
        <div class="label">
          <label>原价:</label>
          <el-input v-model="originalPrice" placeholder="原价" class="price_input" disabled></el-input>
        </div>
        <div class="label">
          <label>折扣:</label>
          <div class="price_input">
            <InputNumber :point="2" :max="1" placeholder="0 ~ 1" v-model.number="discount"></InputNumber>
          </div>
        </div>
        <div class="label">
          <label>数量:</label>
          <el-input-number v-model="productNum" :min="1" :step="1" label="数量" class="price_input"></el-input-number>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div class="btn btn-submit" @click="handleChangeService">确认</div>
      </div>
    </pop-over>
  </div>
</template>

<script>
import InputNumber from "@/components/InputNumber/InputNumber";
export default {
  name: "Appointment",
  components: { InputNumber },
  data() {
    return {
      // 数据
      // 当前日期
      currentDate: this.dateFormat(),
      // 营业时间段
      startTime: 9,
      endTime: 22,
      storeTimes: [],
      // 可选时间
      judgeTimeList: [],
      // 门店成员
      storeEmployeesList: [],
      // 门店员工预约
      appointmentList: [],
      // 截止时间线位置
      deadPos: "",
      // 预约弹框详细信息
      appointmentInfo: {},
      appointmentOrder: {},
      // 预约时长设定
      durations: this.setDurations(),

      // 预约弹层所需数据
      // 会员查询默认可选项
      employeeOptions: [
        {
          value: 0,
          label: "电话"
        },
        {
          value: 1,
          label: "姓名"
        }
      ],
      employeeValue: 0,
      // 输入框显示文本
      employeeText: "请输入手机号码",
      // 会员输入框值
      employees: "",
      // 会员查询结果
      clientList: "",
      // 会员信息
      memberValue: false,
      member: {},
      // 门店项目
      serviceMenu: [],
      currentServiceMenuId: "",
      // 项目下列表
      serviceItems: [],
      // 选择项目的详细
      serviceData: {},
      // 项目或产品默认初始数量
      productNum: 1,
      // 项目或产品默认初始价格
      productPrice: 0,
      // 项目或产品默认名称
      productName: null,
      // 项目与产品所属subclassID
      subclassID: null,
      // 项目或产品代码
      productCode: null,
      // 项目或产品可选工位与可选员工
      empSet: [],
      // 当前项目或产品已选工位下可选员工列表
      empList: [],
      // 已选择项目
      serviceList: [],
      // 水单号
      memoNum: "",
      // 备注
      remark: "",
      // 原价
      originalPrice: 0,
      // 总价
      realPrice: 0,
      // 项目价格修改
      servicePrice: {},
      // 折扣价
      discountPrice: 0,
      // 折扣
      discount: 1,
      // 正修改的服务项目数据
      saveService: null,
      // 正修改的服务项目索引位置
      serviceIndex: null,
      // 不可打折提示文本
      warnValue: false,
      // 支付方式
      payTypes: null,
      // 现金
      cashValue: 0,
      // 线下或线上
      cashOption: 3,
      // 预约账户信息
      accountInfo: {},

      // 对话框
      // 预约详细
      appointmentDetailsPop: false,
      // 结算
      accountPopver: false,
      // 查询会员
      memberPopver: false,
      // 选择服务项目
      servicePopover: false,
      // 修改服务项目价格
      servicePricePopver: false,

      //  页面弹层
      // 开始预约
      setValue: false,

      // 浏览器窗口可视宽度
      virtualWidth: window.innerWidth,
      virtualHeight: window.innerHeight
    };
  },
  created() {},
  mounted() {
    // 请求并发处理
    if (localStorage.getItem("storeId")) {
      this.$axios
        .all([this.fetchStoreTimes(), this.fetchEmpAndAppointment()])
        .then();
    }
    //截止时间线
    this.deadPos = setInterval(() => {
      this.deadLinePos(this.startTime, this.endTime);
    }, 1000 * 60);
  },
  beforeDestroy() {
    // 清除截止时间线
    clearInterval(this.deadPos);
  },
  computed: {},
  watch: {
    employeeValue: function() {
      if (this.employeeValue === 0) {
        this.employeeText = "请输入手机号码";
      } else if (this.employeeValue === 1) {
        this.employeeText = "请输入会员姓名";
      }
    }
  },
  methods: {
    // 开始预约相关操作
    switchMember() {
      if (this.memberValue == true) {
        this.$msgbox({
          title: "提示",
          message: "确认放弃使用会员卡吗？",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.memberValue = false;
            this.member.memberNum = null;
          })
          .catch(() => {});
      } else {
        this.memberValue = false;
        this.memberPopver = true;
      }
    },

    // 确认选择会员
    handleAffirm(row) {
      this.memberValue = true;
      this.member = {
        orderLink: row.name,
        mobile: row.mobile,
        memberNum: row.memberNum
      };
      this.memberPopver = false;
    },

    // 根据姓名或电话获取会员信息
    selectStoreMember(i) {
      var url =
        this.$https.accountHost +
        "/manage/memberUser/selectStoreMemberByPhoneOrName";
      var params = {};
      if (i != "") {
        if (this.employeeValue === 0) {
          params = {
            mobile: i,
            storeId: localStorage.getItem("storeId")
          };
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.result) {
                this.clientList = res.data.result;
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
        } else if (this.employeeValue === 1) {
          params = {
            name: i,
            storeId: localStorage.getItem("storeId")
          };
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.result) {
                this.clientList = res.data.result;
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
        }
      } else {
        this.$message({
          message: "输入内容不能为空",
          type: "warning"
        });
      }
    },

    // 打开预约结算
    payAppointment(item) {
      var orderList = item.productOrderList;
      var subclassIds = [];
      if (item.cardNumber == "" || item.cardNumber == null) {
        this.accountPopver = true;
        this.accountInfo = {
          orderLink: item.orderLink,
          mobile: item.mobile,
          memberNum: item.cardNumber,
          realPrice: item.totalPrice,
          memoNum: item.memoNum,
          remark: item.remark,
          orderNumber: item.orderNumber
        };
      } else {
        for (var i = 0; i < orderList.length; i++) {
          subclassIds.push(orderList[i].subclassID);
        }
        var url =
          this.$https.accountHost + "/manage/memberUser/listMemberAccount";
        var params = {
          memberNum: item.cardNumber,
          subClassIds: JSON.stringify(subclassIds)
        };
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.result.list) {
              this.accountPopver = true;
              this.memberValue = true;
              this.accountInfo = {
                orderLink: item.orderLink,
                mobile: item.mobile,
                memberNum: item.cardNumber,
                realPrice: item.totalPrice,
                memoNum: item.memoNum,
                remark: item.remark,
                orderNumber: item.orderNumber
              };
              var list = res.data.result.list;
              list.forEach(item => {
                item.checked = false;
                item.value = 0;
              });
              this.payTypes = list;
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
      }
    },

    // 结账
    settleAccounts() {
      var payObj,
        payTypeAndAmount = [];

      if (this.accountInfo.memoNum == "") {
        this.$message({
          type: "error",
          message: "水单号不能为空!"
        });
        return;
      }

      var totalPrice = 0;
      var cashType = { payType: this.cashOption, amount: this.cashValue };

      // 获取选中账户值
      if (this.payTypes != null) {
        var payArr = this.payTypes;
        for (var i = 0; i < payArr.length; i++) {
          if (payArr[i].checked == true) {
            if (payArr[i].value > payArr[i].amount) {
              this.$message({
                type: "error",
                message: "使用金额不能大于账户余额!"
              });
              return;
            } else {
              payTypeAndAmount.push({
                accountTypeId: payArr[i].accountTypeId,
                amount: payArr[i].value,
                payTypeName: payArr[i].accountType
              });
            }
          }
        }
        // 计算选中账户值总额
        var accountPrice = 0;
        for (var i = 0; i < payTypeAndAmount.length; i++) {
          accountPrice += payTypeAndAmount[i].amount;
        }
        // 支付总金额
        totalPrice = cashType.amount + accountPrice;
        if (cashType.payType == 3) {
          payObj = [
            {
              payType: cashType.payType,
              amount: cashType.amount,
              payTypeName: "线下"
            },
            {
              payType: 5,
              amount: accountPrice,
              payTypeName: "账户总支付",
              accountType: payTypeAndAmount
            }
          ];
        }
        if (cashType.payType == 4) {
          payObj = [
            {
              payType: cashType.payType,
              amount: cashType.amount,
              payTypeName: "线上"
            },
            {
              payType: 5,
              amount: accountPrice,
              payTypeName: "账户总支付",
              accountType: payTypeAndAmount
            }
          ];
        }
      } else {
        totalPrice = cashType.amount;
        if (cashType.payType == 3) {
          payObj = [
            {
              payType: cashType.payType,
              amount: cashType.amount,
              payTypeName: "线下"
            }
          ];
        }
        if (cashType.payType == 4) {
          payObj = [
            {
              payType: cashType.payType,
              amount: cashType.amount,
              payTypeName: "线上"
            }
          ];
        }
      }

      if (totalPrice != this.accountInfo.realPrice) {
        this.$message({
          type: "error",
          message: "支付金额不等于订单实际总金额!"
        });
        return;
      }

      var path = this.$https.orderHost + "/order/payOrder";
      var info = {
        orderNumber: this.accountInfo.orderNumber,
        payPrice: this.accountInfo.realPrice,
        payTypeAndAmount: JSON.stringify(payObj)
      };

      this.$https.fetchPost(path, info).then(
        res => {
          this.accountPopver = false;
          this.appointmentDetailsPop = false;
          this.emptyData();
          this.fetchEmpAndAppointment();
          this.$notify({
            // 信息
            message: res.data.result,
            // 关闭自动关闭
            duration: 0,
            title: "结算成功",
            type: "success"
          });
        },
        error => {
          this.$message({
            type: "error",
            message: error
          });
        }
      );
    },

    // 确认预约
    submitAppointment() {
      var params,
        url = this.$https.orderHost + "/order/createServiceOrder",
        productIds,
        payObj,
        payTypeAndAmount = [];

      productIds = this.serviceList;

      if (this.member.orderLink == "") {
        this.$message({
          type: "warning",
          message: "请完善顾客姓名"
        });
        return;
      }

      if (!/^1[34578]\d{9}$/.test(this.member.mobile)) {
        this.$message({
          message: "请输入正确手机号码",
          type: "warning"
        });
        return;
      }

      if (this.serviceList.length == 0) {
        this.$message({
          type: "warning",
          message: "请填充预约内容"
        });
        return;
      }

      // var dateSort = [];
      // for (var i = 0; i < productIds.length; i++) {
      //   var list = productIds[i].postAndBeautician;
      //   for (var j = 0; j < list.length; j++) {
      //     console.log("date", list[j].nursingDate);
      //     dateSort.push(list[j].nursingDate);
      //   }
      // }
      // dateSort.sort();
      // console.log('date',dateSort);

      if (this.memberValue != false) {
        params = {
          // nurseDate: this.currentDate,
          orderType: 10,
          channel: 2,
          storeId: localStorage.getItem("storeId"),
          cardNum: this.member.memberNum,
          orderLink: this.member.orderLink,
          mobile: this.member.mobile,
          totalPrice: this.originalPrice,
          industryID: 1,
          productIds: JSON.stringify(productIds),
          remark: this.remark
        };
      } else {
        params = {
          // nurseDate: this.currentDate,
          orderType: 10,
          channel: 2,
          storeId: localStorage.getItem("storeId"),
          cardNum: null,
          orderLink: this.member.orderLink,
          mobile: this.member.mobile,
          totalPrice: this.originalPrice,
          industryID: 1,
          productIds: JSON.stringify(productIds),
          remark: this.remark
        };
      }

      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            if (res.data.result) {
              this.$notify({
                // 信息
                message: "预约成功",
                title: "成功",
                type: "success"
              });
              this.setValue = false;
              this.emptyData();
              this.fetchEmpAndAppointment();
            }
          } else {
            this.$message({
              type: "error",
              message: res.data.responseStatusType.error.errorMsg
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

    // 打开修改已选择项目数量、价格
    openChangeService(index, item) {
      this.saveService = item;
      this.serviceIndex = index;
      this.productName = item.productName;
      this.productNum = item.productNum;
      this.originalPrice = item.originalPrice;
      this.discount = item.discount;
      this.discountPrice = item.discountPrice;
      this.servicePricePopver = true;
    },

    // 确认修改已选择项目数量、价格
    handleChangeService() {
      if (this.productNum == undefined || this.productNum == "") {
        this.$message({
          type: "warning",
          message: "数量不能为空"
        });
        return;
      } else {
        this.discountPrice = this.$calculate.accMul(
          this.originalPrice,
          this.discount
        );
        var params = {
          discount: this.discount,
          discountPrice: this.discountPrice,
          originalPrice: this.saveService.originalPrice,
          postAndBeautician: this.saveService.postAndBeautician,
          productCode: this.saveService.productCode,
          productName: this.saveService.productName,
          productNum: this.productNum,
          subclassId: this.saveService.subclassId
        };
        this.serviceList.splice(this.serviceIndex, 1, params);
        this.servicePricePopver = false;
        this.discount = 1;
        this.caculatePrice();
      }
    },

    // 价格计算
    caculatePrice() {
      // 项目价格
      var totalServicePrice = 0;
      var originalServicePrice = 0;
      this.serviceList.forEach((val, index) => {
        // 原价
        originalServicePrice += val.productNum * val.originalPrice;
        // 总价
        totalServicePrice += val.productNum * val.discountPrice;
      });

      this.originalPrice = parseFloat(originalServicePrice);
      this.realPrice = parseFloat(totalServicePrice);
    },

    // 删除订单内已选择项目
    deleteService(index, name) {
      this.$msgbox({
        title: "提示",
        message: "确认删除 " + name + " 吗?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.serviceList.splice(index, 1);
          this.caculatePrice();
        })
        .catch(() => {});
    },

    // push已选择项目
    pushService() {
      var isEmpty,
        arr = [],
        list = this.empSet;
      if (this.productNum == undefined) {
        this.$message({
          type: "warning",
          message: "数量不能为空"
        });
        return;
      }

      for (var i = 0; i < list.length; i++) {
        if (
          list[i].staffNumber == null ||
          list[i].nursingDate == null ||
          list[i].time == null ||
          list[i].duration == null
        ) {
          this.$message({
            type: "warning",
            message: "所有内容不能为空！"
          });
          isEmpty = true;
          return;
        } else {
          isEmpty = false;
          arr.push({
            postCategoryName: list[i].postCategoryName,
            postCategoryId: list[i].postCategoryId,
            beauticianName: list[i].staffNumber.name,
            beauticanJob: list[i].postCategoryName,
            staffNumber: list[i].staffNumber.staffNumber,
            nursingDate: list[i].nursingDate + " " + list[i].time,
            duration: list[i].duration
          });
        }
      }

      if (isEmpty == false) {
        this.servicePopover = false;
        var params = {
          // 项目编码
          productCode: this.productCode,
          // 项目数量
          productNum: this.productNum,
          // 原价
          originalPrice: this.productPrice,
          // 折扣
          discount: this.discount,
          // 折后价
          discountPrice: this.productPrice,
          // 所属id
          subclassId: this.subclassID,
          // 项目名称
          productName: this.productName,
          // 项目所需员工与职位与预约时间
          postAndBeautician: arr
        };

        this.serviceList.push(params);
        // 价格计算
        this.caculatePrice();
      }
    },

    // 销售产品选择销售人员
    fetchProductEmp(index, item) {
      var tmpIndex = this.selectProEmpIndex.indexOf(index);
      // 若索引数组内存在当前index
      if (tmpIndex != -1) {
        this.selectProEmpIndex.splice(tmpIndex, 1);
        // 根据对象某属性查找其在对象数组中的index
        var nameIndex = this.selectProEmp.findIndex(e => {
          return e.name === item.name;
        });
        this.selectProEmp.splice(nameIndex, 1);
        var ratioNum = Math.floor(100 / this.selectProEmp.length);
        this.selectProEmp.forEach(i => {
          i.ratio = ratioNum;
        });
        return;
      }

      // 若产品销售人员数组长度大于3，禁止再选
      if (this.selectProEmp.length >= 3) {
        this.$message({
          type: "warning",
          message: "最多选择三人"
        });
        return;
      } else {
        this.selectProEmpIndex.push(index);
        this.selectProEmp.push(item);
        // 虚拟索引和比例计算分配
        var ratioNum = Math.floor(100 / this.selectProEmp.length);
        this.selectProEmp.forEach(i => {
          i.ratio = ratioNum;
        });
      }
    },

    // 当前项目可选参数设定
    fetchServiceParams(item) {
      this.productName = item.productName;
      this.productPrice = item.retailPrice;
      this.subclassID = item.subClassID;
      this.productCode = item.productCode;
      this.productNum = 1;

      var url =
        this.$https.dataHost + "/commodityType/selectSubclassByCondition";
      var params = { subclassID: item.subClassID };

      if (item.stockNum == 0) {
        this.$message({
          type: "warning",
          message: "暂无库存"
        });
        return;
      } else {
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.result) {
              this.servicePopover = true;
              var arr = res.data.result.list[0].postCategoryVOList;
              arr.forEach(item => {
                item.staffNumber = null;
                item.nursingDate = this.currentDate;
                item.time = null;
                item.duration = 30;
                item.beauticianName = null;
              });
              this.empSet = arr;
            } else {
              this.empSet = [];
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
      }
    },

    // 门店项目列表
    fetchServiceItemsById(id) {
      this.currentServiceMenuId = id;
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        subClassId: id,
        type: 2,
        storeId: localStorage.getItem("storeId"),
        companyType: 3
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.serviceItems = res.data.result.list;
          } else {
            this.serviceItems = [];
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

    // 门店项目菜单
    fetchServiceMenu() {
      var url =
        this.$https.dataHost + "/commodityType/selectSubclassByConditionNoPage";
      var params = { commodityTypeID: 1 };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.serviceMenu = res.data.result;
            this.currentServiceMenuId = res.data.result[0].subclassID;
            this.fetchServiceItemsById(res.data.result[0].subclassID);
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

    // 取消预约
    cancelAppointment(id) {
      var url = this.$https.orderHost + "/order/cancelAppointMent";
      var params = {
        appointmentId: id,
        modifyOperator: localStorage.getItem("trueName")
      };
      this.$msgbox({
        title: "提示",
        message: "确认取消预约吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.responseStatusType.message == "Success") {
                this.$message({
                  type: "success",
                  message: "已取消预约"
                });
                this.appointmentDetailsPop = false;
                this.fetchEmpAndAppointment();
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
        })
        .catch(() => {});
    },

    // 展示预约详细信息弹框
    showAppointmemtDetails(item) {
      console.log("info", item);
      this.appointmentInfo = item;
      this.appointmentOrder = item.appointmentOrder;
      this.appointmentDetailsPop = true;
    },

    // 获取选定日期查询当天预约
    dateHandleChange() {
      this.fetchEmpAndAppointment();
    },

    // 获取门店员工与当前员工预约
    fetchEmpAndAppointment() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianList";
      var params = {
        nursingDate: this.currentDate,
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          // 清空当前预约数组
          this.appointmentList = [];
          // 定义空数组
          var arr = [];
          if (res.data.result) {
            // 门店员工
            this.storeEmployeesList = res.data.result.list;
            var list = res.data.result.list;
            for (var i = 0; i < list.length; i++) {
              var top = i * 105;
              if (list[i].appointmentList != null) {
                console.log("data", list[i].appointmentList);
                var list2 = list[i].appointmentList;
                for (var j = 0; j < list2.length; j++) {
                  this.appointmentList.push(list2[j]);
                  var width = (list2[j].appointmentOrder.duration / 30) * 135;
                  var timeArrs = list2[j].nursingDate.split(" ");
                  var startArr = timeArrs[1].split(":");
                  var left =
                    (parseInt(startArr[0]) - this.startTime) * 270 +
                    parseInt(startArr[1] / 30) * 135;
                  arr.push({
                    width: width,
                    left: left,
                    top: top
                  });
                }
              }
            }
            for (var k = 0; k < arr.length; k++) {
              this.appointmentList[k].width = arr[k].width;
              this.appointmentList[k].left = arr[k].left;
              this.appointmentList[k].top = arr[k].top;
            }
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

    // 获取门店经营时间段
    fetchStoreTimes() {
      var url = this.$https.storeHost + "/manage/store/selectStoreById";
      var params = { storeId: localStorage.getItem("storeId") };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            var times = res.data.result.shopBusinessTime;
            this.startTime = parseInt(times.split("-")[0]);
            this.endTime = parseInt(times.split("-")[1]);
            // 执行截止时间线位置方法
            this.deadLinePos(this.startTime, this.endTime);
            // 半小时间隔
            for (var i = this.startTime; i < this.endTime; i++) {
              this.storeTimes.push((i > 9 ? i : "0" + i) + ":" + "30");
            }
            //  整点间隔
            for (let i = this.startTime; i <= this.endTime; i++) {
              this.storeTimes.push((i > 9 ? i : "0" + i) + ":" + "00");
            }
            // 排序 00 ~ 30 ~ 00
            this.storeTimes.sort();
            // 判断可选时间
            this.judgeTime(this.currentDate);
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

    // 可选时间判断
    judgeTime(date) {
      var setTime = this.storeTimes;
      var arr = [];
      for (var i = 0; i < setTime.length; i++) {
        var setting = Date.parse(date + " " + setTime[i]);
        var nowTime = Date.parse(new Date());
        if (setting < nowTime) {
          arr.push({
            value: setTime[i],
            label: setTime[i],
            disabled: true
          });
        } else {
          arr.push({
            value: setTime[i],
            label: setTime[i],
            disabled: false
          });
        }
      }
      this.judgeTimeList = arr;
    },

    // 打开预约创建
    createAppointment() {
      // 服务项目菜单
      this.fetchServiceMenu();
      this.emptyData();
      this.setValue = true;
    },

    // 清空data必要对象和数组
    emptyData() {
      // 还原会员是否存在的标记值
      this.memberValue = false;
      // 会员数据
      this.member = {};
      // 清空预约内项目
      this.serviceList = [];
      // 备注
      this.remark = "";
      // 会员输入框值
      this.employees = "";
      // 查询到的会员结果
      this.clientList = "";
      // 原价
      this.originalPrice = 0;
      // 实际价格
      this.realPrice = 0;
      // 现金支付方式
      this.cashValue = 0;
      this.cashOption = 3;
    },

    // 显示截止时间线位置
    deadLinePos(start, end) {
      var date = new Date();
      var hours = date.getHours();
      var minu = date.getMinutes();
      // 若当前小时小于门店经营开始小时
      if (hours < start) {
        this.deadPos = 0;
      }
      // 若当前小时大于等于门店经营开始小时且小于门店经营结束小时
      if (hours >= start && hours < end) {
        this.deadPos = (hours - start) * 270 + minu * 4.5;
      }
      // 若当前小时大于等于门店经营结束小时且分钟大于0
      if (hours >= end && minu > 0) {
        this.deadPos = (end - start) * 270 + 30 * 4.5;
      }
    },

    // 上滚动
    handleScroll() {
      // 下滚动条位置等于上滚动条位置
      this.$refs.scroll2.scrollLeft = this.$refs.scroll.scrollLeft;
    },

    // 下滚动
    handleScroll2() {
      // 上滚动条位置等于下滚动条位置
      this.$refs.scroll.scrollLeft = this.$refs.scroll2.scrollLeft;
    },

    // 时长数组
    setDurations() {
      var res = [];
      for (var i = 0; i < 300; i + 30) {
        i += 30;
        res.push({
          label: `${i}分钟`,
          value: i
        });
      }
      return res;
    },

    // 转换Date对象日期格式
    dateFormat() {
      var date = new Date();
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      return Y + M + D;
    }
  }
};
</script>

<style lang='scss' scoped>
.topSection {
  display: flex;
  width: 100%;
  height: 100px;
  padding: 30px 50px;
  border: 1px solid red;
  .el-input--prefix .el-input__inner{
    padding-left: 50px;
  }
  .left {
    font-size: 24px;
  }

  .center {
    flex: 1;
    text-align: center;
  }

  .right {
    font-size: 24px;
  }
}

.adjSection {
  // position: fixed;
  // top: 85px;
  // left: 150px;
  margin-top: 50px;
  border: 1px solid red;
  right: 0;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  background: #ffffff;

  .blank {
    width: 190px;
  }

  .list {
    flex: 1;
    height: 50px;
    overflow-x: auto;
    white-space: nowrap;
    z-index: 1;

    .item {
      text-align: left;
      padding-left: 10px;
      display: inline-block;
      font-size: 20px;
      width: 135px;
      line-height: 40px;
    }
  }
}

.content {
  position: relative;
  display: flex;

  .empList {
    position: relative;
    z-index: 10;
    width: 190px;
    background: #ffffff;

    .empItem {
      width: 190px;
      height: 105px;
      background: #f8f8f8;
      padding: 30px 10px 30px 20px;
      text-align: center;

      .name {
        line-height: 25px;
        font-size: 14px;
      }

      .job {
        color: #999999;
        line-height: 25px;
        font-size: 13px;
      }
    }
  }

  .timeList {
    position: relative;
    flex: 1;
    line-height: 40px;
    overflow-x: auto;
    white-space: nowrap;
    background: #ffffff;
    z-index: 1;

    .timeRow {
      width: 135px;
      display: inline-block;

      .timeGrid {
        width: 135px;
        height: 105px;
        background: #ffffff;
        border-bottom: 1px solid #9a9a9a;
        border-right: 1px dashed #9a9a9a;
        overflow: hidden;
      }
    }

    .appointmentGrid {
      position: absolute;
      height: 105px;
      padding: 15px;
      line-height: 23px;

      &.reserved {
        border-color: rgb(82, 189, 58);
        color: rgb(82, 189, 58);
        background: rgba(82, 189, 58, 0.3);
      }
      &.bill {
        border-color: rgb(237, 179, 57);
        color: rgb(237, 179, 57);
        background: rgba(237, 179, 57, 0.3);
      }
    }

    .deadline {
      position: absolute;
      top: 0;
      bottom: 15px;
      width: 1px;
      background-color: #ff5e56;

      &:before {
        position: absolute;
        content: "";
        top: 0;
        left: -6px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #ff5e56;
      }

      &:after {
        position: absolute;
        content: "";
        bottom: 0;
        left: -6px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #ff5e56;
      }
    }
  }
}

.popPage {
  .top {
    position: relative;
    background-color: #ffffff;
    padding: 25px 0 15px 78px;

    .btn {
      position: absolute;
      top: 25px;
      left: 15px;
      font-size: 26px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }

  .main {
    position: relative;
    padding: 0 15px 15px 15px;
    background-color: #ffffff;
  }
}

// 预约设定 弹层
.setPage {
  padding: 0;
  display: flex;

  // 左侧视图
  .left {
    flex: 1;
    padding-right: 560px;
  }

  // 右侧视图
  .right {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background: #ffffff;
    z-index: 10;
    padding: 20px 10px 0 0;
    width: 560px;
  }

  // 菜单选项卡
  .tab {
    position: relative;
    background-color: #ffffff;
    padding: 25px 0 15px 80px;

    .tabItem {
      font-size: 16px;
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;

      &.active {
        font-size: 20px;
        font-weight: 700;
      }
    }

    // 关闭按钮
    .btn-close {
      position: absolute;
      top: 25px;
      left: 15px;
      font-size: 26px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }

  // 项目与产品菜单
  .submenu {
    position: relative;
    background-color: #f8f8f8;
    height: 40px;
    line-height: 40px;
    border-radius: 6px;
    overflow: hidden;
    z-index: 10;
    margin: 0 15px 15px;
    font-size: 15px;

    .submenuItem {
      display: inline-block;
      padding: 0 18px;

      &.active {
        color: #47bf7c;
        font-weight: 700;
      }
    }
  }

  // 项目与产品列表
  .box {
    position: relative;
    background-color: #ffffff;
    overflow-x: hidden;
    padding: 5px 15px 15px;

    .boxItem {
      position: relative;
      float: left;
      width: 230px;
      height: 170px;
      background-color: #f8f8f8;
      border-radius: 6px;
      text-align: center;
      margin: 0 15px 15px 0;
      box-shadow: 0 2px 2px 1px #dddddd;

      .name {
        height: 120px;
        font-size: 15px;
        color: #28282d;
        line-height: 20px;
        padding: 40px 5px 0 5px;
        overflow: hidden;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }

      .info {
        display: flex;
        height: 50px;
        line-height: 50px;
        background: #f4f4f4;
        font-size: 14px;
        padding: 0 15px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;

        .price {
          flex: 1;
          text-align: left;
          span {
            font-size: 16px;
            color: #feb019;
          }
        }
        .stockNum {
          flex: 1;
          text-align: right;
          span {
            font-size: 15px;
            color: #feb019;
          }
        }
      }
    }
  }

  // 订单内容
  .orderView {
    .orderInfoView {
      background: #f8f8f8;
    }

    .upside {
      position: relative;
      background: #23a547;
      border-radius: 6px 6px 0 0;
      height: 70px;
      padding: 10px 15px;
      display: flex;

      label {
        display: block;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-weight: 700;
        padding-right: 20px;
        margin: 0 15px 0 0;
        border-right: 1px solid #ffffff;
        color: #ffffff;
      }

      .switch {
        display: flex;
        border-radius: 6px;
        overflow: hidden;
        height: 50px;
        line-height: 50px;
        background: #f4f4f4;
        margin: 0 0 0 5px;

        .name {
          flex: 1;
          width: 70px;
          height: 50px;
          font-size: 16px;
          color: #23a547;
          text-align: center;

          &:last-child {
            border-right: none;
          }

          &.active {
            color: #ffffff;
            background: #feb019;
          }
        }
      }
    }

    .customer {
      padding: 7px 30px;

      .label {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;

        label {
          width: 80px;
          margin-right: 10px;
        }

        .info {
          flex: 1;
        }
      }
      .normal {
        background: #9be1a2;
        font-size: 16px;
        color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
        padding: 0 10px;
        position: relative;
        width: 100px;
        text-align: center;
        display: inline-block;
      }

      .personal {
        background: #feb019;
        font-size: 16px;
        color: #fff;
        height: 40px;
        line-height: 40px;
        border-radius: 6px;
        padding: 0 30px 0 10px;
        position: relative;
        display: flex;

        .name {
          margin-right: 15px;
        }

        .btn-delete {
          position: absolute;
          top: 7px;
          right: 0;
          width: 25px;
          height: 25px;
          background: url(../../assets/images/icon-close-round.png) right top /
            25px no-repeat;
        }
      }
    }

    .orderList {
      padding: 10px 15px;
      position: relative;

      .orderItem {
        position: relative;
        margin-bottom: 10px;
        margin-right: 10px;
        background: #fff;
        border-radius: 6px;
        padding: 0 10px 10px;

        .btn-delete {
          position: absolute;
          top: 0;
          right: 0;
          width: 25px;
          height: 25px;
          background: url(../../assets/images/icon-close.png) right top / 25px
            no-repeat;
        }
        .content {
          padding: 0 23px 0 0;
          display: flex;
          line-height: 40px;
          height: 40px;

          .name {
            flex: 2;
            text-align: left;
            color: #8a8a8a;
            span {
              font-weight: 700;
              color: #333333;
              margin-right: 5px;
            }
          }

          .price {
            font-weight: 700;
            padding: 0 5px;
            span {
              margin-right: 15px;
              &.discount {
                color: #47bf7c;
              }
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .empList {
          .empItem {
            padding: 2px 5px;
            line-height: 24px;
            font-size: 13px;
            color: #8a8a8a;
            background: #f8f8f8;
            display: flex;

            .label-name {
              width: 0;
              flex: 1;
              margin-right: 5px;
              color: #333333;
            }
            .label-dateTime {
              width: 0;
              flex: 1.5;
              text-align: center;
              margin-right: 5px;
            }
            .label-duration {
              width: 0;
              flex: 1;
              text-align: center;
              margin-right: 5px;
            }
            .label-job {
              width: 60px;
              text-align: center;
            }
            .label-ratio {
              flex: 1;
              text-align: right;
            }
          }
          // 未设置员工
          .service-warning {
            padding: 2px 5px;
            line-height: 24px;
            font-size: 13px;
            color: #f4444a;
            background: #f8f8f8;
          }
          .product-warning {
            padding: 2px 5px;
            line-height: 24px;
            font-size: 13px;
            color: #8a8a8a;
            background: #f8f8f8;
          }
        }
      }
    }

    .orderInfo {
      padding: 5px 15px;

      .memoNum {
        margin-bottom: 5px;
      }
    }
  }

  .bottom {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    border-top: 1px solid #eeeeee;

    .orderPrice {
      flex: 2;
      line-height: 25px;
      padding: 5px 0 0 0;
      text-align: right;
      .total {
        color: #feb019;
      }
    }

    .checkout {
      flex: 1;
      text-align: center;
      height: 60px;
      line-height: 60px;

      .btn-pointer {
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #feb019;
        color: #fff;
        border-radius: 6px;
      }
    }
  }
}

// 预约状态说明
.status {
  position: fixed;
  right: 15px;
  bottom: 15px;
  display: flex;
  width: 130px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  z-index: 100;

  .statusItem {
    flex: 1;
    position: relative;
    padding-left: 18px;
    font-size: 12px;

    label {
      position: absolute;
      left: 3px;
      top: 0;
      bottom: 0;
      margin: auto;
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;

      /* 已预约 */
      &.label-reserved {
        background: #52bd3a;
      }

      /* 已支付 */
      &.label-bill {
        background: #edb339;
      }
    }
  }
}

// 预约详细信息弹层
.appointmentDetailsPop {
  .top {
    padding: 10px 15px 0 15px;

    .title {
      font-size: 17px;
      font-weight: 700;
    }
  }

  .main {
    .labelItem {
      display: flex;
      padding: 15px;
      label {
        width: 80px;
        color: #8a8a8a;
      }
      .text {
        flex: 1;
        text-align: right;
        width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .bottom {
    height: 50px;
    line-height: 50px;
    display: flex;

    .btn-cancel {
      flex: 1;
      background: #f8f8f8;
      color: #8a8a8a;
      text-align: center;
    }

    .btn-settle {
      flex: 1;
      text-align: center;
      background: #47bf7c;
      color: #fff;
    }

    .btn-settled {
      flex: 1;
      background: #f8f8f8;
      color: #edb339;
      text-align: center;
    }
  }
}

%text-font17 {
  font-size: 17px;
  font-weight: 700;
}

.pricePop {
  .top {
    padding: 5px 15px;
  }
  .title {
    @extend %text-font17;
  }
  .main {
    padding: 5px 15px;
    background: #eeeeee;

    .label {
      display: flex;
      margin-bottom: 5px;
      height: 40px;
      line-height: 40px;

      label {
        flex: 1;
      }

      .price_input {
        flex: 1;
        margin-left: 15px;
        background: #ffffff;
      }
    }
  }

  .bottom {
    padding: 0 15px;
    text-align: right;

    .btn-submit {
      display: inline-block;
      width: 130px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      background: #47bf7c;
      border-radius: 6px;
    }
  }
}

.servicePop {
  .top {
    padding: 5px 15px;
  }
  .title {
    @extend %text-font17;
  }

  .main {
    .setEmp {
      display: flex;
      text-align: center;
      margin-bottom: 15px;

      .label {
        width: 100px;
        font-size: 14px;
        font-weight: 600;
        height: 40px;
        line-height: 40px;
        margin-right: 7px;
      }

      .setEmpDatePicker {
        border: 1px solid #eeeeee;
        width: 200px;
        margin-right: 7px;
        height: 42px;
      }

      .setEmpPicker {
        border: 1px solid #eeeeee;
        width: 200px;
        height: 42px;
        margin-right: 7px;
      }
    }

    .empSet {
      width: 200px;

      .item {
        font-size: 15px;
        height: 60px;
        line-height: 60px;
        font-weight: 700;
        overflow: hidden;
        padding-left: 20px;
        position: relative;
        cursor: pointer;

        &.active {
          background: #f4f4f4;

          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 4px;
            background: #47bf7c;
          }
        }

        .default {
          color: #8a8a8a;
          font-size: 13px;
          span {
            font-size: 15px;
            font-weight: 700;
            margin-right: 15px;
            color: #333333;
          }
        }

        .active {
          color: #47bf7c;
        }
      }
    }

    .empSelect {
      flex: 1;
      padding-left: 20px;
      background: #f4f4f4;

      .tit {
        position: relative;
        line-height: 40px;
        padding: 0 10px;
        font-size: 15px;
        font-weight: 700;
      }

      .empType {
        padding: 10px 0;

        .item {
          position: relative;
          display: inline-block;
          text-align: center;
          padding: 0 18px;
          line-height: 44px;
          height: 44px;
          font-size: 15px;

          &.active {
            font-weight: 700;
            color: #47bf7c;
            &:after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              bottom: 3px;
              width: 24px;
              height: 2px;
              margin: auto;
              background: #47bf7c;
            }
          }
        }
      }

      .empList {
        position: relative;
        background: #f4f4f4;

        .item {
          cursor: pointer;
          display: inline-block;
          padding: 10px 40px 10px 20px;
          border-radius: 6px;
          width: 225px;
          height: 70px;
          line-height: 25px;
          margin: 0 15px 15px 0;
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Check_N.png)
            185px center / 28px no-repeat;

          &.active {
            background: #fff
              url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Check_S.png)
              185px center / 28px no-repeat;
          }

          .id {
            color: #8a8a8a;
          }
        }
      }
    }
  }
  .bottom {
    @extend .top;
    display: flex;
    background: #ffffff;

    .count {
      margin-top: 2px;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      color: #8a8a8a;
    }

    .amount {
      flex: 1;
      text-align: right;
      line-height: 40px;
      font-size: 14px;
      color: #8a8a8a;
      vertical-align: middle;

      span {
        font-weight: 700;
        color: #f4444a;
        font-size: 20px;
      }
    }

    .btn {
      margin-left: 30px;
      width: 130px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      background: #47bf7c;
      border-radius: 6px;
    }
  }
}

.productPop {
  .top {
    padding: 25px 0 10px 0;
  }

  .title {
    @extend %text-font17;
  }

  .main {
    display: flex;

    .left {
      flex: 1;
      border-right: 0.5px solid rgba(40, 40, 45, 0.5);
    }
    .right {
      width: 340px;
    }

    .menu {
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;

      .item {
        position: relative;
        display: inline-block;
        text-align: center;
        padding: 0 18px;
        font-size: 15px;
        height: 40px;
        line-height: 40px;

        &.active {
          line-height: 46px;
          height: 46px;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }

    .list {
      position: relative;
      z-index: 10;
      background: #ffffff;
      padding: 10px 15px;
      margin: 0 5px;

      .item {
        display: flex;
        background: #fff
          url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_N.png)
          left center / 28px no-repeat;
        padding: 12px 35px 12px 50px;

        &.active {
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Select_S.png)
            left center / 28px no-repeat;
        }

        .name {
          flex: 1;
          font-weight: 700;
          font-size: 15px;
          line-height: 20px;
          padding: 10px 0;
        }

        .empId {
          flex: 1;
          color: #8a8a8a;
          padding: 10px 0;
          margin-left: 10px;
        }
      }
    }

    .tit {
      line-height: 46px;
      height: 46px;
      font-size: 14px;
      font-weight: 700;
      text-align: left;
      padding-left: 20px;
    }

    .sales {
      overflow-x: hidden;
      overflow-y: auto;
      padding: 5px 10px;

      .item {
        position: relative;
        display: flex;
        background: #fff;
        border-radius: 5px;
        padding: 12px 10px 12px 50px;
        margin-bottom: 15px;
        overflow: hidden;
        box-shadow: 0 0 5px 0 rgba(221, 221, 221, 0.7);

        .btn-delete {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 10;
          width: 50px;
          background: #fff
            url(https://static.bokao2o.com/wisdomDesk/images/Def_Icon_Del_Red.png)
            center / 24px no-repeat;
        }

        .text {
          flex: 1;
          line-height: 20px;
          height: 40px;

          .name {
            font-size: 15px;
            font-weight: 700;
          }

          .empId {
            font-size: 14px;
            color: #8a8a8a;
          }
        }

        .ratio {
          margin-top: 4px;
          background: #fff;
          width: 90px;
          height: 32px;
          border-radius: 5px;
          color: #28282d;
          font-size: 14px;
          text-align: left;
          line-height: 32px;

          input {
            background: transparent;
            width: 60px;
            font-size: 14px;
            padding: 0;
            text-align: center;
          }
        }
      }
    }
  }

  .bottom {
    padding: 5px 15px;
    display: flex;
    background: #ffffff;

    .count {
      margin-top: 2px;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      color: #8a8a8a;
    }

    .amount {
      flex: 1;
      text-align: right;
      line-height: 40px;
      font-size: 14px;
      color: #8a8a8a;
      vertical-align: middle;

      span {
        font-weight: 700;
        color: #f4444a;
        font-size: 20px;
      }
    }

    .btn {
      margin-left: 30px;
      width: 130px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      background: #47bf7c;
      border-radius: 6px;
    }
  }
}

// 会员查询
.memberPop {
  .top {
    padding: 10px 15px 0 15px;
  }

  .title {
    @extend %text-font17;
  }

  .find {
    width: 500px;
    padding: 10px 15px;
    margin: 0 auto;
    margin-bottom: 20px;
    display: flex;

    .find-option {
      width: 80px;
      margin-right: 5px;
      // border: 1px solid #eeeeee;
    }

    .findBtn {
      width: 280px;
      border: 1px solid #eeeeee;
    }

    .btn-search {
      width: 100px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      color: #ffffff;
      background: #47bf7c;
    }
  }
  .result {
    width: 500px;
    margin: 0 auto;
  }
}

// 结算
.accountPop {
  .top {
    padding: 10px 15px 0 15px;
  }

  .title {
    @extend %text-font17;
  }

  .orderNumber {
    height: 30px;
    line-height: 30px;
    padding: 0 25px;
    font-size: 14px;
  }

  .member {
    border-bottom: 1px solid #eeeeee;
    height: 30px;
    line-height: 30px;
    padding: 0 25px;
    font-size: 14px;

    .normal {
      color: #333333;
    }

    .personal {
      span {
        color: #feb019;
      }
    }
  }

  .active {
    color: #feb019;
    margin-right: 5px;
  }

  .symbol {
    font-size: 13px;
  }

  .price {
    padding: 0 25px;
    display: flex;
    font-size: 14px;
    height: 44px;
    line-height: 44px;

    div {
      flex: 1;
    }
  }

  .pay {
    padding: 0 25px;
    font-size: 14px;

    .label {
      margin-bottom: 15px;
      line-height: 44px;
      display: flex;

      label {
        width: 100px;
      }

      .inputModel {
        flex: 1;
        border: 1px solid #eeeeee;
        border-radius: 6px;
        padding: 0 15px;
      }

      .ratio {
        margin: 15px 0 0 15px;
        label {
          width: 50px;
          margin-right: 15px;
        }
      }

      .account {
        margin: 0 0 0 15px;
        font-size: 13px;
        line-height: 22px;
      }
    }
  }

  .warnText {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding: 0 25px;

    span {
      color: #feb019;
    }
  }

  .bottom {
    height: 60px;
    text-align: right;
    padding: 0 15px;

    .btn-submit {
      display: inline-block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #47bf7c;
      color: #fff;
      border-radius: 6px;
    }
  }
}

// 滚动条设置
div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #52bd3a;
}

div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
