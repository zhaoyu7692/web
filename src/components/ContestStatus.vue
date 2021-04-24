<template>
  <el-main style="margin: 0 auto; width: 90%">
    <el-table :data="contest_rank" stripe :cell-style="{padding: 0}">
      <el-table-column label="排名" width="100" align="center">
        <template slot-scope="scope">
          <div>{{ contest_rank.indexOf(scope.row) + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="100" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="过题数" width="100" align="center">
        <template slot-scope="scope">
          {{ acceptCount(scope) }}
        </template>
      </el-table-column>
      <el-table-column prop="penalty" label="罚时" width="100" align="center">
        <template slot-scope="scope">
          {{ penalty(scope) }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in contest.indexes" :label="item.toString()" :key="index"
                       :min-width="20" align="center">
        <template slot-scope="scope">
          <div :class="problemStatusClass(scope, item)">
            {{ tryCount(scope, item) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
export default {
  name: "ContestStatus",
  data() {
    return {
      contest_rank: [
        {
          username: '111',
          problem: [
            {
              index: 1,
              try_count: 2,
              accept_time: '2021-4-4 22:43'
            }
          ]
        },
        {
          username: '112',
          problem: [
            {
              index: 1,
              try_count: 0,
              // accept_time: '2021-4-4 22:43'
            }
          ]
        },
        {
          username: '113',
          problem: [
            {
              index: 1,
              try_count: 1,
              // accept_time: '2021-4-4 22:43'
            }
          ]
        },
      ],
      contest: {
        indexes: [1, 2, 3, 4],
        cid: 1,
        title: '1111111',
        count: 123,
        begin_time: '2021-4-4 21:43', // 单位 ms
        duration: 68000, // 单位 s
      }
    }
  },
  computed: {},
  methods: {
    tryCount(scope, index) {
      let data = null
      for (let i = 0; i < scope.row.problem.length; i++) {
        if (scope.row.problem[i].index === index) {
          data = scope.row.problem[i]
          break
        }
      }
      if (data === null || data.try_count === 0) {
        return '-'
      }
      if (this.inContestRunning(data.accept_time)) {
        if (data.try_count === 1) {
          return '+ (' + this.formatTimeCost(data.accept_time) + ')'
        } else {
          return '-' + (data.try_count - 1) + ' (' + this.formatTimeCost(data.accept_time) + ')'
        }
      }
      return '-' + data.try_count
    },
    formatTimeCost(time) {
      let beginTime = new Date(time).getTime() - new Date(this.contest.begin_time).getTime()
      return beginTime / (1000 * 60)
    },
    problemStatusClass(scope, index) {
      let data = null
      for (let i = 0; i < scope.row.problem.length; i++) {
        if (scope.row.problem[i].index === index) {
          data = scope.row.problem[i]
          break
        }
      }
      if (data === null || data.try_count === 0) {
        return 'problem-style-undo'
      }
      if (this.inContestRunning(data.accept_time)) {
        return 'problem-style-accept'
      }
      return 'problem-style-error'
    },
    inContestRunning(time) {
      if (time === undefined || time === null) {
        return false
      }
      let acceptTime = new Date(time).getTime(), beginTime = new Date(this.contest.begin_time).getTime()
      if (acceptTime > beginTime + this.contest.duration * 1000) {
        return false
      }
      return acceptTime > beginTime;
    },
    acceptCount(scope) {
      let acceptCount = 0
      scope.row.problem.forEach((value) => {
        if (value.accept_time !== undefined && value.accept_time !== null && this.inContestRunning(value.accept_time)) {
          acceptCount++
        }
      })
      return acceptCount
    },
    penalty(scope) {
      let penalty = 0
      scope.row.problem.forEach((value) => {
        if (value.accept_time !== undefined && value.accept_time !== null && this.inContestRunning(value.accept_time)) {
          let beginTime = new Date(this.contest.begin_time).getTime(),
              acceptTime = new Date(value.accept_time).getTime()
          penalty += (acceptTime - beginTime) / (1000 * 60) + (value.try_count - 1) * 20
        }
      })
      return penalty
    }
  },
  created() {
  }
}
</script>

<style scoped>
.problem-style-undo, .problem-style-error, .problem-style-accept {
  font-size: 10px;
  line-height: 44px;
  margin: 1px;
}

.problem-style-undo {
  background-color: rgba(0, 0, 0, 0);
}

.problem-style-error {
  background-color: #ff3e3ef5;
}

.problem-style-accept {
  background-color: #42b983;
}

.cxl {
  margin: -11px 0;
  padding: 0 0;
  line-height: 44px;
  background-color: #42b983;

}
</style>