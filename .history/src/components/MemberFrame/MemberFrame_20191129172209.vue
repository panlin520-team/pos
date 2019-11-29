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

  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
 
  }
};
</script>

<style lang='scss' scoped>

</style>