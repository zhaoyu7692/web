<template>
  <el-dialog
      title=" 编辑比赛"
      :visible.sync="visible"
      width="70%"
      model-value style="min-width: 1120px">
    <el-form ref="form" :model="contest" label-width="80px">
      <el-form-item
          label="比赛标题"
          prop="title"
          :rules="[
              {required : true, message: '请输入比赛标题', trigger: 'blur'}
          ]"
      >
        <el-input v-model="contest.title"></el-input>
      </el-form-item>
      <el-form-item label="比赛时间" prop="time" :rules="[{required: true, message: '请选择比赛时间'}]">
        <el-date-picker
            v-model="contest.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="比赛题目" style="margin-bottom: 0">
        <el-row :gutter="20">
          <el-col :span="4" style="text-align: center">题目编号</el-col>
          <el-col :span="11" :offset="1">题目</el-col>
          <el-col :span="2" style="text-align: center">状态</el-col>
          <el-col :span="4" style="text-align: center">操作</el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="(index + 1).toString()" prop="problems" v-for="(problem, index) in contest.problems"
                    :key="index"
                    style="margin-bottom: 0">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-input type="number" v-model="problem.pid" style="height: 26px" size="mini"
                      @blur="checkProblemAvailable(index)"
                      @change="problem.status = 0"></el-input>
          </el-col>
          <el-col :span="11" :offset="1" style="min-height: 1px">{{ problem.title }}</el-col>
          <el-col :span="2" style="text-align: center">
            <i :class="problem_status[problem.status]"
               :style="problem_status_color[problem.status]" style="vertical-align: middle; font-size: 24px"></i>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-button-group>
              <el-button :disabled="index === 0"
                         @click="moveUpProblem(index)"
                         type="success"
                         icon="el-icon-arrow-up"
                         style="padding: 5px"
              ></el-button>
              <el-button @click="deleteProblem(index)"
                         type="danger"
                         icon="el-icon-delete"
                         style="padding: 5px"
              ></el-button>
              <el-button :disabled="index === contest.problems.length - 1"
                         @click="moveDownProblem(index)"
                         type="success"
                         icon="el-icon-arrow-down"
                         style="padding: 5px"
              ></el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form-item>
      <el-button @click="addProblem" type="success" icon="el-icon-plus"
                 style="width: 60px; margin: 0 10px; padding: 5px"></el-button>
      <div style="text-align: center">
        <el-button type="primary" @click="editContest">立即创建</el-button>
        <el-button>取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "EditContestPanel",
  data() {
    const problem_status = [
      'el-icon-warning-outline',
      'el-icon-loading',
      'el-icon-check',
      'el-icon-close'
    ]
    const problem_status_color = [
      '',
      '#E6A23C',
      'red',
      'green'
    ]
    return {
      problem_status,
      problem_status_color,
      contest: {
        title: '',
        time: [],
        problems: [{
          pid: '',
          title: '',
          status: 0,
        }],
      },
      visible: true,
    }
  },
  methods: {
    editContest() {
      this.$refs.form.validate((valid) => {
        console.log(this.contest)
        if (!valid) {
          return
        }
        if (this.contest.problems.length === 0) {
          this.$message({type: 'error', message: '比赛题目数为0'})
        }
        let problems = []
        for (let i = 0; i < this.contest.problems.length; i++) {
          if (this.contest.problems[i].status !== 2) {
            this.$message({type: 'error', message: '请检查题目状态'})
            return
          }
          problems.push({
            index: i + 1,
            pid: parseInt(this.contest.problems[i].pid, 10),
          })
        }
        console.log(problems)
        this.$http.post('/createContest/', {
          title: this.contest.title,
          start_time: this.contest.time[0],
          duration: this.contest.time[1].getTime() - this.contest.time[0].getTime(),
          problems
        }).then(() => {
          this.$message({type: 'success', message: '比赛创建成功'})
          //TODO: 添加重定向
        }).catch(errorCode => {
          if (errorCode !== -1) {
            this.$message({type: 'error', message: '比赛配置失败'})
          }
        })

      })
    },
    // 校验比赛题目
    checkProblemAvailable(index) {
      for (let i = 0; i < this.contest.problems.length; i++) {
        if (i !== index && this.contest.problems[i].pid !== '' && this.contest.problems[i].pid === this.contest.problems[index].pid) {
          this.contest.problems[index].status = 3
          this.contest.problems[index].title = ''
          this.$message({type: 'error', message: '题目重复啦'})
          return
        }
      }

      this.contest.problems[index].status = 1
      this.$http.get('/getProblemInfo/', {
        params:
            {
              pid: this.contest.problems[index].pid
            }
      }).then(({problem}) => {
        this.contest.problems[index].status = 2
        this.contest.problems[index].title = problem.title
      }).catch(errorCode => {
        this.contest.problems[index].status = 3
        this.contest.problems[index].title = ''
        console.log(errorCode)
        if (errorCode !== -1) {
          console.log(1)
        }
      })
    },
    addProblem() {
      this.contest.problems.push({
        pid: '',
        title: '',
        status: 0,
      })
      console.log(this.contest.problems)
    },
    deleteProblem(index) {
      this.contest.problems.splice(index, 1)
    },
    moveUpProblem(index) {
      let movedProblem = this.contest.problems.splice(index, 1)
      this.contest.problems.splice(index - 1, 0, movedProblem[0])
    },
    moveDownProblem(index) {
      let movedProblem = this.contest.problems.splice(index, 1)
      this.contest.problems.splice(index + 1, 0, movedProblem[0])
    }
  },
  created() {
  },
}
</script>

<style scoped>
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>