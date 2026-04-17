<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
      <div class="text-center mb-8">
        <div class="brand-badge mx-auto mb-4" aria-hidden="true">
          <div class="brand-badge__core"></div>
          <div class="brand-badge__dot brand-badge__dot--left"></div>
          <div class="brand-badge__dot brand-badge__dot--right"></div>
          <div class="brand-badge__node"></div>
          <div class="brand-badge__orbit"></div>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">AiProxy</h1>
        <p class="text-slate-500 mt-2">管理控制台</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">密码</label>
            <div class="relative">
              <input 
                type="password" 
                v-model="password"
                class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="请输入密码"
                :disabled="isLoading"
              />
              <button 
                type="button" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <i :class="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            class="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
            :disabled="isLoading || !password"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
        </div>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-slate-500">
          默认密码: <code class="px-2 py-1 bg-slate-100 rounded text-slate-700">admin123</code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value })
    })

    const data = await response.json()

    if (response.ok && data.token) {
      localStorage.setItem('authToken', data.token)
      window.location.href = '/'
    } else {
      error.value = data.error?.message || '密码错误，请重试'
    }
  } catch (err) {
    error.value = '登录失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.brand-badge {
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at 32% 30%, rgba(94, 234, 212, 0.98), rgba(20, 184, 166, 0.92) 48%, rgba(15, 23, 42, 0.25) 49%),
    linear-gradient(145deg, #0f172a, #134e4a);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 16px 32px rgba(16, 185, 129, 0.18);
}

.brand-badge__core {
  position: absolute;
  left: 1.2rem;
  top: 1.7rem;
  width: 1.7rem;
  height: 0.8rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.84);
}

.brand-badge__dot {
  position: absolute;
  top: 1.96rem;
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 9999px;
}

.brand-badge__dot--left {
  left: 1.6rem;
  background: #5eead4;
}

.brand-badge__dot--right {
  left: 2.1rem;
  background: #22d3ee;
}

.brand-badge__node {
  position: absolute;
  right: 0.45rem;
  top: 0.65rem;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #fbbf24, #fb7185);
  box-shadow: 0 0 0 0.2rem rgba(251, 191, 36, 0.14);
}

.brand-badge__orbit {
  position: absolute;
  inset: 0.42rem;
  border-radius: 9999px;
  border: 0.24rem solid transparent;
  border-left-color: #34d399;
  border-bottom-color: #22d3ee;
  transform: rotate(-22deg);
}
</style>
