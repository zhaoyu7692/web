<template>
  <table>
    <tr v-for="(item, index) in data" :key="index">
      <th v-for="(subItem, index) in item" :key="index">
        <el-button type="info" size="mini" class="problem-button" @click="buttonClicked(subItem)"
                   :style="buttonStyle(subItem)">
          {{ subItem }}
        </el-button>
      </th>
    </tr>
  </table>
</template>

<script>
export default {
  name: "ButtonPanel",
  props: {
    content: {
      type: Array
    },
    defaultActive: null,
    width: {
      type: Number,
      default: 0,
    },
    buttonClicked: {
      type: Function
    }
  },
  data() {
    return {
      data: [],
      buttonWidth: 0,
    }
  },
  watch: {
    content(newValue, oldValue) {
      console.log('change', newValue, oldValue)
      let flag = true
      if (newValue.length === oldValue.length) {
        flag = false
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] !== oldValue[i]) {
            flag = true
            break
          }
        }
      }
      if (newValue.length <= 0 || !flag) {
        return
      }
      let spanWidth = this.computeFontWidth(newValue[newValue.length - 1], 12)
      spanWidth = Math.max(spanWidth + 10, 26)
      const width = this.width, offset = 6, border = 2
      let count = Math.floor((width + offset) / (spanWidth + offset + border))
      this.buttonWidth = (width - count * (border + offset) + offset) / count
      let pIds = []
      for (let i = 0; i < newValue.length; i += count) {
        let temp = []
        for (let j = i; j < count + i && j < newValue.length; j++) {
          temp.push(newValue[j])
        }
        pIds.push(temp)
      }
      this.data = pIds
      console.log('data', this.data)
    },
  },
  methods: {
    computeFontWidth(str, size) {
      let span = document.createElement("span")
      span.style.fontSize = size
      span.style.opacity = "0"
      span.innerHTML = str
      document.body.append(span)
      let spanWidth = span.offsetWidth
      span.remove()
      return spanWidth
    },
    buttonStyle(index) {
      let style = 'width: ' + this.buttonWidth + 'px;'
      if (index === this.defaultActive) {
        style += 'color: #ffd04b'
      }
      return style
    }
  },
  computed: {},
  created() {
    console.log('create')
  }
}
</script>

<style scoped>
.problem-button {
  background-color: rgba(0, 0, 0, 0);
  border-color: #bfbfbfa3;
  padding: 6px 4px;
}

.problem-button:hover {
  background-color: #b1b5bd;
}
</style>