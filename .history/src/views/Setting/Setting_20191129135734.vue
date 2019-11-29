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
        <div class="list">
          <div class="listItem">
            <label class="label-left">门店编号</label>
            <label class="label-right">{{storeCode}}</label>
          </div>
        </div>

        <div class="list">
          <!-- 门店名称 -->
          <div class="listItem" :class="editStatus ? 'editValue' : '' ">
            <label class="label-left">名称</label>
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
            <label class="label-left">所属行业</label>
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
            <label class="label-left">详细地址</label>
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
            <label class="label-left">联系电话</label>
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
            <label class="label-left">营业时间</label>
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
          <div class="coordinatesmap"></div>
        </div>
        <div class="companyIntroduce">
          <label>简介</label>
          <div class="conpanyContent">
            反时针美业，成都AAAAA级美容美发企业。在成都已有19年的历史。“时光倒流、绽放魅力”朋友、欢迎您的加盟！我们一定会提供给你足够
            的发展空间和充分展现您个人魅力的舞台！
          </div>
        </div>
        <!-- <div class="btnGroup">
          <div class="btn btn-logout" @click="logOut">退出登录</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "XXX",
  components: {},
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
      // 结束时间
      endTime: "",
      // 用户真实姓名
      trueName: "",

      // 是否编辑
      editStatus: false
    };
  },
  created() {
    this.fetchStore();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    // 修改门店信息
    saveStore() {
      var params = {
        code: this.storeCode,
        industryID: this.storeIndustryId,
        name: this.storeName,
        shopDetailedAddress: this.storeAddress,
        phoneNumber: this.storePhone,
        shopBusinessTime: this.startTime + "-" + this.endTime,
        modifyOperator: this.trueName
      };
      var url = this.$https.storeHost + "/manage/store/updateStoreByCodeOrId";
      if (params.code == "" || params.code == null) {
        this.$message({
          message: "请先登录",
          type: "warning"
        });
        this.$router.push("/login");
        return false;
      }

      if (params.industryID == "" || params.industryID == null) {
        this.$message({
          message: "请选择门店所属行业",
          type: "warning"
        });
        return false;
      }

      if (params.name == "") {
        this.$message({
          message: "请输入门店名称",
          type: "warning"
        });
        return false;
      }

      if (params.shopDetailedAddress == "") {
        this.$message({
          message: "请输入门店详细地址",
          type: "warning"
        });
        return false;
      }

      if (
        params.phoneNumber == "" ||
        !/^1[34578]\d{9}$/.test(params.phoneNumber)
      ) {
        this.$message({
          message: "请输入正确手机号码",
          type: "warning"
        });
        return false;
      }

      if (params.shopBusinessTime == "") {
        this.$message({
          message: "请选择营业时间",
          type: "warning"
        });
        return false;
      }

      if (params.modifyOperator == "") {
        this.$message({
          message: "请先登录",
          type: "warning"
        });
        this.$router.push("/login");
        return false;
      }
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.responseStatusType.message == "Success") {
            this.editStatus = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("门店信息修改失败");
        });
    },
    // 获取门店信息
    fetchStore() {
      this.storeCode = localStorage.getItem("storeCode");
      this.trueName = localStorage.getItem("trueName");
      var params = {
        code: this.storeCode
      };
      var url = this.$https.storeHost + "/manage/store/selectStoreByCodeOrName";
      this.$https
        .fetchPost(url, params)
        .then(res => {
          if (res.data.result) {
            this.storeName = res.data.result[0].name;
            this.storeAddress = res.data.result[0].shopDetailedAddress;
            this.storePhone = res.data.result[0].phoneNumber;
            this.storeBusinessTime = res.data.result[0].shopBusinessTime;
            this.storeIndustryId = res.data.result[0].industryID;
            this.startTime = res.data.result[0].shopBusinessTime.split("-")[0];
            this.endTime = res.data.result[0].shopBusinessTime.split("-")[1];
            this.fetchIndustry();
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("门店数据获取失败");
        });
    },
    // 获取经营行业数据
    fetchIndustry() {
      var url =
        this.$https.storeHost + "/manage/industry/selectListIndustryNoPage";
      this.$https
        .fetchPost(url)
        .then(res => {
          if (res.data.result) {
            this.storeIndustrys = res.data.result;
            this.fetchIndustryText();
          } else {
            this.$message({
              message: res.data.responseStatusType.error.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message.error("经营行业数据获取失败");
        });
    },
    // 显示行业值对应文本
    fetchIndustryText() {
      this.storeIndustrys.forEach(item => {
        if (item.industryID === this.storeIndustryId) {
          this.storeIndustryText = item.industryName;
        }
      });
    },
    // 登出
    logOut() {
      this.$confirm("确认退出登录吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({ path: "/login" });
          localStorage.setItem("isLogin", false);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='scss' scoped>
.settingPage {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  .pageTop {
    font-size: 20px;
    display: flex;
    padding: 25px 0 15px 0;
    height: 81px;
    position: relative;
    .title {
      padding-left: 50px;
      font-size: 25px;
      font-weight: 500;
    }
    .btnsRight {
      width: 50px;
      height: 50px;
      position: absolute;
      right: 50px;
      .btn-save {
        width: 100px;
        font-size: 20px;
        color: #47bf7c;
      }
      .iconfont {
        font-size: 25px;
      }
    }
  }
}
.outerbox {
  width: 1200px;
  height: 760px;
  border: 1px solid #fff;
  margin: 30px auto;
  position: relative;
  border-radius: 6px;
  background-color: #fff;
  // margin-top: -30px;
  .dance {
    width: 135px;
    height: 135px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 500px;
    top: -73px;

    .danceing {
      width: 120px;
      margin: 8px;
      height: 120px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.centercent {
  width: 1094px;
  height: 630px;
  border: 2px solid rgba(254, 176, 25, 1);
  margin: 80px 20px 20px 50px;
  .shopsmap {
    width: 100%;
    height: 200px;
    .coordinates {
      padding: 10px;
    }
    .coordinatesmap {
      width: 950px;
      height: 140px;
      border-radius: 4px;
      margin: 0 auto;
      box-shadow: 0px 0px 11px 2px rgba(207, 207, 207, 1);
    }
  }
  .companyIntroduce {
    width: 100%;
    height: 95px;
    border-top: 1px solid red;
    border-bottom: 1px solid red;
    display: flex;
    label {
      width: 65px;
      height: 100%;
      line-height: 95px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      padding-left: 10px;
      color: rgba(16, 16, 16, 1);
    }
    .conpanyContent {
      width: 100%;
      margin-top: 15px;
      height: 70px;
      padding: 5px 10px;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(16, 16, 16, 1);
    }
  }
}

.list {
  position: relative;
  background-color: #f8f8f8;
  border-radius: 6px;
  overflow: hidden;
  padding: 0 15px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(16, 16, 16, 1);

  .listItem {
    position: relative;
    overflow: hidden;
    padding: 15px 0;
    border-bottom: 1px solid #dcdcdc;
    display: flex;

    &:last-child {
      border-bottom: none;
    }

    .label-left {
      min-width: 90px;
      font-size: 15px;
    }

    .label-right {
      flex: 1;
      text-align: right;
    }

    .el-select {
      position: absolute;
      top: 15px;
      right: 0;
      height: 40px;
    }

    input {
      flex: 1;
      height: 40px;
      text-align: center;
      font-size: 14px;
    }
  }
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  margin-right: 5px;
  flex: 1;

  &:last-child {
    margin-right: 0;
  }
}
</style>
