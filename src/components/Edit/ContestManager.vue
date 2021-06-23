<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="contests.item_list" stripe>;
      <el-table-column prop="cid" label="#" min-width="60"></el-table-column>
      <el-table-column prop="title" label="比赛名称" min-width="200"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="contestStatusColor(scope)">{{ contestStatusText(scope) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="begin_time" label="开始时间" min-width="160" align="center"></el-table-column>
      <el-table-column label="持续时长" min-width="100" align="center">
        <template slot-scope="scope">
          <div>{{ formatDuration(scope) }}</div>
        </template>
      </el-table-column>
      <!--            <el-table-column prop="register_count" label="报名人数" min-width="100" align="center"></el-table-column>-->
      <el-table-column min-width="120" label="操作" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <el-link type="primary" :disabled="contestStatus(scope)!==0" @click="editContest(scope)">编辑</el-link>
            </el-col>
            <el-col :span="12">
              <el-link type="primary" :disabled="contestStatus(scope)!==0" @click="readyDeleteContest(scope)">删除</el-link>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin: 10px 15px" @click="createContest">创建比赛</el-button>
    <el-pagination
        @current-change="pageChanged"
        :current-page="current_page"
        :page-size="contests.size"
        layout="prev, pager, next"
        :total="contests.total"
        class="contests_pagination"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
      <span>确定要删除比赛吗？</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="deleteVisible = false">取 消</el-button>
      <el-button type="primary" @click="deleteContest">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "ContestManager",
  data() {
    return {
      deleteVisible: false,
      deleteCid: -1,
      current_page: 1,
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
    createContest() {
      EventBus.$emit(EventName.ChangeEditContestVisible, true, null)
    },
    editContest(scope) {
      EventBus.$emit(EventName.ChangeEditContestVisible, true, scope.row)
    },
    readyDeleteContest(scope) {
      this.deleteVisible = true
      this.deleteCid = scope.row.cid
      console.log('delete contest', scope)
    },
    deleteContest() {
      this.deleteVisible = false
      this.$http.post('/deleteContest/', {cid: this.deleteCid, user:this.$store.state.user})
          .then(() => {
            this.$message({type: 'success', message: '比赛删除成功'})
            this.pageChanged(this.current_page)
          }).catch(errCode => {
        if (errCode !== -1) {
          this.$message({type: 'error', message: '比赛删除失败'})
        }
      })
    },
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
      let duration = scope.row.duration
      let formatDuration = ('0' + Math.floor((duration % (3600 * 24)) / 3600).toString()).slice(-2) + ':' + ('0' + Math.floor((duration % 3600) / 60).toString()).slice(-2)
      if (duration / (3600 * 24) > 0) {
        formatDuration = Math.floor(duration / (3600 * 24)) + ':' + formatDuration
      }
      return formatDuration
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
    EventBus.$on(EventName.RefreshContestManager, page => {
      console.log(page)
      this.pageChanged(page > 0 ? page : this.current_page)
    })
  }
}
</script>

<style scoped>
.contests_pagination {
  float: right;
  padding: 20px;
}
</style>