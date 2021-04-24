<template>
  <div>
    <div class="web-title">
      <span>OpenJudge 在线评测系统</span>
    </div>
    <div style="margin: 0 auto; width: 1000px; height: 333px">
      <div id="submitChart" class="home-chart"></div>
      <div id="activeChart" class="home-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "Home",
  methods: {
    drawSubmitChart() {
      let chartDom = document.getElementById('submitChart');
      let myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: '评测数据',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['通过', '答案错误', '编译错误', '格式错误', '提交'],
          x: 'center',
          y: 'bottom',
          padding: 32
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {}
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '通过',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '答案错误',
            type: 'line',
            data: [120, 252, 353, 487, 577, 807, 1017]
          },
          {
            name: '编译错误',
            type: 'line',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '格式错误',
            type: 'line',
            data: [150, 382, 583, 737, 927, 1257, 1667]
          },
          {
            name: '提交',
            type: 'line',
            data: [150, 382, 583, 737, 927, 1257, 1667]
          }
        ]
      };
      myChart.setOption(option);
    },
    drawActivityChart() {
      let chartDom = document.getElementById('activeChart');
      let myChart = echarts.init(chartDom);
      let option = {
        title: {
          text: '活跃数据',
          x: 'center',
          y: 'bottom',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['访问', '累计访问', '新增用户', '累计用户'],
          x: 'center',
          y: 'bottom',
          padding: 32
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {}
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '访问',
            type: 'line',
            yAxisIndex: 0,
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '累计访问',
            type: 'line',
            yAxisIndex: 1,
            data: [120, 252, 353, 487, 577, 807, 1017]
          },
          {
            name: '新增用户',
            type: 'line',
            yAxisIndex: 0,
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '累计用户',
            type: 'line',
            yAxisIndex: 1,
            data: [150, 382, 583, 737, 927, 1257, 1667]
          },
        ]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    this.drawActivityChart()
    this.drawSubmitChart()
  }
}
</script>

<style scoped>
.home-chart {
  float: left;
  width: 500px;
  height: 333px;
}

.web-title {
  padding: 80px 20px 100px;
  font-size: 60px;
  text-align: center;
}
</style>