<template>
  <el-date-picker
    v-model="C_timeRange"
    :editable="false"
    type="datetimerange"
    value-format="timestamp"
    format="yyyy-MM-dd HH:mm"
    align="center"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['00:00:00', '23:59:59']"
    :picker-options="$tools.timeRangeOpt(2)"
  ></el-date-picker>
</template>

<script>
export default {
  name: "timeRangePicker",
  props: {
    start: String,
    end: String
  },
  data() {
    return {};
  },
  computed: {
    C_timeRange: {
      get() {
        let self = this,
          { start, end } = self;

        return start && end ? [start + "000", end + "000"] : ""; // 补充000成标准时间戳
      },
      set(arr) {
        let self = this,
          start,
          end;

        start = arr ? arr[0].toString().substring(0, 10) : ""; // 秒为单位，10位时间戳
        end = arr ? arr[1].toString().substring(0, 10) : "";

        self.$emit("update:start", start);
        self.$emit("update:end", end);
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style>
</style>
