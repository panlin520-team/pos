<!-- 员工管理 -->
<template>
  <div class="employeesPage fluid">
    <div class="pageTop">
      <div class="title">员工管理</div>
      <div class="btns btnsRight">
        <!-- <div class="btn iconfont icon-team" title="查看分组" @click="groupOpen = true"></div> -->
        <div class="iconfont icon-addMember btn-pointer" title="添加成员" @click="addemployees"></div>
      </div>
    </div>

    <div class="pageMain">
      <div class="search">
        <input type="text" v-model="keyword" placeholder="请输入关键字检索" />
      </div>
      <div class="headers">
        <div class="headerItem" style="flex:0.5">序号</div>
        <div class="headerItem">头像</div>
        <div class="headerItem">姓名</div>
        <div class="headerItem">手机</div>
        <div class="headerItem">性别</div>
        <!-- <div class="headerItem">分组</div> -->
        <div class="headerItem">职务</div>
        <div class="headerItem">计算底薪</div>
        <!-- <div class="headerItem">级别</div> -->
        <div class="headerItem">目前状态</div>
        <div class="headerItem">是否为销售员</div>
        <div class="headerItem">操作</div>
      </div>
      <div class="list scrollY">
        <!--  :style="{'height': (virtualHeight-125)+'px'}" -->
        <div class="listItem" v-for="(item,index) in emlpoyeesDataFilter" :key="index">
          <div style="flex:0.5">{{index+1}}</div>
          <div style="flex:1">
            <img :src="item.headUrl" alt />
          </div>
          <div style="flex:1">{{item.name}}</div>
          <div style="flex:1">{{item.mobile}}</div>
          <div
            style="flex:1"
          >{{item.gender == 0 ? '女' : ''}}{{item.gender == 1 ? '男' : ''}}{{item.gender == null ? '未知' : ''}}</div>
          <!-- <div style="flex:1">{{item.groupName}}</div> -->
          <div style="flex:1">{{item.postName}}</div>
          <div
            style="flex:1"
          >{{item.isBasicSalarer == 0 ? '否' : ''}}{{item.isBasicSalarer == 1 ? '是' : ''}}{{item.isBasicSalarer == null ? '未知' : ''}}</div>
          <div
            style="flex:1"
          >{{item.workingState == 0 ? '离职' : ''}}{{item.workingState == 1 ? '在职' : ''}}{{item.workingState == null ? '未知' : ''}}</div>
          <div style="flex:1">
            <el-switch
              active-value="1"
              inactive-value="0"
              v-model="item.isSaleMan"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeswith(item)"
            ></el-switch>
          </div>
          <!-- <div style="flex:1">
            <el-switch v-model="value_switch" active-color="#13ce66" inactive-color="#646464"></el-switch>
          </div>-->
          <div style="flex:1">
            <el-button type="primary" size="mini" @click="fetchEmployeesDet(item)">编辑</el-button>
            <el-button type="warning" size="mini" @click="delEmployees(item.beauticianId)">删除</el-button>
          </div>
        </div>
        <!-- 分页 -->
        <!-- <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="dataTotal"
            background
          ></el-pagination>
        </div>-->
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
    </div>

    <pop-over
      :visible.sync="employeesOpen"
      @close="employeesOpen = false"
      width="500px"
      marginTop="5vh"
      custom-class="employeesPop"
      id="pop"
    >
      <div class="top" slot="top">
        <div class="title">员工资料</div>
      </div>
      <div class="main" slot="main">
        <div class="items scrollY" style="height:400px;">
          <!-- 头像上传 -->
          <div class="item">
            <label class="label-left" style="line-height: 60px;">头像</label>
            <div class="value">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :action="uploadUrl"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="employeesDetails.headUrl" :src="employeesDetails.headUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              </el-upload>
            </div>
          </div>
          <div class="item">
            <label class="label-left">姓名</label>
            <div class="value">
              <input
                type="text"
                placeholder="请输入姓名"
                v-model="employeesDetails.name"
                class="input-value"
              />
            </div>
          </div>
          <div class="item">
            <label class="label-left">手机</label>
            <div class="value">
              <input
                type="text"
                placeholder="请输入手机号码"
                v-model="employeesDetails.mobile"
                class="input-value"
              />
            </div>
          </div>
          <div class="item">
            <label class="label-left">openid</label>
            <div class="value">
              <input
                type="text"
                placeholder="微信openid"
                v-model="employeesDetails.openid"
                class="input-value"
              />
            </div>
          </div>
          <div class="item">
            <label class="label-left">性别</label>
            <div class="value">
              <el-select v-model="employeesDetails.gender" placeholder="请选择性别">
                <el-option
                  v-for="item in genders"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="item">
                <label class="label-left">所属分组</label>
                <div class="value">
                  <el-select v-model="employeesDetails.groupId" placeholder="请选择分组">
                    <el-option
                      v-for="item in groups"
                      :key="item.groupId"
                      :label="item.name"
                      :value="item.groupId"
                    ></el-option>
                  </el-select>
                </div>
          </div>-->
          <div class="item">
            <label class="label-left">所属部门</label>
            <div class="value">
              <el-select v-model="part_department" @change="changedepartment" placeholder="请选择所属部门">
                <el-option
                  v-for="item in part_partment"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">职务分类</label>
            <div class="value">
              <el-select v-model="employeeeposition" placeholder="请选择兼职职务">
                <el-option
                  v-for="item in ompyee_tposition"
                  :key="item.postCategoryId"
                  :label="item.name"
                  :value="item.postCategoryId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">职务</label>
            <div class="value">
              <el-select v-model="employeepostName" @focus="changedeptails" placeholder="请选择职务">
                <el-option
                  v-for="item in postNames"
                  :key="item.postId"
                  :label="item.name"
                  :value="item.postId"
                ></el-option>
              </el-select>
            </div>
          </div>

          <div class="item">
            <label class="label-left">兼职部门</label>
            <div class="value">
              <el-select
                v-model="part_timdepartment"
                @change="changeimdepartme"
                placeholder="请选择兼职职务"
              >
                <el-option
                  v-for="item in part_timepartment"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">兼职职位分类</label>
            <div class="value">
              <el-select
                v-model="part_timeposition"
                @change="changetimeposition"
                placeholder="请选择兼职职务"
              >
                <el-option
                  v-for="item in part_tposition"
                  :key="item.postCategoryId"
                  :label="item.name"
                  :value="item.postCategoryId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">兼职职务</label>
            <div class="value">
              <el-select v-model="part_timeJobe" @focus="changejobe" placeholder="请选择兼职职务">
                <el-option
                  v-for="item in part_timeNames"
                  :key="item.postId"
                  :label="item.name"
                  :value="item.postId"
                ></el-option>
              </el-select>
            </div>
          </div>

          <div class="item">
            <label class="label-left">是否兼职</label>
            <div class="value">
              <el-select v-model="part_trueJobe" @change="changetrueJobe" placeholder="请确认是否兼职">
                <el-option
                  v-for="item in part_trueNames"
                  :key="item.postId"
                  :label="item.name"
                  :value="item.postId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">计算底薪</label>
            <div class="value">
              <el-select v-model="isBasicSalarer" @change="changeSalary" placeholder="是否计算底薪">
                <el-option
                  v-for="item in isBasicSalary"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- <div class="item">
            <label class="label-left">级别</label>
            <div class="value">
              <el-select v-model="employeesDetails.postLevel" placeholder="请选择级别">
                <el-option
                  v-for="item in levels"
                  :key="item.postLevelId"
                  :label="item.postLevelName"
                  :value="item.postLevelId"
                ></el-option>
              </el-select>
            </div>
          </div>-->
          <div class="item">
            <label class="label-left">入职时间</label>
            <div class="value">
              <el-date-picker
                v-model="employeesDetails.entryTime"
                :editable="false"
                :clearable="false"
                align="center"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择入职时间"
                class="setEmpDatePicker"
              ></el-date-picker>
            </div>
          </div>
          <div class="item">
            <label class="label-left">目前状态</label>
            <div class="value">
              <el-select v-model="workingState" @change="changezhtai" placeholder="请选择员工目前状态">
                <el-option
                  v-for="item in workingStates"
                  :key="item.state"
                  :label="item.name"
                  :value="item.state"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label-left">排序</label>
            <div class="value">
              <InputNumber
                :point="0"
                placeholder="排序"
                v-model.number="employeesDetails.sort"
                class="input-value"
              ></InputNumber>
            </div>
          </div>
          <div class="item">
            <label class="label-left">简介</label>
            <div class="value">
              <el-button
                type="primary"
                size="small"
                @click="catchData(employeesDetails.introduction);"
              >点击编辑</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom" slot="bottom">
        <div class="btn-save btn-pointer" @click="saveEmployees" v-if="selectStatus == 0">保存</div>
        <div class="btn-save btn-pointer" @click="newEmployees" v-if="selectStatus != 0">确认添加</div>
        <div class="btn-del btn-pointer" v-if="selectStatus == 0" @click="delEmployees">删除</div>
      </div>
    </pop-over>

    <pop-over
      :visible.sync="editorPop"
      @close="editorPop = false"
      width="800px"
      marginTop="5vh"
      mainPadding="10px 15px"
      bottomPadding="0 15px"
      custom-class="editorPop"
    >
      <div class="top" slot="top">
        <div class="title">员工简介</div>
      </div>
      <div class="main" slot="main">
        <Editor :catchData="catchData" :content="content" @change="changeEditor"></Editor>
      </div>
      <div class="bottom" slot="bottom">
        <el-button type="primary" size="small" @click="saveEditor">确认</el-button>
        <el-button type="info" size="small" @click="cancelEditor">取消</el-button>
      </div>
    </pop-over>

    <!-- <transition name="el-zoom-in-bottom">
      <div class="popPage" v-if="employeesOpen == true">
        <div class="pageTop">
          <div class="btns btnsLeft">
            <div
              class="el-icon-close btn-close btn-pointer"
              @click="emptyData;employeesOpen = false"
            ></div>
          </div>
          <div class="title">员工资料</div>
          <div class="btns btnsRight">
            <div class="btn-save btn-pointer" @click="saveEmployees" v-if="selectStatus == 0">保存</div>
            <div class="btn-save btn-pointer" @click="newEmployees" v-if="selectStatus != 0">添加</div>
            <div class="btn-del btn-pointer" v-if="selectStatus == 0" @click="delEmployees">删除</div>
          </div>
        </div>
        <div class="pageMain">
          <br />
          <div class="items scrollY" :style="{'height': (virtualHeight-125)+'px'}">
    <div class="pd10">-->
    <!-- 头像上传 -->
    <!-- <div class="item">
                <label class="label-left" style="line-height: 100px;">头像</label>
                <div class="value">
                  <el-upload
                    class="avatar-uploader"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="employeesDetails.imageUrl"
                      :src="employeesDetails.imageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
    </div>-->
    <!-- <div class="item">
                <label class="label-left">姓名</label>
                <div class="value">
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    v-model="employeesDetails.name"
                    class="input-value"
                  />
                </div>
              </div>
              <div class="item">
                <label class="label-left">手机</label>
                <div class="value">
                  <input
                    type="text"
                    placeholder="请输入手机号码"
                    v-model="employeesDetails.mobile"
                    class="input-value"
                  />
                </div>
              </div>
              <div class="item">
                <label class="label-left">性别</label>
                <div class="value">
                  <el-select v-model="employeesDetails.gender" placeholder="请选择性别">
                    <el-option
                      v-for="item in genders"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
    </div>-->
    <!-- <div class="item">
                <label class="label-left">所属分组</label>
                <div class="value">
                  <el-select v-model="employeesDetails.groupId" placeholder="请选择分组">
                    <el-option
                      v-for="item in groups"
                      :key="item.groupId"
                      :label="item.name"
                      :value="item.groupId"
                    ></el-option>
                  </el-select>
                </div>
    </div>-->
    <!-- <div class="item">
                <label class="label-left">职务</label>
                <div class="value">
                  <el-select v-model="employeesDetails.postId" placeholder="请选择职务">
                    <el-option
                      v-for="item in postNames"
                      :key="item.postId"
                      :label="item.name"
                      :value="item.postId"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <label class="label-left">级别</label>
                <div class="value">
                  <el-select v-model="employeesDetails.postLevel" placeholder="请选择级别">
                    <el-option
                      v-for="item in levels"
                      :key="item.postLevelId"
                      :label="item.postLevelName"
                      :value="item.postLevelId"
                    ></el-option>
                  </el-select>
                </div>
              </div>
    <div class="item">-->
    <!-- <label class="label-left">入职时间</label>
                <div class="value">
                  <el-date-picker
                    v-model="employeesDetails.entryTime"
                    :editable="false"
                    :clearable="false"
                    align="center"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择入职时间"
                    v-if="selectStatus == 1"
                    class="setEmpDatePicker"
                  ></el-date-picker>
                  <el-date-picker
                    v-model="employeesDetails.entryTime"
                    :editable="false"
                    :clearable="false"
                    align="center"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择入职时间"
                    v-if="selectStatus == 0"
                    class="setEmpDatePicker"
                    disabled
                  ></el-date-picker>
                </div>
              </div>
              <div class="item">
                <label class="label-left">目前状态</label>
                <div class="value">
                  <el-select v-model="employeesDetails.workingState" placeholder="请选择员工目前状态">
                    <el-option
                      v-for="item in workingStates"
                      :key="item.state"
                      :label="item.name"
                      :value="item.state"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <label class="label-left">排序</label>
                <div class="value">
                  <InputNumber
                    :point="0"
                    placeholder="排序"
                    v-model.number="employeesDetails.sort"
                    class="input-value"
                  ></InputNumber>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popPage" v-if="groupOpen == true">
        <div class="pageTop">
          <div class="btns btnsLeft">
            <div class="btn btn-close el-icon-close" @click="groupOpen = false"></div>
          </div>
          <div class="title">门店分组资料</div>
          <div class="btns btnsRight">
            <div class="btn iconfont icon-addTeam" title="添加分组" @click="fetchGroupDet()"></div>
          </div>
        </div>
        <div class="pageMain">
          <div class="headers">
            <div class="headerItem">序号</div>
            <div class="headerItem">小组组名</div>
            <div class="headerItem">小组组长</div>
            <div class="headerItem">操作</div>
          </div>
          <div class="list scrollY" :style="{'height': (virtualHeight-125)+'px'}">
            <div class="listItem" v-for="(item,index) in groups">
              <div style="flex:1">{{index+1}}</div>
              <div style="flex:1">{{item.name}}</div>
              <div style="flex:1">{{item.groupLeaderName}}</div>
              <div style="flex:1">
                <el-button type="success" size="mini" @click="fetchGroupDet(item)">编辑</el-button>
                <el-button type="danger" size="mini" @click="delGroup(item)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>-->

    <!-- 分组详细修改和新增 -->
    <el-dialog
      :visible.sync="groupDialog"
      width="500px"
      append-to-body
      center
      custom-class="dialog"
    >
      <div slot="title" class="dialog-title">分组</div>
      <div class="dialogMain">
        <div class="inputVal">
          <label class="label-left">小组组名</label>
          <div class="value">
            <input type="text" placeholder="请输入小组组名" v-model="groupName" />
          </div>
        </div>
        <div class="inputVal">
          <label class="label-left">小组组长</label>
          <div class="value">
            <el-select v-model="leaderId" placeholder="请选择组长">
              <el-option
                v-for="item in groupLeader"
                :key="item.beauticianId"
                :label="item.name"
                :value="item.beauticianId"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <div class="btn btn-save" @click="saveGroupDet(groupObject)">保存</div>
      </div>
    </el-dialog>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
import InputNumber from "@/components/InputNumber/InputNumber";
import MemberFrame from "@/components/MemberFrame/MemberFrame";
import Editor from "@/components/Editor/Editor";
import { log } from "util";

export default {
  name: "Employees",
  components: { InputNumber, MemberFrame, Editor },
  data() {
    return {
      uploadUrl: this.$https.productHost + "/manage/product/uploadFuwenbenPic",
      // 数据
      imageUrl: "",
      // 关键字搜索
      keyword: "",
      // 门店员工
      emlpoyeesData: [],
      // 门店可选分组组长
      groupLeader: [],
      //兼职职务
      part_timeJobe: "",
      // 员工详细
      employeesDetails: {},
      // 门店兼职职务
      part_timeNames: [],
      //兼职职务
      postCategoryId: 0,
      postId: 0,
      // 分组详细(组id，组名，组长id)
      groupId: "",
      swithnumber: "",
      groupName: "",
      leaderId: "",
      groupObject: "",
      groupObjectfsdfasdf: "1",
      // 门店分组
      groups: [],
      //职务分类
      employeeeposition: "",
      ompyee_tposition: [],
      // 员工级别
      levels: [],
      //是否计算底薪
      isBasicSalarer: 1,
      // 门店职务
      postNames: [],
      employeepostName: "",
      //是否兼职
      part_trueNames: [
        {
          postId: 1,
          name: "是"
        },
        {
          postId: 0,
          name: "否"
        }
      ],
      //是否兼职
      part_trueJobe: 0,
      // 性别
      genders: [
        {
          value: 0,
          name: "女"
        },
        {
          value: 1,
          name: "男"
        }
      ],
      //简直部门与兼职职位分类
      part_timdepartment: "",
      part_timepartment: [],
      part_timeposition: "",
      part_tposition: [],

      // 在职状态
      workingStates: [
        {
          state: 1,
          name: "在职"
        },
        {
          state: 0,
          name: "离职"
        }
      ],
      // 是否计算底薪
      isBasicSalary: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],

      // 某些元素的显示
      selectStatus: null,
      workingState: 1,
      //部门
      part_department: "",
      part_partment: [],
      //开关
      value_switch: "",
      //快关数据
      companyId: "",
      companyType: "",
      beauticianId: "",
      yeWuYuanK3Id: "",
      k3Number: "",
      isSaleMan: "",
      modifyOperator: "",
      // 弹出层
      // 分组列表
      groupOpen: false,
      // 成员详细信息
      employeesOpen: false,
      // 编辑器
      editorPop: false,
      content: null,

      // 页码控制
      // 当前页码
      currentPage: 1,
      // 每页显示个数
      pageSize1: 10,
      // 总个数
      dataTotal1: 0,

      // 对话框
      // 分组详细修改与新增
      groupDialog: false,

      // 浏览器可视高度
      virtualHeight: window.innerHeight
    };
  },
  created() {
    this.fetchEmployees();
  },
  mounted() {
    // if (localStorage.getItem("storeId")) {
    //   this.$axios.all([this.fetchPostNames()]).then();
    // }
  },
  computed: {
    emlpoyeesDataFilter: function() {
      const keyword = this.keyword;
      if (keyword) {
        return this.emlpoyeesData.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).indexOf(keyword) > -1;
          });
        });
      }
      return this.emlpoyeesData;
    }
  },
  watch: {},
  methods: {
    // 保存富文本编辑
    saveEditor(val) {
      this.employeesDetails.introduction = this.content;
      this.editorPop = false;
    },
    //改变快关
    changeswith(res) {
      this.companyId = res.companyId;
      this.companyType = res.companyType;
      this.beauticianId = res.beauticianId;
      this.k3Number = res.k3Number;
      this.isSaleMan = res.isSaleMan;
      if (res.isSaleMan == 0) {
        this.yeWuYuanK3Id = res.yeWuYuanK3Id;
      } else {
        res.yeWuYuanK3Id = "";
      }
      this.modifyOperator = res.modifyOperator;
      //开关接口
      this.chanegeswigath();
    },

    // 取消富文本编辑
    cancelEditor() {
      this.editorPop = false;
    },
    //部门
    changedepartment(res) {
      this.part_department = res;
    },
    changedeptails(res) {
      if (!this.part_department || !this.employeeeposition) {
        this.$message({
          message: "请选择所属部门或职务分类",
          type: "warning"
        });
      } else {
        this.fetchPostNames();
      }
    },
    // 富文本编辑监听
    changeEditor(val) {
      this.content = val;
    },

    // 富文本编辑器内容获取
    catchData(val) {
      this.editorPop = true;
      this.content = val;
    },
    //兼职职务
    changejobe(vId) {
      let obj = {};
      obj = this.part_timeNames.find(item => {
        if (vId == item.postId) {
          this.postCategoryId = item.postCategoryId;
          this.postId = item.postId;
        }
      });
      if (!this.part_timeposition || !this.part_timdepartment) {
        this.$message({
          message: "请选择兼职部门或兼职职务分类",
          type: "warning"
        });
      } else {
        this.parteNames();
      }
    },
    //兼职职务选择
    changetimeposition(res) {
      this.part_timeposition = res;
    },
    changeimdepartme(res) {
      this.part_timdepartment = res;
    },
    //是否兼职
    changetrueJobe(res) {
      this.part_trueJobe = res;
    },
    //是否计算底薪
    changeSalary(res) {
      this.isBasicSalarer = res;
    },
    //目前状态
    changezhtai(res) {
      this.workingState = res;
    },
    //添加员工
    addemployees() {
      this.employeesOpen = true;
      this.employeesDetails = {};
      this.selectStatus = 1;
      (this.part_timeNames = []), (this.employeeeposition = "");
      (this.part_timdepartment = ""),
        (this.part_timeposition = ""),
        (this.employeepostName = "");
      this.part_partment = [];
      this.part_department = "";
      this.part_timeJobe = "";
      //请求部门兼职
      this.chanegdepartment();
      this.chanegdtimeposition();
      this.chanegdtiebfn();
      this.part_timeJobe = "";
    },
    // 部门
    chanegdepartment() {
      var url =
        this.$https.storeHost + "/manage/department/listDepartmentNoPage";
      var params = {
        companyType: 3,
        companyId: localStorage.getItem("storeId")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.part_partment = res.data.result;
            this.part_timepartment = res.data.result;
            this.part_timepartment.unshift({
              name: "请选择",
              id: ""
            });
          } else {
            this.part_partment = [];
            this.part_timepartment = [];
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
    // 兼职职位分类
    chanegdtimeposition() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectPostCategoryNoPage";
      var params = {
        postIndustryIDSearch: localStorage.getItem("industryID")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.part_tposition = res.data.result;
            this.part_tposition.unshift({
              name: "请选择",
              postCategoryId: ""
            });
          } else {
            this.part_tposition = [];
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
    // 改变开关
    chanegeswigath() {
      var url = this.$https.storeHost + "/manage/beautician/updateBeautician";
      var params = {
        companyId: this.companyId,
        companyType: this.companyType,
        beauticianId: this.beauticianId,
        yeWuYuanK3Id: this.yeWuYuanK3Id,
        k3Number: this.k3Number,
        isSaleMan: this.isSaleMan,
        modifyOperator: this.modifyOperator
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.editStatus = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.fetchEmployees();
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

    // 删除成员
    delEmployees(id) {
      var url = this.$https.storeHost + "/manage/beautician/deleteBeautician";
      var params = {
        beauticianIds: id,
        modifyOperator: localStorage.getItem("trueName"),
        createOperator: localStorage.getItem("trueName")
      };

      this.$confirm("确认删除该员工吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.responseStatusType.message == "Success") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.employeesOpen = false;
                this.fetchEmployees();
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

    // 保存成员信息修改
    saveEmployees() {
      var params = {
        beauticianId: this.employeesDetails.beauticianId,
        headUrl: this.employeesDetails.headUrl,
        openId: this.employeesDetails.openId,
        name: this.employeesDetails.name,
        mobile: this.employeesDetails.mobile,
        gender: this.employeesDetails.gender,
        storeId: this.employeesDetails.storeId,
        postId: this.employeesDetails.postId,
        isBasicSalary: this.isBasicSalarer,
        workingState: this.workingState,
        companyType: 3,
        companyId: localStorage.getItem("storeId"),
        entryTime: this.employeesDetails.entryTime,
        // postLevel: this.employeesDetails.postLevel,
        sort: this.employeesDetails.sort,
        introduction: this.employeesDetails.introduction,
        modifyOperator: localStorage.getItem("trueName"),
        createOperator: localStorage.getItem("trueName")
      };

      if (params.name == "" || params.name == null) {
        this.$message({
          message: "请填写名称",
          type: "warning"
        });
        return false;
      }

      if (params.mobile == "" || !/^1[34578]\d{9}$/.test(params.mobile)) {
        this.$message({
          message: "请输入正确手机号码",
          type: "warning"
        });
        return false;
      }

      if (params.gender == undefined) {
        this.$message({
          message: "请选择性别",
          type: "warning"
        });
        return false;
      }

      // if (params.openid == "") {
      //   this.$message({
      //     message: "请输入openid",
      //     type: "warning"
      //   });
      //   return false;
      // }

      // if (params.groupId == undefined) {
      //   this.$message({
      //     message: "请选择分组",
      //     type: "warning"
      //   });
      //   return false;
      // }

      if (params.postId == undefined) {
        this.$message({
          message: "请选择职务",
          type: "warning"
        });
        return false;
      }

      // if (params.postLevel == undefined) {
      //   this.$message({
      //     message: "请选择级别",
      //     type: "warning"
      //   });
      //   return false;
      // }

      if (params.workingState == undefined) {
        this.$message({
          message: "请选择目前状态",
          type: "warning"
        });
        return false;
      }

      // if (params.entryTime == undefined) {
      //   this.$message({
      //     message: "请选择入职时间",
      //     type: "warning"
      //   });
      //   return false;
      // }

      var url = this.$https.storeHost + "/manage/beautician/updateBeautician";
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: "门店成员资料保存成功",
              type: "success"
            });
            this.employeesOpen = false;
            this.emptyData();
            this.fetchEmployees();
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

    // 新建成员
    newEmployees() {
      var params = {
        // beauticianId: this.employeesDetails.beauticianId,
        headUrl: this.employeesDetails.headUrl,
        openId: this.employeesDetails.openId,
        name: this.employeesDetails.name,
        mobile: this.employeesDetails.mobile,
        gender: this.employeesDetails.gender,
        postId: this.employeepostName,
        isBasicSalary: this.isBasicSalarer,
        companyType: 3,
        companyId: localStorage.getItem("storeId"),
        workingState: this.workingState,
        departmentId: this.part_department,
        entryTime: this.employeesDetails.entryTime,
        // postLevel: this.employeesDetails.postLevel,
        sort: this.employeesDetails.sort,
        isPartTime: this.part_trueJobe,
        FCreateOrgId: localStorage.getItem("orgK3Number"),
        FUseOrgId: localStorage.getItem("orgK3Number"),
        partTimePostId: this.part_timeJobe,
        partTimePostCategoryId: this.part_timeposition,
        introduction: this.employeesDetails.introduction,
        modifyOperator: localStorage.getItem("trueName"),
        createOperator: localStorage.getItem("trueName")
      };

      if (params.name == "" || params.name == undefined) {
        this.$message({
          message: "请填写名称",
          type: "warning"
        });
        return false;
      }

      if (params.mobile == "" || !/^1[34578]\d{9}$/.test(params.mobile)) {
        this.$message({
          message: "请输入正确手机号码",
          type: "warning"
        });
        return false;
      }

      if (params.gender == undefined) {
        this.$message({
          message: "请选择性别",
          type: "warning"
        });
        return false;
      }

      if (this.part_department == "") {
        this.$message({
          message: "请选择所属部门",
          type: "warning"
        });
        return false;
      }
      if (this.employeeeposition == "") {
        this.$message({
          message: "请选择职务分类",
          type: "warning"
        });
        return false;
      }

      // if (params.openid == "") {
      //   this.$message({
      //     message: "请输入openid",
      //     type: "warning"
      //   });
      //   return false;
      // }

      // if (params.groupId == undefined) {
      //   this.$message({
      //     message: "请选择分组",
      //     type: "warning"
      //   });
      //   return false;
      // }

      if (this.employeepostName == "") {
        this.$message({
          message: "请选择职务",
          type: "warning"
        });
        return false;
      }
      if (params.entryTime == undefined) {
        this.$message({
          message: "请选择入职时间",
          type: "warning"
        });
        return false;
      }

      var url = this.$https.storeHost + "/manage/beautician/insertBeautician";
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.responseStatusType.message == "Success") {
            this.$message({
              message: "门店成员资料添加成功",
              type: "success"
            });
            console.log(this.part_timeJobe);

            this.employeesOpen = false;
            this.emptyData();
            this.fetchEmployees();
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

    // 员工编辑详细信息
    fetchEmployeesDet(i) {
      console.log(i);

      this.employeepostName = i.postName;
      this.part_department = i.departmentName;
      this.part_timeJobe = i.parTimePostName;

      this.chanegdepartment();
      //兼职职务
      this.employeesOpen = true;
      this.employeesDetails = {};
      this.selectStatus = 0;
      var params = {
        beauticianId: i.staffNumber
      };
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianById";
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.employeesOpen = true;
            this.employeesDetails = res.data.result;
            this.fetchEmployees();
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

    // 获取门店员工
    fetchEmployees() {
      this.emlpoyeesData = [];
      var url =
        this.$https.storeHost + "/manage/beautician/selectBeauticianList";
      var params = {
        companyId: localStorage.getItem("storeId"),
        pageNum: this.currentPage,
        companyType: 3,
        pageSize: this.pageSize1
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.dataTotal1 = res.data.result.total;
            res.data.result.list.forEach(value => {
              this.emlpoyeesData.push({
                headUrl: value.headUrl,
                name: value.name,
                mobile: value.mobile,
                gender: value.gender,
                postName: value.postName,
                isBasicSalarer: value.isBasicSalarer,
                workingState: value.workingState,
                beauticianId: value.beauticianId,
                companyId: value.companyId,
                companyType: value.companyType,
                yeWuYuanK3Id: value.yeWuYuanK3Id,
                k3Number: value.k3Number,
                swithnumber: this.swithnumber,
                isSaleMan: value.isSaleMan + "",
                staffNumber: value.staffNumber,
                departmentName: value.departmentName,
                parTimePostName: value.parTimePostName
              });
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
            this.dataTotal1 = 0;
            this.emlpoyeesData = [];
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

    // 员工级别
    // fetchLevel() {
    //   var url =
    //     this.$https.storeHost + "/manage/beautician/selectPostLevelNoPage";
    //   var params = {};
    //   this.$https.fetchPost(url, params).then(
    //     res => {
    //       if (res.data.result) {
    //         this.levels = res.data.result;
    //       } else {
    //         this.$message({
    //           message: res.data.responseStatusType.error.errorMsg,
    //           type: "warning"
    //         });
    //       }
    //     },
    //     error => {
    //       this.$message({
    //         type: "error",
    //         message: error
    //       });
    //     }
    //   );
    // },

    // 门店员工职务
    fetchPostNames() {
      var url = this.$https.storeHost + "/manage/beautician/selectPost";
      var params = {
        postIndustryIDSearch: localStorage.getItem("industryID"),
        companyId: localStorage.getItem("storeId"),
        postCategoryId: this.employeeeposition,
        departmentId: this.part_department,
        companyType: 3
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.postNames = res.data.result.list;
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
    // 门店员工职务分类
    chanegdtiebfn() {
      var url =
        this.$https.storeHost + "/manage/beautician/selectPostCategoryNoPage";
      var params = {
        postIndustryIDSearch: localStorage.getItem("industryID")
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.ompyee_tposition = res.data.result;
          } else {
            this.ompyee_tposition = [];
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
    // 门店员工兼职职务
    parteNames() {
      var url = this.$https.storeHost + "/manage/beautician/selectPost";
      var params = {
        postIndustryIDSearch: localStorage.getItem("industryID"),
        companyId: localStorage.getItem("storeId"),
        postCategoryId: this.part_timeposition,
        departmentId: this.part_timdepartment,
        companyType: 3
      };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result) {
            this.part_timeNames = res.data.result.list;
            this.part_timeNames.unshift({
              postId: "",
              name: "请选择",
              postCategoryId: ""
            });
          } else {
            this.part_timeNames = [];
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

    // 图片上传
    handleAvatarSuccess(res, file) {
      this.$message({
        type: "success",
        message: "头像上传成功"
      });
      this.$set(this.employeesDetails, "headUrl", res.data.src);
      this.employeesDetails.imageUrl = res.data.src;
    },

    // 设置上传参数
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isLt2M;
    },

    // 清空必要信息
    emptyData() {
      this.selectStatus = 0;
      this.employeesDetails = {};
      this.content = null;
    },

    // 改变页码
    handleCurrentChange(val) {
      this.fetchEmployees();
    },

    // 获取门店分组
    fetchGroup() {
      var url = this.$https.storeHost + "/manage/beautician/selectGroup";
      var params = { storeId: localStorage.getItem("storeId") };
      this.$https.fetchPost(url, params).then(
        res => {
          if (res.data.result.list) {
            this.groups = res.data.result.list;
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

    // 打开分组详细对话框
    fetchGroupDet(item) {
      this.groupDialog = true;
      if (item != undefined) {
        this.groupId = item.groupId;
        this.groupName = item.name;
        this.leaderId = item.groupLeaderId;
        this.groupObject = item;
      } else {
        this.groupName = "";
        this.leaderId = "";
        this.groupObject = "";
        this.groupId = "";
      }
    },

    // 获取分组组长可选列表
    // fetchGroupLeader() {
    //   var url =
    //     this.$https.storeHost + "/manage/beautician/selectBeauticianListNoPage";
    //   var params = { storeId: localStorage.getItem("storeId") };
    //   this.$https.fetchPost(url, params).then(
    //     res => {
    //       if (res.data.result) {
    //         this.groupLeader = res.data.result;
    //       } else {
    //         this.$message({
    //           message: res.data.responseStatusType.error.errorMsg,
    //           type: "warning"
    //         });
    //       }
    //     },
    //     error => {
    //       this.$message({
    //         type: "error",
    //         message: error
    //       });
    //     }
    //   );
    // },

    // 删除分组
    delGroup(item) {
      var url = this.$https.storeHost + "/manage/beautician/deleteGroup";
      var params = {
        storeId: localStorage.getItem("storeId"),
        groupId: item.groupId,
        modifyOperator: localStorage.getItem("trueName"),
        createOperator: localStorage.getItem("trueName")
      };
      this.$confirm("确认删除该组吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$https.fetchPost(url, params).then(
            res => {
              if (res.data.responseStatusType.message == "Success") {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                // this.fetchGroup();
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

    // 分组修改或新增
    saveGroupDet(item) {
      var params = {
        name: this.groupName,
        storeId: localStorage.getItem("storeId"),
        groupId: this.groupId,
        groupLeaderId: this.leaderId,
        modifyOperator: localStorage.getItem("trueName"),
        createOperator: localStorage.getItem("trueName")
      };

      if (params.name == "") {
        this.$message({
          message: "请填写小组组名",
          type: "warning"
        });
        return false;
      }

      if (params.groupLeaderId == "") {
        this.$message({
          message: "请选择小组组长",
          type: "warning"
        });
        return false;
      }
      // 修改分组
      if (item != "") {
        var url = this.$https.storeHost + "/manage/beautician/updateGroup";
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.responseStatusType.message == "Success") {
              this.$message({
                message: "门店分组资料修改成功",
                type: "success"
              });
              this.groupDialog = false;
              // this.fetchGroup();
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
      // 添加分组
      if (item == "") {
        var url = this.$https.storeHost + "/manage/beautician/addGroup";
        this.$https.fetchPost(url, params).then(
          res => {
            if (res.data.responseStatusType.message == "Success") {
              this.$message({
                message: "门店分组资料创建成功",
                type: "success"
              });
              this.groupDialog = false;
              // this.fetchGroup();
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
    }
  }
};
</script>

<style lang='scss' scoped>
.employeesPage {
  width: 100%;
  height: 100%;
  .pageTop {
    font-size: 20px;
    display: flex;
    padding: 25px 0 15px 0;
    height: 81px;
    border-bottom: 1px solid #dcdcdc;
    position: relative;
    .btnsLeft {
      margin-left: 30px;
      font-size: 30px;
    }
    .title {
      margin: 0 auto;
      font-size: 25px;
      font-weight: 500;
      flex: 1;
      text-align: center;
    }
    .btnsRight {
      margin-right: 30px;
      height: 50px;
      display: flex;
      .btn-save {
        flex: 1;
        font-size: 16px;
        color: #23a547;
        margin-right: 15px;
      }
      .iconfont {
        font-size: 25px;
      }
      .btn-del {
        display: inline-block;
        font-size: 16px;
        color: #e6a23c;
      }
    }
  }
}
.search {
  position: relative;
  margin: 20px;
  text-align: right;
  padding-right: 30px;

  input {
    width: 400px;
    height: 40px;
    padding: 0 15px;
    font-size: 15px;
    border-radius: 5px;
    text-align: center;
    border: 1px;
    background-color: #f8f8f8;
  }
}
.pagination {
  margin: 20px 100px 20px 0;
  text-align: right;
}

.headers {
  position: relative;
  display: flex;
  margin: 0 20px;

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
    line-height: 70px;
    font-size: 14px;
    text-align: center;

    &:nth-child(odd) {
      background-color: #f8f8f8;
    }

    img {
      display: inline-block;
      vertical-align: middle;
      width: 60px;
      height: 60px;
    }

    .control {
      color: #23a547;
    }
  }
}

.items {
  position: relative;
  margin: 0 auto;
  padding: 0 15px;
  background-color: #f8f8f8;

  .input-value {
    background: #ffffff;
    border: 1px solid rgb(231, 227, 227);
    border-radius: 4px;
  }

  .item {
    position: relative;
    line-height: 40px;
    padding: 7px 12px;
    border-bottom: 1px solid #dcdcdc;
    display: flex;

    &:last-child {
      border-bottom: none;
    }

    .label-left {
      min-width: 90px;
      font-size: 15px;
    }

    .value {
      flex: 1;
      text-align: right;
    }

    .el-select {
      width: 220px;
      height: 40px;
      display: inline-block;
    }

    input {
      width: 220px;
      height: 40px;
      padding: 0 10px;
      font-size: 14px;
      display: inline-block;
    }

    .btn-switch {
      margin: auto;
    }
  }
}

// 图片上传框
.avatar-uploader {
  width: 60px;
  height: 60px;
  display: inline-block;
  background-color: transparent;
}

.el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #eeeeee;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.dialog {
  .inputVal {
    display: flex;
    line-height: 40px;
    padding-left: 15px;
    margin-bottom: 15px;

    .label-left {
      min-width: 90px;
    }

    .value {
      flex: 1;
      text-align: right;

      input {
        width: 220px;
        height: 40px;
        text-align: center;
      }

      .el-select {
        width: 220px;
        height: 40px;
      }
    }
  }
}

.editorPop {
  .top {
    padding: 5px 15px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
  }

  .bottom {
    height: 50px;

    text-align: right;
  }
}

.employeesPop {
  .top {
    padding: 5px 15px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
  }

  .bottom {
    text-align: right;

    .btn-save {
      padding: 7px 15px;
      font-size: 14px;
      margin-right: 15px;
      border-radius: 6px;
      color: #ffffff;
      background-color: #23a547;
      text-align: center;
      display: inline-block;
    }
    .iconfont {
      font-size: 25px;
    }
    .btn-del {
      padding: 7px 15px;
      font-size: 14px;
      margin-right: 15px;
      border-radius: 6px;
      color: #ffffff;
      background: #e6a23c;
      text-align: center;
      display: inline-block;
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
