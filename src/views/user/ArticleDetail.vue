<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, View } from '@element-plus/icons-vue'
import { api } from '@/api'

const route = useRoute()
const article = ref(null)

const paragraphs = computed(() => {
  if (!article.value) return []
  return article.value.content.split('\n\n').filter(Boolean)
})

async function load() {
  const res = await api.getArticle(route.params.id)
  if (res.code === 0) article.value = res.data
}

async function toggleFavorite() {
  const res = await api.toggleFavorite(article.value.id)
  if (res.code === 0) {
    article.value.favorited = res.data.favorited
    ElMessage.success(article.value.favorited ? '已收藏' : '已取消收藏')
  }
}

onMounted(load)
</script>

<template>
  <div class="detail-page">
    <div v-if="article" class="article">
      <el-tag effect="light" class="category">{{ article.category }}</el-tag>
      <h1 class="title">{{ article.title }}</h1>
      <div class="meta">
        <span>{{ article.source }}</span>
        <span>{{ article.updatedAt }}</span>
        <span class="views">
          <el-icon><View /></el-icon>{{ article.views }} 阅读
        </span>
      </div>

      <div class="actions">
        <el-button :type="article.favorited ? 'warning' : 'default'" @click="toggleFavorite">
          <el-icon><StarFilled v-if="article.favorited" /><Star v-else /></el-icon>
          {{ article.favorited ? '已收藏' : '收藏' }}
        </el-button>
      </div>

      <div class="content">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>

      <div class="footer-note">
        <p>免责声明：本文内容仅供心理健康科普参考，不构成医学诊断或治疗建议。如遇严重心理困扰，请及时寻求专业帮助。</p>
        <p>来源：{{ article.source }}</p>
      </div>
    </div>

    <el-skeleton v-else :rows="8" animated />
  </div>
</template>

<style scoped>
.detail-page {
  padding: 20px;
  box-sizing: border-box;
  max-width: 760px;
  margin: 0 auto;
}

.article {
  background: #fff;
  border-radius: 16px;
  padding: 36px 40px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.category {
  margin-bottom: 12px;
}

.title {
  margin: 0 0 14px;
  font-size: 26px;
  line-height: 1.4;
  color: #2c3e2c;
}

.meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9ca3af;
  padding-bottom: 18px;
  border-bottom: 1px solid #f0f2f0;
}

.views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.actions {
  margin: 16px 0;
}

.content p {
  font-size: 15px;
  line-height: 1.9;
  color: #3a443a;
  margin: 0 0 16px;
}

.footer-note {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed #e5e7eb;
  font-size: 12px;
  color: #b0b8b0;
  line-height: 1.7;
}

.footer-note p {
  margin: 0 0 4px;
}

@media (max-width: 768px) {
  .article {
    padding: 24px 20px;
  }
  .title {
    font-size: 22px;
  }
}
</style>
