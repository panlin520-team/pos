<!-- 弹框Modal组件 -->
<template>
  <div class="floatBox" v-if="$route.meta.menubar">
    <div style="display:flex">
      <div class="concealVIP" @click="clickconceal">
        <img
          :class="[rotate?'fa fa-arrow-down go':'fa fa-arrow-down aa']"
          src="../src/assets/images/icon_cbl.png"
          alt
        />
      </div>
    </div>
    <transition name="fade">
      <div class="memberBox" v-if="show_box">
        <div class="content">
          <div class="userPhoto">
            <img src="./assets/images/default-icon.png" alt width="110" height="110" />
          </div>
          <div class="usermessage">
            <div class="userNamePoto">
              <label>姓名：</label>
              <div class="userName-box">
                <el-input v-model="input_name" placeholder="请输入姓名"></el-input>
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
              <label>联系电话：</label>
              <div class="userName-box">
                <el-input v-model="input_number" placeholder="请输入手机号"></el-input>
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
              <el-input v-model="input_matter" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="experienCard">
            <el-button type="warning" @click="show_carLise">体验卡</el-button>
          </div>
          <PopOver
            custom-class="storageblock"
            :visible.sync="visible_carLise"
            @close="close_carLise"
            width="500px"
          >
            <div class="stgblcktop" slot="top">体验卡信息</div>
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
                custom-class="storageblock"
                :visible.sync="visible_details"
                @close="close_details"
                width="900px"
              >
                <div class="stgblcktop" slot="top">卡信息</div>
                <div class="stgblcktopmain" slot="main">
                  <el-table :data="tableData_details" style="width: 100%">
                    <el-table-column label="项目名称" width="230">
                      <template slot-scope="scope">
                        <div
                          slot="reference"
                          class="name-wrapper"
                        >{{ scope.row.experiencecardProductName }}</div>
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
                      <div
                        class="default"
                        v-if="item.setEmpName==undefined || item.setEmpName=='' "
                      >
                        <span>{{item.postCategoryName}}</span>(选填)
                      </div>
                      <div class="active" v-if="item.setEmpName!=''">
                        <span>{{item.setEmpName}}</span>
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
        <div class="accountBalance">
          <span>账户信息：</span>
          <div class="savingBale" v-for="item in accounBalance" :key="item.index">
            <label>{{item.accountType}}：</label>
            <span>{{item.amount}}</span>元
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  components: {
    MenuBar
  },
  data() {
    return {
      logo: require("@/assets/images/logo.png"),
      // 浏览器可视高度
      virtualHeight: window.innerHeight,
      //显示与隐藏
      show_box: true,
      message: "显示会员",
      //输入姓名
      input_name: "",
      //输入手机号
      input_number: "",
      //备注内容
      input_matter: "",
      accountType: "",
      //员工编号
      subClassId: "",
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
      //会员等级
      grade: "",
      rotate: false,
      //搜索数据
      tableData_vippeple: [],
      //查看体验卡
      tableData_carLise: [
        {
          cardName: "哈哈哈哈哈"
        }
      ],
      //账户信息余额
      accounBalance: [],
      //查看体验卡详情
      tableData_details: [],

      // 项目当前工种下已选员工id
      currentEmpId: null
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
            postCategoryId: list[i].postCategoryId,
            beauticianId: list[i].setEmpId,
            beauticianName: list[i].setEmpName
          });
        }
      }

      // var params = {
      //   // 项目所需员工与职位
      //   postAndBeautician: arr
      // };
      this.serviceList = arr;
      console.log("serviceList", this.serviceList);

      //判断
      if (this.serviceList.length !== this.empSet.length) {
        this.$message({
          message: "警告哦，请选择全对应员工...",
          type: "warning"
        });
      } else {
        this.staffstampCard();
        this.servicePopover = false;
        console.log(this.useTimes);
        console.log(this.totalTimes);
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
        console.log("res", res);
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
    //点击显示与隐藏
    clickconceal() {
      this.show_box = !this.show_box;

      this.rotate = !this.rotate;
      // if (this.show_box) {
      //   this.message = "隐藏会员";
      // } else {
      //   this.message = "显示会员";
      // }
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
    //确定划卡
    vipexdetails(res) {
      this.subClassId = res.subClassId;
      this.experiencecardProductCode = res.experiencecardProductCode;
      this.experiencecardProductName = res.experiencecardProductName;
      this.experiencecardProductType = res.experiencecardProductType;
      this.useTimes = res.useTimes;
      this.totalTimes = res.totalTimes;
      console.log(this.experiencecardProductType);
      if (this.experiencecardProductType == 1) {
        this.stampCard();
        if (res.useTimes < res.totalTimes) {
          res.useTimes += 1;
        } else {
          res.useTimes = res.totalTimes;
          this.$message({
            message: "警告哦，不能划卡了哟...",
            type: "warning"
          });
        }
      } else {
        if (res.useTimes < res.totalTimes) {
          res.useTimes += 1;
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
      console.log(res);
      this.cardNum = res.cardNum;
      this.memberNum = res.memberNum;
      this.grade = res.membershipLevelName;
      this.input_name = res.name;
      this.input_number = res.mobile;
      // 设置本地存储
      localStorage.setItem("memberName", this.input_name);
      localStorage.setItem("memberNumber", this.input_number);
      localStorage.setItem("membership", this.memberNum);
      localStorage.setItem("grade", this.grade);

      console.log(this.memberNum);

      this.memberbalance();
      this.visible_care = false;
    },
    //查看体验卡详情
    vipecarLise(res) {
      this.memberdetails();

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
          console.log(res.data);

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
          console.log(res.data);
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
    //获取会员卡详情
    memberdetails() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/selectExpCardUser";
      var params = {
        memberNum: this.memberNum
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          console.log(res.data.result);
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
    //获取账户余额
    memberbalance() {
      var url =
        this.$https.accountHost + "/manage/memberUser/listMemberAccount";
      var params = {
        memberNum: this.memberNum
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          console.log(res.data.result.list);
          var arr = res.data.result.list;
          localStorage.setItem("list", JSON.stringify(arr));
          // localStorage.setItem("list", res.data.result.list);

          this.accounBalance = res.data.result.list;
        })
        .catch(err => {
          this.$message.error("获取账户余额请求错误...");
        });
      // console.log(this.accounBalance);
      // debugger
    },
    //划卡
    stampCard() {
      var url =
        this.$https.storeHost + "/manage/experienceCard/updateUserExpUseTimes";
      var params = {
        memberNum: this.memberNum,
        experiencecardNum: this.cardNum,
        productCode: this.experiencecardProductCode,
        storeId: localStorage.getItem("storeId"),
        storeName: localStorage.getItem("storeName"),
        productName: this.experiencecardProductName,
        postAndBeautician: ""
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          console.log(res);
          if (this.useTimes < this.totalTimes) {
            this.$message({
              message: res.data.responseStatusType.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "error"
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
        memberNum: this.memberNum,
        experiencecardNum: this.cardNum,
        productCode: this.experiencecardProductCode,
        storeId: localStorage.getItem("storeId"),
        storeName: localStorage.getItem("storeName"),
        productName: this.experiencecardProductName,
        postAndBeautician: JSON.stringify(this.serviceList)
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          console.log(res);
          if (res.data.result) {
            this.$message({
              message: res.data.responseStatusType.message,
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "error"
            });
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
        subclassID: this.subClassId
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          console.log("选择员工", res.data.result.list[0].postCategoryVOList);
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
          console.log(this.empSet);
        })
        .catch(err => {
          //   this.$message.error("体验卡列表提交请求错误...");
        });
    }
  },
  created() {
    console.log(localStorage.getItem("memberName"));
    console.log(this.tableData_carLise);

    this.input_name = localStorage.getItem("memberName");
    this.input_number = localStorage.getItem("memberNumber");
    this.grade = localStorage.getItem("grade");
    this.accounBalance = JSON.parse(localStorage.getItem("list"));
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>