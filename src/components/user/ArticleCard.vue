<script setup>
import { Star, StarFilled, View } from '@element-plus/icons-vue'

defineProps({
  article: { type: Object, required: true }
})

const emit = defineEmits(['favorite'])
</script>

<template>
  <div class="article-card">
    <div class="main" @click="$emit('open', article)">
      <h3 class="title">{{ article.title }}</h3>
      <p class="summary">{{ article.summary }}</p>
      <div class="meta">
        <el-tag size="small" effect="light">{{ article.category }}</el-tag>
        <span class="meta-item">
          <el-icon><View /></el-icon>{{ article.views }}
        </span>
        <span class="meta-item">{{ article.updatedAt }}</span>
      </div>
    </div>
    <button class="fav" :class="{ on: article.favorited }" @click.stop="emit('favorite', article)">
      <el-icon>
        <StarFilled v-if="article.favorited" />
        <Star v-else />
      </el-icon>
    </button>
  </div>
</template>

<style scoped>
.article-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.article-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.main {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e2c;
}

.summary {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: #9ca3af;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fav {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #d0d5d0;
  font-size: 20px;
  padding: 4px;
  flex-shrink: 0;
}

.fav.on {
  color: #f7b500;
}
</style>
