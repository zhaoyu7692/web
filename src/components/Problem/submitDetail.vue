<template>
  <el-dialog
      title="编译信息"
      :visible.sync="visible"
      width="70%"
      model-value style="min-width: 1120px">
    <el-input type="textarea" readonly resize="none" v-model="compilation_message" autosize>

    </el-input>
    <!--    <el-form ref="editProblemForm" label-width="80px" :rules="rules" :model="problem">-->
    <!--      <el-form-item label="题目标题" prop="title">-->
    <!--        <el-input v-model="problem.title"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="题目描述" prop="description">-->
    <!--        <el-input type="textarea" v-model="problem.description"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="输入描述" prop="input">-->
    <!--        <el-input type="textarea" v-model="problem.input"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="输出描述" prop="output">-->
    <!--        <el-input type="textarea" v-model="problem.output"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="题目来源" prop="output">-->
    <!--        <el-input type="textarea" v-model="problem.source"></el-input>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="测试用例" prop="samples">-->
    <!--        <el-row style="padding-bottom: 10px" v-for="(sample, index) in problem.samples" :key="index" type="flex"-->
    <!--                align="middle"-->
    <!--                justify="center">-->
    <!--          <el-col :span="11">-->
    <!--            <el-input resize="none" type="textarea" placeholder="输入样例" v-model="sample.input"></el-input>-->
    <!--          </el-col>-->
    <!--          <el-col :span="11">-->
    <!--            <el-input resize="none" type="textarea" placeholder="输出样例" v-model="sample.output"></el-input>-->
    <!--          </el-col>-->
    <!--          <el-col :span="2">-->
    <!--            <el-button-->
    <!--                @click="deleteSample(index)"-->
    <!--                type="primary"-->
    <!--                icon="el-icon-minus"-->
    <!--                style="padding: 5px; display: block; margin: 0 auto"-->
    <!--            ></el-button>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--        <el-button @click="addSample" type="primary" icon="el-icon-plus"-->
    <!--                   style="width: 60px; margin: 0; padding: 5px"></el-button>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="评测用例" prop="input_file_list">-->
    <!--        <el-row>-->
    <!--          <el-col :span="12">-->
    <!--            <el-upload-->
    <!--                :on-change="inputFileChange"-->
    <!--                action="/api/uploadTestCase/"-->
    <!--                :before-upload="beforeUploadInput"-->
    <!--                :on-success="uploadSuccess"-->
    <!--                :on-error="uploadError"-->
    <!--                multiple-->
    <!--            >-->
    <!--              <el-button size="small" type="primary">点击选择输入文件</el-button>-->
    <!--              <div slot="tip" class="el-upload__tip">1.in - x.in</div>-->
    <!--            </el-upload>-->
    <!--          </el-col>-->
    <!--          <el-col :span="12">-->
    <!--            <el-upload-->
    <!--                :on-change="outputFileChange"-->
    <!--                action="/api/uploadTestCase/"-->
    <!--                :before-upload="beforeUploadOutput"-->
    <!--                :on-success="uploadSuccess"-->
    <!--                :on-error="uploadError"-->
    <!--                multiple-->
    <!--                ref="upload"-->
    <!--            >-->
    <!--              <el-button size="small" type="primary">点击选择输出文件</el-button>-->
    <!--              <div slot="tip" class="el-upload__tip">1.out - x.out</div>-->
    <!--            </el-upload>-->
    <!--          </el-col>-->
    <!--        </el-row>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="时间限制" prop="time_limit">-->
    <!--        <el-input type="number" v-model="problem.time_limit" size="mini" style="width: 100px;"></el-input>-->
    <!--        MS-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="空间限制" prop="memory_limit">-->
    <!--        <el-input type="number" v-model="problem.memory_limit" size="mini" style="width: 100px;"></el-input>-->
    <!--        KB-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="题目难度">-->
    <!--        <el-radio-group v-model="problem.difficulty">-->
    <!--          <el-radio label="简单"></el-radio>-->
    <!--          <el-radio label="一般"></el-radio>-->
    <!--          <el-radio label="困难"></el-radio>-->
    <!--        </el-radio-group>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
  </el-dialog>
</template>

<script>
import EventBus, {EventName} from "@/utils/EventBus";

export default {
  name: "submitDetail",
  data() {
    return {
      visible: true,
      compilation_message: '',
    }
  },
  created() {
    EventBus.$on(EventName.ChangeSubmitDetailVisible, (visible, compilation_message) => {
      this.compilation_message = compilation_message
      this.visible = visible
    })
  }
}
</script>

<style scoped>

</style>