<script setup>
defineProps({
  message: { type: Object, required: true }
})
</script>

<template>
  <div class="bubble-row" :class="message.role">
    <div class="bubble" :class="{ crisis: message.crisis }">
      <div v-if="message.crisis" class="crisis-tag">⚠ 危机干预提示</div>

      <p v-if="message.content" class="text">{{ message.content }}</p>

      <!-- 卡片消息：建议清单 -->
      <div v-if="message.type === 'card' && message.card.items" class="card-box">
        <div class="card-title">{{ message.card.title }}</div>
        <ul class="card-items">
          <li v-for="(item, i) in message.card.items" :key="i">{{ item }}</li>
        </ul>
      </div>

      <!-- 卡片消息：文章推荐 -->
      <div v-if="message.type === 'card' && message.card.articleRefs" class="card-box">
        <div class="card-title">{{ message.card.title }}</div>
        <router-link
          v-for="ref in message.card.articleRefs"
          :key="ref.id"
          :to="`/knowledge/${ref.id}`"
          class="article-ref"
        >
          {{ ref.title }}
        </router-link>
      </div>

      <span class="time">{{ message.time }}</span>
    </div>
  </div>
</template>

<style scoped>
.bubble-row {
  display: flex;
  margin-bottom: 14px;
}

.bubble-row.user {
  justify-content: flex-end;
}

.bubble {
  max-width: 72%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
}

.bubble-row.user .bubble {
  background: #e6f5e4;
  color: #2c3e2c;
  border-bottom-right-radius: 4px;
}

.bubble-row.assistant .bubble {
  background: #f4f4f7;
  color: #333;
  border-bottom-left-radius: 4px;
}

.bubble.crisis {
  background: #fdeeee;
  border: 1px solid #ea6668;
  color: #5a1d1d;
}

.crisis-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  color: #ea6668;
  margin-bottom: 6px;
}

.text {
  margin: 0;
  white-space: pre-line;
}

.card-box {
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e2c;
  margin-bottom: 8px;
}

.card-items {
  margin: 0;
  padding-left: 18px;
}

.card-items li {
  margin-bottom: 6px;
}

.article-ref {
  display: block;
  color: #3a7d34;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.article-ref:last-child {
  border-bottom: none;
}

.article-ref:hover {
  color: #52c41a;
}

.time {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: #b0b8b0;
  text-align: right;
}
</style>
