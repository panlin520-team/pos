<!-- 富文本编辑器 -->
<template>
  <div ref="editor" style="text-align:left"></div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editor",
  data() {
    return {
      editor: ""
    };
  },
  props: {
    content: { required: true }
  },
  watch: {
    content: function(val) {
      this.editor.txt.html(val);
    }
  },
  mounted() {
    this.setEditor();
    this.editor.txt.html(this.content);
  },
  methods: {
    setEditor() {
      this.editor = new E(this.$refs.editor);
      // 每次改变获取内容
      this.editor.customConfig.onchange = html => {
        this.$emit("catchData", html);
        this.$emit("change", html);
      };
      this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; //图片大小限制为3M
      this.editor.customConfig.uploadImgMaxLength = 5; //限制一次最多上传5张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; //设置超时时间
      this.editor.customConfig.uploadImgServer =
        this.$https.productHost + "/manage/product/uploadFuwenbenPic"; // 上传图片到服务器
      this.editor.customConfig.uploadFileName = "file"; // 后台接受上传文件的参数名

      // 菜单配置
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];

      this.editor.customConfig.uploadImgHooks = {
        before: function(xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function(xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          this.imgUrl = Object.values(result.data).toString();
        },
        fail: function(xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function(xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function(xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        customInsert: function(insertImg, result, editor) {
          let url = result.data.src;
          insertImg(url);
        }
      };

      this.editor.create(); // 创建富文本实例
    }
  }
};
</script>
