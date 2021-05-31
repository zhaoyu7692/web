<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="submitStatus.item_list" stripe>
      <el-table-column prop="rid" label="运行编号" min-width="12" align="center"></el-table-column>
      <el-table-column prop="index" label="题目编号" min-width="12" align="center"></el-table-column>
      <el-table-column label="运行结果" min-width="16" align="center">
        <template slot-scope="scope">
          <el-link v-if="scope.row.compilation_message !== null && scope.row.compilation_message.length > 0"
                   :style="getStyle(scope)" @click="showCompileMessage(scope.row.compilation_message)">
            {{ getStatus(scope) }}
          </el-link>
          <div v-else :style="getStyle(scope)">{{ getStatus(scope) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="运行时间" min-width="13" align="center">
        <template slot-scope="scope">
          <div>{{ null === scope.row.time_cost ? "" : scope.row.time_cost + "ms" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="运行内存" min-width="13" align="center">
        <template slot-scope="scope">
          <div>{{ null === scope.row.memory_cost ? "" : scope.row.memory_cost + "KB" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="提交语言" min-width="12" align="center">
        <template slot-scope="scope">
          <div>{{ languages[scope.row.language] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名称" min-width="16" align="center"></el-table-column>
      <el-table-column prop="submit_time" label="提交时间" min-width="24" align="center"></el-table-column>
    </el-table>
    <el-pagination
        @current-change="currentChange"
        :current-page="1"
        :page-size="submitStatus.size"
        layout="prev, pager, next"
        :total="submitStatus.total"
        class="submit-pagination"
    ></el-pagination>
  </el-main>
</template>

<script>

import {languages} from "@/utils/common";
import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "SubmitStatus",
  data() {
    return {
      languages,
      submitStatus: {
        total: 0,
        size: 20,
        item_list: [{
          rid: 1,
          time_cost: 1234,
          memory_cost: 22222,
          status: 1,
          compilation_message: '',
        }]
      },
    };
  },
  computed: {},
  methods: {
    showCompileMessage(msg) {
      EventBus.$emit(EventName.ChangeSubmitDetailVisible, true, msg)
    },
    currentChange(page) {
      let params = {
        cid: this.$route.params.cid === undefined ? 0 : this.$route.params.cid,
        page,
        size: this.submitStatus.size,
      }
      this.$http.get('/submitStatus/', {params: params})
          .then(({submit_status}) => {
            console.log(submit_status)
            this.submitStatus = submit_status
          })
          .catch(errorCode => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '提交列表获取失败'})
            }
          })
    },
    getStatus(scope) {
      const statusText = [
        "等待评测",
        "正在编译",
        "编译错误",
        "编译超时",
        "正在运行",
        "时间超限",
        "内存超限",
        "输出超限",
        "运行错误",
        "格式错误",
        "答案错误",
        "答案正确"
      ]
      if (scope.row.status < 0) return "系统错误";
      return statusText[scope.row.status];
    },
    getStyle(scope) {
      const statusColor = [
        "#6633ff",
        "#6633ff",
        "#ff0000",
        "#ff0000",
        "#6633ff",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ffa500",
        "#ff0000",
        "#ff0000",
        "#00aa00"
      ]
      return "color: " + statusColor[scope.row.status];
    }
  },
  created() {
    this.currentChange(1);
  }
};
</script>

<style scoped>
.submit-pagination {
  float: right;
  padding: 20px;
}
</style>