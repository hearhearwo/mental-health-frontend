<script setup>
import { ref, computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  status: { type: Object, required: true },
  loading: { type: Boolean, default: false }
})

const trendRange = ref('7')

// 数据加载完成前不渲染图表，避免 ECharts 用空 indicator 初始化抛错
const hasData = computed(() => (props.status.dimensions || []).length > 0)

const radarOption = computed(() => {
  const dims = props.status.dimensions || []
  return {
    tooltip: {},
    radar: {
      indicator: dims.map((d) => ({ name: d.name, max: 100 })),
      radius: '62%',
      center: ['50%', '52%'],
      axisName: { color: '#6b7280', fontSize: 12 },
      splitArea: {
        areaStyle: { color: ['rgba(82,196,26,0.03)', 'rgba(82,196,26,0.07)'] }
      },
      splitLine: { lineStyle: { color: '#e5e7eb' } },
      axisLine: { lineStyle: { color: '#e5e7eb' } }
    },
    series: [
      {
        type: 'radar',
        data: [{ value: dims.map((d) => d.score), name: '当前状态' }],
        areaStyle: { color: 'rgba(82,196,26,0.18)' },
        lineStyle: { color: '#52C41A', width: 2 },
        itemStyle: { color: '#52C41A' },
        symbol: 'circle',
        symbolSize: 5
      }
    ]
  }
})

const trendOption = computed(() => {
  const trend = trendRange.value === '7' ? props.status.trend7 : props.status.trend30
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 12, top: 16, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: trend.dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      interval: 1,
      axisLabel: { color: '#9ca3af', fontSize: 10 },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: trend.levels,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#52C41A', width: 2 },
        itemStyle: { color: '#52C41A' },
        areaStyle: { color: 'rgba(82,196,26,0.08)' }
      }
    ]
  }
})
</script>

<template>
  <div class="status-panel">
    <div class="panel-header">
      <span class="panel-title">心理状态</span>
      <StatusBadge :level="status.level" />
    </div>

    <template v-if="loading">
      <el-skeleton :rows="5" animated class="status-skeleton" />
    </template>

    <template v-else-if="hasData">
      <div class="radar">
        <BaseChart :option="radarOption" class="chart radar-chart" />
      </div>

      <div class="trend">
        <div class="trend-head">
          <span class="trend-title">等级趋势</span>
          <div class="range-switch">
            <button
              :class="{ on: trendRange === '7' }"
              @click="trendRange = '7'"
            >
              7 天
            </button>
            <button
              :class="{ on: trendRange === '30' }"
              @click="trendRange = '30'"
            >
              30 天
            </button>
          </div>
        </div>
        <BaseChart :option="trendOption" class="chart trend-chart" />
      </div>
    </template>

    <div v-else class="status-empty">
      <el-empty description="暂无评估数据" :image-size="90" />
      <p class="empty-tip">开始对话后，AI 会自动分析并生成你的心理状态</p>
    </div>

    <p class="disclaimer">状态评估基于 AI 分析，仅供参考，不构成医学诊断。</p>
  </div>
</template>

<style scoped>
.status-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.panel-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e2c;
}

.radar {
  margin-top: 8px;
}

.chart {
  width: 100%;
}

.radar-chart {
  height: 220px;
}

.trend {
  margin-top: 12px;
}

.trend-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.trend-title {
  font-size: 13px;
  color: #6b7280;
}

.range-switch {
  display: flex;
  gap: 4px;
}

.range-switch button {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
}

.range-switch button.on {
  background: #e6f5e4;
  color: #3a7d34;
  font-weight: 600;
}

.trend-chart {
  height: 130px;
}

.status-skeleton {
  margin-top: 16px;
}

.status-empty {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-tip {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
}

.disclaimer {
  margin: auto 0 0;
  padding-top: 12px;
  font-size: 11px;
  line-height: 1.5;
  color: #b0b8b0;
  text-align: center;
}
</style>
