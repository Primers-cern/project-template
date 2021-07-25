<template>
  <div class="img-upload-wrapper wrap-flex">
    <div v-for="(item, index) in list" :key="index" class="file-item-wrapper">
      <el-image style="width: 100%; height: 100%" :src="item" fit="cover"></el-image>
      <div class="item-del-btn" @click="handleRemove(index)">
        <i class="el-icon-delete"></i>
      </div>
    </div>
    <el-upload
      v-if="preview && list.length < limit"
      action="#"
      :show-file-list="false"
      :http-request="catchImage"
    >
      <div class="file-item-wrapper uploader center-flex column-flex justify-center">
        <i class="el-icon-plus size-32 text-bold text-info" :class="tips && 'mt-2'"></i>
        <p v-if="tips" class="text-center text-muted mt-1 size-12">{{tips}}</p>
      </div>
    </el-upload>
    <el-upload v-else action="#" :show-file-list="false" :http-request="catchImage">
      <slot />
    </el-upload>

    <el-dialog
      title="图像裁剪"
      :visible.sync="showCropper"
      width="400px"
      append-to-body
      center
      :close-on-click-modal="false"
      @open="setCropper"
      @close="$refs.cropper.clear(); cropping = false"
    >
      <vue-cropper
        ref="cropper"
        :aspectRatio="this.ratio[0]/this.ratio[1]"
        :zoomable="false"
        :autoCropArea="1"
      ></vue-cropper>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          :loading="cropping"
          @click="cropping = true;$refs.cropper.getCroppedCanvas(outputOption).toBlob(handleUpload)"
        >{{cropping ? '正在' : '确认'}}裁剪</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Axios from "axios";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  name: "imgUploader",
  components: { VueCropper },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    },
    ratio: {
      type: Array,
      default: () => [500, 500]
    },
    tips: {
      type: String,
      default: "尺寸比例 1:1"
    },
    preview: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      showCropper: false,
      cropping: false,
      fileSource: {},
      outputOption: {
        width: this.ratio[0],
        height: this.ratio[1]
      },
      ossOptions: {
        empty: true
      }
    };
  },
  mounted() {},
  methods: {
    // 获取到图片
    catchImage({ file }) {
      let self = this,
        maxSize = 5 * 1024 * 1024;

      if (file.size >= maxSize)
        return self.$message.error("请上传 5m 内的图片");

      self.fileSource = file;
      self.showCropper = true;
    },

    setCropper() {
      let self = this,
        url = URL.createObjectURL(self.fileSource);

      self.$nextTick(() => {
        let cropper = self.$refs.cropper;
        cropper.initCrop();
        cropper.replace(url);
      });
    },

    handleUpload(blob) {
      let self = this;
      self.getOssData().then(ossSign => {
        let file = self.fileSource,
          fileName = file.uid + "." + file.type.split("/")[1];

        var ossData = new FormData();
        ossData.append("name", file.name);
        ossData.append("key", ossSign.upload_path + fileName);
        ossData.append("policy", ossSign.policy);
        ossData.append("OSSAccessKeyId", ossSign.key_id);
        ossData.append("success_action_status", ossSign.success_status);
        ossData.append("signature", ossSign.signature);
        ossData.append("file", blob, file.name);

        Axios.post(ossSign.bucket_domain, ossData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then(res => {
            if (res.status === 200) {
              let imgUrl =
                ossSign.bucket_domain + ossSign.upload_path + fileName;

              if (self.preview)
                self.$emit("update:list", [...self.list, imgUrl]);
              self.$emit("uploaded", imgUrl);

              self.$message.success("上传成功");
              self.cropping = false;
              self.showCropper = false;
            }
          })
          .catch(error => {
            console.log("error", error);
          });
      });
    },

    handleRemove(index) {
      let self = this;
      self
        .$confirm("确认删除该图片", "提示", {})
        .then(() => {
          let emitArr = [...self.list];
          emitArr.splice(index, 1);
          self.$emit("update:list", emitArr);
          self.$emit("remove", index);
        })
        .catch(() => {});
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
.file-item-wrapper {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  height: 100px;
  width: 100px;
  margin: 0 20px 20px 0;
  background-color: var(--banground-color);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.item-del-btn {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #00000066;
  opacity: 0;
  transition: all 0.3s;
}

.item-del-btn .el-icon-delete {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 32px;
  color: #fff;
  transform: translate(-50%, -50%);
}

.file-item-wrapper:hover .item-del-btn {
  opacity: 1;
}

.uploader:hover {
  border-color: var(--theme-color);
}
</style>
