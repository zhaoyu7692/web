<template>
  <el-dialog
      title=" 编辑题目"
      :visible.sync="visible"
      width="70%"
      model-value style="min-width: 1120px">
    <el-form ref="form" label-width="80px" :rules="rules" :model="problem">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
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
      visible: false,
      problem: {
        title: '',
        description: '',
        input: '',
        output: '',
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
      rules: {
        title: [{validator: validateTitle, trigger: 'blur'}],
        description: [{validator: validateDescription, trigger: 'blur'}],
        input: [{validator: validateInput, trigger: 'blur'}],
        output: [{validator: validateOutput, trigger: 'blur'}],
        samples: [{validator: validateSamples, trigger: 'blur'}],
        input_file_list: [{validator: validateTestCase, trigger: 'blur'}],
        time_limit: [{validator: validateTimeLimit, trigger: 'change'}],
        memory_limit: [{validator: validateMemoryLimit, trigger: 'change'}],
      }
    }
  },
  methods: {
    addSample() {
      this.problem.samples.push({
        input: '',
        output: '',
      })
    },
    deleteSample(index) {
      this.samples.splice(index, 1)
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
      return true
    },
    uploadSuccess(response, file) {
      this.$message({type: 'success', message: file.name + "上传成功!"})
    },
    uploadError(error, file) {
      this.$message({type: 'error', message: file.name + "上传失败!"})
    },
    inputFileChange(file, fileList) {
      this.problem.input_file_list = fileList;
    },
    outputFileChange(file, fileList) {
      this.problem.output_file_list = fileList
    },
    Submit(data) {
      this.$http.post('/createProblem/', data)
          .then(({pid}) => {
            this.visible = false
            this.$message({type: 'error', message: '题目创建成功，题目编号 ' + pid})
          })
          .catch(errorCode => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '题目创建失败'})
            }
          })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        let formData = this.problem
        let data = {
          title: formData.title,
          description: formData.description,
          input: formData.input,
          output: formData.output,
          samples: formData.samples,
          filename_list: [],
          time_limit: parseInt(formData.time_limit),
          memory_limit: parseInt(formData.memory_limit),
          difficulty: difficulty.indexOf(formData.difficulty),
        }

        let totalCount = 0
        this.problem.input_file_list.forEach(value => {
          totalCount++
          this.$message({type: 'info', message: '正在计算' + value.name + '的 hash 值'})
          let reader = new FileReader();
          reader.readAsBinaryString(value.raw);
          reader.onload = () => {
            data.filename_list.push(sha256(reader.result))
            this.$message({type: 'success', message: value.name + '的 hash 值计算完成'})
            if (data.filename_list.length === totalCount) {
              console.log('submit now')
              console.log(data)
              this.Submit(data)
            }
          };
        })

        this.problem.output_file_list.forEach(value => {
          totalCount++
          this.$message({type: 'info', message: '正在计算' + value.name + '的 hash 值'})
          let reader = new FileReader();
          reader.readAsBinaryString(value.raw);
          reader.onload = () => {
            data.filename_list.push(sha256(reader.result))
            this.$message({type: 'success', message: value.name + '的 hash 值计算完成'})
            if (data.filename_list.length === totalCount) {
              console.log('submit now')
              console.log(data)
              this.Submit(data)
            }
          };
        })
      })

    },
  },
  created() {
    EventBus.$on(EventName.ChangeEditProblemVisible, (visible, scope) => {
      this.visible = visible
      if (scope != null) {
        console.log('edit')
      }
    })
  }
}
</script>

<style scoped>

</style>