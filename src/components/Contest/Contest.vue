<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="problems" stripe>;
      <el-table-column prop="index" label="#" min-width="60"></el-table-column>
      <el-table-column label="题目" min-width="400">
        <template slot-scope="scope">
          <router-link :to="'/contest/'+ contest.cid + '/' + scope.row.index">
            <el-link>{{ scope.row.title }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="accept" label="通过数" min-width="80" align="center"></el-table-column>
      <el-table-column prop="total" label="提交数" min-width="80" align="center"></el-table-column>
      <el-table-column label="通过率" min-width="180">
        <template slot-scope="scope">
          <el-progress :percentage="acceptRate(scope)"></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>

import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "Contest",
  data() {
    return {
      problems: [],
      contest: {},
    };
  },
  methods: {
    acceptRate(scope) {
      if (scope.row.total === 0) return 0;
      return Number(((scope.row.accept / scope.row.total) * 100).toFixed(0));
    },
    loadData() {
      this.$http.get('/contest/?cid=' + this.$route.params.cid)
          .then(({problems, contest}) => {
            console.log(problems)
            this.problems = problems
            this.contest = contest
            let problemIds = []
            this.problems.forEach((item) => {
              problemIds.push(item.index)
            })
            EventBus.$emit(EventName.UpdateContestPIds, problemIds)
          })
          .catch((errorCode) => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '111数据请求失败'})
            }
          })
    }
  },
  computed: {},
  created() {
    this.loadData()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>