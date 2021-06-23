<template>
  <el-main style="margin: 0 auto; width: 90%">
    <el-table :data="contest_rank" stripe :cell-style="{padding: 0}">
      <el-table-column label="排名" width="100" align="center">
        <template slot-scope="scope">
          <div>{{ contest_rank.indexOf(scope.row) + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="100" align="center"></el-table-column>
      <el-table-column prop="accept_count" label="过题数" width="100" align="center"></el-table-column>
      <el-table-column prop="penalty" label="罚时" width="100" align="center"></el-table-column>
      <el-table-column v-for="(item, index) in contest.indexes" :label="item.toString()" :key="index"
                       :min-width="20" align="center">
        <template slot-scope="scope">
          <div :class="problemStatusClass(scope.row.problem[index])">
            {{ submitText(scope.row.problem[index]) }}
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
        // {
        //   username: String,
        //   accept_count: Number,
        //   penalty: Number,
        //   problem: [
        //     {
        //       index: Number,
        //       try_count: Number,
        //       accept_time: String
        //     }
        //   ]
        // },
      ],
      contest: {
        indexes: Array,
        cid: Number,
        title: String,
        count: Number,
        begin_time: String, // 单位 ms
        duration: Number, // 单位 s
      }
    }
  },
  computed: {},
  methods: {
    submitText(data) {
      if (data.try_count === 0) {
        return '-'
      } else {
        if (data.accept_time >= 0) {
          return '+' + (data.try_count > 1 ? (data.try_count - 1) : '')
        } else {
          return '-' + data.try_count
        }
      }
    },
    problemStatusClass(data) {
      const className = ['problem-style-undo', 'problem-style-accept', 'problem-style-error']
      if (data === null || data.try_count === 0) {
        return className[0]
      } else if (data.accept_time > 0) {
        return className[1]
      }
      return className[2]
    },
    loadRank() {
      this.$http.get('/contestRank/?cid=' + this.$route.params.cid)
          .then(({contest_rank, contest}) => {
            console.log(contest_rank, contest)
            this.contest = contest
            this.contest_rank = contest_rank
          })
          .catch(errorCode => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '11'})
            }
          })
    }
  },
  created() {
    this.loadRank()
  }
}
</script>

<style scoped>
.problem-style-undo, .problem-style-error, .problem-style-accept {
  font-size: 10px;
  line-height: 44px;
  /*margin: 1px -10px 1px;*/
  margin-left: -9px;
  margin-right: -9px;
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