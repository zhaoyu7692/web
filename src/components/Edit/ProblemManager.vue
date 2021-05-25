<template>
  <el-main style="width: 90%; margin: 0 auto;">
    <el-table :data="problems.item_list" stripe>;
      <el-table-column prop="pid" label="#" min-width="60"></el-table-column>
      <el-table-column label="题目" min-width="400">
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
          <el-row>
            <el-col :span="12">
              <el-link type="primary" @click="editProblem(scope)">编辑</el-link>
            </el-col>
            <el-col :span="12">
              <el-link type="primary" @click="deleteProblem(scope)">删除</el-link>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-if="true"
        @current-change="pageChanged"
        :current-page="1"
        :page-size="problems.size"
        layout="prev, pager, next"
        :total="problems.total"
        class="problem_pagination"
    ></el-pagination>
  </el-main>
</template>

<script>

import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "ProblemManager",
  data() {
    return {
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
    editProblem(scope) {
      EventBus.$emit(EventName.ChangeEditProblemVisible, true, {scope: scope.row.pid})
    },
    deleteProblem(scope) {
      console.log('删除题目', scope)
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