<!-- 弹框Modal组件 -->
<template>
  <transition name="modal-fade">
    <div class="popover" v-if="visible" @click="close" :class="CustomClass">
      <!-- 遮罩层 -->
      <div class="popoverBackdrop" @click="close" v-if="BackDrop"></div>
      <!-- 弹框内容 -->
      <div
        class="popoverBody"
        @click.stop
        role="popover"
        aria-labelledby="popoverTitle"
        arial-describedby="popoverDescription"
        :style="{width: width,minHeight: minHeight,marginTop: marginTop}"
      >
        <div class="popover__header" :style="{padding: headerPadding}">
          <!-- 标题 -->
          <slot name="top"></slot>
          <button type="button" class="popover__headerbtn" @click="close" v-if="ShowClose"></button>
        </div>
        <div class="popover__main" :style="{padding: mainPadding}">
          <!-- 主体 -->
          <slot name="main"></slot>
        </div>
        <div class="popover__bottom" :style="{padding: bottomPadding}">
          <!-- 底部 -->
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "PopOver",
  props: {
    // 是否显示popover
    // 使用 :visible.sync="visible"
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    // popover宽度
    // 使用 :width="50%" 或 width="200px"
    width: {
      type: String,
      default: "50%"
    },
    // popover高度
    // 使用 minHeight="200px"
    minHeight: {
      type: String,
      default: "200px"
    },
    // popover margin-top
    // 使用 marginTop="15vh"
    marginTop: {
      type: String,
      default: "15vh"
    },
    // 元素内边距
    headerPadding: {
      type: String,
      default: "5px 0"
    },
    mainPadding: {
      type: String,
      default: "5px 0"
    },
    bottomPadding: {
      type: String,
      default: "5px 0"
    },
    // 显示关闭按钮
    //  使用 :show-close="false"
    ShowClose: {
      type: Boolean,
      default: true
    },
    // 显示遮罩层
    // 使用 :back-drop="false"
    BackDrop: {
      type: Boolean,
      default: true
    },
    // popover 自定义类名
    CustomClass: {
      type: String,
      default: ""
    }
  },
  mounted() {
  },
  beforeDestory() {
    // 销毁
    document.body.removeChild(this.$el);
  },
  computed: {},
  watch: {},
  methods: {
 
  }
};
</script>

<style lang='scss' scoped>

</style>