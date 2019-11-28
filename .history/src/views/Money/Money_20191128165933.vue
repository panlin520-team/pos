<!-- 收银 -->
<template>
  <div class="moneyPage fluid">
    <!-- 开单顶部日期、状态查询订单 -->
    <div class="pageTop">
      <div class="btns btnsLeft">
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
        <el-select
          v-model="orderType"
          placeholder="全部"
          class="selectType"
          @change="typeHandleChange"
        >
          <el-option
            v-for="item in orderTypes"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </div>
      <div class="title">收银台</div>
      <div class="btns btnsRight">
        <div class="search">
          <input type="text" v-model="keyword" placeholder="订单号 / 客户名 / 时间 / 金额" />
        </div>
        <div class="btn btn-money" @click="openBill">收银</div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="pageMain">
      <div class="headers">
        <div class="headerItem">订单号</div>
        <div class="headerItem">客户</div>
        <div class="headerItem">时间</div>
        <div class="headerItem" style="flex:2">服务项目</div>
        <div class="headerItem">金额</div>
        <div class="headerItem">状态</div>
      </div>
      <div class="list">
        <div
          class="listItem"
          v-for="(item,index) in orderDataFilter"
          :key="item.orderNumber"
          @click="getOrder(item)"
        >
          <!-- <div class="listItem" v-for="(item,index) in orderDataFilter" :key="item.orderNumber"> -->
          <div style="flex:1" class="overflow">{{item.orderNumber}}</div>
          <div style="flex:1" class="overflow" v-if="item.cardNumber !=''">
            <span class="consumer vip">{{item.orderLink}}</span>
          </div>
          <div style="flex:1" class="overflow" v-if="item.cardNumber ==''">
            <span class="consumer normal">散客</span>
          </div>
          <div style="flex:1" class="overflow">{{item.createTime}}</div>
          <div style="flex:2" class="overflow">
            <span v-for="list in item.productOrderList">{{list.productName}}&nbsp;&nbsp;</span>
          </div>
          <div style="flex:1" class="price overflow">
            ¥
            <span>{{item.payPrice}}</span>
          </div>
          <div
            style="flex:1"
            class="overflow"
            :class="[item.orderStatus=='1'? 'topay': '',item.orderStatus=='2'? 'payed': '',item.orderStatus=='3'? 'inservice': '',item.orderStatus=='4'? 'backed': '',item.orderStatus=='5'? 'cancel': '']"
          >{{item.orderStatus | filterOrderStatus(item.orderStatus)}}</div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="pagination" v-if="dataTotal != 0">
        <el-pagination
          @current-change="pageHandleChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="dataTotal"
          background
        ></el-pagination>
      </div>
    </div>

    <!-- 开单 -->
    <transition name="el-zoom-in-bottom">
      <div class="popPage billPage" v-if="billOpen == true">
        <div class="left">
          <!-- 切换 -->
          <div class="tab">
            <div class="btn-pointer btn-close el-icon-close" @click="billOpen = false;emptyData"></div>
            <div
              class="tabItem"
              v-for="item in menu"
              :class="item.menuId == currentMenuId ? 'active' : ''"
              @click="changeCurrentMenuId(item.menuId)"
            >{{item.menuName}}</div>
          </div>

          <!-- 项目与产品菜单 -->
          <div class="submenu">
            <!-- 项目 currentMenuId == 1" -->
            <div
              class="submenuItem btn-pointer"
              v-for="item in serviceMenu"
              v-if="currentMenuId == 1"
              :key="item.subclassID"
              :class="item.subclassID == currentServiceMenuId ? 'active' : ''"
              @click="fetchServiceItemsById(item.subclassID)"
            >{{item.subclassName}}</div>
            <!-- 产品 currentMenuId == 2 -->
            <div
              class="submenuItem btn-pointer"
              v-for="item in productMenu"
              v-if="currentMenuId == 2"
              :key="item.productKindId"
              :class="item.productKindId == currentProductMenuId ? 'active' : ''"
              @click="fetchProductItemsById(item.productKindId)"
            >{{item.productTypeName}}</div>
          </div>
          <!-- 产品与项目列表 -->
          <div class="box scrollY" :style="{'height': (virtualHeight-135)+'px'}">
            <div
              class="boxItem btn-pointer"
              v-for="(item,index) in serviceItems"
              @click="fetchServiceParams(item)"
              v-if="currentMenuId == 1"
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
            <div
              class="boxItem btn-pointer"
              v-for="item in productItems"
              @click="fetchProductParams(item)"
              v-if="currentMenuId == 2"
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
              <div class="tit">订单</div>
              <div class="customer">
                <div
                  class="normal btn-pointer"
                  v-if="memberValue == false"
                  @click="memberPopver = true"
                >选择会员</div>
                <div class="personal" v-if="memberValue != false">
                  <div class="name">{{member.orderLink}}</div>
                  <div class="phone">{{member.mobile}}</div>
                  <div class="btn-pointer btn-delete" @click="deleteMember"></div>
                </div>
              </div>
            </div>
            <div class="orderList scrollY" :style="{'height': (virtualHeight-255)+'px'}">
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
                    <label class="label-job nowrap">{{emp.beauticanJob}}</label>
                  </div>
                  <div class="service-warning" v-if="item.postAndBeautician.length == 0">未设置服务人员</div>
                </div>
              </div>
              <div class="orderItem" v-for="(item,index) in productList" :key="item.staffNumber">
                <div class="btn-pointer btn-delete" @click="deleteProduct(index,item.productName)"></div>
                <div class="content btn-pointer" @click="openChangeProduct(index,item)">
                  <div class="name">
                    <span>{{item.productName}}</span>
                    x{{item.productNum}}
                  </div>
                  <div class="price">
                    <span class="discount" v-if="item.discount != 1">{{item.discount * 10}}折</span>
                    <span>¥ {{item.productNum * item.discountPrice}}</span>
                  </div>
                </div>
                <div class="empList">
                  <div
                    class="empItem"
                    v-for="(emp,index) in item.postAndBeautician"
                    :key="index"
                    v-if="emp.length != 0"
                  >
                    <label class="label-name nowrap">{{emp.beauticianName}}</label>
                    <label class="label-ratio nowrap">{{emp.ratio}}%</label>
                  </div>
                  <div class="product-warning" v-if="item.postAndBeautician.length == 0">暂未设置销售人员</div>
                </div>
              </div>
            </div>
            <div class="orderInfo">
              <el-input placeholder="水单号(必填)" v-model="memoNum" clearable class="memoNum"></el-input>
              <el-input placeholder="备注(选填)" v-model="remark" clearable class="remark"></el-input>
            </div>
          </div>
          <div class="bottom">
            <div class="orderPrice">
              <div class="original">原价：¥{{originalPrice}}</div>
              <div class="total">总价：¥{{realPrice}}</div>
            </div>
            <div class="checkout">
              <div class="btn-pointer" @click="openAccount">结算</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单详细 -->
      <div class="popPage orderDetailsPage" v-if="orderDetailsPage == true">
        <div class="top">
          <div class="btns btnsLeft">
            <div
              class="btn btn-close el-icon-arrow-left"
              @click="orderDetailsPage = false;emptyData"
            ></div>
          </div>
          <div class="title">已结账</div>
          <div class="btns btnsRight">
            <div class="btn btn-delete el-icon-delete"></div>
          </div>
        </div>
        <div class="main scrollY" :style="{'height': (virtualHeight-95)+'px'}">
          <div class="header">
            <div class="orderInfo">
              <label>开单时间：{{orderDetails.createTime}}</label>
              <label>订单号：{{orderDetails.orderNumber}}</label>
              <label>水单号：{{orderDetails.memoNum}}</label>
            </div>
            <div class="consumer">
              <label>顾客姓名: {{orderDetails.orderLink}}</label>
              <label>联系电话: {{orderDetails.mobile}}</label>
              <label>卡号: {{orderDetails.cardNumber}}</label>
            </div>
          </div>
          <div class="service">
            <div class="tit">
              <span class="iconfont icon-project"></span>项目
            </div>
            <div
              class="item"
              v-for="item in orderDetails.productOrderList"
              v-if="item.productTypeId == 2"
            >
              <div class="info">
                <label class="label-left">{{item.productName}}</label>
                <label class="label-right">X{{item.productNum}}</label>
              </div>
              <div class="emp">
                <label v-for="list in item.bookingBeauticianIdsArray">
                  <span>{{list.beauticianName}}</span>
                  <span class="job">{{list.beauticanJob}}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="products">
            <div class="tit">
              <span class="iconfont icon-product"></span>产品
            </div>
            <div
              class="item"
              v-for="item in orderDetails.productOrderList"
              v-if="item.productTypeId == 1"
            >
              <div class="info">
                <label class="label-left">{{item.productName}}</label>
                <label class="label-right">X{{item.productNum}}</label>
              </div>
              <div class="emp">
                <label v-for="list in item.bookingBeauticianIdsArray">
                  <span>{{list.beauticianName}}</span>
                  <span class="split">{{list.ratio}}%</span>
                </label>
              </div>
            </div>
          </div>
          <div class="payType">
            <div class="tit">
              <span class="iconfont icon-paytype"></span>支付方式
            </div>
            <div class="types">
              <div class="typeItem" v-for="payValue in orderDetails.payTypeAndAmountArray">
                <span class="iconfont icon-vip"></span>
                <span>{{payValue.payTypeName}}</span>
                <label class="amount">¥ {{payValue.amount}}</label>
              </div>
              <div class="typeItem" v-for="payValue in orderDetails.memberPay">
                <span class="iconfont icon-vip"></span>
                <span>{{payValue.payTypeName}}</span>
                <label class="amount">¥ {{payValue.amount}}</label>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="remark">
              <span class="iconfont icon-edit"></span>
              {{orderDetails.remark}}
            </div>
            <div class="total">
              总价：
              <label>
                ¥
                <span>{{orderDetails.totalPrice}}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 对话框 结算方式 -->
    <!-- <pop-over
      :visible.sync="accountPopver"
      @close="accountPopver = false"
      width="500px"
      marginTop="5vh"
      custom-class="accountPop"
    >
      <div class="top" slot="top">
        <div class="title">结算</div>
      </div>
      <div class="main" slot="main">
        <div class="member">
          <div class="normal" v-if="memberValue == false">散客</div>
          <div class="personal" v-if="memberValue == true">
            会员姓名：
            <span>{{member.orderLink}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;电话号码：
            <span>{{member.mobile}}</span>
          </div>
        </div>
        <div class="warnText" v-if="warnValue == true">
          注意：
          <span>当前订单内存在一项要求不打折，所有项将按原价支付</span>
        </div>
        <div class="price">
          <div class="original">
            原价：
            <span class="active">{{originalPrice}}</span>
            <span class="symbol">元</span>
          </div>
          <div class="real">
            总价：
            <span class="active">{{realPrice}}</span>
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
              <el-checkbox v-model="item.checked" @change="checkDiscount(item)"></el-checkbox>
              <div class="value">
                余额：
                <span class="active">{{item.amount}}</span>
                <span class="symbol">元</span>
              </div>
            </div>
          </div>
          <div class="label">
            <label>水单号</label>
            <input placeholder="水单号" v-model="memoNum" class="inputModel" />
          </div>
          <div class="label">
            <label>备注</label>
            <input placeholder="备注(选填)" v-model="remark" class="inputModel" />
          </div>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div class="btn-pointer btn-submit" @click="settleAccounts">结算</div>
      </div>
    </pop-over> -->

    <!-- 对话框 会员查询-->
    <!-- <pop-over
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
    </pop-over> -->

    <!-- 对话框 选择服务项目员工 -->
    <!-- <pop-over
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
        <div class="empSet">
          <div
            v-for="(item,index) in empSet"
            :key="index"
            :class="['item',{'active' : currentServiceId==item.postCategoryId}]"
            @click="switchEmpList(index,item.postCategoryId,item.setEmpId)"
          >
            <div class="default" v-if="item.setEmpName==undefined || item.setEmpName=='' ">
              <span>{{item.postCategoryName}}</span>(必填)
            </div>
            <div class="active" v-if="item.setEmpName!=''">
              <span>{{item.setEmpName}}</span>
            </div>
          </div>
        </div>
        <div class="empSelect">
          <div class="tit">{{currentServiceTitle}}</div>
          <div class="empList scrollY" style="height:180px;">
            <div
              v-for="(item,index) in empList"
              :key="index"
              :class="['item',currentEmpId==item.beauticianId ?'active':'']"
              @click="fetchServiceEmp(currentServiceId,item)"
            >
              <div class="name">{{item.name}}</div>
              <div class="id">工号：{{item.beauticianId}}</div>
            </div>
          </div>
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
    </pop-over> -->

    <!-- 对话框 选择产品、销售人员、销售比例 -->
    <!-- <pop-over
      :visible.sync="productPopover"
      @close="productPopover = false"
      width="960px"
      custom-class="productPop"
      id="pop"
    >
      <div class="top" slot="top">
        <div class="title center">{{productName}}</div>
      </div>
      <div class="main" slot="main">
        <div class="left">
          <div class="menu">
            <div class="item active">员工</div>
          </div>
          <div class="list scrollY" style="height:350px">
            <div
              class="btn-pointer item"
              v-for="(item,index) in productEmpList"
              :key="index"
              :class="selectProEmpIndex.includes(index) ? 'active' : ''"
              @click="fetchProductEmp(index,item)"
            >
              <div class="name">{{item.name}}</div>
              <div class="empId">工号：{{item.staffNumber}}</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="tit">销售比例</div>
          <div class="sales">
            <div class="item" v-for="(item,index) in selectProEmp">
              <div class="btn btn-delete" @click="deleteProEmp(index)"></div>
              <div class="text">
                <div class="name">{{item.name}}</div>
                <div class="empId">工号：{{item.staffNumber}}</div>
              </div>
              <div class="ratio">
                <input type="number" placeholder="百分比" max="100" v-model="item.ratio" />
                <label>%</label>
              </div>
            </div>
          </div>
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
        <div class="btn btn-submit" @click="pushProduct">确认</div>
      </div>
    </pop-over> -->

    <!-- 对话框 修改服务项目数量、价格 -->
    <!-- <pop-over
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
    </pop-over> -->

    <!-- 对话框 修改产品数量、价格 -->
    <!-- <pop-over
      :visible.sync="productPricePopver"
      @close="productPricePopver = false"
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
        <div class="btn btn-submit" @click="handleChangeProduct">确认</div>
      </div>
    </pop-over> -->
  </div>
</template>

<script>
import InputNumber from "@/components/InputNumber/InputNumber";
export default {
  name: "Money",
  components: { InputNumber },
  data() {
    return {
      // 数据
      // 当前日期
      currentDate: this.dateFormat(),
      // 查询关键词
      keyword: "",
      // 当前页码
      currentPage: 1,
      // 每页显示个数
      pageSize: 20,
      // 总个数
      dataTotal: null,
      // 订单状态
      orderType: "",
      // 订单状态选项
      orderTypes: [],
      // 订单
      orderData: [],
      // 门店开单菜单
      menu: [
        {
          menuId: 1,
          menuName: "项目"
        },
        {
          menuId: 2,
          menuName: "产品"
        }
      ],
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
      // 会员查询确认结果
      vip: [],
      // 会员信息
      memberValue: false,
      member: {},
      // 当前门店项目和产品菜单
      currentMenuId: 1,
      // 门店项目
      serviceMenu: [],
      currentServiceMenuId: "",
      // 门店产品
      productMenu: [],
      currentProductMenuId: "",
      // 项目下列表
      serviceItems: [],
      // 产品下列表
      productItems: [],
      // 产品下员工
      productEmpList: [],
      // 已选中产品销售员
      selectProEmp: [],
      // 已选择产品销售员索引
      selectProEmpIndex: [],
      // 选择项目的详细
      serviceData: {},
      // 选择产品的详细
      productData: {},
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
      // 项目当前工种id
      currentServiceId: null,
      // 项目当前工种title
      currentServiceTitle: null,
      // 项目当前工种下已选员工id
      currentEmpId: null,
      // 已选择项目
      serviceList: [],
      // 已选择产品
      productList: [],
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
      // 正修改的产品数据
      saveProduct: null,
      // 正修改的服务项目索引位置
      serviceIndex: null,
      // 正修改的产品索引位置
      productIndex: null,
      // 不可打折提示文本
      warnValue: false,
      // 支付方式
      payTypes: null,
      // 现金
      cashValue: 0,
      // 线下或线上
      cashOption: 3,
      // 订单号
      orderNumber: null,
      // 订单详细信息
      orderDetails: null,

      // 弹出层页面
      // 结算
      billOpen: false,
      // 订单详细
      orderDetailsPage: false,

      // 对话框
      // 结算
      accountPopver: false,
      // 查询会员
      memberPopver: false,
      // 选择服务项目
      servicePopover: false,
      // 选择产品
      productPopover: false,
      // 修改服务项目价格
      servicePricePopver: false,
      // 修改产品价格
      productPricePopver: false,

      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  // 过滤器
  filters: {
    filterOrderStatus(key) {
      let orderStatus = "";
      switch (key) {
        case 0:
          orderStatus = "未知";
          break;
        case 1:
          orderStatus = "待支付";
          break;
        case 2:
          orderStatus = "已支付";
          break;
        case 3:
          orderStatus = "服务中";
          break;
        case 4:
          orderStatus = "已取消";
          break;
      }
      return orderStatus;
    }
  },
  created() {
    // 日期格式化
    this.dateFormat();
  },
  mounted() {
    // 请求并发处理
    if (localStorage.getItem("storeId")) {
      this.$axios.all([this.fetchOrerStatus()]).then();
    }
  },
  computed: {
    orderDataFilter: function() {
      const keyword = this.keyword;
      if (keyword) {
        return this.orderData.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(keyword) > -1;
          });
        });
      }
      return this.orderData;
    }
  },
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
    // 删除会员
    deleteMember() {
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
          this.member = {};
          this.payTypes = null;
        })
        .catch(() => {});
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

    // 结账
    settleAccounts() {
      var params,
        url = this.$https.orderHost + "/order/createServiceOrder",
        productIds,
        payObj,
        payTypeAndAmount = [];

      productIds = this.serviceList.concat(this.productList);

      if (this.memoNum == "") {
        this.$message({
          type: "error",
          message: "水单号不能为空!"
        });
        return;
      }

      if (this.warnValue == true) {
        productIds.forEach(value => {
          value.discount = 1;
          value.discountPrice = value.originalPrice;
        });
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

      if (totalPrice != this.realPrice) {
        this.$message({
          type: "error",
          message: "支付金额不等于订单实际总金额!"
        });
        return;
      }

      if (this.memberValue != false) {
        params = {
          orderType: 2,
          channel: 2,
          storeId: localStorage.getItem("storeId"),
          cardNum: this.member.memberNum,
          orderLink: this.member.orderLink,
          mobile: this.member.mobile,
          totalPrice: this.originalPrice,
          industryID: 1,
          productIds: JSON.stringify(productIds),
          // 水单号
          memoNum: this.memoNum,
          remark: this.remark
        };
      } else {
        params = {
          orderType: 2,
          channel: 2,
          storeId: localStorage.getItem("storeId"),
          cardNum: null,
          orderLink: null,
          mobile: null,
          totalPrice: this.originalPrice,
          industryID: 1,
          productIds: JSON.stringify(productIds),
          // 水单号
          memoNum: this.memoNum,
          remark: this.remark
        };
      }

      // 若订单号不存在
      if (this.orderNumber == undefined || this.orderNumber == null) {
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.responseStatusType.message == "Success") {
              if (res.data.result) {
                this.orderNumber = res.data.result;
                var path = this.$https.orderHost + "/order/payOrder";
                var info = {
                  orderNumber: res.data.result,
                  payPrice: this.realPrice,
                  // 订单列表
                  productIds: JSON.stringify(productIds),
                  // 支付方式
                  payTypeAndAmount: JSON.stringify(payObj)
                };
                this.$https.fetchPost(path, info).then(
                  res => {
                    if (res.data.responseStatusType.message == "Success") {
                      this.accountPopver = false;
                      this.billOpen = false;
                      this.emptyData();
                      this.fetchOrder();
                      this.$notify({
                        // 信息
                        message: res.data.result,
                        // 关闭自动关闭
                        duration: 0,
                        title: "成功",
                        type: "success"
                      });
                    } else {
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
      }
      // 若订单号存在
      else {
        var path = this.$https.orderHost + "/order/payOrder";
        var info = {
          orderNumber: this.orderNumber,
          payPrice: this.realPrice,
          // 订单列表
          productIds: JSON.stringify(productIds),
          // 支付方式
          payTypeAndAmount: JSON.stringify(payObj)
        };
        this.$https.fetchPost(path, info).then(
          res => {
            this.accountPopver = false;
            this.emptyData();
            this.fetchOrder();
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
      }
    },

    // 判断使用账户是否可打折
    checkDiscount(item) {
      if (item.checked == true && item.discount != 1) {
        this.$confirm(
          "该账户不能用于结算打折类账户，且订单内所有项将按原价进行结算，是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            item.checked = true;
            this.warnValue = true;
            this.realPrice = this.originalPrice;
          })
          .catch(() => {
            item.checked = false;
          });
      }
    },

    // 打开结算框
    openAccount() {
      if (this.serviceList.length == 0 && this.productList.length == 0) {
        this.$message({
          type: "warning",
          message: "请填充订单内容"
        });
        return;
      }
      if (this.memoNum == "" || this.memoNum == null) {
        this.$message({
          type: "warning",
          message: "请输入水单号"
        });
        return;
      }
      // 若为散客,直接打开结算框
      if (this.memberValue == false) {
        this.accountPopver = true;
        return;
      } else {
        var arr = this.serviceList.concat(this.productList);
        var subclassIds = [];
        for (var i = 0; i < arr.length; i++) {
          subclassIds.push(arr[i].subclassId);
        }
        var url =
          this.$https.accountHost + "/manage/memberUser/listMemberAccount";
        var params = {
          memberNum: this.member.memberNum,
          subClassIds: JSON.stringify(subclassIds)
        };
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.result.list) {
              this.accountPopver = true;
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

    // 打开修改已选择产品数量、价格
    openChangeProduct(index, item) {
      this.saveProduct = item;
      this.productIndex = index;
      this.productName = item.productName;
      this.productNum = item.productNum;
      this.originalPrice = item.originalPrice;
      this.discount = item.discount;
      this.discountPrice = item.discountPrice;
      this.productPricePopver = true;
    },

    // 确认修改已选择产品数量、价格
    handleChangeProduct() {
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
          originalPrice: this.saveProduct.originalPrice,
          postAndBeautician: this.saveProduct.postAndBeautician,
          productCode: this.saveProduct.productCode,
          productName: this.saveProduct.productName,
          productNum: this.productNum,
          subclassId: this.saveProduct.subclassId
        };
        this.productList.splice(this.productIndex, 1, params);
        this.discount = 1;
        this.productPricePopver = false;
        this.caculatePrice();
      }
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
      // 产品价格
      var totalProductPrice = 0;
      var originalProductPrice = 0;
      this.productList.forEach((val, index) => {
        // 原价
        originalProductPrice += val.productNum * val.originalPrice;
        // 总价
        totalProductPrice += val.productNum * val.discountPrice;
      });

      this.originalPrice =
        parseFloat(originalServicePrice) + parseFloat(originalProductPrice);
      this.realPrice =
        parseFloat(totalServicePrice) + parseFloat(totalProductPrice);
    },

    // 删除订单内已选择产品
    deleteProduct(index, name) {
      this.$msgbox({
        title: "提示",
        message: "确认删除 " + name + " 吗?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.productList.splice(index, 1);
          this.caculatePrice();
        })
        .catch(() => {});
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
        if (list[i].setEmpId == undefined || list[i].setEmpId == "") {
          this.$message({
            type: "warning",
            message: "请填写完项目所需员工"
          });
          isEmpty = true;
          return;
        } else {
          isEmpty = false;
          arr.push({
            postCategoryId: list[i].postCategoryId,
            beauticianId: list[i].setEmpId,
            beauticianName: list[i].setEmpName,
            beauticanJob: list[i].setEmpJob
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
          // 项目所需员工与职位
          postAndBeautician: arr
        };

        this.serviceList.push(params);
        // 价格计算
        this.caculatePrice();
      }
    },

    // 确认选择产品相关设定
    pushProduct() {
      var arr = [];
      var list = this.selectProEmp;
      var totalRatio = 0;
      // 计算当前销售总比例
      this.selectProEmp.forEach(i => {
        // 总比例
        totalRatio += Number(i.ratio);
      });

      if (this.productNum == undefined) {
        this.$message({
          type: "warning",
          message: "数量不能为空"
        });
        return;
      }
      if (this.selectProEmp.length > 0 && totalRatio != 100) {
        this.$message({
          type: "warning",
          message: "产品销售总比例必须满足100%"
        });
        return;
      } else {
        for (var i = 0; i < list.length; i++) {
          arr.push({
            postCategoryId: list[i].postCategoryId,
            beauticianId: list[i].staffNumber,
            beauticianName: list[i].name,
            ratio: list[i].ratio
          });
        }
        var params = {
          // 产品编码
          productCode: this.productCode,
          // 产品数量
          productNum: this.productNum,
          // 原价
          originalPrice: this.productPrice,
          // 折扣
          discount: this.discount,
          // 折后价
          discountPrice: this.productPrice,
          // 产品所属id
          subclassId: this.subclassID,
          // 产品名称
          productName: this.productName,
          // 产品员工与销售比例
          postAndBeautician: arr
        };
        this.productPopover = false;
        this.productList.push(params);
        // 价格计算
        this.caculatePrice();
      }
    },

    // 取消选择销售人员
    deleteProEmp(index) {
      this.selectProEmp.splice(index, 1);
      var tmpIndex = this.selectProEmp.findIndex(e => {
        return e === index;
      });
      this.selectProEmpIndex.splice(tmpIndex, 1);
      var ratioNum = Math.floor(100 / this.selectProEmp.length);
      this.selectProEmp.forEach(i => {
        i.ratio = ratioNum;
      });
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

    // 对应选择项目工种下员工并修改对应服务项目工种菜单
    fetchServiceEmp(id, item) {
      // 遍历寻找含指定id的某条数据
      var res = this.empSet.find(item => {
        return item.postCategoryId == id;
      });

      if (item.beauticianId != this.currentEmpId) {
        // 若存在，对该条数据增加属性
        if (res) {
          this.$set(res, "setEmpName", item.name);
          this.$set(res, "setEmpId", item.beauticianId);
          this.$set(res, "setEmpJob", this.currentServiceTitle);
          // 绑定当前已选员工id，方便右侧员工列表渲染
          this.currentEmpId = item.beauticianId;
        }
      } else {
        this.$set(res, "setEmpName", "");
        this.$set(res, "setEmpId", "");
        this.$set(res, "setEmpJob", "");
        // 绑定当前已选员工id，方便右侧员工列表渲染
        this.currentEmpId = null;
      }
    },

    // 服务项目工种菜单切换
    switchEmpList(index, curId, empId) {
      this.currentServiceTitle = this.empSet[index].postCategoryName;
      this.empList = this.empSet[index].beauticianList;
      this.currentServiceId = curId;
      if (empId != undefined) {
        this.currentEmpId = empId;
      }
    },

    // 当前项目可选参数设定
    fetchServiceParams(item) {
      this.productName = item.productName;
      this.productPrice = item.retailPrice;
      this.subclassID = item.subClassID;
      this.productCode = item.productCode;
      this.productNum = 1;
      this.currentEmpId = null;

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
              this.empSet = res.data.result.list[0].postCategoryVOList;
              this.empList =
                res.data.result.list[0].postCategoryVOList[0].beauticianList;
              this.currentServiceId =
                res.data.result.list[0].postCategoryVOList[0].postCategoryId;
              this.currentServiceTitle =
                res.data.result.list[0].postCategoryVOList[0].postCategoryName;
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

    // 获取门店员工
    fetchEmployees() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianByStoreId";
      var params = { storeId: localStorage.getItem("storeId") };

      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.productEmpList = res.data.result;
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

    // 产品选择
    fetchProductParams(item) {
      if (item.stockNum == 0) {
        this.$message({
          type: "warning",
          message: "暂无库存"
        });
        return;
      } else {
        this.productData = item;
        this.productName = item.productName;
        this.productPrice = item.retailPrice;
        this.subclassID = item.subClassID;
        this.productCode = item.productCode;
        this.productNum = 1;
        this.productPopover = true;
        this.selectProEmp = [];
        this.selectProEmpIndex = [];
      }
    },

    // 打开收银界面，清空一些关键信息
    openBill() {
      this.billOpen = true;
      // 服务项目菜单
      this.fetchServiceMenu();
      // 产品菜单
      this.fetchProductMenu();
      // 门店员工
      this.fetchEmployees();
      // 清空必要数据
      this.emptyData();
    },

    // 清空data必要对象和数组
    emptyData() {
      // 清空会员信息
      this.memberValue = false;
      this.member = {};
      // 清空订单内项目、产品
      this.serviceList = [];
      this.productList = [];
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
      // 订单号
      this.orderNumber = null;
      // 现金支付方式
      this.cashValue = 0;
      this.cashOption = 3;
      // 订单详细
      this.orderDetails = null;
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

    // 门店产品列表
    fetchProductItemsById(id) {
      this.currentProductMenuId = id;
      var url = this.$https.productHost + "/manage/product/selectProductList";
      var params = {
        kindId: id,
        type: 1,
        storeId: localStorage.getItem("storeId"),
        companyType: 3
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.productItems = res.data.result.list;
          } else {
            this.productItems = [];
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

    // 门店产品菜单
    fetchProductMenu() {
      var url = this.$https.productHost + "/productKind/selectProductKind";
      var params = {};
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.productMenu = res.data.result;
            this.currentProductMenuId = res.data.result[0].productKindId;
            this.fetchProductItemsById(res.data.result[0].productKindId);
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

    // 获取门店当天订单
    fetchOrder() {
      var url = this.$https.orderHost + "/order/selectOrderList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        date: this.currentDate,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        orderStatus: this.orderType
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataTotal = res.data.result.total;
            this.orderData = res.data.result.list;
          } else {
            this.dataTotal = 0;
            this.orderData = [];
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

    // 获取订单状态
    fetchOrerStatus() {
      var url = this.$https.orderHost + "/order/selectOrderStatusList";
      this.$https.fetchPost(url).then(
        res => {
          if (res.data.result) {
            this.orderTypes = res.data.result;
            this.orderTypes.unshift({ value: "全部", key: null });
            this.orderType = res.data.result[0].key;
            this.fetchOrder();
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

    // 获取订单详细(根据订单状态)
    getOrder(item) {
      // 已支付
      if (item.orderStatus == 2) {
        var url = this.$https.orderHost + "/order/selectOrderByNum";
        var params = { orderNumbers: item.orderNumber };
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.result) {
              this.orderDetailsPage = true;
              this.orderDetails = res.data.result[0];
              if (res.data.result[0].payTypeAndAmountArray.length > 1) {
                this.orderDetails.memberPay =
                  res.data.result[0].payTypeAndAmountArray[1].accountType;
              }
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
      // // 待支付
      // if (item.orderStatus == 1) {
      //   this.billOpen = true;
      // }
      // // 已支付
      // if (item.orderStatus == 2) {
      //   this.orderDetailsPage = true;
      // }
      // // 服务中
      // if (item.orderStatus == 3) {
      //   this.orderDetailsPage = true;
      // }
      // // 已取消
      // if (item.orderDetailsPage == 4) {
      // }
    },

    // 门店项目与产品菜单显示切换
    changeCurrentMenuId(id) {
      this.currentMenuId = id;
    },

    // 获取选定日期查询当天预约
    dateHandleChange() {
      this.fetchOrder();
    },

    // 查询不同状态订单
    typeHandleChange(val) {
      this.orderType = val;
      this.fetchOrder();
    },

    // 改变页码
    pageHandleChange(val) {
      this.currentPage = val;
      this.fetchOrder();
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
.datePicker {
  margin-right: 15px;
}

.selectType {
  min-width: 100px;

  input {
    color: red;
  }
}

.search {
  display: inline-block;
  margin-right: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 6px;

  input {
    width: 300px;
    height: 40px;
    background-color: transparent;
  }
}

.headers {
  position: relative;
  display: flex;
  margin: 20px 20px 0 20px;
  padding-right: 30px;

  .headerItem {
    flex: 1;
    text-align: center;
    line-height: 50px;
    color: #8a8a8a;
  }
}

.list {
  position: relative;
  margin: 0 20px;

  .listItem {
    position: relative;
    display: flex;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
    padding-right: 30px;
    cursor: pointer;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background: url("../../assets/images/icon-right.png") right center / 28px
        no-repeat;
      width: 28px;
      height: 28px;
      margin: auto;
    }

    .topay {
      color: #f4444a;
    }

    .payed {
      color: #32b872;
    }

    .inservice {
      color: #e9ac3e;
    }

    .backed {
      color: #333333;
    }

    .cancel {
      color: #333333;
    }

    .consumer {
      position: relative;
      padding-left: 26px;

      &.vip {
        background: transparent url("../../assets/images/vip.png") left center /
          24px no-repeat;
      }

      &.normal {
        background: transparent url("../../assets/images/normal.png") left
          center / 24px no-repeat;
      }
    }

    .price {
      span {
        font-size: 18px;
      }
    }

    .overflow {
      width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.orderDetailsPage {
  background-color: #f8f8f8;
  padding: 0;

  &.cancel {
    color: #8a8a8a;
  }

  .top {
    margin-bottom: 20px;
    position: relative;
    padding: 35px 20px 20px 20px;
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    line-height: 40px;
    height: 40px;
  }

  .btns {
    position: absolute;
    top: 35px;
    height: 40px;

    &.btnsLeft {
      left: 15px;
      .btn {
        top: 0;
        left: 0;
      }
    }

    &.btnsRight {
      right: 15px;
    }

    .btn {
      position: relative;
      display: inline-block;
      min-width: 50px;
      margin-right: 10px;
      height: 40px;
      line-height: 40px;
      font-size: 25px;
      text-align: center;

      &:last-child {
        margin-right: 0;
      }
    }

    .btn-delete {
      top: 0;
      left: 0;
      right: 15px;
      color: #ff5e56;
    }
  }

  .main {
    margin: 0 100px;
    padding: 10px 20px 20px;
    background-color: #ffffff;
    border-radius: 6px;

    .header {
      color: #8a8a8a;
      line-height: 28px;
      border-bottom: 0.5px solid #f8f8f8;
      padding: 10px 0 5px 0;

      div {
        display: flex;

        label {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .tit {
      font-size: 16px;
      line-height: 28px;
      padding: 12px 0 8px 0;
      height: 48px;

      .iconfont {
        font-size: 28px;
        margin-right: 5px;
      }
    }

    .item {
      background-color: #f8f8f8;
      padding: 15px 15px 10px 15px;
      margin-bottom: 10px;
      border-radius: 6px;
      overflow: hidden;

      .info {
        display: flex;
        font-weight: 700;
        line-height: 30px;

        .label-left {
          flex: 1;
        }
        .label-right {
          text-align: right;
        }
      }
      .emp {
        margin-top: 5px;
        line-height: 25px;
        font-size: 13px;

        label {
          display: inline-block;
          width: calc(25% - 35px);
          margin-right: 35px;

          &:last-child {
            margin-right: 0;
          }

          span {
            display: inline-block;
            margin-right: 8px;

            &:last-child {
              margin-right: 0;
            }

            &.job {
              color: #8a8a8a;
            }

            &.assign {
              width: 24px;
              height: 18px;
              line-height: 18px;
              vertical-align: middle;
              text-align: center;
              font-size: 12px;
              color: #ffffff;
            }

            &.guest {
              background-color: #47bf7c;
            }

            &.turn {
              background-color: #e1993e;
            }
          }
        }
      }
    }

    .types {
      line-height: 30px;
      font-size: 14px;

      .typeItem {
        display: flex;
        margin-right: 5px;
        font-size: 13px;
        line-height: 25px;

        label {
          flex: 1;
          text-align: right;
        }
      }
    }

    .types {
      background-color: #f8f8f8;
      padding: 15px 15px 10px 15px;
      margin-bottom: 10px;
      border-radius: 6px;
      overflow: hidden;
    }

    .bottom {
      display: flex;
      padding: 15px 5px 20px 5px;
      line-height: 24px;

      .remark {
        flex: 1;
        font-size: 14px;
        color: #8a8a8a;
      }

      .total {
        margin-left: 25px;
        font-size: 14px;
        color: #5a5a5a;

        label {
          color: #ff5e56;
          font-size: 16px;
          span {
            font-size: 20px;
          }
        }
      }
    }
  }
}

.billPage {
  padding: 0;
  display: flex;

  // 左侧视图
  .left {
    flex: 1;
    padding-right: 500px;
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
    width: 500px;
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
    clear: both;
    .boxItem {
      position: relative;
      float: left;
      width: 230px;
      height: 170px;
      background-color: #f8f8f8;
      border-radius: 6px;
      text-align: center;
      transition: 0.5s;
      bottom: 0;
      margin: 15px 15px 20px 0;
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
    .boxItem:hover {
      cursor: pointer;
      bottom: 10px;
      box-shadow: 0px 0px 11px 2px #cfcfcf;
    }
  }

  // 订单内容
  .orderView {
    .orderInfoView {
      background: #f8f8f8;
    }

    .upside {
      position: relative;
      background: #47bf7c;
      border-radius: 6px 6px 0 0;
      height: 80px;
      padding: 15px 10px 0;
      display: flex;

      .tit {
        flex: 1;
        padding: 0 15px 0 10px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
      }

      .customer {
        flex: 1;
        text-align: right;
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
              flex: 1.5;
              margin-right: 10px;
              color: #333333;
            }
            .label-job {
              flex: 1;
              text-align: right;
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
    display: flex;

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
    }

    .findBtn {
      width: 280px;
    }

    .btn-search {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #ffffff;
      background: #47bf7c;
      margin-left: 3px;
      border-radius: 5px;
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

  .member {
    border-bottom: 1px solid #eeeeee;
    height: 44px;
    line-height: 44px;
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
