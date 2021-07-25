<script setup>
import { inject } from "vue";
import tools from 'js/tools'

const getOssOptions = inject('getOssOptions')
const upload = info => {
  console.log(info)
  const file = info.file
  if (!file) return info

  const
    fileName = file.uid + "." + file.type.split("/")[1],
    params = {
      name: info.name,
      policy: oss.policy,
      signature: oss.signature,
      OSSAccessKeyId: oss.key_id,
      key: oss.upload_path + fileName,
      success_action_status: oss.success_status,
    }

  formData = new FormData();
  formData.append("file", file, info.name);
  for (let key in params) formData.append(key, params[key])

  return tools.http.defult
    .post(oss.bucket_domain, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      if (res.status !== 200) tools.message.error('上传出错了！' + res.status)
      res.fileName = fileName
      res.params = params
      res.filePath = oss.bucket_domain + oss.upload_path + fileName
      return res
    })
}

</script>
