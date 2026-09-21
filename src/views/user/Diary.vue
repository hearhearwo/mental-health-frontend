<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { EditPen, Lock } from '@element-plus/icons-vue'
import { api, MOODS } from '@/api'
import BaseChart from '@/components/BaseChart.vue'

const diaries = ref([])
const calendarDate = ref(new Date())
const dialogVisible = ref(false)
const diaryForm = reactive({ mood: '平静', score: 3, content: '' })

const moodColorMap = {
  开心: '#52C41A',
  平静: '#8FD460',
  焦虑: '#FAAD14',
  难过: '#FA8C16',
  愤怒: '#EA6668'
}

async function load() {
  const res = await api.getDiaries()
  if (res.code === 0) diaries.value = res.data
}

function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function hasDiary(day) {
  return diaries.value.some((d) => d.date === day)
}

const dayDiaries = computed(() =>
  diaries.value.filter((d) => d.date === todayStr(calendarDate.value))
)

const trendOption = computed(() => {
  const sorted = [...diaries.value].sort((a, b) => a.date.localeCompare(b.date))
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 8, right: 12, top: 20, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: sorted.map((d) => d.date.slice(5)),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
      interval: 1,
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: sorted.map((d) => d.score),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#52C41A', width: 2 },
        itemStyle: { color: '#52C41A' },
        areaStyle: { color: 'rgba(82,196,26,0.08)' }
      }
    ]
  }
})

const pieOption = computed(() => {
  const counts = {}
  diaries.value.forEach((d) => {
    counts[d.mood] = (counts[d.mood] || 0) + 1
  })
  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    itemStyle: { color: moodColorMap[name] }
  }))
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#6b7280', fontSize: 11 } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        data,
        label: { show: false },
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }
      }
    ]
  }
})

function openDialog() {
  diaryForm.mood = '平静'
  diaryForm.score = 3
  diaryForm.content = ''
  dialogVisible.value = true
}

async function saveDiary() {
  if (!diaryForm.content.trim()) return ElMessage.warning('请写点什么吧')
  const res = await api.createDiary({
    date: todayStr(),
    mood: diaryForm.mood,
    score: diaryForm.score,
    content: diaryForm.content.trim()
  })
  if (res.code === 0) {
    await load()
    dialogVisible.value = false
    ElMessage.success('日记已保存')
  }
}

onMounted(load)
</script>

<template>
  <div class="diary-page">
    <div class="page-head">
      <div>
        <h2 class="page-title">情绪日记</h2>
        <p class="privacy-tip">
          <el-icon><Lock /></el-icon> 你的日记仅本人可见，请放心记录
        </p>
      </div>
      <el-button type="primary" :icon="EditPen" @click="openDialog">写日记</el-button>
    </div>

    <div class="diary-grid">
      <div class="card">
        <h3 class="card-title">日历</h3>
        <el-calendar v-model="calendarDate">
          <template #date-cell="{ data }">
            <div class="date-cell">
              <span>{{ Number(data.day.split('-')[2]) }}</span>
              <span v-if="hasDiary(data.day)" class="dot" />
            </div>
          </template>
        </el-calendar>

        <div class="day-diary">
          <h4>{{ todayStr(calendarDate) }} 的记录</h4>
          <div v-if="dayDiaries.length">
            <div v-for="d in dayDiaries" :key="d.id" class="diary-item">
              <span class="mood-tag" :style="{ color: moodColorMap[d.mood], background: moodColorMap[d.mood] + '1a' }">
                {{ d.mood }}
              </span>
              <span class="score">评分 {{ d.score }}/5</span>
              <p class="content">{{ d.content }}</p>
            </div>
          </div>
          <el-empty v-else description="当天暂无记录" :image-size="50" />
        </div>
      </div>

      <div class="stat-col">
        <div class="card">
          <h3 class="card-title">情绪得分趋势</h3>
          <BaseChart :option="trendOption" class="chart chart-line" />
        </div>
        <div class="card">
          <h3 class="card-title">情绪类型占比</h3>
          <BaseChart :option="pieOption" class="chart chart-pie" />
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="写日记" width="520px">
      <el-form label-position="top">
        <el-form-item label="今天的情绪">
          <div class="mood-btns">
            <button
              v-for="m in MOODS"
              :key="m"
              class="mood-btn"
              :class="{ on: diaryForm.mood === m }"
              :style="diaryForm.mood === m ? { color: '#fff', background: moodColorMap[m] } : {}"
              @click="diaryForm.mood = m"
            >
              {{ m }}
            </button>
          </div>
        </el-form-item>
        <el-form-item label="情绪评分">
          <el-rate v-model="diaryForm.score" />
        </el-form-item>
        <el-form-item label="记录内容">
          <el-input
            v-model="diaryForm.content"
            type="textarea"
            :rows="5"
            placeholder="今天发生了什么？你的感受如何？"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDiary">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.diary-page {
  padding: 20px;
  box-sizing: border-box;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #2c3e2c;
}

.privacy-tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
}

.diary-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.card-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e2c;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart {
  width: 100%;
}

.chart-line {
  height: 240px;
}

.chart-pie {
  height: 260px;
}

.date-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  height: 100%;
  justify-content: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #52c41a;
}

.day-diary {
  margin-top: 12px;
  border-top: 1px solid #f0f2f0;
  padding-top: 12px;
}

.day-diary h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
}

.diary-item {
  padding: 10px 12px;
  background: #fafbfa;
  border-radius: 10px;
  margin-bottom: 8px;
}

.mood-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  margin-right: 8px;
}

.score {
  font-size: 12px;
  color: #9ca3af;
}

.content {
  margin: 6px 0 0;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
}

.mood-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mood-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  padding: 6px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.mood-btn:hover {
  border-color: #52c41a;
  color: #52c41a;
}

@media (max-width: 768px) {
  .diary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
