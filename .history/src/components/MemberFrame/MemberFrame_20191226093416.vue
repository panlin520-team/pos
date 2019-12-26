<!-- 弹框Modal组件 -->
<template>
  <div class="fixed">
    <div class="concealVIP" @click="clickconceal">
      <img
        :class="[this.$store.state.fold==false ?'fa fa-arrow-down go':'fa fa-arrow-down aa']"
        src="../../assets/images/icon_cbl.png"
        alt
      />
    </div>
    <transition name="fade">
      <div class="floatBox" v-if="$route.meta.menubar" v-show="this.$store.state.fold">
        <div class="memberBox">
          <div class="content">
            <div class="userPhoto">
              <img :src="imageUrl" />
              <div
                v-if="this.$store.state.member != null"
                @click="clearMember"
                class="clear btn-pointer"
              >X</div>
            </div>
            <div class="usermessage">
              <div class="userNamePoto">
                <div class="userName-box">
                  <label>姓名：</label>
                  <el-input
                    v-model="input_name"
                    v-on:keyup.13.native="show_stgbcar"
                    placeholder="请输入姓名"
                  ></el-input>
                  <div class="userName-boxs">
                    <i class="el-icon-search" @click="show_stgbcar"></i>
                  </div>
                </div>
                <PopOver
                  custom-class="storageblock"
                  :visible.sync="visible_care"
                  @close="close_stgbcar"
                  width="600px"
                >
                  <div class="stgblcktop" slot="top">会员信息</div>
                  <div class="stgblcktopmain" slot="main">
                    <el-table :data="tableData_vippeple" style="width: 100%">
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
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button size="mini" @click="vipexamine(scope.row)">确定</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </PopOver>

                <div class="userName-box">
                  <label>联系电话：</label>
                  <el-input
                    v-model="input_number"
                    v-on:keyup.13.native="show_stgbcar2"
                    placeholder="请输入手机号"
                  ></el-input>
                  <div class="userName-boxs">
                    <i class="el-icon-search" @click="show_stgbcar2"></i>
                  </div>
                </div>
                <div class="gradevip">
                  会员等级：
                  <span>{{grade}}</span>
                </div>
              </div>
              <div class="remarkVip">
                <label>备注：</label>
                <el-input v-model="remark" @blur="unfocused" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="experienCard">
              <el-button type="warning" @click="show_carLise">客户项目</el-button>
            </div>
            <div class="experienCards">
              <el-button type="warning" @click="show_customization">项目定制</el-button>
            </div>
            <PopOver
              custom-class="storageblock2"
              :visible.sync="visible_carLise"
              @close="close_carLise"
              width="600px"
            >
              <div class="stgblcktop" slot="top">客户项目信息</div>
              <div class="stgblcktopmain" slot="main">
                <el-table :data="tableData_carLise" style="width: 100%">
                  <el-table-column label="姓名" v-model="cardName">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">{{ scope.row.cardName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="卡号">
                    <template slot-scope="scope">
                      <div slot="reference" class="name-wrapper">{{ scope.row.cardNum }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size="mini" @click="vipecarLise(scope.row)">查看详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <PopOver
                  custom-class="storageblock3"
                  :visible.sync="visible_details"
                  @close="close_details"
                  width="900px"
                >
                  <div class="stgblcktop" slot="top">卡信息</div>
                  <div class="stgblcktopmain" slot="main">
                    <el-table :data="tableData_details" style="width: 100%">
                      <el-table-column label="项目名称" width="120">
                        <template slot-scope="scope">
                          <div
                            slot="reference"
                            class="name-wrapper"
                          >{{ scope.row.experiencecardProductName }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="商品小类" width="110">
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
                      <el-table-column label="使用总数" width="100">
                        <template slot-scope="scope">
                          <div slot="reference" class="name-wrapper">{{ scope.row.totalTimes }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="使用次数" width="100">
                        <template slot-scope="scope">
                          <div slot="reference" class="name-wrapper">{{ scope.row.useTimes }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="有效期" width="200">
                        <template slot-scope="scope">
                          <div slot="reference" class="name-wrapper">{{ scope.row.useLimit }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button size="mini" @click="vipexdetails(scope.row)">划卡</el-button>
                          <el-button size="mini" @click="userdetails(scope.row)">使用详情</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </PopOver>
                
                <pop-over
                  :visible.sync="servicePopover"
                  @close="servicePopover = false"
                  width="960px"
                  custom-class="servicePop"
                  id="pop"
                >
                  <div class="top" slot="top">
                    <div class="title">洗剪吹</div>
                  </div>
                  <div class="main" slot="main">
                    <div class="empSet">
                      <div
                        v-for="(item,index) in empSet"
                        :class="['item',{'active' : currentServiceId==item.postCategoryId}]"
                        :key="index"
                        @click="switchEmpList(index,item.postCategoryId,item.setEmpId)"
                      >
                        <div class="default" v-if="item.setName==undefined || item.setName=='' ">
                          <span>{{item.postCategoryName}}</span>
                        </div>
                        <div class="active" v-if="item.setName!=''">
                          <span>{{item.setName}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="empSelect">
                      <div class="tit">{{currentServiceTitle}}</div>
                      <div class="empList scrollY">
                        <div
                          class="item"
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
                    <div class="btn btn-submit" @click="pushService">确认</div>
                  </div>
                </pop-over>
              </div>
            </PopOver>
          </div>
          <pop-over
            :visible.sync="visible_customization"
            @close="visible_customization = false"
            width="600px"
            custom-class="servicecust"
          >
            <div class="top" slot="top">
              <div class="title">定制项目</div>
            </div>
            <div class="main" slot="main">
              <el-table :data="tableData_customization" style="width: 100%">
                <el-table-column label="姓名" v-model="cardName">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.cardName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="卡号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.cardNum }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="vipecustomization(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom" slot="bottom"></div>
          </pop-over>
          <pop-over
            :visible.sync="visible_customs"
            @close="visible_customs = false"
            width="700px"
            custom-class="servicecutbs"
          >
            <div class="top" slot="top">
              <div class="title">定制项目</div>
            </div>
            <div class="main" slot="main">
              <el-table :data="tableData_customs" style="width: 100%">
                <el-table-column label="姓名" v-model="cardName">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.cardName }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="卡号">
                  <template slot-scope="scope">
                    <div slot="reference" class="name-wrapper">{{ scope.row.cardNum }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="vipecucustoms(scope.row)">划卡</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="bottom" slot="bottom"></div>
          </pop-over>
          <div class="accountBalance">
            <span class="spans">账户信息：</span>
            <div class="accountCenter">
              <div class="savingBale" v-for="item in accounBalance" :key="item.index">
                <label>{{item.accountType}}：</label>
                <span>{{item.amount}}</span>元
              </div>
            </div>

            <div style="margin: 8px 0 0 50px">
              <el-button size="small" @click="immediaimmediately" type="warning">立即充值</el-button>
            </div>
          </div>
        </div>

        <!-- <pop-over
          :visible.sync="visible_recharge"
          @close="visible_recharge = false"
          width="500px"
          custom-class="servicepeole"
        >
          <div class="top" slot="top">3124213</div>
          <div class="main" slot="main"></div>
          <div class="bottom" slot="bottom"></div>
        </pop-over>-->
        <PopOver
          custom-class="storageblockk"
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
                <el-select v-model="value_accountstate" placeholder="请选择支付状态">
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
    </transition>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      logo: require("@/assets/images/logo.png"), // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //显示与隐藏
      show_box: true,
      message: "显示会员",
      //输入姓名
      input_name: "",
      //输入手机号
      input_number: "",
      accountType: "",
      //员工编号
      subClassId: "",
      staffNumber: "",
      //会员卡号
      memberNum: "",
      cardName: "哈哈哈哈",
      //使用次数
      useTimes: "",
      //总数
      totalTimes: "",
      siYuan: [],
      changeRed: -1,
      //体验卡编码
      cardNum: "",
      // 项目或产品默认初始数量
      productNum: 1,
      // 项目或产品默认名称
      productName: null,
      // 项目或产品可选工位与可选员工
      empSet: [],
      empList: [],
      // 项目当前工种id
      currentServiceId: null,
      cardid: "",
      //会员备注
      remark: "",
      //已选项目
      serviceList: [],
      // 项目当前工种title
      currentServiceTitle: null,
      //商品编码
      experiencecardProductCode: "",
      //商品名称
      experiencecardProductName: "",
      //tylp
      experiencecardProductType: "",
      //弹出框控制
      visible_care: false,
      visible_carLise: false,
      visible_details: false,
      visible_vipexd: false,
      servicePopover: false,
      visible_recharge: false,
      visible_customization: false,
      visible_customs: false,
      //会员等级
      grade: "",
      rotate: false,
      //搜索数据
      tableData_vippeple: [],
      //查看体验卡
      tableData_carLise: [],
      tableData_customs: [
        {
          cardName: "哈哈",
          cardNum: "1212423235"
        }
      ],
      //项目定制
      tableData_customization: [
        {
          cardName: "哈哈",
          cardNum: "1212423235"
        }
      ],
      //账户信息余额
      accounBalance: [],
      //查看体验卡详情
      tableData_details: [],

      // 项目当前工种下已选员工id
      currentEmpId: null,
      //充值
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
      //上传图片
      imageUrl: "",
      imageUrls: require("../../assets/images/user.png"),

      //充值里数据
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
      //充值类型
      value_tregion: "",
      //充值员工
      value_tpeple: "",
      //支付类型
      value_accounTelp: "",
      //支付状态
      value_accountstate: "",
      //充值账户类型下拉选项
      interestTple: [],
      optionpeTylp: [],
      //充值
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
      //充值账户类型x选项
      options_account: [],
      //充值员工下拉下拉框
      optionpeple: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    // push已选择项目
    pushService() {
      var list = this.empSet;
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].setEmpId != "" && list[i].setEmpId != undefined) {
          arr.push({
            postId: list[i].postId,
            beauticianId: this.staffNumber,
            beauticianName: list[i].setEmpName
          });
        }
      }
      this.serviceList = arr;

      //判断
      if (this.serviceList.length !== this.empSet.length) {
        this.$message({
          message: "警告哦，请选择全对应员工...",
          type: "warning"
        });
      } else {
        this.staffstampCard();
        this.servicePopover = false;
        this.visible_details = false;
        setTimeout(() => {
          this.visible_carLise = false;
        }, 100);
      }
    },
    //定制项目列表选择
    vipecustomization() {
      this.visible_customs = true;
    },
    vipecucustoms() {},
    //充值
    //充值获取员工
    changepeople() {
      this.beauticianIds[0].beauticianId = this.value_tpeple;
    },
    //充值选择类型
    changeTylp() {
      this.payTypeAndAmount[0].payType = this.value_accounTelp;
    },
    //充值选择金额
    changemoney() {
      this.payTypeAndAmount[0].amount = this.form.money;
    },
    //立即充值
    immediaimmediately() {
      this.value_tregion = "";
      this.form.money = "";
      this.form.gatheringp = "";
      this.value_tpeple = "";
      this.delivery = "0";
      this.rebate = "0";
      this.value_accounTelp = "";
      this.value_accountstate = "";
      this.form.desc = "";
      if (this.input_name) {
        this.visible_recharge = true;
      } else {
        this.$message.error("请先选择会员");
      }
    },
    //充值点击提交
    onSubmit() {
      // this.accounBalance = [];
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
            this.memberbalance();
          }, 200);
        } else {
          this.$message.error("请填写备注");
        }
      } else {
        this.visible_recharge = false;
        this.rechargeList();
        setTimeout(() => {
          this.memberbalance();
        }, 200);
      }
    },
    close_recharge() {
      this.beauticianIds[0].amount = "";
      this.payTypeAndAmount[0].payType = "";
      this.payTypeAndAmount[0].amount = "";
      this.visible_recharge = false;
    },
    // 对应选择项目工种下员工并修改对应服务项目工种菜单
    fetchServiceEmp(id, item) {
      this.staffNumber = item.staffNumber;
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
    //填写备注
    unfocused() {
      localStorage.setItem("remark", this.remark);
      if (localStorage.getItem("membership")) {
        this.rmarkMember();
      } else {
        this.$message({
          message: "请先选择会员",
          type: "warning"
        });
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
    //项目定制划卡
    show_customization() {
      this.visible_customization = true;
    },
    //点击显示与隐藏
    clickconceal() {
      this.$store.state.fold = !this.$store.state.fold;
    },
    //搜索姓名
    show_stgbcar() {
      this.memberinformation();
      this.visible_care = true;
    },
    //搜索电话
    show_stgbcar2() {
      this.memberinformation2();
      this.visible_care = true;
    },
    close_stgbcar(itemcar) {
      this.visible_care = false;
    },
    //搜索体验卡
    show_carLise() {
      this.memberdetails();
      this.visible_carLise = true;
    },
    close_carLise(itemcar) {
      this.visible_carLise = false;
    },
    userdetails(){

    },
    //确定划卡
    vipexdetails(res) {
      this.cardid = res.id;
      this.subClassId = res.subClassId;
      this.experiencecardProductCode = res.experiencecardProductCode;
      this.experiencecardProductName = res.experiencecardProductName;
      this.experiencecardProductType = res.experiencecardProductType;
      this.useTimes = res.useTimes;
      this.totalTimes = res.totalTimes;
      if (this.experiencecardProductType == 1) {
        this.$confirm("您确定划卡吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.stampCard();
            this.visible_details = false;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消划卡"
            });
          });
        if (res.useTimes < res.totalTimes) {
        } else {
          res.useTimes = res.totalTimes;
          this.$message({
            message: "警告哦，不能划卡了哟...",
            type: "warning"
          });
        }
      } else {
        if (res.useTimes < res.totalTimes) {
          this.employeels();
          this.servicePopover = true;
        } else {
          res.useTimes = res.totalTimes;
          this.$message({
            message: "警告哦，不能划卡了哟...",
            type: "warning"
          });
        }
        this.serviceList = [];
        this.visible_vipexd = true;
      }
    },
    //选中会员
    vipexamine(res) {
      this.imageUrl = res.headImgUrl;
      this.remark = res.remark;
      this.cardNum = res.cardNum;
      this.memberNum = res.memberNum;
      this.grade = res.membershipLevelName;
      this.input_name = res.name;
      this.input_number = res.mobile;
      // 设置本地存储
      localStorage.setItem("remark", this.remark);
      localStorage.setItem("memberName", this.input_name);
      localStorage.setItem("memberNumber", this.input_number);
      localStorage.setItem("membership", this.memberNum);
      localStorage.setItem("grade", this.grade);
      var params = {
        // 会员名称
        userName: res.name,
        // 会员手机号
        userMobile: res.mobile,
        // 会员编号及卡号
        userNumber: res.memberNum,
        // 会员等级
        userGrade: res.membershipLevelName
      };
      localStorage.setItem("member", JSON.stringify(params));
      this.$store.commit("setMember", JSON.stringify(params));
      this.accounBalance = [];
      this.memberbalance();
      this.visible_care = false;
    },
    // 清空会员信息
    clearMember() {
      this.$confirm("确认清空会员信息吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.commit("setMember", null);
          localStorage.removeItem("member");
          this.cardNum = "";
          this.memberNum = "";
          this.grade = "";
          this.remark = "";
          this.input_name = "";
          this.input_number = "";
          this.imageUrl = this.imageUrls;
          localStorage.removeItem("remark");
          localStorage.removeItem("memberName");
          localStorage.removeItem("memberNumber");
          localStorage.removeItem("membership");
          localStorage.removeItem("grade");
          localStorage.removeItem("list");
          // localStorage.removeItem("imageUrl");
          this.accounBalance = [];
        })
        .catch(() => {});
    },
    //查看体验卡详情
    vipecarLise(res) {
      this.cardid = res.id;
      this.memberdcarUser();
      this.cardNum = res.cardNum;
      this.tableData_details = res.experiencecardProductUserList;
      this.visible_details = true;
    },
    close_details() {
      this.visible_details = false;
    },
    //选择员工
    close_vipexd() {
      this.visible_vipexd = false;
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
            this.$notify({
              message: res.data.responseStatusType.error.errorMsg,
              position: "bottom-right",
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
        remark: this.remark,
        memberNum: localStorage.getItem("membership")
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
    //获取会员电话
    memberinformation() {
      var url =
        this.$https.accountHost +
        "/manage/memberUser/selectStoreMemberByPhoneOrName";
      var params = {
        storeId: localStorage.getItem("storeId"),
        name: this.input_name
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
          this.tableData_vippeple = res.data.result;
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    },
    //获取会员电话
    memberinformation2() {
      var url =
        this.$https.accountHost +
        "/manage/memberUser/selectStoreMemberByPhoneOrName";
      var params = {
        storeId: localStorage.getItem("storeId"),
        mobile: this.input_number
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
          this.tableData_vippeple = res.data.result;
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    },
    //点击查看详情
    memberdcarUser() {
      var url =
        this.$https.storeHost +
        "/manage/experienceCard/selectExpCardUserProduct";
      var params = {
        memberNum: this.$store.state.member.userNumber,
        experiencecardUserId: this.cardid
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.tableData_details = res.data.result;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    //获取会员卡详情
    memberdetails() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/selectExpCardUser";
      var params = {
        memberNum: this.$store.state.member.userNumber
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result.userExperiencecardList) {
            this.tableData_carLise = res.data.result.userExperiencecardList;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
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
        cardNumber: localStorage.getItem("membership"),
        amount: this.form.money,
        payTypeAndAmount: JSON.stringify(this.payTypeAndAmount),
        beauticianId: JSON.stringify(this.beauticianIds),
        name: this.form.gatheringp,
        isRoyalty: this.delivery,
        isintegral: this.rebate,
        rechargeChannel: 3,
        industryId: localStorage.getItem("industryID"),
        mobile: this.input_number,
        payStatus: this.value_accountstate,
        payee: this.form.gatheringp,
        isAbatementLadderDetailed: 1,
        remarks: this.form.desc
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: res.data.result,
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
    //获取账户余额
    memberbalance() {
      this.accounBalance = [];

      var url =
        this.$https.accountHost + "/manage/memberUser/listMemberAccount";
      var params = {
        memberNum: this.$store.state.member.userNumber
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          res.data.result.list.forEach(value => {
            if (value.isQingKe == 0) {
              this.accounBalance.push({
                accountType: value.accountType,
                accountTypeId: value.accountTypeId,
                amount: value.amount,
                isQingKe: value.isQingKe
              });
              var arr = this.accounBalance;

              localStorage.setItem("list", JSON.stringify(arr));
            }
          });
        })
        .catch(err => {
          this.$message.error("获取账户余额请求错误...");
        });
    },
    //划卡
    stampCard() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/updateUserExpUseTimes";
      var params = {
        memberNum: this.$store.state.member.userNumber,
        experiencecardNum: this.cardNum,
        id: this.cardid,
        productCode: this.experiencecardProductCode,
        storeId: localStorage.getItem("storeId"),
        storeName: localStorage.getItem("storeName"),
        productName: this.experiencecardProductName,
        postAndBeautician: "",
        createOperator: localStorage.getItem("trueName"),
        memberName: this.input_name,
        memberMobile: this.input_number
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Failure") {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "error"
            });
          } else {
            this.$message({
              message: "划卡成功",
              type: "success"
            });
          }
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    },
    //选择员工划卡
    staffstampCard() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/updateUserExpUseTimes";
      var params = {
        memberNum: this.$store.state.member.userNumber,
        experiencecardNum: this.cardNum,
        id: this.cardid,
        productCode: this.experiencecardProductCode,
        storeId: localStorage.getItem("storeId"),
        storeName: localStorage.getItem("storeName"),
        productName: this.experiencecardProductName,
        postAndBeautician: JSON.stringify(this.serviceList),
        createOperator: localStorage.getItem("trueName"),
        memberName: this.input_name,
        memberMobile: this.input_number
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result !== null) {
            this.$message({
              message: res.data.result,
              type: "success",
              duration: 2000
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "error"
            });
            // this.visible_details = false;
            // this.visible_carLise = false;
          }
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    },
    //获取员工信息
    employeels() {
      this.currentEmpId = null;
      var url =
        this.$https.dataHost + "/commodityType/selectSubclassByCondition";
      var params = {
        subclassID: this.subClassId,
        storeId: localStorage.getItem("storeId")
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
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
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    }
  },
  created() {
    this.input_name = localStorage.getItem("memberName");
    this.input_number = localStorage.getItem("memberNumber");
    this.grade = localStorage.getItem("grade");
    this.remark = localStorage.getItem("remark");
    this.imageUrl = localStorage.getItem("imageUrl");
    this.accounBalance = JSON.parse(localStorage.getItem("list"));
    // store.commit("usernames",this.input_name)
  },
  mounted() {
    //请求
    this.accounttypeData();
    this.paymentTalp();
    this.rechargepeople();
  }
};
</script>

<style lang='scss' scoped>
.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 200px;
  z-index: 160;
  .concealVIP {
    position: absolute;
    left: 10px;
    top: 5px;
    z-index: 160;
  }
  .aa {
    transition: all 1s;
  }
  .go {
    transform: rotate(-180deg);
    transition: all 1s;
  }
}

.floatBox {
  width: 100%;
  min-width: 1200px;
  height: 200px;
  transition: 1s;
  position: fixed;
  bottom: 0;
  left: 0;

  .revealVIP {
    position: absolute;
    right: 10px;
    top: -50px;
  }
  .memberBox {
    border-top: 1px solid #23a547;
    background: #fafff8;
    width: 100%;
    height: 220px;
    .content {
      width: 1330px;
      height: 140px;
      display: flex;
      margin: 0 auto;
      padding-top: 12px;
      justify-content: space-around;

      .userPhoto {
        width: 100px;
        height: 100px;
        background-color: #eee;
        border-radius: 5px;
        position: relative;
        img {
          width: 100px;
          height: 100px;
        }
        .clear {
          width: 15px;
          height: 15px;
          line-height: 15px;
          border-radius: 4px;
          font-size: 13px;
          position: absolute;
          top: 2px;
          right: 0;
          background: #23a547;
          color: #fff;
          text-align: center;
        }
      }
      .usermessage {
        height: 120px;
        flex: 1;
        margin: 0 15px;
        border-bottom: 1px solid #eee;
        .userNamePoto {
          display: flex;
          .userName-box {
            flex: 1;
            position: relative;
            display: flex;
            label {
              margin-left: 28px;
              line-height: 40px;
              font-size: 16px;
              font-weight: bold;
            }
            .userName-boxs {
              right: 0px;
              height: 40px;
              width: 40px;
              text-align: center;
              line-height: 40px;
              top: 0px;
              position: absolute;
              i {
                font-size: 16px;
                color: #606266;
              }
            }
            .userName-boxs:hover {
              cursor: pointer;
            }
          }
          .el-button {
            width: 90px;
            height: 45px;
          }
          .el-input {
            width: 210px;
            flex: 1;
            border-radius: 4px;
          }
          .el-input:focus {
            border: 1px solid #23a547 !important;
          }
          .gradevip {
            width: 150px;
            height: 40px;
            line-height: 40px;
            margin-left: 15px;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span {
              color: #feb019;
              font-size: 18px;
            }
          }
        }
        .remarkVip {
          display: flex;
          margin-top: 10px;
          margin-left: 28px;
          label {
            line-height: 40px;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(34, 34, 34, 1);
          }
          .el-input {
            width: 800px;
            height: 45px;
            border-radius: 6px;
          }
        }
      }
      .experienCard {
        width: 100px;
        height: 40px;
        margin: 50px 28px 0 0;
      }
      .experienCards {
        width: 100px;
        height: 40px;
        margin: 50px 0 0 15px;
      }
    }
    .accountBalance {
      display: flex;
      width: 1200px;
      margin: 0 auto;
      height: 50px;
      clear: both;
      .spans {
        width: 100px;
        height: 18px;
        font-size: 18px;
        line-height: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        padding: 10px;
        color: rgba(0, 0, 0, 1);
      }
      .accountCenter {
        width: 900px;
        height: 50px;
        float: left;
        overflow-y: hidden;
        overflow-x: scroll;
        white-space: nowrap;
        .savingBale {
          height: 50px;
          min-width: 150px;
          display: inline-block;
          margin: 10px 0 20px 10px;
          label {
            height: 16px;
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(0, 0, 0, 1);
          }
          span {
            height: 16px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(254, 176, 25, 1);
          }
        }
      }
      /* 滚动槽的样式设置 */
      .accountCenter::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgb(116, 240, 68);
      }
      /* 滚动条滑块的样式设置 */
      .accountCenter::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset 0 0 6px rgb(195, 247, 7);
      }
    }
  }
}
//弹出框
//出入库弹出框
.storageblock {
  width: 100%;
  .stgblcktop {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .stgblcktopmain {
    width: 90%;
    margin: 0 auto;
    max-height: 500px;
    overflow: auto;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    // box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    .el-table__header {
      background-color: #23a547;
    }
    li {
      padding: 18px 0 0 18px;
      font-size: 16px;
    }
  }
}
//充值弹出框
.storageblockk {
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
.storageblock2 {
  width: 100%;
  .stgblcktop {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .stgblcktopmain {
    width: 90%;
    margin: 0 auto;
    max-height: 465px;
    overflow: auto;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
  }
}
.storageblock3 {
  width: 100%;
  .stgblcktop {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .stgblcktopmain {
    width: 90%;
    margin: 0 auto;
    overflow: auto;
    border-top: 0.5px solid rgba(220, 220, 220, 0.7);
    // box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    .el-table__header {
      background-color: #23a547;
    }
    li {
      padding: 18px 0 0 18px;
      font-size: 16px;
    }
  }
}
.aa {
  cursor: pointer;
}
.red {
  background-color: #f4f4f4;
}
//弹框
.servicePop {
  .top {
    padding: 5px 15px;
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
      height: 250px;
      padding-left: 20px;
      background: #f4f4f4;

      .tit {
        position: relative;
        line-height: 40px;
        padding: 0 10px;
        font-size: 15px;
        font-weight: 700;
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
//定制项目划卡弹框
.servicecust {
  .top {
    width: 100%;
    height: 30px;
    font-weight: 550;
    font-size: 20px;
    text-align: center;
  }
  .main {
    padding: 0 15px;
  }
}
//项目定制详情里面划卡
.servicecutbs {
  .top {
    width: 100%;
    height: 30px;
    font-weight: 550;
    font-size: 20px;
    text-align: center;
  }
  .main {
    padding: 0 15px;
  }
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: opacity 1s;
}
</style>
  <style >
/* 公共的移入列表样式 */
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #e3fbe6 !important;
}
</style>