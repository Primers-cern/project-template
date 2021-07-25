<template>
  <div>
    <vue-tinymce v-model="content" :setting="options" />
  </div>
</template>

<script>
import Axios from "axios";

export default {
  name: "tinymceEditor",
  props: {
    height: {
      type: String,
      default: "400"
    }
  },
  data() {
    return {
      editor: null,
      content: "",
      options: {
        menubar: false, // 顶部菜单
        branding: false, // 技术支持
        elementpath: false, // 路径
        statusbar: true, // 状态栏
        toolbar:
          "fontsizeselect forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify  | numlist bullist | link image | fullscreen",
        toolbar_drawer: "sliding",
        plugins: "image fullscreen link",
        language: "zh_CN",
        height: this.height,
        content_style: "img {width: 100%; height: auto}",

        images_upload_handler: this.handleUpload,
        image_description: false,
        image_dimensions: false,

        init_instance_callback: this.handleInit
      },

      ossOptions: {
        empty: true
      }
    };
  },
  mounted() {},
  methods: {
    handleInit(editor) {
      this.$emit("init", editor);
      this.editor = editor;
    },
    getContent() {
      return this.content;
    },

    setContent(content) {
      if (this.editor) this.editor.focus();
      this.content = content;
    },

    handleUpload(blobInfo, succFun, failFun) {
      let self = this,
        file = blobInfo.blob(),
        maxSize = 5 * 1024 * 1024; // 不能大于5m

      if (file.size >= maxSize) return failFun("请上传 5m 内的图片");

      self.getOssData().then(ossSign => {
        let nameArr = file.name.split("."),
          fileName = nameArr[0] + "_" + new Date().getTime() + "." + nameArr[1];

        var ossData = new FormData();
        ossData.append("name", file.name);
        ossData.append("key", ossSign.upload_path + fileName);
        ossData.append("policy", ossSign.policy);
        ossData.append("OSSAccessKeyId", ossSign.key_id);
        ossData.append("success_action_status", ossSign.success_status);
        ossData.append("signature", ossSign.signature);
        ossData.append("file", file, file.name);

        Axios.post(ossSign.oss_host, ossData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then(res => {
            if (res.status === 200) {
              let image_url =
                ossSign.bucket_domain + ossSign.upload_path + fileName;

              self.$message.success("上传成功");
              succFun(image_url);
            }
          })
          .catch(error => {
            console.log("error", error);
            failFun(error);
          });
      });
    },

    getOssData() {
      return new Promise(resolve => {
        let self = this;

        if (!self.ossOptions.empty) return resolve(self.ossOptions);
        let url = "Index/Image/getFrontOSSConfig",
          params = {
            upload_type: "image"
          };

        self.$http.post(url, params).then(data => {
          let res = data.data;

          self.ossOptions = res;
          resolve(res);
        });
      });
    }
  }
};
</script>

<style scoped>
@import "~plugins/tinymce/css/content.min.css";
@import "~plugins/tinymce/css/skin.min.css";
@import "~plugins/tinymce/css/skin.content.min.css";
@import "~plugins/tinymce/css/custom.css";
</style>
