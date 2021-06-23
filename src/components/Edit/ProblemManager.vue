<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="problems.item_list" stripe>;
      <el-table-column prop="pid" label="#" min-width="60"></el-table-column>
      <el-table-column label="题目" min-width="200">
        <template slot-scope="scope">
          <router-link :to="'/problem/' + scope.row.pid">
            <el-link>{{ scope.row.title }}</el-link>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="难度" min-width="70" align="center">
        <template slot-scope="scope">
          <el-tag :type="problemDifficultyColor(scope)">{{ problemDifficultyText(scope) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="accept" label="通过数" min-width="80" align="center"></el-table-column>
      <el-table-column prop="total" label="提交数" min-width="80" align="center"></el-table-column>
      <el-table-column label="通过率" min-width="180">
        <template slot-scope="scope">
          <el-progress :percentage="acceptRate(scope)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="操作" align="center">
        <template slot-scope="scope">
          <el-col :span="12">
            <el-link type="primary" @click="editProblem(scope)">编辑</el-link>
          </el-col>
          <el-col :span="12">
            <el-link type="primary" @click="readyDeleteProblem(scope)">删除</el-link>
          </el-col>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin: 10px 15px" @click="createProblem">创建题目</el-button>
    <el-pagination
        v-if="true"
        @current-change="pageChanged"
        :current-page="current_page"
        :page-size="problems.size"
        layout="prev, pager, next"
        :total="problems.total"
        class="problem_pagination"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="deleteVisible" width="30%">
      <span>确定要删除题目吗？</span>
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
  name: "ProblemManager",
  data() {
    return {
      deleteVisible: false,
      deletePid: -1,
      current_page: 1,
      problems: {
        total: 0,
        size: 20,
        item_list: [
          // {
          //   pid: 1,
          //   title: "12311111",
          //   difficulty: 1,
          //   accept: 123,
          //   total: 8700,
          // }
        ]
      }
    };
  },
  methods: {
    createProblem() {
      EventBus.$emit(EventName.ChangeEditProblemVisible, true, null)
    },
    readyDeleteProblem(scope) {
      this.deletePid = scope.row.pid
      this.deleteVisible = true
    },
    editProblem(scope) {
      EventBus.$emit(EventName.ChangeEditProblemVisible, true, scope.row)
    },
    deleteContest() {
      this.deleteVisible = false
      this.$http.post('/deleteProblem/', {pid: this.deletePid, user: this.$store.state.user})
          .then(() => {
            this.$message({type: 'success', message: '题目删除成功'})
            this.pageChanged(this.current_page)
          })
          .catch(errCode => {
            if (errCode !== -1) {
              this.$message({type: 'error', message: '题目删除失败'})
            }
          })
    },
    acceptRate(scope) {
      if (scope.row.total === 0) return 0;
      return Number(((scope.row.accept / scope.row.total) * 100).toFixed(0));
    },
    problemDifficultyColor(scope) {
      const difficulties = ['', 'warning', 'danger']
      return difficulties[scope.row.difficulty]
    },
    problemDifficultyText(scope) {
      const difficultText = ['简单', '一般', '困难']
      return difficultText[scope.row.difficulty]
    },
    pageChanged(page) {
      let data = {
        page,
        size: this.problems.size,
      }
      this.$http.post('/problems/', data)
          .then(({problems}) => {
            console.log(problems)
            this.problems = problems
          })
          .catch((errorCode) => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '数据请求失败'})
            }
          })
    }
  },
  computed: {},
  created() {
    this.pageChanged(1)
    EventBus.$on(EventName.RefreshProblemManager, page => {
      this.pageChanged(page > 0 ? page : this.current_page)
    })
  }
}
</script>

<style scoped>

</style>


<style scoped>
.problem_pagination {
  float: right;
  padding: 20px;
}

a {
  text-decoration: none;
}
</style>