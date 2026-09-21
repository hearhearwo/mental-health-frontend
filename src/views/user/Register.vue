<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Message, Key, Lock } from '@element-plus/icons-vue'
import { api } from '@/api'
import { setToken, removeToken, hasAgreedPolicy, agreePolicy } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const sending = ref(false)
const cooldown = ref(0)
let timer = null

const form = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

// 首次注册政策确认（与登录保持一致）
const policyVisible = ref(false)
const agreePrivacy = ref(false)
const agreeDisclaimer = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(v) {
  return EMAIL_RE.test(v)
}

async function handleSendCode() {
  const email = form.email.trim()
  if (!isValidEmail(email)) return ElMessage.warning('请输入正确的邮箱地址')
  if (cooldown.value > 0) return

  sending.value = true
  const res = await api.sendEmailCode(email)
  sending.value = false
  if (res.code !== 0) return

  ElMessage.success('验证码已发送，请查收邮箱')
  cooldown.value = 60
  timer = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function handleRegister() {
  const email = form.email.trim()
  const code = form.code.trim()
  const password = form.password

  if (!isValidEmail(email)) return ElMessage.warning('请输入正确的邮箱地址')
  if (!/^\d{6}$/.test(code)) return ElMessage.warning('请输入 6 位验证码')
  if (password.length < 6 || password.length > 64) return ElMessage.warning('密码长度需在 6-64 位之间')
  if (password !== form.confirmPassword) return ElMessage.warning('两次输入的密码不一致')

  loading.value = true
  const res = await api.register({ email, password, code })
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
  ElMessage.success('注册成功')
  router.push(route.query.redirect || '/chat')
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div>
        <div class="brand-text">
          <h1>创建账号</h1>
          <p>用邮箱开启你的心理陪伴之旅</p>
        </div>
      </div>

      <div class="register-form">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
          :prefix-icon="Message"
        />

        <div class="code-row">
          <el-input
            v-model="form.code"
            placeholder="6 位验证码"
            :prefix-icon="Key"
            maxlength="6"
          />
          <el-button
            class="code-btn"
            :loading="sending"
            :disabled="cooldown > 0"
            @click="handleSendCode"
          >
            {{ cooldown > 0 ? cooldown + 's 后重发' : '发送验证码' }}
          </el-button>
        </div>

        <el-input
          v-model="form.password"
          type="password"
          placeholder="设置密码（6-64 位）"
          show-password
          :prefix-icon="Lock"
        />
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="确认密码"
          show-password
          :prefix-icon="Lock"
        />
      </div>

      <el-button
        type="primary"
        class="register-btn"
        :loading="loading"
        @click="handleRegister"
      >
        注 册
      </el-button>

      <p class="agreement">
        注册即代表同意《隐私政策》与《免责声明》<br />
        AI 建议仅供参考，不构成医学诊断。
      </p>

      <p class="switch-auth">
        已有账号？<router-link to="/login">去登录</router-link>
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #eaf7e8 0%, #f4faf4 60%, #eef6ee 100%);
  padding: 24px;
  box-sizing: border-box;
}

.register-card {
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

.register-form :deep(.el-input) {
  margin-bottom: 16px;
}

.code-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.code-row :deep(.el-input) {
  margin: 0;
  flex: 1;
}

.code-btn {
  flex-shrink: 0;
  height: 40px;
}

.register-btn {
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
