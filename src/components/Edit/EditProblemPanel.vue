<template>
  <el-dialog
      :title="edit ? '编辑题目' : '创建题目'"
      :visible.sync="visible"
      :before-close="closeEditProblemPanel"
      width="70%"
      model-value style="min-width: 1120px">
    <el-form ref="editProblemForm" label-width="80px" :rules="rules" :model="problem">
      <el-form-item label="题目标题" prop="title">
        <el-input v-model="problem.title"></el-input>
      </el-form-item>
      <el-form-item label="题目描述" prop="description">
        <el-input type="textarea" v-model="problem.description"></el-input>
      </el-form-item>
      <el-form-item label="输入描述" prop="input">
        <el-input type="textarea" v-model="problem.input"></el-input>
      </el-form-item>
      <el-form-item label="输出描述" prop="output">
        <el-input type="textarea" v-model="problem.output"></el-input>
      </el-form-item>
      <el-form-item label="题目来源" prop="source">
        <el-input type="textarea" v-model="problem.source"></el-input>
      </el-form-item>
      <el-form-item label="测试用例" prop="samples">
        <el-row style="padding-bottom: 10px" v-for="(sample, index) in problem.samples" :key="index" type="flex"
                align="middle"
                justify="center">
          <el-col :span="11">
            <el-input resize="none" type="textarea" placeholder="输入样例" v-model="sample.input"></el-input>
          </el-col>
          <el-col :span="11">
            <el-input resize="none" type="textarea" placeholder="输出样例" v-model="sample.output"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button
                @click="deleteSample(index)"
                type="primary"
                icon="el-icon-minus"
                style="padding: 5px; display: block; margin: 0 auto"
            ></el-button>
          </el-col>
        </el-row>
        <el-button @click="addSample" type="primary" icon="el-icon-plus"
                   style="width: 60px; margin: 0; padding: 5px"></el-button>
      </el-form-item>
      <el-form-item label="评测用例" prop="input_file_list">
        <el-row>
          <el-col :span="12">
            <el-upload
                :on-change="inputFileChange"
                action="/api/uploadTestCase/"
                :before-upload="beforeUploadInput"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="removeInput"
                :file-list="existed_input_file_list"
                multiple
            >
              <el-button size="small" type="primary">点击选择输入文件</el-button>
              <div slot="tip" class="el-upload__tip">1.in - x.in</div>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-upload
                :on-change="outputFileChange"
                action="/api/uploadTestCase/"
                :before-upload="beforeUploadOutput"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="removeOutput"
                :file-list="existed_output_file_list"
                multiple
                ref="upload"
            >
              <el-button size="small" type="primary">点击选择输出文件</el-button>
              <div slot="tip" class="el-upload__tip">1.out - x.out</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="时间限制" prop="time_limit">
        <el-input type="number" v-model="problem.time_limit" size="mini" style="width: 100px;"></el-input>
        MS
      </el-form-item>
      <el-form-item label="空间限制" prop="memory_limit">
        <el-input type="number" v-model="problem.memory_limit" size="mini" style="width: 100px;"></el-input>
        KB
      </el-form-item>
      <el-form-item label="题目难度">
        <el-radio-group v-model="problem.difficulty">
          <el-radio label="简单"></el-radio>
          <el-radio label="一般"></el-radio>
          <el-radio label="困难"></el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="onSubmit">{{ edit ? '立即修改' : '立即创建' }}</el-button>
        <el-button @click="closeEditProblemPanel">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus";
import {sha256} from 'js-sha256'

const difficulty = ['简单', '一般', '困难']
export default {
  name: "EditProblemPanel",
  data() {
    const validateTitle = (rule, value, callback) => {
      if (value === null || value.length === 0) {
        callback(new Error("请输入题目标题"))
        return
      }
      callback()
    }
    const validateDescription = (rule, value, callback) => {
      if (value === null || value.length === 0) {
        callback(new Error("请输入题目描述"))
        return
      }
      callback()
    }
    const validateInput = (rule, value, callback) => {
      if (value === null || value.length === 0) {
        callback(new Error("请输入输入描述"))
        return
      }
      callback()
    }
    const validateOutput = (rule, value, callback) => {
      if (value === null || value.length === 0) {
        callback(new Error("请输入输出描述"))
        return
      }
      callback()
    }
    const validateSamples = (rule, value, callback) => {
      for (let i = 0; i < value.length; i++) {
        if (value[i].input === null || value[i].input === '' || value[i].output === '' || value[i].output === null) {
          callback(new Error("测试样例不能为空"))
          return
        }
      }
      callback()
    }
    const validateTestCase = (rule, value, callback) => {
      if (this.problem.input_file_list.length === 0 && this.problem.output_file_list.length === 0) {
        callback(new Error("评测用例为空"))
        return
      }
      if (this.problem.input_file_list.length !== this.problem.output_file_list.length) {
        callback(new Error("评测用例输入输出不匹配"))
        return
      }
      let inputFilenames = Array(), outputFilenames = Array()
      for (let i = 0; i < this.problem.input_file_list.length; i++) {
        inputFilenames.push(this.problem.input_file_list[i].name.substring(0, this.problem.input_file_list[i].name.lastIndexOf('.in')))
      }
      for (let i = 0; i < this.problem.output_file_list.length; i++) {
        outputFilenames.push(this.problem.output_file_list[i].name.substring(0, this.problem.output_file_list[i].name.lastIndexOf('.out')))
      }
      console.log(inputFilenames, outputFilenames)
      for (let i = 0; i < inputFilenames.length; i++) {
        if (outputFilenames.indexOf(inputFilenames[i]) < 0) {
          callback(new Error("评测用例输入输出不匹配"))
          return
        }
      }
      callback()
    }
    const validateTimeLimit = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("时间限制需要大于0ms~"))
        return
      }
      callback()
    }
    const validateMemoryLimit = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("空间限制需要大于0KB~"))
        return
      }
      callback()
    }
    return {
      edit: false,
      pid: -1,
      visible: false,
      problem: {
        title: '',
        description: '',
        input: '',
        output: '',
        source: '',
        samples: [{
          input: '',
          output: '',
        }],
        input_file_list: [],
        output_file_list: [],
        time_limit: 1000,
        memory_limit: 65536,
        difficulty: '简单',
      },
      existed_input_file_list: [],
      existed_output_file_list: [],
      rules: {
        title: [{required: true, trigger: 'blur'}, {validator: validateTitle, trigger: 'blur'}],
        description: [{required: true, trigger: 'blur'}, {validator: validateDescription, trigger: 'blur'}],
        input: [{required: true, trigger: 'blur'}, {validator: validateInput, trigger: 'blur'}],
        output: [{required: true, trigger: 'blur'}, {validator: validateOutput, trigger: 'blur'}],
        samples: [{required: true, trigger: 'blur'}, {validator: validateSamples, trigger: 'blur'}],
        input_file_list: [{required: true, trigger: 'blur'}, {validator: validateTestCase, trigger: 'blur'}],
        time_limit: [{required: true, trigger: 'blur'}, {validator: validateTimeLimit, trigger: 'change'}],
        memory_limit: [{required: true, trigger: 'blur'}, {validator: validateMemoryLimit, trigger: 'change'}],
      }
    }
  },
  created() {
    EventBus.$on(EventName.ChangeEditProblemVisible, (visible, problem) => {
      this.existed_output_file_list = []
      this.existed_input_file_list = []
      if (this.$refs.editProblemForm !== undefined) {
        this.$refs.editProblemForm.resetFields()
      }
      this.edit = problem !== null
      this.visible = visible
      if (problem != null) {
        console.log(problem)
        this.pid = problem.pid
        this.$http.get('/getProblem/', {params: {pid: problem.pid}})
            .then(({problem, samples, testcases}) => {
              console.log(problem, samples, testcases)
              this.problem.title = problem.title
              this.problem.description = problem.description
              this.problem.input = problem.input
              this.problem.output = problem.output
              this.problem.source = problem.source
              this.problem.samples = samples
              this.problem.time_limit = problem.time_limit
              this.problem.memory_limit = problem.memory_limit
              this.problem.difficulty = difficulty[problem.difficulty]
              for (let i = 0; i < testcases.length; i++) {
                console.log(testcases[i])
                let file = {
                  name: testcases[i].filename,
                  key: testcases[i].key,
                }
                if (testcases[i].filename.endsWith('.in')) {
                  this.existed_input_file_list.push(file)
                } else if (testcases[i].filename.endsWith('.out')) {
                  this.existed_output_file_list.push(file)
                }
              }
              this.problem.input_file_list = this.existed_input_file_list
              this.problem.output_file_list = this.existed_output_file_list
            })
            .catch(errCode => {
              if (errCode !== -1) {
                this.$message({type: 'error', message: '未知错误11'})
              }
            })
      }
    })
  },
  methods: {
    closeEditProblemPanel() {
      this.existed_input_file_list = []
      this.existed_output_file_list = []
      this.problem.input_file_list = []
      this.problem.output_file_list = []
      this.pid = -1
      this.visible = false
    },
    addSample() {
      this.problem.samples.push({
        input: '',
        output: '',
      })
    },
    deleteSample(index) {
      this.samples.splice(index, 1)
    },
    removeInput(file, fileList) {
      this.problem.input_file_list = fileList
    },
    removeOutput(file, fileList) {
      this.problem.output_file_list = fileList
    },
    beforeUploadInput(file) {
      for (let i = 0; i < this.problem.input_file_list.length - 1; i++) {
        if (this.problem.input_file_list[i].name === file.name) {
          this.$message({type: 'error', message: file.name + '已经上传过了~'})
          return false
        }
      }
      if (!file.name.endsWith(".in")) {
        this.$message({type: 'error', message: file.name + '文件拓展名不是 .in ~'})
        return false
      }
      console.log(file)
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        file.key = sha256(reader.result)
        this.$message({type: 'success', message: file.name + '的 hash 值计算完成 ' + file.key})
      };
      return true
    },
    beforeUploadOutput(file) {
      for (let i = 0; i < this.problem.output_file_list.length - 1; i++) {
        if (this.problem.output_file_list[i].name === file.name) {
          this.$message({type: 'error', message: file.name + '已经上传过了~'})
          return false
        }
      }
      if (!file.name.endsWith(".out")) {
        this.$message({type: 'error', message: file.name + '文件拓展名不是 .out ~'})
        return false
      }
      console.log(file)
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        file.key = sha256(reader.result)
        this.$message({type: 'success', message: file.name + '的 hash 值计算完成 ' + file.key})
      };
      return true
    },
    uploadSuccess(response, file) {
      this.$message({type: 'success', message: file.name + "上传成功!"})
    },
    uploadError(error, file) {
      this.$message({type: 'error', message: file.name + "上传失败!"})
    },
    inputFileChange(file, fileList) {
      this.problem.input_file_list = fileList
    },
    outputFileChange(file, fileList) {
      this.problem.output_file_list = fileList
    },
    checkFileReady(file_list, filenames) {
      for (let i = 0; i < file_list.length; i++) {
        let value = file_list[i]
        if (value.raw !== undefined && value.raw.key !== undefined) {
          value.key = value.raw.key
        }
        if (value.key === undefined || value.key === null || value.status !== 'success') {
          this.$message({type: 'info', message: '请重新上传' + value.name})
          return false
        }
        filenames.push({
          key: value.key,
          name: value.name
        })
      }
      return true
    },
    onSubmit() {
      this.$refs.editProblemForm.validate((valid) => {
        if (!valid) {
          return
        }
        let filenames = []
        if (!this.checkFileReady(this.problem.input_file_list, filenames) || !this.checkFileReady(this.problem.output_file_list, filenames)) {
          return;
        }
        console.log(this.problem.input_file_list, this.problem.output_file_list)
        let formData = this.problem
        let data = {
          title: formData.title,
          description: formData.description,
          input: formData.input,
          output: formData.output,
          samples: formData.samples,
          source: formData.source,
          filename_list: filenames,
          time_limit: parseInt(formData.time_limit),
          memory_limit: parseInt(formData.memory_limit),
          difficulty: difficulty.indexOf(formData.difficulty),
          user: this.$store.state.user
        }
        console.log(data)
        if (this.edit) {
          data.pid = this.pid
          this.$http.post('/updateProblem/', data)
              .then(() => {
                this.closeEditProblemPanel()
                this.$message({type: 'success', message: '题目修改成功'})
                EventBus.$emit(EventName.RefreshProblemManager, -1)
              })
              .catch(errorCode => {
                if (errorCode !== -1) {
                  this.$message({type: 'error', message: '题目修改失败'})
                }
              })
        } else {
          this.$http.post('/createProblem/', data)
              .then(({pid}) => {
                this.visible = false
                this.$message({type: 'success', message: '题目创建成功，题目编号 ' + pid})
                EventBus.$emit(EventName.RefreshProblemManager, -1)
              })
              .catch(errorCode => {
                if (errorCode !== -1) {
                  this.$message({type: 'error', message: '题目创建失败'})
                }
              })
        }
      })
    },
  },

}
</script>

<style scoped>

</style>