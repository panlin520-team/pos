<!-- 店铺设置 -->

<template>
  <div class="settingPage fluid">
    <div class="pageTop">
      <div class="title">门店信息</div>
      <!-- <div class="btns btnsRight">
        <div class="btn btn-save" v-if="editStatus == false" @click="editStatus = true">编辑</div>
        <div class="btn btn-save" v-if="editStatus == true" @click="saveStore">保存</div>
      </div>-->
    </div>
    <div class="outerbox">
      <div class="dance">
        <div class="danceing">
          <img src="../../assets/images/icon-user.png" alt />
        </div>
      </div>
      <div class="centercent">
        <!-- <div class="listone">
          <div class="listItem">
            <label class="label-left">门店编号</label>
            <label class="label-right">{{storeCode}}</label>
          </div>
        </div>-->
        <div class="listtow">
          <!-- 门店名称 -->
          <div class="listItem" :class="editStatus ? 'editValue' : '' ">
            <label class="label-left">门店名称：</label>
            <label class="label-right" v-if="editStatus == false">{{storeName}}</label>
            <input
              type="text"
              placeholder="请输入门店名称"
              v-model="storeName"
              v-if="editStatus == true"
              class="input-value"
            />
          </div>
          <!-- 门店营业行业 -->
          <div class="listItem">
            <label class="label-left">所属行业：</label>
            <label class="label-right" v-if="editStatus == false">{{storeIndustryText}}</label>
            <el-select
              v-model="storeIndustryId"
              placeholder="请选择所属行业"
              v-if="editStatus == true"
              @change="fetchIndustryText"
            >
              <el-option
                v-for="item in storeIndustrys"
                :key="item.industryID"
                :label="item.industryName"
                :value="item.industryID"
              ></el-option>
            </el-select>
          </div>
          <!-- 门店所处地区 -->
          <!-- <div class="listItem" :class="editStatus ? 'editValue' : '' ">
          <label class="label-left">地区</label>
          <label class="label-right" v-if="editStatus == false">{{storeArea}}</label>
          <input type="text" placeholder="请输入地区" v-model="storeArea" v-if="editStatus == true" class="input-value"/>
          </div>-->
          <!-- 门店详细地址 -->
          <div class="listItem" :class="editStatus ? 'editValue' : '' ">
            <label class="label-left">详细地址：</label>
            <label class="label-right" v-if="editStatus == false">{{storeAddress}}</label>
            <input
              type="text"
              placeholder="请输入详细地址"
              v-model="storeAddress"
              v-if="editStatus == true"
              class="input-value"
            />
          </div>
          <!-- 门店电话号码 -->
          <div class="listItem" :class="editStatus ? 'editValue' : '' ">
            <label class="label-left">联系电话：</label>
            <label class="label-right" v-if="editStatus == false">{{storePhone}}</label>
            <input
              type="text"
              placeholder="请输入联系电话"
              v-model="storePhone"
              v-if="editStatus == true"
              class="input-value"
            />
          </div>
          <!-- 门店营业时间 -->
          <div class="listItem">
            <label class="label-left">营业时间：</label>
            <label class="label-right" v-if="editStatus == false">{{storeBusinessTime}}</label>
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
              start: '08:00',
              step: '00:60',
              end: '22:00'
            }"
              size="small"
              :clearable="false"
              :editable="false"
              v-if="editStatus == true"
            ></el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
              start: '08:00',
              step: '00:60',
              end: '22:00',
              minTime: startTime
            }"
              size="small"
              :clearable="false"
              :editable="false"
              v-if="editStatus == true"
            ></el-time-select>
          </div>
        </div>
        <!-- 地图 -->
        <div class="shopsmap">
          <div class="coordinates">地图坐标</div>
          <div id="container" class="coordinatesmap"></div>
        </div>
        <!-- <div class="companyIntroduce">
          <label>公司简介</label>
          <div class="conpanyContent">
            反时针美业，成都AAAAA级美容美发企业。在成都已有19年的历史。“时光倒流、绽放魅力”朋友、欢迎您的加盟！我们一定会提供给你足够
            的发展空间和充分展现您个人魅力的舞台！
          </div>
        </div>-->
        <!-- <div class="btnGroup">
          <div class="btn btn-logout" @click="logOut">退出登录</div>
        </div>-->
      </div>
    </div>
    <!-- <MemberFrame></MemberFrame> -->
  </div>
</template>

<script>
// import MemberFrame from "@/components/MemberFrame/MemberFrame";

export default {
  components: {
    // MemberFrame
  },
  data() {
    return {
      // 门店名称
      storeName: "",
      // 门店编号
      storeCode: "",
      // 门店地址
      storeAddress: "",
      // 门店电话
      storePhone: "",
      // 门店营业时间
      storeBusinessTime: "",
      // 行业数据
      storeIndustrys: [],
      // 行业id
      storeIndustryId: "",
      // 行业值对应文本
      storeIndustryText: "",
      // 开始时间
      startTime: "",
      //经纬度
      gaodeData: [],
      GaodeLongitude: "",
      GaodeLatitude: "",
      // 结束时间
      endTime: "",
      // 用户真实姓名
      trueName: "",

      // 是否编辑
      editStatus: false
    };
  },

  computed: {},
  watch: {},
  methods: {
  
  }
};
</script>

<style lang='scss' scoped>

</style>
