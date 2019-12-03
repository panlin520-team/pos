<!-- 员工预约 -->
<template>
  <div class="reservation">
    <!-- 标题、日期、查询、添加  -->
    <div class="header">
      <div class="title">员工预约</div>
      <div class="date">
        <el-date-picker
          v-model="date"
          type="date"
          :editable="false"
          :clearable="false"
          align="center"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="dateChange()"
          style="font-size: 18px;"
        ></el-date-picker>
      </div>
      <el-button
        type="success"
        icon="el-icon-plus"
        circle
        @click="reservationFill = true;clientDialog =true;"
      ></el-button>
    </div>

    <!-- 时间轴  -->
    <div class="timeline">
      <div class="blank"></div>
      <div class="times" ref="scroll" @scroll="handleScroll()">
        <div class="timeItem" v-for="(item,index) in timeItems" :key="item">{{item}}</div>
      </div>
    </div>

    <!-- 预约排表 -->
    <div class="gantt">
      <!-- 员工   -->
      <div class="employee">
        <div class="employeeItem" v-for="(item,index) in employeeList" :key="index">
          <div class="name">{{item.name}}</div>
          <div class="job">{{item.postName}}</div>
        </div>
      </div>
      <!-- 预约表格  -->
      <div class="timeRank" ref="scroll2" @scroll="handleScroll2()">
        <div class="rankItems" v-for="(item,index) in timeItems" :key="item" :data-time="item">
          <div class="rankItemColl">
            <div
              class="rankItem"
              v-for="(item,index) in employeeList"
              :key="index"
              @click="reserveFill($event,item.name)"
            ></div>
          </div>
        </div>

        <!-- 预约信息表 -->
        <div
          class="reserveItem"
          v-for="(item,index) in reserveList"
          :class="[{'reserved':item.appointmentStatus===0},{'bill':item.appointmentStatus===1},{'occupy':item.appointmentStatus===2},{'rest':item.appointmentStatus===3},{'dated':item.appointmentStatus===4}]"
          :style="{'z-index': 100+item.sortIndex,'width': item.width+ 'px','top': item.top+'px','left': item.left+'px'}"
          @click="reserveDetail(item.appointmentId)"
        >
          <div class="name nowrap">{{item.consumer}}</div>
          <div class="phone nowrap">{{item.consumerPhone}}</div>
          <div class="projects nowrap">{{item.productName}}</div>
        </div>

        <!-- 时间截止线 -->
        <!-- <div class="timeline" :style="{'left': timeLine+ 'px'}"></div> -->
      </div>
    </div>

    <!-- 预约状态说明   -->
    <div class="status">
      <div class="statusItem">
        <label class="label-reserved"></label>已预约
      </div>
      <div class="statusItem">
        <label class="label-bill"></label>已开单
      </div>
      <div class="statusItem">
        <label class="label-occupy"></label>已占用
      </div>
      <div class="statusItem">
        <label class="label-rest"></label>已调休
      </div>
      <div class="statusItem">
        <label class="label-dated"></label>已过期
      </div>
    </div>

    <!-- 对话框 --- 预约信息 -->
    <el-dialog
      :visible.sync="reserveDialog"
      width="500px"
      v-for="item in reserveDetails"
      :key="item.appointmentId"
      append-to-body
    >
      <div slot="title" class="dialog-title">预约信息</div>
      <div class="btn btn-edit" v-if="item.appointmentStatus == 0">编辑</div>
      <div class="reserveDetail">
        <div class="content">
          <div class="contentItem">
            <label>顾客姓名</label>
            <div class="val">{{item.consumer}}</div>
          </div>
          <div class="contentItem">
            <label>顾客电话</label>
            <div class="val">{{item.consumerPhone}}</div>
          </div>
          <div class="contentItem">
            <label>预约项目</label>
            <div class="val">{{item.productName}}</div>
          </div>
        </div>
        <div class="content editContent">
          <div class="contentItem">
            <label>预约员工</label>
            <div class="val">{{item.employee}}</div>
          </div>
          <div class="contentItem">
            <label>到店日期</label>
            <div class="val">{{item.nursingTime}}</div>
          </div>
          <div class="contentItem">
            <label>预约时长</label>
            <div class="val">{{item.duration}}分钟</div>
          </div>
          <div class="contentItem">
            <label>预约备注</label>
            <div class="val">{{item.remark}}</div>
          </div>
        </div>
      </div>
      <div slot="footer" class="btnGroup">
        <div
          class="btn btn-cancel"
          v-if="item.appointmentStatus==0"
          @click="cancelReserve(item.appointmentId)"
        >取消预约</div>
        <div class="btn btn-order" v-if="item.appointmentStatus==0">开单</div>
        <div class="btn btn-ordered" v-else="item.appointmentStatus==1">已开单</div>
      </div>
    </el-dialog>

    <!-- 选择员工 -->
    <el-dialog title="选择员工" :visible.sync="employeeDialog" append-to-body>
      <div slot="title" class="dialog-title">选择员工</div>
    </el-dialog>

    <!-- 选择日期 -->
    <el-dialog title="选择日期时间" :visible.sync="dateDialog" append-to-body>
      <div slot="title" class="dialog-title">选择日期时间</div>
      <el-calendar>
        <template slot="dateCell" slot-scope="{date, data}">
          <div
            class="calendar"
            @click="show(data.day)"
            :class="data.isSelected ? 'selected' : ''"
          >{{ data.day.split('-').slice(2).join('-') }}</div>
        </template>
      </el-calendar>
    </el-dialog>

    <el-dialog :visible.sync="timeDialog" append-to-body>
      <div slot="title" class="dialog-title">选择时间</div>
    </el-dialog>

    <!-- 选择时长 -->
    <el-dialog title="选择时长" :visible.sync="durationDialog" append-to-body>
      <div slot="title" class="dialog-title">选择时长</div>
      <div class="durationDialog">
        <el-slider
          class="slider"
          v-model="duration"
          :step="30"
          :max="300"
          show-stops
          :show-tooltip="false"
        ></el-slider>
        <div class="marks">
          <div class="marks-min">30分钟</div>
          <div class="marks-max">300分钟</div>
        </div>
        <div class="duration">
          已选择时长:
          <span>{{duration}}</span>分钟
        </div>
      </div>
      <div slot="footer" class="footer">
        <div class="btn btn-submit" @click="durationAffirm(duration)">确认</div>
      </div>
    </el-dialog>

    <!-- 会员查询 -->
    <el-dialog :visible.sync="clientDialog" width="700px" append-to-body>
      <div slot="title" class="dialog-title">会员查询</div>
      <div class="clientDialog">
        <div class="search">
          <el-select v-model="employeeValue" class="select-search">
            <el-option
              v-for="item in employeeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input :placeholder="employeeText" v-model="employees" class="input-search"></el-input>
          <div class="btn-search" @click="selectStoreMember(employees)">查询</div>
        </div>
        <!-- 查询结果表格 -->
        <div class="result">
          <el-table :data="clientList" style="width: 100%" v-if="clientList != ''">
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
    </el-dialog>

    <!-- 新建会员 -->
    <el-dialog :visible.sync="clientCreateDialog" width="500px" append-to-body>
      <div slot="title" class="dialog-title">会员新建</div>
      <div class="member">
        <div class="content">
          <div class="contentItem">
            <label>顾客电话</label>
            <div class="val">
              <input type="text" placeholder="输入电话" v-model="member.mobile" />
            </div>
          </div>
          <div class="contentItem">
            <label>顾客姓名</label>
            <div class="val">
              <input type="text" placeholder="输入姓名" v-model="member.name" />
            </div>
          </div>
          <div class="contentItem">
            <label>身份证号</label>
            <div class="val">
              <input type="text" placeholder="输入身份证号" v-model="member.idCard" />
            </div>
          </div>
          <div class="contentItem">
            <label>顾客性别</label>
            <div class="val">
              <el-radio-group v-model="member.sex" size="mini">
                <el-radio-button label="0">男</el-radio-button>
                <el-radio-button label="1">女</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="contentItem">
            <label>进店渠道</label>
            <div class="val">
              <el-radio-group size="mini" v-model="member.enterChannel">
                <el-radio-button
                  v-for="(item,index) in channels"
                  :label="index"
                  :key="index"
                >{{item}}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="contentItem">
            <label>会员备注</label>
            <div class="val">
              <input type="text" placeholder="备注" v-model="member.remark" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer btnGroup">
        <div class="btn btn-order" @click="addStoreMember()">新建</div>
      </div>
    </el-dialog>

    <!--  预约项目，客户信息  -->
    <el-collapse-transition>
      <div class="reservationFill" v-if="reservationFill">
        <!--  项目  -->
        <div class="project">
          <!--  项目展示控制  -->
          <div class="projectControl">
            <!-- 返回 -->
            <div class="btn btn-close" @click="reservationFill = false">
              <i class="el-icon-close"></i>
            </div>
            <div class="menu">
              <div class="menuItem">门店项目</div>
            </div>
          </div>
          <!--  项目展示  -->
          <div class="contentField">
            <!--  项目分类  -->
            <div class="category">
              <div
                v-for="(item,index) in category"
                :key="index"
                class="categoryItem"
                :class="item.subclassID === categoryId ? 'select': ''"
                @click="categorySearch(item.subclassID)"
              >{{item.subclassName}}</div>
            </div>
            <!--  项目分类展示  -->
            <div class="service" :style="{'height': virtualHeight+'px'}">
              <div
                class="serviceItem"
                v-for="(item,index) in categoryList"
                :key="index"
                @click="addProject(item.productName)"
              >
                <div class="name">{{item.productName}}</div>
                <div class="price">¥{{item.retailPrice}}</div>
              </div>
            </div>
          </div>
        </div>

        <!--  预约信息填写  -->
        <div class="client" :style="{'height': virtualHeight+'px'}">
          <div class="topBand">
            <div class="title">
              <div
                class="titleItem"
                :class="reservationForm.vip ? '' : 'select'"
                @click="showClient()"
              >新客</div>
              <div
                class="titleItem"
                @click="clientDialog = true"
                :class="reservationForm.vip ? 'select' : ''"
              >会员</div>
            </div>
          </div>

          <div class="content vip" v-if="reservationForm.vip == true">
            <div class="contentItem">
              <div class="name">{{reservationForm.consumerName}}</div>
              <div class="id">{{reservationForm.idCard}}</div>
            </div>
          </div>

          <div class="content" :class="reservationForm.vip ? '' : 'newClient'">
            <div class="contentItem">
              <label>顾客电话</label>
              <input type="text" placeholder="输入顾客电话" v-model="reservationForm.consumerPhone" />
            </div>
            <div class="contentItem">
              <label>顾客姓名</label>
              <input type="text" placeholder="输入顾客姓名" v-model="reservationForm.consumerName" />
            </div>
            <div
              class="createClient"
              v-if="reservationForm.vip != true"
              @click="clientCreateDialog =true;member.mobile=reservationForm.consumerPhone;member.name=reservationForm.consumerName"
            >新会员</div>
          </div>

          <div class="content">
            <div class="contentItem">
              <label>预约员工</label>
              <div class="select" @click="employeeDialog =true">{{reservationForm.employee}}</div>
              <div class="btn-select">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <div class="contentItem">
              <label>预约时间</label>
              <div
                class="select"
                @click="dateDialog = true"
              >{{reservationForm.date}} {{reservationForm.time}}</div>
              <div class="btn-select">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <div class="contentItem">
              <label>预约时长</label>
              <div class="select" @click="durationDialog =true">{{reservationForm.duration}}分钟</div>
              <div class="btn-select">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <div class="contentItem">
              <label>预约备注</label>
              <div class="select pdr10">
                <textarea maxlength="100" placeholder="请输入内容" v-model="reservationForm.remark"></textarea>
              </div>
            </div>
          </div>

          <div class="projects">
            <div class="title">预约项目</div>
            <div class="projectsItem" v-for="(item,index) in projects" :key="index">
              <div class="btn-delete" @click="deleteProject(index)">
                <i class="el-icon-circle-close"></i>
              </div>
              <label class="name">{{item}}</label>
            </div>
          </div>

          <div class="btn btn-submit">预约</div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      // 数据
      // 默认日期
      date: this.dateFormat(),
      // 开始时间
      startTime: 0,
      // 结束时间
      endTime: 0,
      // 默认时长
      duration: 30,
      // 时间线
      timeLine: "",
      // 时间段
      timeItems: [],
      // 员工
      employeeList: [],
      // 预约排班表
      reserveList: [],
      // 预约信息
      reserveDetails: "",
      // 门店项目分类
      categoryId: 1,
      category: [],
      // 门店项目分类产品
      categoryList: [],
      // 预约信息集合
      reservationForm: {},
      projects: [],
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
      // 职位列表
      employeeJob: [],
      // 职位列表下员工
      employeeLise: [],
      // 新建会员
      member: {
        mobile: "",
        name: "",
        sex: 1,
        remark: "",
        enterChannel: 1
      },
      // 会员来源
      channels: [],

      // 对话框
      // 预约详细对话框
      reserveDialog: false,
      // 选择员工
      employeeDialog: false,
      // 选择日期
      dateDialog: false,
      // 选择时间
      timeDialog: false,
      // 选择时长
      durationDialog: false,
      // 会员查询
      clientDialog: false,
      // 新建会员
      clientCreateDialog: false,

      // 页面弹出层
      // 预约信息填写
      reservationFill: false,

      // 浏览器可视高度
      virtualHeight: ""
    };
  },
  created() {
    // 时间段
    this.timeline();
    // 员工预约
    this.getReserve(this.date);
    // 门店项目
    this.categoryData(1);
    // 浏览器窗口可视高度
    window.addEventListener("resize", this.getHeight);
    // this.getHeight();
    // 新建会员来源
    this.memberChannel();
  },
  mounted() {
    // 每分钟执行一次时间线查询
    setInterval(this.timeSlot, 1000 * 60);
  },
  beforeDestroy() {
    // 清除计时器
    clearInterval(this.timeSlot);
    // 取消滚动
  },
  destroyed() {
    // 销毁监听浏览器窗口可视高度
    window.removeEventListener("resize", this.getHeight);
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
    // 开始预约
    reserveFill(e, i) {
      var virtualDate = Date.parse(
        this.date +
          " " +
          e.currentTarget.parentElement.parentElement.dataset.time
      );
      var nowDate = Date.parse(new Date());
      if (virtualDate < nowDate) {
        this.$message({
          message: "该时间已过，不能预约！",
          type: "warning"
        });
      } else {
        this.reservationForm = {
          date: this.date,
          time: e.currentTarget.parentElement.parentElement.dataset.time,
          employee: i,
          duration: 30,
          storeNumber: 1
        };
        this.reservationFill = true;
        this.clientDialog = true;
      }
    },

    // 日历显示
    show(e) {
      // console.log(e);
    },

    // 显示新客界面
    showClient() {
      // 保证属性改变，使视图更新
      this.$set(this.reservationForm, "vip", false);
    },

    // 确认选择会员信息
    handleAffirm(row) {
      if (row != "") {
        this.clientDialog = false;
        this.$set(this.reservationForm, "vip", true);
        this.reservationForm.consumerPhone = row.mobile;
        this.reservationForm.consumerName = row.name;
        this.reservationForm.idCard = row.idCard;
      }
    },

    // 新建(添加)门店会员
    addStoreMember(sex, remark, memberNum, mobile, name, idCard, enterChannel) {
      var url = this.$https.accountHost + "/storeMember/addStoreMember";
      var params = {
        mobile: this.member.mobile,
        name: this.member.name,
        idCard: this.member.idCard,
        sex: this.member.sex,
        enterChannel: this.member.enterChannel,
        remark: this.member.remark,
        storeId: 1
      };

      if (params.name == "") {
        this.$message({
          message: "姓名不能为空",
          type: "warning"
        });
        return false;
      }

      if (!/^1[34578]\d{9}$/.test(params.mobile)) {
        this.$message({
          message: "手机号码格式错误",
          type: "warning"
        });
        return false;
      }

      if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(params.idCard)) {
        this.$message({
          message: "身份证号码格式错误",
          type: "warning"
        });
        return false;
      }

      console.log("params", params);

      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.clientCreateDialog = false;
            this.$set(this.reservationForm, "vip", true);
            this.reservationForm.consumerPhone = res.data.result.mobile;
            this.reservationForm.consumerName = res.data.result.name;
            this.reservationForm.idCard = res.data.result.idCard;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("新建会员失败");
        });
    },

    // 会员来源
    memberChannel() {
      var url =
        this.$https.accountHost + "/manage/pos/member/selectEnterChannel";
      this.$https
        .fetchPost(url)
        .then(res => {
          if (res.data.result) {
            this.channels = res.data.result;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error("会员来源数据获取失败");
        });
    },

    // 根据姓名或电话获取会员信息
    selectStoreMember(i) {
      var url = this.$https.accountHost + "/manage/pos/member/selectStoreMemberByPhoneOrName";
      var params = {};
      if (i != "") {
        if (this.employeeValue === 0) {
          params = {
            mobile: i,
            storeId: 1
          };
          this.$https
            .fetchPost(url, params)
            .then(res => {
              if (res.data.result.list) {
                this.clientList = res.data.result.list;
              } else {
                this.$message({
                  message: res.data.responseStatusType.error.errorMsg,
                  type: "warning"
                });
              }
            })
            .catch(err => {
              this.$message.error("会员信息查询失败");
            });
        } else if (this.employeeValue === 1) {
          params = {
            name: i,
            storeId: 1
          };
          this.$https
            .fetchPost(url, params)
            .then(res => {
              if (res.data.result.list) {
                this.clientList = res.data.result.list;
              } else {
                this.$message({
                  message: res.data.responseStatusType.error.errorMsg,
                  type: "warning"
                });
              }
            })
            .catch(err => {
              this.$message.error("会员信息查询失败");
            });
        }
      } else {
        this.$message({
          message: "输入内容不能为空",
          type: "warning"
        });
      }
    },

    // 添加门店项目至预约信息
    addProject(i) {
      console.log(i);
      this.projects.push(i);
    },

    // 删除门店项目至预约信息
    deleteProject(i) {
      console.log(i);
      this.projects.splice(i, 1);
    },

    // 门店项目分类产品
    categorySearch(id, postId, postLevel) {
      var url =
        this.$https.productHost + "/manage/product/selectProductByCondition";
      var params = { subClassID: id, postId: 1, postLevel: 1 };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.categoryList = res.data.result;
            this.categoryId = id;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("门店项目产品数据获取失败");
        });
    },

    // 门店项目分类
    categoryData(id) {
      var url =
        this.$https.dataHost + "/commodityType/selectSubclassByCondition";
      var params = {
        industryID: id
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.category = res.data.result.list;
            this.categorySearch(res.data.result.list[0].subclassID, 1, 1);
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("门店项目分类数据获取失败");
        });
    },

    // 预约详细
    reserveDetail(id) {
      var url =
        this.$https.storeHost + "/manage/appointment/selectAppointmentByWhere";
      var params = {
        appointmentId: id
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.reserveDialog = true;
            this.reserveDetails = res.data.result.list;
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("预约详细数据获取失败");
        });
    },

    // 取消预约
    cancelReserve(id) {
      var url = this.$https.storeHost + "/manage/appointment/cancelAppointment";
      var params = {
        appointmentId: id,
        modifyOperator: "吕布"
      };

      this.$confirm("确定取消该预约吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$https
            .fetchPost(url, params)
            .then(res => {
              if (res.data.responseStatusType.message == "Success") {
                this.$message({
                  message: "取消成功",
                  type: "success"
                });
                this.reserveDialog = false;
                this.getReserve(this.date);
              } else {
                this.$message.error(res.data.responseStatusType.error.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("预约取消失败");
            });
        })
        .catch(() => {});
    },

    // 员工表与当前预约
    getReserve(time) {
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianList";
      var params = {
        nursingDate: time
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          var self = this;
          if (res.data.result) {
            this.employeeList = res.data.result.list;
            // 清空原排班数组
            this.reserveList = [];
            var list = res.data.result.list;
            var res = [];
            for (var i = 0; i < list.length; i++) {
              var top = i * 105;
              var list2 = list[i].appointmentList;
              for (var j = 0; j < list2.length; j++) {
                this.reserveList.push(list2[j]);
                var width = (list2[j].duration / 30) * 135;
                var timeArrs = list2[j].nursingTime.split(" ");
                var startArr = timeArrs[1].split(":");
                var left =
                  (parseInt(startArr[0]) - this.startTime) * 270 +
                  parseInt(startArr[1] / 30) * 135;
                res.push({
                  width: width,
                  left: left,
                  top: top
                });
              }
            }
            for (var k = 0; k < res.length; k++) {
              this.reserveList[k].width = res[k].width;
              this.reserveList[k].left = res[k].left;
              this.reserveList[k].top = res[k].top;
            }
          }
        })
        .catch(err => {
          this.$message.error("当前预约排班信息获取失败");
        });
    },

    // 工作时间段
    timeline() {
      var url = this.$https.storeHost + "/manage/store/selectStoreById";
      var params = {
        storeId: 1
      };
      this.$https
        .fetchPost(url, params)
        .then(res => {
          var shopBusinessTime = res.data.result.shopBusinessTime;
          var start = parseInt(shopBusinessTime.split("-")[0]);
          var end = parseInt(shopBusinessTime.split("-")[1]);

          this.startTime = start;
          this.endTime = end;
          // 半小时
          for (var i = start; i < end; i++) {
            this.timeItems.push((i > 9 ? i : "0" + i) + ":" + "30");
          }
          //  整点
          for (let i = start; i <= end; i++) {
            this.timeItems.push((i > 9 ? i : "0" + i) + ":" + "00");
          }
          // 排序 00 ~ 30 ~ 00
          this.timeItems.sort();
          this.timeSlot();
        })
        .catch(err => {
          this.$message.error("工作时间段数据获取失败");
        });
    },

    // 确认选择时长
    durationAffirm(i) {
      if (i != 0) {
        this.durationDialog = false;
        this.reservationForm.duration = i;
      } else {
        this.$message({
          message: "请选择时长",
          type: "warning"
        });
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

    // 时间线
    timeSlot() {
      var date = new Date();
      // 计算时间线位置
      this.timeLine =
        (date.getHours() - this.startTime) * 270 + date.getMinutes() * 4.5;
    },

    // 获取日期选定值查询当天排班
    dateChange() {
      this.getReserve(this.date);
    },

    // 修改日期选择框日期格式
    dateFormat() {
      var date = new Date();
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() > 9 ? date.getDate() + " " : "0" + date.getDate();
      return Y + M + D;
    },

    // 日期转字符串
    dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var res = year + "/" + month + "/" + day;
      return res;
    },
    // get height
    getHeight() {
      this.virtualHeight = window.innerHeight;
    }
  }
};
</script>

<style lang='scss' scoped>
/* 标题、日期、查询、添加 */
.header {
  position: fixed;
  top: 0;
  left: 150px;
  right: 0;
  padding: 35px 20px 10px 20px;
  height: 85px;
  line-height: 40px;
  z-index: 100;
  display: flex;
  background: #ffffff;

  .title {
    font-size: 24px;
  }

  .date {
    flex: 1;
    text-align: center;
  }
}

/* 时间段 */
.timeline {
  position: fixed;
  top: 85px;
  left: 150px;
  right: 0;
  z-index: 100;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  background: #ffffff;

  .blank {
    width: 190px;
  }

  .times {
    flex: 1;
    overflow-x: auto;

    .timeItem {
      text-align: left;
      padding-left: 10px;
      display: inline-block;
      font-size: 20px;
      cursor: pointer;
      width: 135px;
      line-height: 40px;
    }
  }
}

// 排班表
.gantt {
  position: relative;
  display: flex;
  padding-top: 137px;

  .employee {
    position: relative;
    z-index: 10;
    width: 190px;
    background: #ffffff;

    .employeeItem {
      width: 190px;
      height: 105px;
      background: #f4f4f4;
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

  .timeRank {
    position: relative;
    z-index: 1;
    flex: 1;
    line-height: 40px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    background: #ffffff;

    .rankItems {
      width: 135px;
      display: inline-block;

      .rankItem {
        width: 135px;
        height: 105px;
        background: #ffffff;
        border-bottom: 1px solid #9a9a9a;
        border-right: 1px dashed #9a9a9a;
        cursor: pointer;
      }
    }

    .reserveItem {
      position: absolute;
      height: 105px;
      border-left: 2px solid #52bd3a;
      padding: 15px;
      line-height: 23px;
      cursor: pointer;

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
      &.occupy {
        border-color: rgb(244, 78, 78);
        color: rgb(244, 78, 78);
        background: rgba(244, 78, 78, 0.3);
      }
      &.rest {
        border-color: rgb(145, 197, 255);
        color: rgb(145, 197, 255);
        background: rgba(145, 197, 255, 0.3);
      }
      &.dated {
        border-color: rgb(138, 138, 138);
        color: rgb(138, 138, 138);
        background: rgba(138, 138, 138, 0.3);
      }
      .nowrap {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .timeline {
      position: absolute;
      top: 0;
      bottom: 15px;

      width: 1px;
      background: #f44e4e;
    }
  }
}

/* 状态说明 */
.status {
  position: fixed;
  right: 15px;
  bottom: 15px;
  display: flex;
  width: 310px;
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

      /* 已开单 */
      &.label-bill {
        background: #edb339;
      }

      /* 已占用 */
      &.label-occupy {
        background: #f44e4e;
      }

      /* 已调休 */
      &.label-rest {
        background: #91c5ff;
      }

      /* 已过期 */
      &.label-dated {
        background: #8a8a8a;
      }
    }
  }
}

// 预约信息
.reserveDetail {
  border-top: 1px solid #f4f4f4;
  padding: 10px 15px;

  .content {
    border-bottom: 1px solid #f4f4f4;

    .contentItem {
      display: flex;
      padding: 15px 0;

      label {
        width: 80px;
        color: #8a8a8a;
      }

      .val {
        flex: 1;
        text-align: right;
      }
    }
  }
}

.member {
  border-top: 1px solid #f4f4f4;
  padding: 10px 15px;

  .content {
    border-bottom: 1px solid #f4f4f4;

    .contentItem {
      display: flex;
      padding: 15px 0;

      label {
        color: #8a8a8a;
      }

      .val {
        flex: 1;
        text-align: right;
      }

      input {
        border: 0;
        width: 100%;
        text-align: right;
        font-size: 14px;
      }
    }
  }
}

// 会员查询对话框
.clientDialog {
  height: 300px;
  overflow-y: auto;

  .search {
    width: 500px;
    height: 40px;
    margin: 0 auto;
    margin-bottom: 20px;
    display: flex;

    .select-search {
      width: 80px;
      margin-right: 10px;
    }

    .input-search {
      width: 280px;
      margin-right: 10px;
    }

    .btn-search {
      cursor: pointer;
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #ffffff;
      background: #23A547;
    }
  }
  .result {
    width: 500px;
    margin: 0 auto;
  }
}

/* 预约项目，客户信息 */
.reservationFill {
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 100;
  /* 项目 */
  .project {
    flex: 1;
    overflow: hidden;
    /* 项目展示控制 */
    .projectControl {
      position: relative;
      padding: 35px 50px 10px 50px;
      line-height: 40px;
      z-index: 10;
      .btn-close {
        position: absolute;
        top: 35px;
        left: 12px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 25px;
      }

      .menu {
        text-align: center;
      }
      .menuItem {
        display: inline-block;
        position: relative;
        padding: 0 15px;
        &.select {
          color: #23A547;
          &:after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            width: 22px;
            height: 2px;
            background: #23A547;
            margin: 0 auto;
          }
        }
      }
    }

    /* 项目展示 */
    .contentField {
      position: relative;
      overflow: hidden;
      padding: 10px;

      .category {
        background: #f4f4f4;
        padding: 0 15px;
        margin-bottom: 15px;
        z-index: 10;
        line-height: 40px;
        border-radius: 5px;
        overflow: hidden;
        .categoryItem {
          position: relative;
          display: inline-block;
          text-align: center;
          padding: 0 18px;
          height: 44px;
          &.select {
            color: #23A547;
          }
        }
      }
      .serviceItem {
        position: relative;
        float: left;
        width: 136px;
        height: 105px;
        background: #f4f4f4;
        text-align: center;
        margin: 0 15px 15px 0;
        box-shadow: 0 2px 2px 1px #dddddd;

        .name {
          height: 70px;
          font-size: 15px;
          line-height: 20px;
          padding: 20px 5px 0 5px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .price {
          height: 35px;
          line-height: 30px;
          font-size: 16px;
          color: #ffffff;
          background: #23A547;
          box-sizing: border-box;
          box-shadow: 0 2px 2px 1px #dddddd;
        }
      }
    }
  }

  /* 顾客预约信息填写 */
  .client {
    position: relative;
    z-index: 10;
    width: 400px;
    overflow: auto;
    box-shadow: 0 0 2px #dddddd;

    .topBand {
      display: flex;
      padding: 35px 10px 20px 10px;

      .title {
        display: flex;
        overflow: hidden;
        margin: 0 auto;
        cursor: pointer;

        .titleItem {
          position: relative;
          flex: 1;
          width: 100px;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          text-align: center;

          &.select {
            color: #23A547;
            &:after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 1px;
              background: #23A547;
            }
          }
        }
      }
    }

    .content {
      position: relative;
      margin: 0 15px 15px 15px;
      padding: 0 15px;
      background: #f4f4f4;
      overflow: auto;

      &.newClient {
        padding-right: 90px;
      }

      &.vip {
        background: #d6c363;
        color: #ffffff;
      }

      .createClient {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        cursor: pointer;
        display: block;
        width: 75px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #23A547;
        border-left: 1px solid #dddddd;
        margin: auto;
      }

      .contentItem {
        padding: 15px 0;
        display: flex;
        line-height: 24px;
        position: relative;

        .name {
          flex: 1;
          text-align: left;
        }

        .id {
          flex: 1;
          text-align: right;
        }

        label {
          width: 70px;
          font-size: 14px;
        }
        input {
          flex: 1;
          padding-right: 15px;
          text-align: right;
          font-size: 14px;
          border: none;
          box-sizing: border-box;
          background: #f4f4f4;
        }

        .select {
          padding-right: 25px;
          flex: 1;
          text-align: right;
          font-size: 14px;
          cursor: pointer;

          &.pdr10 {
            padding-right: 10px;
          }

          textarea {
            width: 100%;
            height: 40px;
            background-color: #f4f4f4;
            border: 0;
            resize: none;
            color: #333333;
            text-align: right;
            font-size: 14px;
          }
        }

        .btn-select {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 20px;
          text-align: center;
          font-size: 20px;
          line-height: 54px;
          cursor: pointer;
        }
      }
    }

    .projects {
      margin-bottom: 15px;
      padding: 0 15px;
      overflow: auto;
      padding-bottom: 60px;

      .title {
        margin: 15px;
        font-size: 15px;
      }

      .projectsItem {
        position: relative;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        margin-bottom: 10px;
        background: #f4f4f4;
        padding-left: 50px;
        font-size: 14px;

        .btn-delete {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          text-align: center;
          font-size: 20px;
          color: #8a8a8a;
          cursor: pointer;
        }
      }
    }

    .btn-submit {
      width: 400px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #23A547;
      color: #ffffff;
      position: fixed;
      bottom: 0;
      right: 0;
    }
  }
}

// 选择时长对话框
.durationDialog {
  margin: 0 auto;

  .slider {
    width: 80%;
    margin: 0 auto;
  }

  .marks {
    position: relative;
    width: 80%;
    height: 20px;
    margin: 0 auto;

    .marks-min {
      position: absolute;
      top: 0;
      left: 0;
    }
    .marks-max {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .duration {
    width: 80%;
    height: 20px;
    margin: 20px auto;

    span {
      color: #f44e4e;
    }
  }
}

.calendar {
  &.selected {
    background: #23A547;
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
