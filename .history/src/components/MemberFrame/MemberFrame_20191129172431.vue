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
  data() {
    return {};
  },

  mounted() {},
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang='scss' scoped>
</style>