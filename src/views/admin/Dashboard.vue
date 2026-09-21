<script setup>
import * as echarts from 'echarts'
import { User, Notebook, ChatDotRound, TrendCharts } from '@element-plus/icons-vue'
import StatCard from '@/components/StatCard.vue'
import BaseChart from '@/components/BaseChart.vue'

const stats = [
  { label: '总用户数', value: '12,846', icon: User, color: '#3b82f6', trend: '+12.5%' },
  { label: '情绪日志', value: '3,258', icon: Notebook, color: '#8b5cf6', trend: '+8.2%' },
  { label: '咨询会话', value: '1,024', icon: ChatDotRound, color: '#ec4899', trend: '+15.3%' },
  { label: '平均情绪', value: '4.2', icon: TrendCharts, color: '#10b981', trend: '+0.3' }
]

// 情绪趋势分析（平均情绪评分 + 记录数量）
const emotionTrendOption = {
  color: ['#2a78d6', '#eb6834'],
  tooltip: { trigger: 'axis' },
  legend: { data: ['平均情绪评分', '记录数量'], top: 0, right: 0 },
  grid: { left: 12, right: 12, top: 42, bottom: 8, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['09/08', '09/09', '09/10', '09/11', '09/12', '09/13', '09/14'],
    axisLine: { lineStyle: { color: '#c3c2b7' } },
    axisTick: { show: false },
    axisLabel: { color: '#898781' }
  },
  yAxis: [
    {
      type: 'value',
      name: '评分',
      min: 1,
      max: 5,
      nameTextStyle: { color: '#898781' },
      axisLabel: { color: '#898781' },
      splitLine: { lineStyle: { color: '#e1e0d9' } }
    },
    {
      type: 'value',
      name: '数量',
      nameTextStyle: { color: '#898781' },
      axisLabel: { color: '#898781' },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: '平均情绪评分',
      type: 'line',
      smooth: true,
      data: [3.6, 3.8, 3.5, 4.0, 4.1, 3.9, 4.2],
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2 }
    },
    {
      name: '记录数量',
      type: 'line',
      smooth: true,
      yAxisIndex: 1,
      data: [120, 132, 101, 145, 160, 150, 175],
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 2 }
    }
  ]
}

// 咨询会话统计柱状图
const sessionChartOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 12, right: 12, top: 24, bottom: 8, containLabel: true },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: '#c3c2b7' } },
    axisTick: { show: false },
    axisLabel: { color: '#898781' }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#898781' },
    splitLine: { lineStyle: { color: '#e1e0d9' } }
  },
  series: [
    {
      name: '咨询会话',
      type: 'bar',
      barWidth: 18,
      data: [142, 168, 120, 185, 176, 98, 64],
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6da7ec' },
          { offset: 1, color: '#2a78d6' }
        ])
      }
    }
  ]
}

// 用户活跃度趋势（多折线）
const activityOption = {
  color: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
    top: 0,
    right: 0
  },
  grid: { left: 12, right: 12, top: 42, bottom: 8, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [
      '09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07',
      '09/08', '09/09', '09/10', '09/11', '09/12', '09/13', '09/14'
    ],
    axisLine: { lineStyle: { color: '#c3c2b7' } },
    axisTick: { show: false },
    axisLabel: { color: '#898781' }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#898781' },
    splitLine: { lineStyle: { color: '#e1e0d9' } }
  },
  series: [
    {
      name: '活跃用户',
      type: 'line',
      smooth: true,
      data: [812, 845, 830, 902, 876, 921, 958, 934, 1012, 987, 1045, 1023, 1108, 1156],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    },
    {
      name: '新增用户',
      type: 'line',
      smooth: true,
      data: [45, 52, 48, 61, 55, 68, 72, 64, 78, 71, 85, 80, 92, 96],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    },
    {
      name: '日记用户',
      type: 'line',
      smooth: true,
      data: [356, 378, 342, 401, 389, 428, 456, 441, 502, 486, 521, 508, 556, 589],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    },
    {
      name: '咨询用户',
      type: 'line',
      smooth: true,
      data: [78, 92, 85, 104, 98, 112, 128, 121, 136, 129, 148, 141, 156, 168],
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2 }
    }
  ]
}
</script>

<template>
  <div class="dashboard">
    <div class="stats">
      <StatCard
        v-for="s in stats"
        :key="s.label"
        :label="s.label"
        :value="s.value"
        :color="s.color"
        :trend="s.trend"
      >
        <template #icon>
          <el-icon><component :is="s.icon" /></el-icon>
        </template>
      </StatCard>
    </div>

    <div class="chart-row">
      <div class="card">
        <div class="card-header">
          <h3>情绪趋势分析</h3>
        </div>
        <BaseChart :option="emotionTrendOption" class="chart chart-md" />
      </div>

      <div class="card">
        <div class="card-header">
          <h3>咨询会话统计</h3>
        </div>
        <div class="session-summary">
          <div class="summary-item">
            <div class="summary-num">1,024</div>
            <div class="summary-label">总咨询</div>
          </div>
          <div class="summary-item">
            <div class="summary-num">892</div>
            <div class="summary-label">已完成</div>
          </div>
          <div class="summary-item">
            <div class="summary-num">87</div>
            <div class="summary-label">进行中</div>
          </div>
          <div class="summary-item">
            <div class="summary-num accent">96.8%</div>
            <div class="summary-label">满意度</div>
          </div>
        </div>
        <BaseChart :option="sessionChartOption" class="chart chart-sm" />
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>用户活跃度趋势</h3>
      </div>
      <BaseChart :option="activityOption" class="chart chart-lg" />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.card-header {
  margin-bottom: 8px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
  margin: 0;
}

.chart {
  width: 100%;
}

.chart-md {
  height: 320px;
}

.chart-sm {
  height: 210px;
}

.chart-lg {
  height: 360px;
}

.session-summary {
  display: flex;
  margin-bottom: 8px;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-item + .summary-item {
  border-left: 1px solid #f0f0f0;
}

.summary-num {
  font-size: 20px;
  font-weight: 700;
  color: #1f2329;
}

.summary-num.accent {
  color: #7c5cfc;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

@media (max-width: 1200px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-row {
    grid-template-columns: 1fr;
  }
}
</style>
