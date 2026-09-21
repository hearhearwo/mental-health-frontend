<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  color: { type: String, required: true },
  trend: { type: String, default: '' }
})

const iconStyle = computed(() => ({
  color: props.color,
  background: props.color + '1a'
}))
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" :style="iconStyle">
      <slot name="icon" />
    </div>
    <div class="stat-body">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
    <div v-if="trend" class="stat-trend">
      <span class="trend-up">{{ trend }}</span>
      <span class="trend-text">较上周</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-body {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2329;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.trend-up {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.trend-text {
  font-size: 11px;
  color: #9ca3af;
}
</style>
