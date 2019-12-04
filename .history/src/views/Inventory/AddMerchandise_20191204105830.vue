<!-- 定制-->
<template>
  <div class="customization-page_root">
    <el-row>
      <el-col>
        <p class="title">收银产品</p>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.commodityTypeID"
            :label="item.commodityTypeName"
            :name="item.commodityTypeName"
          >
            <el-tabs
              type="border-card"
              v-if="visible_common == false"
              v-model="activeName_common"
              @tab-click="commonleClick"
            >
              <!-- 项目盒子 -->
              <el-tab-pane
                v-for="(item) in productbleTabs"
                :key="item.commoTypeID"
                :label="item.subclassName"
                :name="item.subclassName"
              >
                <!-- {{item.content}} -->
                <el-row :gutter="20" class="el_carconnent">
                  <div class="carBox">
                    <div
                      class="grid-content"
                      v-for="item in productmodel"
                      :key="item.index"
                      @click="car_smreos(item)"
                    >
                      <div class="pd-content">
                        <span>{{item.productName}}</span>
                      </div>
                      <div class="bottom-content">
                        <span class="left-list">
                          <span class="figure-title">￥：</span>
                          <span class="figure">{{item.retailPrice}}</span>
                          元
                        </span>
                        <span class="right-list">
                          <span class="figure-title">库存：</span>
                          <span class="figure">{{item.stockNum}}</span>个
                        </span>
                      </div>
                    </div>
                  </div>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <!-- 商品 -->
            <el-tabs
              type="border-card"
              v-if="visible_merchandise == true"
              v-model="activeName_common"
              @tab-click="commonleClis"
            >
              <!-- 项目盒子 -->
              <el-tab-pane
                v-for="(item) in productbleTabdise"
                :key="item.productTypeId"
                :label="item.productTypeName"
                :name="item.productTypeName"
              >
                <!-- {{item.content}} -->
                <el-row :gutter="20" class="el_carconnent">
                  <div class="carBox">
                    <div
                      class="grid-content"
                      v-for="item in productmodtab"
                      :key="item.index"
                      @click="car_smreos(item)"
                    >
                      <div class="pd-content">
                        <span>{{item.productName}}</span>
                      </div>
                      <div class="bottom-content">
                        <span class="left-list">
                          <span class="figure-title">￥：</span>
                          <span class="figure">{{item.retailPrice}}</span>
                          元
                        </span>
                        <span class="right-list">
                          <span class="figure-title">库存：</span>
                          <span class="figure">{{item.stockNum}}</span>个
                        </span>
                      </div>
                    </div>
                  </div>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <!-- 体验卡 -->
          </el-tab-pane>

          <!-- <el-tab-pane label="产品" name="second">产品</el-tab-pane> -->
        </el-tabs>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next"
          :total="pageTotal"
        ></el-pagination>
      </el-col>
      <!-- 右边内容 -->
      <el-col>
        <div class="list-content-right">
          <div class="project-header">
            <p class="project-title">项目定制订单</p>
            <div class="project-name">
              <img src="../../assets/images/member.png" alt />
              <span class="name">
                姓名：
                <span class="name-message">{{userNames}}</span>
              </span>
            </div>
          </div>
          <!-- 列表 -->
          <div class="list-content">
            <el-table :data="tableDataList" class="table-box">
              <el-table-column label="项目名称" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.productName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <input
                      @change="changeNumer(scope.row)"
                      type="number"
                      v-model="scope.row.amount"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="单价" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">
                    <input
                      type="number"
                      @change="changeRefer(scope.row)"
                      v-model="scope.row.retailPrice"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="原价" width="80">
                <template slot-scope="scope">
                  <div slot="reference" class="name-wrapper">{{ scope.row.retailPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="总价" width="80">
                <template slot-scope="scope">
                  <div
                    slot="reference"
                    class="name-wrapper"
                  >{{ scope.row.amount * scope.row.retailPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="compile" label="编辑">
                <template slot-scope="scope">
                  <el-button @click="removeBtn(scope.row,scope.$index)" type="danger" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 底部信息 -->
          <div class="bottom-box">
            <div class="demo-input-suffix">
              备注：
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="display-box">
              <div class="price-display">
                <p>
                  原价：
                  <span class="price">{{totalPrice}}</span>
                  <span class="price-unit">元</span>
                </p>
                <p>
                  总价：
                  <span class="price">{{totalPrice}}</span>
                  <span class="price-unit">元</span>
                </p>
              </div>
              <div class="button-srue">
                <el-button @click="placeOrder " type="warning">确认定制</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 产品弹出框 -->
    <!-- 弹出框 -->
    <PopOver
      custom-class="storageblock"
      :visible.sync="visible_examine"
      @close="closePopOver"
      width="518px"
    >
      <div class="stgblcktop" slot="top">支付信息</div>
      <div class="stgblcktopmain" slot="main">
        <div class="paymentprice">
          <div class="stgeprice">
            <label>原价：</label>
            <span>{{totalPrice}}元</span>
          </div>
          <div class="stgeprice">
            <label>总价：</label>
            <span>{{totalPrice}}元</span>
          </div>
        </div>
        <div>
          <div class="catalysis">
            <el-radio-group @change="input_radio" v-model="input_cataly" size="mini" class="ratio">
              <el-radio :label="3">线下</el-radio>
              <el-radio :label="4">线上</el-radio>
            </el-radio-group>
            <el-input v-model="input_present" placeholder="请输入储蓄支付"></el-input>
          </div>
        </div>
      </div>
      <div class="stgblckbottom" slot="bottom">
        <el-button @click="cancel_storage">取消</el-button>
        <el-button @click="confirm_storage" type="success">确认购买</el-button>
      </div>
    </PopOver>
    <MemberFrame></MemberFrame>
  </div>
</template>

<script>
export default {
  name: "Navnu",
  data() {
    return {
    }
  },
  computed: {},
  watch: {
  },
  methods: {

  },
  created() {
  },
  mounted() {}
};
</script>

<style lang='scss'>

</style>
