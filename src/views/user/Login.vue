<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { api } from '@/api'
import { setToken, removeToken, hasAgreedPolicy, agreePolicy } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const form = reactive({ account: '', password: '' })

// 首次登录政策确认
const policyVisible = ref(false)
const agreePrivacy = ref(false)
const agreeDisclaimer = ref(false)

async function handleLogin() {
  if (!form.account || !form.password) return ElMessage.warning('请输入账号和密码')

  loading.value = true
  const res = await api.login({ account: form.account, password: form.password })
  loading.value = false

  if (res.code !== 0) return

  setToken(res.data.token)

  if (!hasAgreedPolicy()) {
    policyVisible.value = true
    return
  }
  goChat()
}

function confirmPolicy() {
  if (!agreePrivacy.value || !agreeDisclaimer.value) return
  agreePolicy()
  policyVisible.value = false
  goChat()
}

function cancelPolicy() {
  policyVisible.value = false
  agreePrivacy.value = false
  agreeDisclaimer.value = false
  removeToken()
  ElMessage.warning('需同意协议后方可使用')
}

function goChat() {
  ElMessage.success('登录成功')
  router.push(route.query.redirect || '/chat')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        <div class="brand-text">
          <h1>心理健康 AI 助手</h1>
          <p>倾听你的每一种情绪</p>
        </div>
      </div>

      <div class="login-form">
        <el-input
          v-model="form.account"
          placeholder="请输入账号"
          :prefix-icon="User"
        />
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
          :prefix-icon="Lock"
        />
      </div>

      <el-button
        type="primary"
        class="login-btn"
        :loading="loading"
        @click="handleLogin"
      >
        登 录
      </el-button>

      <p class="agreement">
        登录即代表同意《隐私政策》与《免责声明》<br />
        AI 建议仅供参考，不构成医学诊断。
      </p>

      <p class="switch-auth">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </p>
    </div>

    <el-dialog
      v-model="policyVisible"
      title="用户协议与免责声明"
      width="480px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="policy-content">
        <h4>《隐私政策》</h4>
        <p>我们重视你的隐私。你的对话记录、情绪日记等所有内容均为本人可见，我们将严格保护你的个人信息安全，不会在未经授权的情况下向第三方披露。</p>
        <h4>《免责声明》</h4>
        <p>本产品提供的 AI 建议与心理状态评估仅供心理健康自助参考，<strong>不构成医学诊断或治疗建议</strong>。如你正面临严重的心理困扰或危机，请及时联系专业医疗机构或心理援助热线。</p>
      </div>
      <div class="policy-checks">
        <el-checkbox v-model="agreePrivacy">我已阅读并同意《隐私政策》</el-checkbox>
        <el-checkbox v-model="agreeDisclaimer">我已阅读并同意《免责声明》</el-checkbox>
      </div>
      <template #footer>
        <el-button @click="cancelPolicy">取消</el-button>
        <el-button
          type="primary"
          :disabled="!agreePrivacy || !agreeDisclaimer"
          @click="confirmPolicy"
        >
          确认并进入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #eaf7e8 0%, #f4faf4 60%, #eef6ee 100%);
  padding: 24px;
  box-sizing: border-box;
}

.login-card {
  width: 420px;
  max-width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 36px 40px 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #52c41a, #8ed98a);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-text h1 {
  margin: 0;
  font-size: 20px;
  color: #2c3e2c;
}

.brand-text p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #9ca3af;
}

.login-form :deep(.el-input) {
  margin-bottom: 16px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  margin-top: 8px;
}

.agreement {
  margin: 16px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #b0b8b0;
  text-align: center;
}

.switch-auth {
  margin: 12px 0 0;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.switch-auth a {
  color: #52c41a;
  text-decoration: none;
  font-weight: 600;
}

.policy-content {
  max-height: 300px;
  overflow: auto;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.7;
}

.policy-content h4 {
  margin: 12px 0 4px;
  color: #2c3e2c;
}

.policy-content p {
  margin: 0 0 8px;
}

.policy-checks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
</style>
