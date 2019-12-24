<!-- 客户管理 -->
<template>
  <div class="clienthId">
    <!-- 客户列表 -->
    <div class="clientSmo" v-show="clienthide == false">
      <div class="clientTitle">
        <h1>会员</h1>
        <div style="display: flex">
          <div class="inpuT">
            <el-input
              class="el-input"
              v-model="input_name"
              v-on:keyup.13.native="clickname"
              placeholder="请输入姓名"
            ></el-input>
            <span style="cursor:pointer" @click="clickname">
              <i class="el-icon-search"></i>
            </span>
          </div>
          <div class="inpuT">
            <el-input v-model="input_popel" v-on:keyup.13.native="clickpopel" placeholder="请输入手机号"></el-input>
            <span style="cursor:pointer" @click="clickpopel">
              <i class="el-icon-search"></i>
            </span>
          </div>
          <div class="clientBtn">
            <el-button @click="addvipcode" type="success">添加会员</el-button>
          </div>
        </div>
      </div>
      <PopOver
        custom-class="storageblockvip"
        :visible.sync="visible_addvip"
        @close="close_stgbaddvip"
        width="430px"
      >
        <div class="stgblcktop" slot="top">添加会员</div>
        <div class="stgblcktopmain" slot="main">
          <el-form
            :model="ruleForm_addvip"
            :rules="rules_addvip"
            ref="ruleForm_addvip"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="会员姓名：" prop="name">
              <el-input v-model="ruleForm_addvip.name"></el-input>
            </el-form-item>
            <el-form-item label="会员手机号：" prop="pople">
              <el-input v-model="ruleForm_addvip.pople"></el-input>
            </el-form-item>
            <el-form-item label="身份证号：">
              <el-input v-model="ruleForm_addvip.identity"></el-input>
            </el-form-item>
            <el-form-item label="生日：">
              <el-date-picker
                v-model="ruleForm_addvip.bersder"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                class="herderDatePicker"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="ruleForm_addvip.sex" size="mini" class="ratio">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <textarea rows="10" v-model="ruleForm_addvip.remark" class="textarea" cols="30"></textarea>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm_addvip')">立即添加</el-button>
              <el-button @click="resetForm('ruleForm_addvip')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="stgblckbottomIP" slot="bottom"></div>
      </PopOver>
      <!-- <PopOver
        custom-class="storageblock"
        :visible.sync="visible_VIP"
        @close="close_stgbVip"
        width="430px"
      >
        <div class="stgblcktop" slot="top">会员标签</div>
        <div class="stgblcktopmain" style="height:240px" slot="main">
          <div class="stgbListtallyVip">
            <div class="stgbLisarea">
              <textarea rows="10" v-model="remark" class="textarea" cols="30"></textarea>
            </div>
          </div>
        </div>
        <div class="stgblckbottom" slot="bottom">
          <el-button type="info" @click="VipClick">确定</el-button>
        </div>
      </PopOver>-->
      <div class="clienList">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="卡号">
            <template slot-scope="scope">
              <span>{{ scope.row.memberNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.mobile }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星级">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">{{ scope.row.membershipLevelName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="vipexamine(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize1"
          layout="total, prev, pager, next"
          :total="dataTotal1"
          background
        ></el-pagination>
      </div>
    </div>
    <!-- 客户个人信息 -->
    <div class="Customer" v-show="clienthide == true">
      <div class="CustLeft">
        <div class="CustTop">
          <div class="CustTitle">
            <div class="getrback">
              <i class="el-icon-arrow-left arrows" @click="getBack"></i>
            </div>
            <span>会员卡详情</span>
            <div>···</div>
          </div>
          <div class="CustName" @click="num=0" :class="{active:num==0}">
            <p>{{vipName}}</p>
            <span>{{mobile}}</span>
          </div>
        </div>
        <div class="CustBottom" :style="{'height': (virtualHeight-320)+'px'}">
          <div class="menus hover" @click="num=0" :class="{active:num==1}">个人档案</div>
          <div class="menus" @click="num=1" :class="{active:num==2}">护理记录</div>
          <div class="menus" @click="num=2" :class="{active:num==3}">储蓄记录</div>
          <div class="menus" @click="num=3" :class="{active:num==4}">医美记录</div>
          <div class="menus" @click="num=4" :class="{active:num==5}">产品记录</div>
          <div class="menus" @click="num=5" :class="{active:num==6}">数据分析</div>
        </div>
        <div class="footer" @click="show_recharge">
          <img src="../../assets/images/icon-cz.png" alt />
          <span>充值</span>
        </div>
        <PopOver
          custom-class="storageblock"
          :visible.sync="visible_recharge"
          @close="close_recharge"
          width="400px"
        >
          <div class="recharge_top" slot="top">充值管理</div>
          <div class="recharge_main" slot="main">
            <el-form ref="form" :model="form" status-icon label-width="80px">
              <el-form-item label="账户类型" prop="regions">
                <el-select v-model="value_tregion" placeholder="请选择账户类型">
                  <el-option
                    v-for="item in interestTple"
                    :key="item.accountTypeId"
                    :label="item.accountType"
                    :value="item.accountTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值金额" prop="moneeys">
                <el-input v-model="form.money" @blur="changemoney" placeholder="请输入充值金额"></el-input>
              </el-form-item>
              <el-form-item label="收款人" prop="collectoneeys">
                <el-input v-model="form.gatheringp" placeholder="请输入收款人姓名"></el-input>
              </el-form-item>
              <el-form-item label="员工" prop="employee">
                <el-select v-model="value_tpeple" @change="changepeople" placeholder="请选择充值员工">
                  <el-option
                    v-for="item in optionpeple"
                    :key="item.staffNumber"
                    :label="item.name"
                    :value="item.staffNumber"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付类型" prop="payTalp">
                <el-select v-model="value_accounTelp" @change="changeTylp" placeholder="请选择支付类型">
                  <el-option
                    v-for="item in optionpeTylp"
                    :key="item.payTypeId"
                    :label="item.payTypeName"
                    :value="item.payTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付状态" prop="paystate">
                <el-select v-model="value_accountstate" @change="changeTylps" placeholder="请选择支付状态">
                  <el-option
                    v-for="item in paymentTelp"
                    :key="item.payTypeId"
                    :label="item.payTypeName"
                    :value="item.payTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="备注：" prop="sportsshape">
                <textarea rows="10" v-model="form.desc" class="textarea" cols="30"></textarea>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即充值</el-button>
                <el-button @click="visible_recharge = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="recharge_bottom" slot="bottom"></div>
        </PopOver>
      </div>
      <!-- 右侧 -->
      <div class="CustRight" v-show="moreClick == false">
        <div v-show="num==0" class="personage">
          <div class="rightTitle">
            <div class="rigtop">
              <span @click="changePassword">
                <el-button type="info" plain>修改密码</el-button>
              </span>
            </div>
            <PopOver
              custom-class="storageblockpassword"
              :visible.sync="visible_password"
              @close="close_password"
              width="500px"
            >
              <div class="stgblcktop" slot="top">修改密码</div>
              <div class="stgblcktopmain" slot="main">
                <el-form
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="原密码:" prop="oldpassword" autocomplete="off">
                    <el-input
                      type="password"
                      @blur="oldpassword"
                      v-model.number="ruleForm.oldpassword"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="新密码:" prop="pass">
                    <el-input
                      type="password"
                      @blur="newpassword"
                      v-model="ruleForm.pass"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码:" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="submitFormpassword('ruleForm')">确定修改</el-button>
                    <el-button @click="resetFormpassword('ruleForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </PopOver>
          </div>
          <div class="information">
            <div class="inforTop">
              <div class="inforLeft">
                <div class="photo">
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div class="photoRit">
                  <div class="inforname">
                    {{vipName}}
                    <span>{{mobile}}</span>
                  </div>
                  <p class="member">{{cardNumber}}</p>
                  <div class="member">
                    会员备注：
                    <p>
                      <span>{{remark}}</span>
                      <label>
                        <img @click="show_stgbVip" src="../../assets/images/icon-xg.png" alt="#" />
                      </label>
                    </p>
                  </div>
                  <PopOver
                    custom-class="storageblock"
                    :visible.sync="visible_VIP"
                    @close="close_stgbVip"
                    width="430px"
                  >
                    <div class="stgblcktop" slot="top">会员备注</div>
                    <div class="stgblcktopmain" style="height:240px" slot="main">
                      <div class="stgbListtallyVip">
                        <div class="stgbLisarea">
                          <textarea rows="10" v-model="remark2" class="textarea" cols="30"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="stgblckbottom" slot="bottom">
                      <el-button type="info" @click="VipClick">确定</el-button>
                    </div>
                  </PopOver>
                </div>
              </div>

              <div class="inforRight">
                <el-button type="info" @click="item_more">修改会员资料</el-button>
              </div>
            </div>
            <div class="inforBottom">
              <div class="inforBoso">
                <div class="inforSome" v-for="item in accounts" :key="item.index">
                  <p>{{item.amount}}</p>
                  <span>{{item.accountType}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="integral">标签</div>
          <div class="addintegras" @click="show_stgbtally">
            <el-button size="small" v-for="item in privateList" :key="item.index">{{item}}</el-button>
            <el-button size="small" class="addBtn">+</el-button>
            <!-- <PopOver
              custom-class="storageblock"
              :visible.sync="visible_tally"
              @close="close_stgbtally"
              width="500px"
            >
              <div class="stgblcktop" slot="top">会员标签</div>
              <div class="stgblcktopmain" slot="main">
                <div class="stgbListtally" v-for="itemtay in ware_tally" :key="itemtay.index">
                  <label>{{itemtay.name}}</label>
                </div>
              </div>
              <div class="stgblckbottom" slot="bottom">
                <el-button type="info" @click="tallyClick(itemtay)">确定</el-button>
              </div>
            </PopOver>-->
          </div>
          <div class="integral">消费情况</div>
          <div class="inforNews">
            <div class="inforns">
              <div>上次到店</div>
              <span>{{dataChangeLastTime}}</span>
            </div>
            <div class="inforns">
              <div>到店次数</div>
              <span>{{arriveTimes}}</span>
            </div>
            <div class="inforns">
              <div>消费总金额</div>
              <span>{{totalConsumption}}</span>
            </div>
          </div>
        </div>
        <div v-show="num==1" class="ItemInformation">
          <div class="PerminNurse">
            <label>护理记录</label>
            <div class="rightNurse">
              <el-select v-model="value_nurse" placeholder="请选择" @change="Change_nurse">
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input v-model="input_nurse" placeholder="请输入内容"></el-input>
              <div class="block">
                <el-date-picker
                  v-model="valueNurse"
                  type="date"
                  @change="Change_Time"
                  class="herderDatePicker"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <el-table :data="nurseRecordFilter" class="el-tableList">
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="orderLink" label="姓名"></el-table-column>
            <el-table-column prop="orderTypeName" label="订单类型"></el-table-column>
            <el-table-column prop="cardNumber" label="卡号"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @current-change="pageHandleChange"
              :current-page.sync="currentPage"
              :page-size="pageSize4"
              layout="total, prev, pager, next"
              :total="dataTotal_nurse"
              background
            ></el-pagination>
          </div>
        </div>
        <div v-show="num==2" class="ItemInformation">
          <div class="PerminNurse">
            <label>储蓄记录</label>
            <div class="rightNurse">
              <el-select v-model="value_savings" @change="Change_savings" placeholder="请选择">
                <el-option
                  v-for="item in optionsavings"
                  :key="item.accountTypeId"
                  :label="item.accountType"
                  :value="item.accountTypeId"
                ></el-option>
              </el-select>
              <el-input v-model="input_savings" placeholder="请输入内容"></el-input>
              <div class="block">
                <el-date-picker
                  v-model="valuesavings"
                  type="date"
                  @change="Change_savingsTime"
                  class="herderDatePicker"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <el-table :data="savingsRecordFilter" class="el-tableList">
            <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="amount" label="充值金额"></el-table-column>
            <el-table-column prop="cardNumber" label="卡号"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @current-change="pageHandlesavings"
              :current-page.sync="currentPage"
              :page-size="pageSize2"
              layout="total, prev, pager, next"
              :total="dataTotal_savings"
              background
            ></el-pagination>
          </div>
        </div>
        <div v-show="num==3" class="ItemInformation">
          <div class="PerminNurse">
            <label>医美记录</label>
            <div class="rightNurse">
              <el-input v-model="input_Medicine" placeholder="请输入内容"></el-input>
              <div class="block">
                <el-date-picker
                  v-model="valueMedicine"
                  type="date"
                  @change="Change_Medicine"
                  class="herderDatePicker"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <el-table :data="tableDataMedicineFilter" class="el-tableList">
            <el-table-column prop="orderNumber" label="日期"></el-table-column>
            <el-table-column prop="orderLink" label="姓名"></el-table-column>
            <el-table-column prop="orderTypeName" label="订单类型"></el-table-column>
            <el-table-column prop="cardNumber" label="卡号"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @current-change="pageHandleMedicine"
              :current-page.sync="currentPage"
              :page-size="pageSize3"
              layout="total, prev, pager, next"
              :total="dataTotal_Medicine"
              background
            ></el-pagination>
          </div>
        </div>
        <div v-show="num==4" class="ItemInformation">
          <div class="PerminNurse">
            <label>产品记录</label>
            <div class="rightNurse">
              <el-input v-model="input_product" placeholder="请输入内容"></el-input>
              <div class="block">
                <el-date-picker
                  v-model="valueproduct"
                  type="date"
                  @change="Change_product"
                  class="herderDatePicker"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <el-table :data="tableDataproductFilter" class="el-tableList">
            <el-table-column prop="orderNumber" label="订单号"></el-table-column>
            <el-table-column prop="productName" label="产品"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              @current-change="pageHandleproduct"
              :current-page.sync="currentPage"
              :page-size="pageSize5"
              layout="total, prev, pager, next"
              :total="dataTotal_product"
              background
            ></el-pagination>
          </div>
        </div>
        <div v-show="num==5" class="dataAnalysis">
          <p>数据分析</p>
          <el-tabs v-model="activeAnalysis" @tab-click="handleAnalysis">
            <el-tab-pane label="最近10笔消费" name="first">
              <div style="width:800px;height:600px;margin: 0 auto;" id="main"></div>
            </el-tab-pane>
            <el-tab-pane label="最近10笔充值" name="second">
              <div style="width:800px;height:600px;margin: 0 auto;" id="main_recharge"></div>
            </el-tab-pane>
            <el-tab-pane label="项目最近10笔消费次数" name="third">
              <div style="width:800px;height:600px;margin: 0 auto;" id="main_consumption"></div>
            </el-tab-pane>
            <el-tab-pane label="项目最近10笔消费金额" name="fourth">
              <div style="width:800px;height:600px;margin: 0 auto;" id="main_money"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 弹出框 -->
      <div class="moreData" v-show="moreClick == true" :style="{'height': virtualHeight+'px'}">
        <div>
          <div class="vipData">
            <div class="vipspan" @click="moreClick = false">
              <img src="../../assets/images/icon-close.png" alt />
            </div>
            <div class="vipname">修改会员资料</div>
            <div class="compile">
              <el-button @click="truemodification" type="info">确定修改</el-button>
            </div>
          </div>
          <div class="vipinforList">
            <div class="vipinforname">
              <label>会员名</label>
              <div>
                <el-input clearable v-model="amend_input" placeholder="请输入会员名"></el-input>
              </div>
            </div>
            <div class="vipinforname">
              <label>会员电话</label>
              <div>
                <el-input clearable v-model="amend_pefpoe" placeholder="请输入会员电话"></el-input>
              </div>
            </div>
            <div class="vipinforname">
              <label>身份证号</label>
              <div>
                <el-input clearable v-model="amend_idcard" placeholder="请输入身份证号"></el-input>
              </div>
            </div>
            <div class="vipinforname">
              <label>生日</label>
              <div>
                <el-date-picker
                  v-model="amend_bersday"
                  type="date"
                  format="yyyy-MM-dd"
                  class="herderDatePicker"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </div>
          </div>
          <!-- 点击编辑 -->
          <!-- <div v-show="moreRedact == true">
            <ul class="Vipul">
              <li>
                <label>名字</label>
                <div>
                  <el-input v-model="inputName" placeholder="请输入内容"></el-input>
                </div>
              </li>
              <li>
                <label>性别</label>
                <el-form ref="form">
                  <el-form-item>
                    <el-select
                      style="border: 1px solid rgb(153, 149, 149)"
                      v-model="region"
                      placeholder="请选择性别"
                    >
                      <el-option label="男" value="man"></el-option>
                      <el-option label="女" value="woman"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </li>
              <li>
                <label>客户来源</label>
                <el-form ref="form">
                  <el-form-item>
                    <el-select
                      style="border: 1px solid rgb(153, 149, 149)"
                      v-model="clientSource"
                      placeholder="请选择客户来源"
                    >
                      <el-option label="默认" value="default"></el-option>
                      <el-option label="朋友介绍" value="introduce"></el-option>
                      <el-option label="广告传单" value="leaflet"></el-option>
                      <el-option label="口碑" value="publicPraise"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </li>
              <li>
                <label>生日</label>
                <el-form ref="form">
                  <el-form-item>
                    <el-col>
                      <el-date-picker
                        type="date"
                        size="small"
                        placeholder="选择日期"
                        v-model="dateDay"
                        class="herderDatePicker"
                        style="width: 100%;"
                      ></el-date-picker>
                    </el-col>
                  </el-form-item>
                </el-form>
              </li>
            </ul>
            <div class="customTag" @click="addcustom">添加自定义</div>
          </div>-->
        </div>
      </div>
    </div>
    <MemberFrame v-show="MenFalse == true" ref="moduleName"></MemberFrame>
  </div>
</template>

<script>
import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  name: "hello",
  components: { MemberFrame },
  data() {
    var checkAge = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入原密码"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          // callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldpassword: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldpassword: [{ validator: checkAge, trigger: "blur" }]
      },
      //数据消费
      chartconsumption: "",
      //充值数据
      form: {
        money: "",
        accountstate: "",
        region: "",
        gatheringp: "",
        desc: "",
        moneeys: "",
        collectoneeys: "",
        employee: "",
        payTalp: "",
        paystate: "",
        sportsshape: ""
      },
      ruleForm_addvip: {
        name: "",
        region: "",
        resource: "",
        pople: "",
        identity: "",
        remark: "",
        sex: "",
        bersder: ""
      },

      rules_addvip: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        pople: [
          { required: true, message: "请输入会员电话", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" }
        ]
      },

      //充值账户类型
      value_tregion: "",
      //会员姓名
      vipName: "",
      //会员电话
      mobile: "",
      //
      memberNum: "",
      //充值员工选择
      value_tpeple: "",
      //充值支付类型
      value_accounTelp: "",
      //支付状态类型
      value_accountstate: "",
      value_accountstates: "",
      //客户数据
      tableData: [],
      //标签列表
      privateList: [],
      //弹出框
      tableData_points: {},
      //充值账户类型
      valaccount: "",
      //客户手机号
      mobiles: "",
      //会员密码
      password: "",
      //卡号
      cardNumber: "",
      delivery: "0",
      rebate: "0",

      //充值支付类型下拉下拉框
      optionpeTylp: [],
      //支付状态
      paymentTelp: [
        {
          payTypeId: 1,
          payTypeName: "已支付"
        },
        {
          payTypeId: 2,
          payTypeName: "未支付"
        }
      ],
      //充值账户类型下拉选项
      interestTple: [],
      //充值账户类型x选项
      options_account: [],
      //充值员工下拉下拉框
      optionpeple: [],
      //充值金额
      input_account: "",
      //客户搜索框
      input_name: "",
      input_popel: "",
      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      // 浏览器可视高度
      virtualWidth: window.innerWidth,
      // 弹出层
      clienthide: false,
      visible_care: false,
      visible_tally: false,
      visible_VIP: false,
      moreClick: false,
      MenFalse: false,
      // moreRedact: false,
      visible_recharge: false,
      visible_addvip: false,
      visible_password: false,
      //会员资料编辑
      inputName: "",
      region: "",
      clientSource: "",
      dateDay: "",
      //左边导航菜单
      num: "",
      //储蓄记录
      activeName_setm: "setfirst",
      //储蓄下拉框
      optionsavings: [],
      //储蓄下拉选择
      value_savings: "",

      //储蓄搜索框
      input_savings: "",
      //储蓄时间
      valuesavings: "",
      //医美记录
      tableDataMedicine: [],
      //修改账户信息
      amend_input: "",
      //修改账户信息
      amend_pefpoe: "",
      //修改账户信息
      amend_idcard: "",
      //修改账户信息
      amend_bersday: "",
      //上传图片
      imageUrl: "",
      //医美时间
      valueMedicine: "",
      //护理记录列表
      nurseRecord: [],

      //选择下拉美发美容
      options: [
        {
          label: "美发护理",
          value: 2
        },
        {
          label: "美容护理",
          value: 3
        }
      ],
      //选择员工
      beauticianIds: [
        {
          beauticianId: ""
        }
      ],
      //充值中价格
      payTypeAndAmount: [
        {
          payType: "",
          amount: ""
        }
      ],
      //数据分析
      activeAnalysis: "first",
      //医美搜索框
      input_Medicine: "",
      memberNum: null,
      //新密码
      newwodesss: "",
      //护理下拉选择
      value_nurse: 2,
      //产品搜索框
      input_product: "",
      //产品时间
      valueproduct: "",
      //产品数据
      tableDataproduct: [],
      //搜索框
      input_nurse: "",

      //时间
      valueNurse: "",
      //消费情况
      consumption: [],
      //剪发储蓄卡
      ware_car: [],
      //选择标签
      ware_tally: [],
      radio: "2",
      value_model: "",
      //当前会员页
      currentPage: 1,
      oldwodesss: "",
      //会员备注
      remark: "",
      remark2: "",

      //上次到店
      dataChangeLastTime: "",
      //到店次数
      arriveTimes: "",
      //消费总金额
      totalConsumption: "",
      value1: "",
      //会员每页数
      pageSize1: 10,
      pageSize2: 13,
      pageSize3: 10,
      pageSize4: 10,
      pageSize5: 10,
      pageSize6: 10,
      //会员总个数
      dataTotal1: 0,
      //护理总个数
      dataTotal_nurse: 0,
      //储蓄总个数
      dataTotal_savings: 0,
      //医美总个数
      dataTotal_Medicine: 0,
      //产品总个数
      dataTotal_product: 0,
      //账户
      accounts: [],

      //储蓄记录
      savingsRecord: [],

      dataname: [],
      dataadd: [],
      //充值图表
      rechargedaata: [],
      rechargedatas: [],
      //图表消费次数
      consumptioLeData: [],
      consumptioLeDatass: [],
      //图表消费金额
      consumpmoneyData: [],
      consumpmoneyDatass: []
    };
  },
  computed: {
    //护理查询
    nurseRecordFilter: function() {
      const input_nurse = this.input_nurse;
      if (input_nurse) {
        return this.nurseRecord.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(input_nurse) > -1;
          });
        });
      }
      return this.nurseRecord;
    },
    //储蓄查询
    savingsRecordFilter: function() {
      const input_savings = this.input_savings;
      if (input_savings) {
        return this.savingsRecord.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(input_savings) > -1;
          });
        });
      }

      return this.savingsRecord;
    },
    //医美查询
    tableDataMedicineFilter: function() {
      const input_Medicine = this.input_Medicine;
      if (input_Medicine) {
        return this.tableDataMedicine.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(input_Medicine) > -1;
          });
        });
      }
      return this.tableDataMedicine;
    },
    //产品查询
    tableDataproductFilter: function() {
      const input_product = this.input_product;
      if (input_product) {
        return this.tableDataproduct.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(input_product) > -1;
          });
        });
      }
      return this.tableDataproduct;
    }
  },
  watch: {},
  mounted() {
    this.initCharts();
    this.recharge();
    this.consumptions();
    this.consumpmoney();
  },
  methods: {
    //上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //充值获取员工
    changepeople() {
      this.beauticianIds[0].beauticianId = this.value_tpeple;
    },
    //充值选择类型
    changeTylp() {
      this.payTypeAndAmount[0].payType = this.value_accounTelp;
    },
    changeTylps() {
      if (this.value_accountstate == 2) {
        this.value_accountstates = 0;
      } else {
        this.value_accountstates = 1;
      }
    },
    //充值选择金额
    changemoney() {
      this.payTypeAndAmount[0].amount = this.form.money;
    },
    //返回会员页
    getBack() {
      this.clienthide = false;
      this.clientList();
    },
    //数据图表最近10笔消费
    initCharts() {
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 绘制图表
      let option = {
        color: ["#3398DB"],
        toolbox: {
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
            dataView: {
              show: true,
              title: "数据视图",
              optionToContent: function(opt) {
                let axisData = opt.xAxis[0].data; //坐标数据
                let series = opt.series; //折线图数据
                let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                let tdBodys = ""; //数据
                series.forEach(function(item) {
                  //组装表头
                  tdHeads += `<td style="padding: 0 50px">${item.name}</td>`;
                });
                let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                for (let i = 0, l = axisData.length; i < l; i++) {
                  for (let j = 0; j < series.length; j++) {
                    //组装表数据
                    tdBodys += `<td>${series[j].data[i]}</td>`;
                  }
                  table += `<tr><td style="padding: 50px">${axisData[i]}</td>${tdBodys}</tr>`;
                  tdBodys = "";
                }
                table += "</tbody></table>";
                return table;
              }
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.dataname,
            axisLabel: {
              interval: 0,
              rotate: 20,
              margin: 10,
              textStyle: {
                color: "#282828"
              }
            }
          }
        ],
        yAxis: {
          type: "value"
        },

        series: [
          {
            name: "最近10笔消费",
            data: this.dataadd,
            type: "line"
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //数据图表最近10笔充值
    recharge() {
      var myChart = this.$echarts.init(
        document.getElementById("main_recharge")
      );
      // 绘制图表
      let option = {
        color: ["#3398DB"],
        toolbox: {
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
            dataView: {
              show: true,
              title: "数据视图",
              optionToContent: function(opt) {
                let axisData = opt.xAxis[0].data; //坐标数据
                let series = opt.series; //折线图数据
                let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                let tdBodys = ""; //数据
                series.forEach(function(item) {
                  //组装表头
                  tdHeads += `<td style="padding: 0 50px">${item.name}</td>`;
                });
                let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                for (let i = 0, l = axisData.length; i < l; i++) {
                  for (let j = 0; j < series.length; j++) {
                    //组装表数据
                    tdBodys += `<td>${series[j].data[i]}</td>`;
                  }
                  table += `<tr><td style="padding: 10px 50px">${axisData[i]}</td>${tdBodys}</tr>`;
                  tdBodys = "";
                }
                table += "</tbody></table>";
                return table;
              }
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.rechargedaata,
            axisLabel: {
              interval: 0,
              rotate: 20,
              margin: 10,
              textStyle: {
                color: "#282828"
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "最近10笔充值",
            type: "bar",
            barWidth: "60%",
            data: this.rechargedatas
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //数据图表最近10笔消费次数
    consumptions() {
      var myChart = this.$echarts.init(
        document.getElementById("main_consumption")
      );
      // 绘制图表
      let option = {
        color: ["#3398DB"],
        toolbox: {
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
            dataView: {
              show: true,
              title: "数据视图",
              optionToContent: function(opt) {
                let axisData = opt.xAxis[0].data; //坐标数据
                let series = opt.series; //折线图数据
                let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                let tdBodys = ""; //数据
                series.forEach(function(item) {
                  //组装表头
                  tdHeads += `<td style="padding: 0 50px">${item.name}</td>`;
                });
                let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                for (let i = 0, l = axisData.length; i < l; i++) {
                  for (let j = 0; j < series.length; j++) {
                    //组装表数据
                    tdBodys += `<td>${series[j].data[i]}</td>`;
                  }
                  table += `<tr><td style="padding: 10px 50px">${axisData[i]}</td>${tdBodys}</tr>`;
                  tdBodys = "";
                }
                table += "</tbody></table>";
                return table;
              }
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.consumptioLeData,
            axisLabel: {
              interval: 0,
              rotate: 20,
              margin: 10,
              textStyle: {
                color: "#282828"
              }
            }
          }
        ],
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "项目最近10笔消费次数",
            data: this.consumptioLeDatass,
            type: "bar"
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //数据图表最近10笔消费次数
    consumpmoney() {
      var myChart = this.$echarts.init(document.getElementById("main_money"));
      // 绘制图表
      let option = {
        color: ["#3398DB"],
        toolbox: {
          show: true,
          feature: {
            // mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
            dataView: {
              show: true,
              title: "数据视图",
              optionToContent: function(opt) {
                let axisData = opt.xAxis[0].data; //坐标数据
                let series = opt.series; //折线图数据
                let tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头
                let tdBodys = ""; //数据
                series.forEach(function(item) {
                  //组装表头
                  tdHeads += `<td style="padding: 0 50px">${item.name}</td>`;
                });
                let table = `<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>${tdHeads} </tr>`;
                for (let i = 0, l = axisData.length; i < l; i++) {
                  for (let j = 0; j < series.length; j++) {
                    //组装表数据
                    tdBodys += `<td>${series[j].data[i]}</td>`;
                  }
                  table += `<tr><td style="padding: 10px 50px">${axisData[i]}</td>${tdBodys}</tr>`;
                  tdBodys = "";
                }
                table += "</tbody></table>";
                return table;
              }
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.consumpmoneyData,
            axisLabel: {
              interval: 0,
              rotate: 20,
              margin: 10,
              textStyle: {
                color: "#282828"
              }
            }
          }
        ],
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "项目最近10笔消费金额",
            data: this.consumpmoneyDatass,
            type: "bar"
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //充值点击提交
    onSubmit() {
      if (this.value_tregion == "") {
        this.$message.error("请选择账户类型");
      } else if (this.form.money == "") {
        this.$message.error("请输入充值金额");
      } else if (this.form.gatheringp == "") {
        this.$message.error("请输入收款人");
      } else if (this.value_tpeple == "") {
        this.$message.error("请选择员工");
      } else if (this.value_accounTelp == "") {
        this.$message.error("请选择支付类型");
      } else if (this.value_accountstate == "") {
        this.$message.error("请选择支付状态");
      } else if (this.value_accounTelp == 13) {
        if (this.form.desc !== "") {
          this.visible_recharge = false;
          this.rechargeList();
          setTimeout(() => {
            this.$refs.moduleName.memberbalance();
          }, 400);
        } else {
          this.$message.error("请填写备注");
        }
      } else {
        this.visible_recharge = false;
        this.rechargeList();
        setTimeout(() => {
          this.$refs.moduleName.memberbalance();
        }, 400);
        setTimeout(() => {
          this.savingAccount();
        }, 400);
      }
    },
    //修改密码
    changePassword() {},
    //添加会员s
    submitForm(formName) {
      let res = /^[1][3,4,5,7,8][0-9]{9}$/;
      let strs = this.ruleForm_addvip.pople;
      // this.changpassword();
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (res.test(strs)) {
            this.addmember();
            setTimeout(() => {
              this.clientList();
            }, 200);
            // location.reload();
          } else {
            this.$message({
              message: "抱歉手机号输入不合法...",
              type: "warning"
            });
          }
        } else {
          return false;
          // this.visible_password = false;
        }
      });
    },

    //确认修改
    truemodification() {
      let re = /^[1][3,4,5,7,8][0-9]{9}$/;
      let str = this.amend_pefpoe;
      //身份证号/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      let idcards = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      let card = this.amend_idcard;
      if (this.amend_input !== "") {
        if (re.test(str)) {
          this.zhterMember();
          this.moreClick = false;
          // location.reload();
        } else {
          this.$message({
            message: "抱歉手机号输入不合法...",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "请输入会员名...",
          type: "warning"
        });
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //添加会员隐藏
    close_stgbaddvip() {
      this.visible_addvip = false;
    },
    //添加会员
    addvipcode() {
      this.ruleForm_addvip = {};
      this.visible_addvip = true;
    },
    //查名字
    clickname() {
      this.addmembername();
    },
    //查名字
    clickpopel() {
      this.addmemberpoapele();
    },

    //修改密码弹出框
    changePassword() {
      this.visible_password = true;
      this.ruleForm.pass = "";
      this.ruleForm.checkPass = "";
      this.ruleForm.oldpassword = "";
    },
    close_password() {
      this.visible_password = false;
    },
    submitFormpassword(formName) {
      // this.changpassword();
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs[formName].resetFields();
          this.changpassword();
        } else {
          return false;
        }
      });
    },
    resetFormpassword(formName) {
      this.$refs[formName].resetFields();
    },
    //点击会员查看详情
    vipexamine(res) {
      this.optionpeTylp = [];
      this.sex = res.sex;
      this.num = 0;
      this.dataChangeLastTime = res.dataChangeLastTime;
      this.arriveTimes = res.arriveTimes;
      this.totalConsumption = res.totalConsumption;
      this.mobile = res.mobile;
      this.vipName = res.name;
      this.mobiles = res.mobile;
      this.cardNumber = res.memberNum;
      this.clienthide = true;
      this.moreClick = false;
      this.remark = res.remark;
      //获取修改信息
      this.amend_input = res.name;
      this.amend_pefpoe = res.mobile;
      this.amend_idcard = res.idCard;
      this.amend_bersday = res.birthday;
      this.password = res.password;
      //发起请求
      this.savingAccount();
      this.nurserecordData();
      this.savingsData();
      this.savingsselectbox();
      this.cosmeticData();
      this.productData();
      this.rechargepeople();
      this.paymentTalp();
      this.accounttypeData();
      //查询消费图表
      this.queryConsumption();
      this.rechargeTop();
      this.consumptioLevel();
      this.consumptionmoney();
    },
    //数据分析切换
    handleAnalysis(tab, event) {},
    // 改变护理订单状态
    Change_nurse(val) {
      this.nurserecordData();
    },
    //改变护理时间状态
    Change_Time(val) {
      this.nurserecordData();
    },
    // 改变护理记录页码
    pageHandleChange(val) {
      this.nurserecordData();
    },
    // 改变会员页页码
    handleCurrentChange(val) {
      this.clientList();
    },
    //改变储蓄时间状态
    Change_savingsTime(val) {
      this.savingsData();
    },
    //改变储蓄账户下拉状态
    Change_savings(val) {
      this.savingsData();
    },

    // 改变储蓄记录页码
    pageHandlesavings(val) {
      this.savingsData();
    },
    // 改变医美记录页码
    pageHandleMedicine(val) {
      this.cosmeticData();
    },
    //改变医美时间状态
    Change_Medicine(val) {
      this.cosmeticData();
    },
    // 改变产品记录页码
    pageHandleproduct(val) {
      this.productData();
    },
    //改变产品时间状态
    Change_product(val) {
      this.productData();
    },
    //获取新密码
    newpassword() {
      this.newwodesss = this.ruleForm.pass;
    },
    //获取旧密码
    oldpassword() {
      this.oldwodesss = this.ruleForm.oldpassword;
    },

    //修改密码
    changpassword() {
      var url =
        this.$https.accountHost + "/manage/memberUser/resetMemberPassword";
      var params = {
        memberNum: this.cardNumber,
        passwordOld: this.oldwodesss,
        passwordNew: this.newwodesss
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: "修改成功...",
              type: "success"
            });
            this.visible_password = false;
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
    //搜索会员名字
    addmembername() {
      var url = this.$https.accountHost + "/manage/memberUser/listByPage";
      var params = {
        storeId: localStorage.getItem("storeId"),
        name: this.input_name
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.tableData = res.data.result.list;
            this.$message({
              message: "搜索成功...",
              type: "success"
            });
          } else {
            this.tableData = [];
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
    //搜索会员电话
    addmemberpoapele() {
      var url = this.$https.accountHost + "/manage/memberUser/listByPage";
      var params = {
        storeId: localStorage.getItem("storeId"),
        mobile: this.input_popel
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.tableData = res.data.result.list;

            this.$message({
              message: "搜索成功...",
              type: "success"
            });
          } else {
            this.tableData = [];
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
    //添加会员
    addmember() {
      var url = this.$https.accountHost + "/manage/memberUser/add";
      var params = {
        storeId: localStorage.getItem("storeId"),
        name: this.ruleForm_addvip.name,
        mobile: this.ruleForm_addvip.pople,
        birthday: this.ruleForm_addvip.bersder,
        sex: this.ruleForm_addvip.sex,
        remark: this.ruleForm_addvip.remark,
        memberAddType: 1,
        idCard: this.ruleForm_addvip.identity
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.$message({
              message: "添加成功...",
              type: "success"
            });
            this.visible_addvip = false;
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
    //客户列表
    clientList() {
      var url = this.$https.accountHost + "/manage/memberUser/listByPage";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage,
        pageSize: this.pageSize1
      };
      this.$https.fetchPost(url, params).then(
        res => {
          this.tableData = res.data.result.list;
          var a = this.tableData[0].lableName;
          var labelLists = a.split(",");
          this.privateList = labelLists;
          if (res.data.result) {
            this.dataTotal1 = res.data.result.total;
            this.nurseRecord = res.data.result.list;
          } else {
            this.dataTotal1 = 0;
            this.nurseRecord = [];
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
    //修改备注
    rmarkMember() {
      var url =
        this.$https.accountHost + "/manage/memberUser/updateStoreMember";
      var params = {
        remark: this.remark2,
        memberNum: this.cardNumber
      };
      this.$https.fetchPost(url, params).then(res => {
        if (res.data) {
          this.$message({
            message: "修改备注成功...",
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.responseStatusType.error.errorMsg,
            type: "warning"
          });
        }
      });
    },
    //修改账号
    zhterMember() {
      var url =
        this.$https.accountHost + "/manage/memberUser/updateStoreMember";
      var params = {
        name: this.amend_input,
        mobile: this.amend_pefpoe,
        idCard: this.amend_idcard,
        birthday: this.amend_bersday,

        memberNum: this.cardNumber
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data) {
            this.$message({
              message: "修改成功...",
              type: "success"
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
    //储蓄下拉框
    savingsselectbox() {
      var url =
        this.$https.walletHost + "/manage/wallet/selectWalletAccountList";
      var params = {
        storeId: localStorage.getItem("storeId"),
        pageNum: this.currentPage,
        pageSize: this.pageSize2
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.optionsavings = res.data.result;
            this.optionsavings.unshift({
              accountTypeId: null,
              accountType: "全部"
            });
            this.value_savings = this.optionsavings[0].accountTypeId;
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
    //客户详情储蓄账户
    savingAccount() {
      var url =
        this.$https.accountHost + "/manage/memberUser/listMemberAccount";
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize1,
        memberNum: this.cardNumber
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.accounts = res.data.result.list;
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
    //护理记录
    nurserecordData() {
      var url =
        this.$https.orderHost + "/order/selectOrderByMemberNumAndProductType";
      var params = {
        storeId: localStorage.getItem("storeId"),
        orderType: this.value_nurse,
        memberNum: this.cardNumber,
        keywordOrderNum: this.memberNum,
        date: this.valueNurse,
        pageNum: this.currentPage,
        pageSize: this.pageSize4
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataTotal_nurse = res.data.result.total;
            this.nurseRecord = res.data.result.list;
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
    //储蓄记录
    savingsData() {
      var url = this.$https.walletHost + "/wallet/selectRechargeById";
      var params = {
        storeId: localStorage.getItem("storeId"),
        cardNumber: this.cardNumber,
        accountTypeId: this.value_savings,
        date: this.valuesavings,
        pageNum: this.currentPage,
        pageSize: this.pageSize2
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataTotal_savings = res.data.result.total;
            this.savingsRecord = res.data.result.list;
          } else {
            this.dataTotal_savings = 0;
            this.savingsRecord = [];
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
    //医美记录
    cosmeticData() {
      var url =
        this.$https.orderHost + "/order/selectOrderByMemberNumAndProductType";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber,
        keywordOrderNum: 9,
        pageNum: this.currentPage,
        pageSize: this.pageSize3,
        date: this.valueMedicine
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataTotal_Medicine = res.data.result.total;
            this.tableDataMedicine = res.data.result.list;
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
    //产品记录
    productData() {
      var url = this.$https.orderHost + "/order/selectOrderProductByMemberNum";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber,
        date: this.valueproduct,
        pageNum: this.currentPage,
        pageSize: this.pageSize5
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          this.dataTotal_product = res.data.result.total;
          this.tableDataproduct = res.data.result.list;
        })
        .catch(err => {
          // this.$message.error("产品记录请求失败...");
        });
    },
    //充值
    rechargeList() {
      var url =
        this.$https.walletHost +
        "/manage/wallet/insertStoreRechargeAuditRecord";
      var params = {
        storeId: localStorage.getItem("storeId"),
        accountTypeId: this.value_tregion,
        cardNumber: this.cardNumber,
        amount: this.form.money,
        payTypeAndAmount: JSON.stringify(this.payTypeAndAmount),
        beauticianId: JSON.stringify(this.beauticianIds),
        name: this.form.gatheringp,
        isRoyalty: this.delivery,
        isintegral: this.rebate,
        rechargeChannel: 3,
        industryId: localStorage.getItem("industryID"),
        mobile: this.mobiles,
        payStatus: this.value_accountstates,
        payee: this.form.gatheringp,
        isAbatementLadderDetailed: 1,
        remarks: this.form.desc
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: "充值成功",
              type: "success",
              duration: 5000
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
    //充值员工

    rechargepeople() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianListNoPage";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.optionpeple = res.data.result;
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
    //支付类型
    paymentTalp() {
      var url = this.$https.payHost + "/manage/payment/selectPayTypeList";
      var params = {
        storeId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            res.data.result.forEach(value => {
              if (value.payTypeCategory == 1) {
                this.optionpeTylp.push({
                  payTypeCategory: value.payTypeCategory,
                  payTypeId: value.payTypeId,
                  payTypeName: value.payTypeName
                });
              }
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
    //账户类型
    accounttypeData() {
      var url =
        this.$https.walletHost + "/manage/wallet/selectWalletAccountList";
      this.$https.fetchPost(url).then(
        res => {
          if (res.data.result) {
            this.interestTple = res.data.result;
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

    //查询10笔消费
    queryConsumption() {
      var url = this.$https.orderHost + "/order/selectConsumeTopTen";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataname = res.data.result.date;
            this.dataadd = res.data.result.price;
            this.initCharts();
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
    //消费
    rechargeTop() {
      var url = this.$https.walletHost + "/manage/wallet/selectRechargeTopTen";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          this.rechargedaata = res.data.result.date;
          this.rechargedatas = res.data.result.price;
          this.recharge();
        })
        .catch(err => {
          // this.$message.error("查询10笔消费请求失败...");
        });
    },
    //消费次数
    consumptioLevel() {
      var url = this.$https.orderHost + "/order/selectConsumeTimesTopTen";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          this.consumptioLeData = res.data.result.productNameList;
          this.consumptioLeDatass = res.data.result.orderTimesList;
          this.consumptions();
        })
        .catch(err => {
          // this.$message.error("项目消费次数请求失败...");
        });
    },
    //消费金额
    consumptionmoney() {
      var url = this.$https.orderHost + "/order/selectConsumeMoneyTopTen";
      var params = {
        storeId: localStorage.getItem("storeId"),
        memberNum: this.cardNumber
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.consumpmoneyDatass = res.data.result.orderMoneyList;
            this.consumpmoneyData = res.data.result.productNameList;
            this.consumpmoney();
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
    //选择标签
    show_stgbtally(itemtay) {},
    close_stgbtally(itemtay) {},
    //标签选择
    tallyClick(itemtay) {
      this.visible_tally = false;
    },
    //会员备注
    show_stgbVip() {
      this.remark2 = "";
      this.visible_VIP = true;
    },
    close_stgbVip() {
      this.visible_VIP = false;
    },
    VipClick() {
      this.rmarkMember();
      this.remark = this.remark2;
      if (this.vipName == localStorage.getItem("memberName")) {
        localStorage.setItem("remark", this.remark2);
      }

      this.visible_VIP = false;
    },
    //点击充值
    show_recharge() {
      this.value_tregion = "";
      this.form.money = "";
      this.form.gatheringp = "";
      this.value_tpeple = "";
      this.delivery = "0";
      this.rebate = "0";
      this.value_accounTelp = "";
      this.value_accountstate = "";
      this.form.desc = "";

      this.visible_recharge = true;
    },
    close_recharge() {
      this.beauticianIds[0].amount = "";
      this.payTypeAndAmount[0].payType = "";
      this.payTypeAndAmount[0].amount = "";
      this.visible_recharge = false;
    },
    //点击修改会员资料
    item_more() {
      this.moreClick = true;
    }
  },
  created() {
    this.clientList();
  }
};
</script>

 <style lang='scss' scoped>
/* 引入公共css类 */
/* @import url(); */
.clienthId {
  width: 100%;
  height: 100%;
  .clientSmo {
    width: 100%;
    height: 100%;
    position: relative;
    .clientTitle {
      width: 100%;
      height: 80px;
      background-color: #f3ece3;
      display: flex;
      padding: 20px 20px;
      justify-content: space-between;
      .inpuT {
        width: 300px;
        position: relative;
        padding: 0 20px;
        span {
          width: 40px;
          height: 30px;
          padding-top: 10px;
          text-align: center;
          position: absolute;
          right: 20px;
          i {
            color: rgb(51, 51, 51);
            font-size: 17px;
          }
        }
      }
      .clientBtn {
        margin-right: 20px;
      }
    }
    .clienList {
      width: 80%;
      margin: 30px auto;
      border-radius: 6px;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
      padding: 10px 50px 20px 50px;
      overflow: auto;
      position: relative;
    }
    .pagination {
      text-align: right;
      margin-right: 200px;
    }
  }
  .Customer {
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 100;
    background-color: #eaeaea;
    .CustLeft {
      width: 260px;
      height: 100%;
      overflow: auto;
      .CustTop {
        background-color: #fff;

        .CustTitle {
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          padding: 0 10px;
          padding-top: 30px;
          border-bottom: 1px solid #eee;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            font-weight: 600;
          }
          .getrback {
            width: 30px;
            height: 30px;
            i {
              font-size: 40px;
            }
          }
        }
        .CustName {
          padding: 20px;
          font-size: 16px;
          p {
            font-size: 20px;
            margin-bottom: 6px;
          }
        }
      }
      .CustBottom {
        width: 100%;
        height: 100%;
        background-color: #fff;
        margin-top: 10px;
        overflow: auto;
        :hover.menus {
          background-color: #f4f4f4;
        }
        .menus {
          width: 100%;
          height: 60px;
          line-height: 60px;
          color: #5a5a5a;
          font-size: 15px;
          text-align: center;
        }
      }
      .footer {
        width: 100%;
        height: 60px;
        background-color: #647c48;
        line-height: 60px;
        text-align: center;
        font-size: 15px;
        color: #fff;
        img {
          width: 20px;
          height: 20px;
        }
        span {
          margin-left: 8px;
        }
      }
    }
    .CustRight {
      flex: 1;
      max-width: 1200px;
      height: 100%;
      overflow: auto;
      background-color: #fff;
      margin: auto;
      .personage {
        .rightTitle {
          width: 100%;
          margin-top: 70px;
          margin-left: 130px;
          position: relative;
          .rigtop {
            position: absolute;
            color: #fff;
            right: 150px;
            bottom: 10px;
          }
        }
        .information {
          width: 100%;
          height: 250px;
          .inforTop {
            width: 100%;
            height: 150px;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            .inforLeft {
              width: 500px;
              height: 100%;
              padding: 10px;
              display: flex;
              position: relative;
              .photo {
                width: 90px;
                height: 90px;
                background-color: #eeeeee;
                line-height: 80px;
                text-align: center;
                margin: 0 auto;
                font-size: 50px;
                border-radius: 6px;
                position: absolute;
                top: -20px;
                .avatar-uploader .el-upload {
                  border: 1px dashed #d9d9d9;
                  border-radius: 6px;
                  cursor: pointer;
                  position: relative;
                  overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                  border-color: #409eff;
                }
                .avatar-uploader-icon {
                  font-size: 28px;
                  color: #8c939d;
                  width: 90px;
                  height: 90px;
                  line-height: 90px;
                  text-align: center;
                }
                .avatar {
                  width: 90px;
                  height: 90px;
                  display: block;
                }
                span {
                  color: #cac6c6;
                }
              }
              .photoRit {
                width: 380px;
                height: 100%;
                position: absolute;
                right: 0;
                .member {
                  margin: 4px 0;
                  span {
                    padding-bottom: 5px;
                  }
                  label {
                    width: 80px;
                    height: 80px;
                    line-height: 30px;
                    img {
                      width: 25px;
                      height: 25px;
                      margin-left: 10px;
                    }
                  }
                }
                .inforname {
                  font-size: 18px;
                  width: 240px;
                  span {
                    margin-left: 30px;
                    font-size: 16px;
                    color: #8a8a8a;
                  }
                }
              }
            }
            .inforRight {
              padding: 20px;
            }
          }
          .inforBottom {
            width: 100%;
            height: 100px;
            padding: 20px 0;
            .inforBoso {
              width: 100%;
              height: 60px;
              display: flex;
              .inforSome {
                width: 25%;
                height: 100%;
                line-height: 25px;
                text-align: center;
                border-right: 1px solid #eee;
                span {
                  color: #b0b0b0;
                }
              }
              .inforSomes {
                width: 25%;
                height: 100%;
                line-height: 25px;
                text-align: center;
                span {
                  color: #b0b0b0;
                }
              }
            }
          }
        }
        .integral {
          width: 100%;
          height: 50px;
          font-size: 18px;
          font-weight: 600;
          background-color: #f4f4f4;
          line-height: 60px;
          padding-left: 15px;
        }
        .addintegras {
          width: 300px;
          height: 70px;
          line-height: 70px;
          padding-left: 15px;
          .addBtn {
            width: 50px;
          }
        }
        .inforNews {
          width: 100%;
          height: 300px;
          padding: 15px;
        }
        .inforns {
          width: 100%;
          height: 30px;
          font-size: 15px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
      }
      .PerminTitle {
        .PerminName {
          width: 100%;
          height: 100px;
          line-height: 100px;
          p {
            text-align: center;
            font-size: 20px;
          }
        }
      }
      .ItemInformation {
        width: 100%;
        height: 100%;
        .PerminNurse {
          height: 100px;
          width: 100%;
          display: flex;
          justify-content: space-between;

          label {
            font-size: 22px;
            font-weight: 600;
            margin-left: 20px;
            margin-top: 50px;
          }
          .rightNurse {
            display: flex;
            margin-right: 40px;
            .el-select {
              width: 130px;
              margin-top: 50px;
            }
            .el-input {
              height: 45px;
              width: 180px;
              // border: 1px solid rgb(216, 211, 211);
              margin-top: 50px;
              margin-left: 10px;
              border-radius: 6px;
            }
            .block {
              margin-left: 15px;
            }
          }
        }
        .el-tableList {
          width: 80%;
          margin: 0 auto;
          position: relative;
          margin-top: 15px;
          border-radius: 6px;
          box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
        }
      }
      .pagination {
        margin: 20px 110px 20px 0;
        text-align: right;
      }
      .dataAnalysis {
        p {
          height: 100px;
          width: 100%;
          font-size: 20px;
          line-height: 100px;
          text-align: center;
        }
        .el-tabs {
          padding: 0 20px;
        }
      }

      .ticket {
        .PerminName {
          width: 100%;
          height: 100px;
          line-height: 100px;
          p {
            text-align: center;
            font-size: 20px;
          }
        }
      }
    }
    .moreData {
      flex: 1;
      max-width: 1200px;
      margin: auto;
      background-color: #f8f8f8;
      .vipData {
        width: 100%;
        height: 90px;
        line-height: 110px;
        padding: 0 20px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        color: #28282d;
        font-size: 18px;
        .vipspan {
          font-size: 60px;
        }
        .vipname {
          font-size: 30px;
        }
      }
      .vipinforList {
        width: 100%;
        background-color: #fff;
        height: 820px;
        padding: 20px;
        margin-top: 30px;
        .vipinforname {
          width: 100%;
          height: 55px;
          border-bottom: 1px solid rgb(236, 234, 234);
          display: flex;
          line-height: 43px;
          margin-top: 10px;
          justify-content: space-between;
          label {
            font-size: 16px;
          }
          .el-input {
            border-radius: 4px;
            width: 218px;
          }
        }
      }
      .Vipul {
        height: 100%;
        margin-top: 20px;
        padding: 0 10px;
        background-color: #fff;
        li {
          height: 40px;
          line-height: 40px;
          border-bottom: 0.5px solid rgba(220, 220, 220, 0.7);
          display: flex;
          justify-content: space-between;
          padding: 15px;
          .el-input {
            width: 215px;
            border: 1px solid #dcdfe6;
          }
          .el-form {
            width: 215px;
            border-radius: 10px;
            .el-col {
              background-color: rgba(148, 139, 139, 0.7);
            }
          }
        }
      }
      .customTag {
        width: 100%;
        height: 54px;
        line-height: 54px;
        text-align: center;
        margin-top: 35px;
        color: #23a547;
        background-color: #fff;
      }
    }
  }
}

//出入库弹出框
.storageblock {
  .stgblcktop {
    text-align: center;
    font-size: 20px;
  }
  .stgblcktopmain {
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    clear: both;
    li {
      padding: 18px 0 0 18px;
      font-size: 16px;
    }
    .stgbList {
      display: flex;
      justify-content: space-between;
      padding: 18px 18px 0 18px;
      font-size: 16px;
    }
    .stgbListtally {
      padding: 18px 0 0 18px;
      float: left;
      label {
        flex: 1;
        border: 1px solid rgb(153, 149, 149);
        border-radius: 6px;
        padding: 6px 8px;
      }
    }
    .stgbListtallyVip {
      padding: 30px 15px;
      .stgbLisarea {
        width: 285px;
        height: 135px;
        textarea {
          width: 100%;
          height: 100%;
          background-color: #f4f4f4;
          border-radius: 10px;
          padding: 15px;
          margin-left: 35px;
        }
      }
    }
    // .stgbListtallyVpe {
    //   width: 100%;
    //   height: 100%;
    //   .stgbViplist {
    //     width: 100%;
    //     height: 40px;
    //     line-height: 40px;
    //     padding: 0 10px;
    //     display: flex;
    //     justify-content: space-between;
    //     .stgImg {
    //       width: 40px;
    //       height: 40px;
    //       border: 1px solid red;
    //       display: inline;
    //       margin-right: 10px;
    //     }
    //     .el-radio {
    //       line-height: 40px;
    //     }
    //   }
    // }
  }
  .stgblckbottom {
    position: absolute;
    width: 100%;
    margin-top: 30px;
    bottom: 10px;
    text-align: center;
  }
  .stgblckbottomIP {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    text-align: center;
    .el-button {
      width: 100%;
      background-color: #28282d;
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
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    li {
      padding: 18px 0 0 18px;
      font-size: 16px;
    }
  }
}
//修改密码
.storageblockpassword {
  .stgblcktop {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
  .stgblcktopmain {
    margin-top: 16px;
    .el-input {
      width: 215px;
      border-radius: 4px;
      // border: 1px solid rgb(211, 208, 208);
    }
  }
}
//充值弹出框
.storageblock {
  .recharge_top {
    width: 100%;
    height: 30px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #646464;
  }
  .recharge_main {
    .el-input {
      width: 215px;
    }
    .textarea {
      width: 250px;
      height: 100px;
      border-radius: 5px;
      padding: 10px;
    }
    .el-textarea__inner {
      width: 215px;
    }
  }
}
//添加会员
.storageblockvip {
  .stgblcktop {
    text-align: center;
    font-size: 16px;
    padding: 10px 0;
  }
  .stgblcktopmain {
    padding-top: 20px;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);

    .el-input {
      width: 215px;
      // border: 1px solid rgb(184, 178, 178);
      border-radius: 4px;
    }
    .el-select {
      border: 1px solid rgb(184, 178, 178);
    }
    .el-textarea__inner {
      width: 215px;
      border: 1px solid rgb(184, 178, 178);
    }
    .el-radio-group {
      text-align: center;
    }
    .el-date-editor {
      background-color: rgb(216, 210, 210);
    }
    .textarea {
      width: 260px;
      height: 100px;
      border-radius: 5px;
      padding: 10px;
    }
  }
  .stgblckbottom {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    bottom: 10px;
    text-align: center;
  }
}
</style>
