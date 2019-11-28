<!-- input输入数值控制组件 -->
<template>
  <input
    class="input-number"
    type="number"
    :placeholder="placeholder"
    v-model="inputData"
    @keydown="keydownFn"
  />
</template>

<script>
export default {
  props: {
    // 小数位数
    point: {
      default: 0
    },
    // 最大值
    max: Number,
    // 输入提示
    placeholder: String,
    // 数据对象
    value: {
      default: null
    }
  },
  computed: {
    inputData: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        let val = this.$el.value;
        let len = val.length;

        // 若输入08，变为8
        if (len == 2 && val.charAt(0) == 0 && val.charAt(1) != ".") {
          this.$el.value = val.charAt(1);
          this.setParentModeVal(this.$el.value);
          return;
        }

        // 禁止输入多个小数点
        if (Math.abs(this.value) > 0 && val === "" && value === "") {
          if (this.keyDownDel) {
            this.$el.value = "";
          } else {
            this.$el.value = this.value;
          }
          this.setParentModeVal(this.$el.value);
          return;
        }

        // 处理输入“点、e、+、-等被识别为数字字符
        if (this.value === "" && val === "" && value === "") {
          //字母类非数字输入都为''；
          this.$el.value = "";
          this.setParentModeVal("");
          return;
        }

        // 保留小数
        if (val) {
          let pointIndex = val.indexOf(".");
          if (this.point == 0 && pointIndex !== -1) {
            this.$el.value = val.substr(0, pointIndex);
            this.setParentModeVal(this.$el.value);
            return;
          }
          if (pointIndex > 0 && len - pointIndex > this.point + 1) {
            this.$el.value = val.substr(0, pointIndex + this.point + 1);
            this.setParentModeVal(this.$el.value);
            return;
          }
        }

        // 最大值
        if (this.max > 0 && val > this.max) {
          this.$el.value = val.substr(0, len - 1);
          this.setParentModeVal(this.$el.value);
          return;
        }

        this.setParentModeVal(val);
        return;
      }
    }
  },
  mounted() {
    // 判断键盘是否是删除动作
    var that = this;
    window.document.onkeydown = function(event) {
      let e = event || window.event || arguments.callee.caller.arguments[0];
      if (e.keyCode == 8 || e.keyCode == 46) {
        that.keyDownDel = true;
      } else {
        that.keyDownDel = false;
      }
    };
  },
  data() {
    return {
      keyDownDel: false // 判断键盘输入值
    };
  },
  methods: {
    setParentModeVal(value) {
      this.$emit("input", value);
    },
    keydownFn(event) {
      let e = event || window.event;
      if (e.keyCode == 8 || e.keyCode == 46) {
        //Backspace || Delete
        this.keyDownDel = true;
      } else {
        this.keyDownDel = false;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.input-number {
  background-color: transparent;
  box-sizing: border-box;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  width: 100%;
}

//去掉输入框右侧加减箭头
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
