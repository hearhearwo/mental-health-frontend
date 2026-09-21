<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { api, CATEGORIES } from '@/api'
import ArticleCard from '@/components/user/ArticleCard.vue'

const router = useRouter()
const activeCategory = ref('')
const keyword = ref('')
const articles = ref([])

async function load() {
  const res = await api.getArticles({ category: activeCategory.value, keyword: keyword.value })
  if (res.code === 0) articles.value = res.data
}

function switchCategory(cat) {
  activeCategory.value = cat
  load()
}

async function toggleFavorite(article) {
  const res = await api.toggleFavorite(article.id)
  if (res.code === 0) {
    article.favorited = res.data.favorited
    ElMessage.success(article.favorited ? '已收藏' : '已取消收藏')
  }
}

function openArticle(article) {
  router.push(`/knowledge/${article.id}`)
}

onMounted(load)
</script>

<template>
  <div class="knowledge-page">
    <div class="page-head">
      <h2 class="page-title">知识库</h2>
      <div class="search-box">
        <el-input
          v-model="keyword"
          placeholder="搜索文章关键词"
          clearable
          :prefix-icon="Search"
          @keyup.enter="load"
          @clear="load"
        />
        <el-button type="primary" @click="load">搜索</el-button>
      </div>
    </div>

    <div class="category-tabs">
      <button
        class="cat-btn"
        :class="{ on: activeCategory === '' }"
        @click="switchCategory('')"
      >
        全部
      </button>
      <button
        v-for="c in CATEGORIES"
        :key="c"
        class="cat-btn"
        :class="{ on: activeCategory === c }"
        @click="switchCategory(c)"
      >
        {{ c }}
      </button>
    </div>

    <div class="article-list">
      <ArticleCard
        v-for="a in articles"
        :key="a.id"
        :article="a"
        @open="openArticle"
        @favorite="toggleFavorite"
      />
      <el-empty v-if="!articles.length" description="暂无相关文章" />
    </div>

    <p class="foot-note">
      本页面内容仅供心理健康科普参考，不构成医学诊断或治疗建议。
    </p>
  </div>
</template>

<style scoped>
.knowledge-page {
  padding: 20px;
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: #2c3e2c;
}

.search-box {
  display: flex;
  gap: 10px;
  width: 320px;
  max-width: 100%;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.cat-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #5a6b5a;
  padding: 6px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.cat-btn:hover {
  border-color: #52c41a;
  color: #3a7d34;
}

.cat-btn.on {
  background: #e6f5e4;
  border-color: #52c41a;
  color: #3a7d34;
  font-weight: 600;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.foot-note {
  margin: 20px 0 0;
  text-align: center;
  font-size: 12px;
  color: #b0b8b0;
}

@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
    align-items: stretch;
  }
  .search-box {
    width: 100%;
  }
}
</style>
