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
    drawSubmitChart(data) {
      let chartDom = document.getElementById('submitChart');
      let myChart = echarts.init(chartDom);

      let xAxisData = data.legend, series = [], legendData = []
      for (let i = 0; i < data.items.length; i++) {
        let item = data.items[i]
        legendData.push(item.name)
        series.push({
          name: item.name,
          type: 'line',
          data: item.data,
        })
      }
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
          data: legendData,
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
          data: xAxisData
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: series
      };
      console.log(option)
      myChart.setOption(option);
    },
    drawActivityChart(data) {
      console.log(data)
      let chartDom = document.getElementById('activeChart');
      let myChart = echarts.init(chartDom);

      let xAxisData = data.legend, series = [], legendData = []
      for (let i = 0; i < data.items.length; i++) {
        let item = data.items[i]
        legendData.push(item.name)
        series.push({
          name: item.name,
          type: 'line',
          data: item.data,
        })
      }
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
          data: legendData,
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
          data: xAxisData
        },
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ],
        series: series
      };
      console.log(option)
      myChart.setOption(option);
    }
  },
  mounted() {
    this.$http.get('/systemStatistics/')
        .then(({activity_data, submit_data}) => {
          this.drawActivityChart(activity_data)
          this.drawSubmitChart(submit_data)
        })
        .catch(({errorCode}) => {
          if (errorCode !== -1) {
            this.$message.error('获取平台统计数据失败')
          }
        })
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