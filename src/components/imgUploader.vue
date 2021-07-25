<template>
  <div class="center-flex">
    <div
      v-for="(item, index) in fileList"
      class="upload-show-item group"
      :key="index"
      :style="`width: ${size[0]}px; height: ${size[1]}px;`"
    >
      <el-image class="w-full h-full" :src="item.url" fit="cover"></el-image>
      <div class="upload-show-panel">
        <i class="el-icon-zoom-in cursor-pointer" @click="viewer.push(item.url)"></i>
        <el-popconfirm title="确认删除该项？" @confirm="handleRemove(item)">
          <template #reference>
            <i class="el-icon-delete cursor-pointer ml-3"></i>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-upload
      v-show="!upToLimit"
      ref="elUploader"
      class="img-uploader inline-block"
      action="#"
      :on-change="handleAdd"
      :auto-upload="false"
      :show-file-list="false"
    >
      <div class="upload-btn group" :style="`width: ${size[0]}px; height: ${size[1]}px;`">
        <i class="el-icon-plus text-4xl text-gray-400 group-hover:text-theme"></i>
        <span v-if="tips" class="mt-4 text-xs text-gray-300 group-hover:text-gray-500">{{ tips }}</span>
      </div>
    </el-upload>
  </div>

  <teleport to="body">
    <el-image-viewer
      v-if="viewer.length"
      :urlList="viewer"
      hideOnClickModal
      @close="viewer.length = 0"
    />
  </teleport>

  <el-dialog v-model="showCropper" title="裁剪" width="500px" @close="cropping = false;">
    <vue-picture-cropper
      :img="fileSource.value"
      :boxStyle="{
        minHeight: '300px',
        maxHeight: '50vh',
        backgroundColor: '#f8f8f8',
      }"
      :options="{
        viewMode: 1,
        zoomable: false,
        dragMode: 'crop',
        autoCropArea: '1',
        aspectRatio: props.ratio[0] / props.ratio[1]
      }"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCropper = false">取 消</el-button>
        <el-button type="primary" :loading="cropping" @click="handleCrop">裁 剪</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmit, defineProps, reactive, ref, computed, inject } from "vue";
import tools from "js/tools";
import uploadTool from 'components/uploadTool.vue'
import VuePictureCropper, { cropper } from "vue-picture-cropper/dist/esm";

const emit = defineEmit()
const props = defineProps({
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
    default: () => ([500, 500])
  },
  tips: {
    type: String,
    default: "尺寸比例 1:1"
  },
  size: {
    type: Array,
    default: () => ([120, 120])
  }
})

const viewer = ref([])

const elUploader = ref()
const fileList = ref([...props.list])
const upToLimit = computed(() => fileList.value.length >= props.limit)
const handleAdd = (file, list) => {
  elUploader.value.handleRemove(file)

  let
    maxSize = 5 * 1024 * 1024, // 5m
    errorText = ''
  if (file.size >= maxSize) errorText = "请上传 5m 内的图片"
  if (!~file.raw.type.indexOf('image/')) errorText = "请添加图片格式"
  if (errorText) return tools.message.warning(errorText)

  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    fileSource.value = {
      uid: file.uid,
      value: reader.result
    }
    showCropper.value = true;
  }
}


const showCropper = ref(false)
const cropping = ref(false)
const fileSource = ref({})
const outputOption = reactive({
  width: props.ratio[0],
  height: props.ratio[1]
})
const handleCrop = () => {
  const canvas = cropper.getCroppedCanvas(outputOption)
  cropping.value = true
  canvas.toBlob(blob => {
    blob.uid = fileSource.value.uid
    const item = {
      file: blob,
      url: cropper.getDataURL()
    }

    fileList.value.push(item)
    showCropper.value = false
    emit('add', item)
  })
}

const handleRemove = file => {
  fileList.value.splice(fileList.value.indexOf(file), 1)
  emit('remove', file)
}

const handleUpload = async () => {
  const uploadAction = uploadTool.setup().upload
  fileList.value.map(async item => {
    const result = await uploadAction(item)
    return {
      uploaded: true,
      name: item.name,
      url: result.filePath
    }
  });

  const uploadedList = {
    success: !fileList.value.some(item => !!item.file),
    value: [...fileList.value]
  }

  emit("update:list", [...fileList.value]);
  emit("uploaded", uploadedList);
  return result
}

</script>

<style>
.upload-show-item {
  @apply rounded-md border border-gray-300 mr-3 overflow-hidden inline-block relative;
}

.upload-show-panel {
  @apply group-hover:opacity-100 text-white text-2xl bg-gray-800 bg-opacity-50 opacity-0 transition-opacity center-flex justify-center absolute top-0 bottom-0 w-full;
}

.upload-btn {
  @apply hover:(border-solid border-theme) bg-blue-gray-50 cursor-pointer rounded-md border border-dashed border-gray-300 center-flex flex-col justify-center transition-all;
}
/* 
.img-uploader .el-upload-list--picture-card {
  font-size: 0;
}

.img-uploader .el-upload--picture-card {
  margin-bottom: 8px;
}

.img-uploader.over-limit .el-upload--picture-card {
  opacity: 0.4;
  border-color: #c0ccda;
  cursor: not-allowed;
} */
</style>
