<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="contests.item_list" stripe>;
      <el-table-column prop="cid" label="#" min-width="60"></el-table-column>
      <el-table-column label="比赛名称" min-width="360">
        <template slot-scope="scope">
          <el-link @click="jumpContest(scope)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="contestStatusColor(scope)">{{ contestStatusText(scope) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="begin_time" label="开始时间" min-width="160" align="center"></el-table-column>
      <el-table-column label="持续时长" min-width="80" align="center">
        <template slot-scope="scope">
          <div>{{ formatDuration(scope) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="register_count" label="报名人数" min-width="100" align="center"></el-table-column>
      <el-table-column min-width="80" label="操作" align="center">
        <template>
          <div>
            <el-link type="primary">参赛</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @current-change="pageChanged"
        :current-page="1"
        :page-size="contests.size"
        layout="prev, pager, next"
        :total="contests.total"
        class="contests_pagination"
    ></el-pagination>
  </el-main>
</template>

<script>

import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "Contests",
  data() {
    return {
      contests: {
        item_list: [
          {
            cid: 1,
            title: '1111111',
            count: 123,
            begin_time: 1615013622737, // 单位 ms
            duration: 18000, // 单位 s
          },
        ],
        total: 0,
        size: 20,
      },
    }
  },
  methods: {
    jumpContest(scope) {
      EventBus.$emit(EventName.UpdateContest, scope.row)
    },
    pageChanged(page) {
      console.log(page)
      this.$http.get('/contests/?page=' + page + "&size=" + this.contests.size)
          .then(({contests}) => {
            console.log(contests)
            this.contests = contests
          }).catch(errorCode => {
        if (errorCode !== -1) {
          this.$message({type: 'error', message: '比赛列表获取失败！'})
        }
      })
    },
    formatDuration(scope) {
      return ('0' + (scope.row.duration / 3600).toString()).slice(-2) + ':' + ('0' + (scope.row.duration % 3600).toString()).slice(-2)
    },
    contestStatus(scope) {
      // 根据当前时间判断比赛进行状态
      let beginTime = new Date(scope.row.begin_time).getTime()
      // console.log(scope.row.title, now, beginTime + scope.row.duration * 1000, beginTime, scope.row.duration)
      if (Date.now() > beginTime + scope.row.duration * 1000) {
        return 2
      }
      if (Date.now() > beginTime) {
        return 1
      }
      return 0
    },
    contestStatusColor(scope) {
      const statusColor = ['', 'success', 'danger']
      return statusColor[this.contestStatus(scope)]
    },
    contestStatusText(scope) {
      const statusText = ['未开始', '进行中', '已结束']
      return statusText[this.contestStatus(scope)]
    },
    formatStartTime(scope) {
      let date = new Date();
      date.setTime(scope.start_time)
      return date.toDateString()
    }
  },
  created() {
    this.pageChanged(1)
  }
}
</script>

<style scoped>
.contests_pagination {
  float: right;
  padding: 20px;
}
</style>