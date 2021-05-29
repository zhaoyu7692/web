<template>
  <div style="height: inherit">
    <div class="split-container" style="overflow-y: auto">
      <div class="problem-info">
        <p style="text-align: center; font-size: 24px">
          <span>{{ index + '.' }}</span>
          <span style="padding-left: 20px">{{ problem.title }}</span>
        </p>
        <h5 style="text-align: center">
          <span>时间限制：{{ problem.time_limit + 'ms' }}</span>
          <span style="padding-left: 20px">空间限制：{{ problem.memory_limit + 'KB' }}</span>
        </h5>
        <div class="description-title">题目描述</div>
        <el-input readonly autosize type="textarea" resize="none" v-model="problem.description"></el-input>
        <div class="description-title">输入描述</div>
        <el-input type="textarea" readonly resize="none" autosize v-model="problem.input_description"></el-input>
        <div class="description-title">输出描述</div>
        <el-input readonly autosize type="textarea" resize="none" v-model="problem.output_description"></el-input>
        <div v-for="(item, index) in problem.samples" :key="index">
          <div class="description-title">
            示例输入{{ index + 1 }}
            <el-button round size="mini" @click="sampleCopy('input', index, $event)" class="copy-button">复制</el-button>
          </div>
          <el-input readonly autosize type="textarea" resize="none" v-model="item.input"></el-input>
          <div class="description-title">
            示例输出{{ index + 1 }}
            <el-button round size="mini" @click="sampleCopy('output', index, $event)" class="copy-button">复制</el-button>
          </div>
          <el-input readonly autosize type="textarea" resize="none" v-model="item.output"></el-input>
        </div>
        <div class="description-title">来源</div>
        <el-input readonly autosize type="textarea" resize="none" v-model="problem.source"></el-input>
      </div>
    </div>
    <div class="split-container" style="overflow-y: hidden; box-sizing: border-box; padding: 72px 0 0;">
      <div class="code-editor-header" style="margin-top: -72px">
        <span>编程语言：</span>
        <el-select @change="languageChanged" v-model="language" size="small" style="width: 120px">
          <el-option v-for="(index, item) in languages" v-bind:key="item" v-bind:value="index"></el-option>
        </el-select>
        <div style="float: right">
          <el-button size="small" @click="selectFile">
            上传文件
            <input id="getFileElement" type="file" accept="text/*" style="display: none" @change="uploadFile">
          </el-button>
          <el-button size="small" @click="resetCode">重置</el-button>
          <el-button size="small" @click="submitCode">提交代码</el-button>
        </div>
      </div>
      <div id="codeEditor" class="code-editor"></div>
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import Clipboard from 'clipboard'
import EventBus, {EventName} from "@/utils/EventBus";
import {languages} from "@/utils/common";

export default {
  name: "Problem",
  data() {
    return {
      language: 'C',
      languages: languages,
      codeEditor: null,
      codeModel: null,
      index: null,
      cid: null,
      problem: {},
    }
  },
  watch: {
    language(val) {
      this.$message(val)
    },
    '$route'() {
      this.updateProblemData()
    }
  },
  methods: {
    // problem description
    sampleCopy(ope, index, e) {
      let text = 'input' === ope ? this.problem.samples[index].input : this.problem.samples[index].output;
      let clipBoard = new Clipboard(e.target, {text: () => text})
      clipBoard.on('success', () => {
        this.$message({type: 'success', message: '复制成功'});
        clipBoard.destroy() // 释放内存
      })
      clipBoard.on('error', () => {
        this.$message({type: 'warning', message: '浏览器不兼容，推荐使用 chrome 或 edge 浏览器'});
        clipBoard.destroy() // 释放内存
      })
      // 解决第一次点击不生效
      clipBoard.onClick(e)
    },
    // code editor
    languageChanged() {
      this.$toast({type: 'info', message: 'language changed: ' + this.language})
      const languageMap = {
        'C': 'c',
        'C++': 'cpp',
        'Java': 'java',
        'Python': 'python',
        'Go': 'go',
        'Objective-C': 'objective-c',
        'Kotlin': 'kotlin',
        'JavaScript': 'javascript',
        'Pascal': 'pascal',
      }
      let language = languageMap[this.language];
      if (language.length) {
        monaco.editor.setModelLanguage(this.codeModel, language)
      }
    },
    selectFile() {
      document.getElementById('getFileElement').dispatchEvent(new MouseEvent('click'))
    },
    uploadFile() {
      let file = document.getElementById('getFileElement')
      if (!file || !window.FileReader) {
        this.$message('浏览器不兼容，推荐使用 chrome 或 edge 浏览器')
      }
      let reader = new FileReader();
      let that = this
      reader.onload = function () {
        that.codeModel.setValue(this.result)
      }
      reader.readAsText(file.files[0], 'UTF-8')
    },
    resetCode() {
      this.codeModel.setValue('')
    },
    submitCode() {
      if (this.$store.state.user === null) {
        EventBus.$emit(EventName.ChangeLoginDialogVisible, true)
        this.$message({type: 'error', message: '代码提交失败！请先登录账号', customClass: 'toast-z-index'})
        return
      }
      let code = this.codeModel.getValue()
      let data = {
        code: code,
        index: this.index,
        uid: this.$store.state.user.uid,
        token: this.$store.state.user.token,
        cid: this.cid,
        language: this.languages.indexOf(this.language)
      }
      console.log(data)
      this.$http.post("/submit/", data)
          .then(() => {
            this.$message({type: 'success', message: '代码提交成功！'})
          })
          .catch(errorCode => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '代码提交失败，请检查网络连接！'})
            }
          })
    },
    initCodeEditor() {
      this.codeModel = monaco.editor.createModel('', 'c')
      this.codeEditor = monaco.editor.create(document.getElementById('codeEditor'), {
        model: this.codeModel,
        automaticLayout: true,
        scrollbar: {
          verticalScrollbarSize: 0,
        },
        minimap: {
          scale: 2,
        }
      })
    },
    updateProblemData() {
      this.cid = this.$route.params.cid === undefined ? 0 : parseInt(this.$route.params.cid)
      this.index = parseInt(this.$route.params.index)
      this.problem = {}
      let params = {
        cid: this.cid,
        index: this.index,
      }
      this.$http.get('/problem/', {params: params})
          .then(({problem}) => {
            console.log(problem)
            this.problem = problem
          })
          .catch(errorCode => {
            if (errorCode !== -1) {
              this.$message({type: 'error', message: '题目信息获取失败！'})
            }
          })
    }
  },
  created() {
    this.updateProblemData()
  },
  mounted() {
    this.initCodeEditor()
  }
}
</script>

<style scoped>

.problem-info {
  padding: 40px 30px;
}

.code-editor {
  height: inherit;
}

.split-container {
  height: 100%;
  width: 50%;
  float: left;
}

.description-title {
  padding: 15px 0 8px;
}

.copy-button {
  float: right;
  width: 36px;
  height: 20px;
  padding: 0 0;
  margin-top: 8px;
}

.code-editor-header {
  padding: 20px 20px;
  margin-top: -72px;
  border-bottom: 1px solid #cccccc;
}
</style>