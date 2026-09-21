<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, DataAnalysis, Loading, ChatDotRound } from '@element-plus/icons-vue'
import { api } from '@/api'
import StatusPanel from '@/components/user/StatusPanel.vue'
import ChatBubble from '@/components/user/ChatBubble.vue'

const statusData = ref({
  level: 'L2',
  dimensions: [],
  trend7: { dates: [], levels: [] },
  trend30: { dates: [], levels: [] }
})

const statusLoading = ref(true)

const conversations = ref([])
const messages = ref([])
const currentId = ref('')
const input = ref('')
const loading = ref(false)
const panelDrawer = ref(false)
const msgBox = ref(null)

const currentTitle = computed(() => {
  const c = conversations.value.find((x) => x.id === currentId.value)
  return c ? c.title : '新的会话'
})

async function loadStatus() {
  statusLoading.value = true
  const res = await api.getStatus()
  if (res.code === 0) statusData.value = res.data
  statusLoading.value = false
}

async function loadConversations() {
  const res = await api.getConversations()
  if (res.code === 0) {
    conversations.value = res.data
    if (res.data.length && !currentId.value) {
      currentId.value = res.data[0].id
      await loadMessages(res.data[0].id)
    }
  }
}

async function loadMessages(id) {
  const res = await api.getMessages(id)
  if (res.code === 0) {
    messages.value = res.data
    scrollToBottom()
  }
}

async function switchConv(id) {
  currentId.value = id
  await loadMessages(id)
}

async function newConversation() {
  const res = await api.createConversation()
  if (res.code === 0) {
    conversations.value.unshift(res.data)
    currentId.value = res.data.id
    messages.value = []
  }
}

async function deleteConversation(id) {
  ElMessageBox.confirm('确定删除该会话吗？', '提示', { type: 'warning' })
    .then(async () => {
      await api.deleteConversation(id)
      conversations.value = conversations.value.filter((c) => c.id !== id)
      if (currentId.value === id) {
        if (conversations.value.length) {
          currentId.value = conversations.value[0].id
          await loadMessages(currentId.value)
        } else {
          currentId.value = ''
          messages.value = []
        }
      }
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  messages.value.push({ id: 'temp', role: 'user', content: text, type: 'text', time: '刚刚' })
  loading.value = true
  scrollToBottom()

  const res = await api.sendMessage(currentId.value, text)
  loading.value = false
  if (res.code === 0) {
    // 移除临时消息，用接口返回的替换
    messages.value = messages.value.filter((m) => m.id !== 'temp')
    messages.value.push(res.data.user, res.data.reply)
    // 对话驱动状态图刷新
    await loadStatus()
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight
  })
}

onMounted(async () => {
  await Promise.all([loadStatus(), loadConversations()])
})
</script>

<template>
  <div class="chat-page">
    <div class="status-col">
      <StatusPanel :status="statusData" :loading="statusLoading" />
    </div>

    <div class="chat-col">
      <div class="chat-toolbar">
        <el-button type="primary" plain size="small" :icon="Plus" @click="newConversation">
          新建会话
        </el-button>
        <span class="conv-title">{{ currentTitle }}</span>
        <div class="toolbar-right">
          <el-button class="status-toggle" size="small" :icon="DataAnalysis" @click="panelDrawer = true">
            状态
          </el-button>

          <el-popover placement="bottom-end" width="280" trigger="click">
            <template #reference>
              <el-button size="small" :icon="ChatDotRound">历史会话</el-button>
            </template>
            <div class="conv-list">
              <div
                v-for="c in conversations"
                :key="c.id"
                class="conv-item"
                :class="{ active: c.id === currentId }"
                @click="switchConv(c.id)"
              >
                <div class="conv-main">
                  <div class="conv-title">{{ c.title }}</div>
                  <div class="conv-time">{{ c.updatedAt }}</div>
                </div>
                <el-button link type="danger" size="small" @click.stop="deleteConversation(c.id)">
                  删除
                </el-button>
              </div>
              <el-empty v-if="!conversations.length" description="暂无会话" :image-size="60" />
            </div>
          </el-popover>
        </div>
      </div>

      <div ref="msgBox" class="messages">
        <ChatBubble v-for="m in messages" :key="m.id" :message="m" />
        <div v-if="loading" class="loading-row">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI 正在思考…</span>
        </div>
        <el-empty
          v-if="!messages.length && !loading"
          description="开始你的第一次倾诉吧"
          :image-size="80"
        />
      </div>

      <div class="input-bar">
        <el-input
          v-model="input"
          type="textarea"
          :rows="2"
          resize="none"
          placeholder="请输入你想倾诉的内容，Enter 发送"
          @keydown.enter.exact.prevent="send"
        />
        <el-button type="primary" :disabled="!input.trim()" @click="send">发送</el-button>
      </div>
    </div>

    <el-drawer v-model="panelDrawer" direction="ltr" size="320px" title="心理状态">
      <StatusPanel :status="statusData" :loading="statusLoading" />
    </el-drawer>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  gap: 20px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.status-col {
  flex: 0 0 28%;
  max-width: 340px;
  min-width: 260px;
  min-height: 0;
}

.chat-col {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f0;
}

.conv-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e2c;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.status-toggle {
  display: none;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafbfa;
}

.loading-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
  padding: 8px 0;
}

.input-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  padding: 14px 16px;
  border-top: 1px solid #f0f2f0;
}

.input-bar .el-input {
  flex: 1;
}

.input-bar .el-button {
  height: 40px;
  flex-shrink: 0;
}

.conv-list {
  max-height: 320px;
  overflow-y: auto;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.conv-item:hover {
  background: #f4faf4;
}

.conv-item.active {
  background: #e6f5e4;
}

.conv-main {
  flex: 1;
  min-width: 0;
}

.conv-title {
  font-size: 13px;
  color: #2c3e2c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-time {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .chat-page {
    padding: 12px;
  }
  .status-col {
    display: none;
  }
  .status-toggle {
    display: inline-flex;
  }
}
</style>
