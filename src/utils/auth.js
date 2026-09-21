const TOKEN_KEY = 'ai_mental_token'
const POLICY_KEY = 'ai_mental_policy_agreed'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

export function hasAgreedPolicy() {
  return localStorage.getItem(POLICY_KEY) === '1'
}

export function agreePolicy() {
  localStorage.setItem(POLICY_KEY, '1')
}
