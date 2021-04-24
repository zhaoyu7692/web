<template>
  <el-dialog
      title=" 编辑题目"
      :visible.sync="visible"
      width="70%"
      :before-close="a"
      model-value style="min-width: 1120px">
    <el-form ref="form" label-width="80px">
      <el-form-item label="题目标题">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <el-form-item label="题目描述">
        <el-input type="textarea" v-model="description"></el-input>
      </el-form-item>

<!--      <el-form-item label="比赛时间">-->
<!--        <el-date-picker v-model="start_time" type="datetime" placeholder="开始时间"></el-date-picker>-->
<!--        &#45;&#45;&#45;&#45;&#45;&#45;-->
<!--        <el-date-picker v-model="end_time" type="datetime" placeholder="结束时间"></el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item label="测试用例">
        <!--        <el-select v-model="sad" placeholder="请选择活动区域">-->
        <!--          <el-option label="区域一" value="shanghai"></el-option>-->
        <!--          <el-option label="区域二" value="beijing"></el-option>-->
        <!--        </el-select>-->
      </el-form-item>
      <el-form-item label="评测用例">
        <el-row>
          <el-col :span="12">
            <el-upload
                :on-change="inputFileChange"
                action="/api/uploadTestCase/"
                multiple
                :file-list="upload_input_file_list"
            >
              <el-button size="small" type="primary">点击选择输入文件</el-button>
              <div slot="tip" class="el-upload__tip">1.in - x.in</div>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-upload
                :on-change="outputFileChange"
                action="/api/uploadTestCase/"
                multiple
                :auto-upload="false"
                :file-list="upload_output_file_list"
                http-request=""
                ref="upload"
            >
              <el-button size="small" type="primary">点击选择输出文件</el-button>
              <div slot="tip" class="el-upload__tip">1.out - x.out</div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="日常练习">
        <el-col :span="1">
          <el-switch v-model="practice"></el-switch>
        </el-col>

      </el-form-item>
      <el-form-item label="时间限制">
        <el-input type="number" v-model="time_limit" size="mini" style="width: 100px;"></el-input>
        MS
      </el-form-item>
      <el-form-item label="空间限制">
        <el-input type="number" v-model="memory_limit" size="mini" style="width: 100px;"></el-input>
        KB
      </el-form-item>
      <el-form-item label="题目难度">
        <el-radio-group v-model="difficulty">
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
export default {
  name: "EditProblemPanel",
  data() {
    return {
      visible: true,
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      input_file_list: [],
      output_file_list: [],
      upload_input_file_list: [],
      upload_output_file_list: [],
      practice: false,
      time_limit: 1000,
      memory_limit: 65536,
      difficulty: '简单',
    }
  },
  watch: {
    output(newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  }
  ,
  methods: {
    inputFileChange(file, fileList) {
      this.input_file_list = fileList;
    },
    outputFileChange(file, fileList) {
      this.output_file_list = fileList
    },
    onSubmit() {
      console.log('submit!');
      this.$refs.upload.submit()
    },
    // beforeUpload() {
    //
    // }
    // xx() {
    //   console.log(this.input_file_list)
    //   console.log(this.output)
    //   setTimeout(()=> {
    //     this.xx()
    //   }, 1000)
    // }
  },
  created() {
    // setTimeout(()=>{
    // this.xx()
    // }, 1000)
  }
}
</script>

<style scoped>

</style>