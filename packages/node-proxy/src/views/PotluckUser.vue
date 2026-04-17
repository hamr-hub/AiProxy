<template>
  <div class="potluck-user min-h-screen bg-slate-50 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🍲</span>
          <span class="font-bold text-slate-800 text-lg">API 大锅饭 <span class="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-1">用户版</span></span>
        </div>
        <div v-if="isLoggedIn" class="flex items-center gap-4">
          <div class="hidden sm:block text-sm text-slate-500">
            欢迎，<strong class="text-slate-800">{{ userData?.name || '用户' }}</strong>
          </div>
          <button @click="toggleTheme" class="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all">
            <i :class="['fas', theme === 'dark' ? 'fa-sun' : 'fa-moon']"></i>
          </button>
          <button @click="handleLogout" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
            <i class="fas fa-sign-out-alt"></i> 退出
          </button>
        </div>
        <div v-else>
          <button @click="toggleTheme" class="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all">
            <i :class="['fas', theme === 'dark' ? 'fa-sun' : 'fa-moon']"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 max-w-5xl mx-auto w-full p-6">
      <!-- Login Container -->
      <div v-if="!isLoggedIn" class="max-w-md mx-auto mt-12 sm:mt-24">
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-key text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">登录我的用量</h2>
            <p class="text-sm text-slate-500 mt-2">使用您的 API Key 登录查看个人使用统计</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</label>
              <input 
                v-model="apiKey" 
                type="text" 
                placeholder="maki_xxxxxxxx..." 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono text-sm transition-colors"
                autocomplete="off"
              >
            </div>
            <div class="flex items-center gap-2">
              <input v-model="rememberKey" type="checkbox" id="remember" class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
              <label for="remember" class="text-sm text-slate-600 cursor-pointer">记住我的 Key</label>
            </div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <i class="fas fa-sign-in-alt" v-if="!loading"></i>
              <i class="fas fa-circle-notch animate-spin" v-else></i>
              {{ loading ? '正在登录...' : '登录' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Dashboard Container -->
      <div v-else class="animate-fade-in">
        <div class="flex items-center gap-2 mb-6">
          <i class="fas fa-chart-bar text-indigo-500"></i>
          <h3 class="text-xl font-bold text-slate-800">个人使用统计</h3>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-orange-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">最后使用</div>
            <div class="text-xl font-bold text-slate-800">{{ formatRelativeTime(userData?.lastUsedAt) }}</div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-indigo-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">每日用量</div>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold text-slate-800">{{ userData?.usage?.today || 0 }}</span>
              <span class="text-slate-400 text-sm">/ {{ userData?.usage?.limit || 0 }}</span>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-emerald-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">剩余额度</div>
            <div class="text-3xl font-bold text-emerald-600">{{ userData?.usage?.remaining || 0 }}</div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-cyan-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">累计调用</div>
            <div class="text-3xl font-bold text-cyan-600">{{ userData?.total || 0 }}</div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-emerald-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">今日 Tokens</div>
            <div class="text-2xl font-bold text-emerald-600">{{ formatTokenCompact(userData?.usage?.totalTokens) }}</div>
            <div class="text-[10px] text-slate-400 mt-1" v-if="userData?.usage?.cachedTokens">
              含 {{ formatTokenCompact(userData.usage.cachedTokens) }} 缓存
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-cyan-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">今日缓存 Tokens</div>
            <div class="text-2xl font-bold text-cyan-600">{{ formatTokenCompact(userData?.usage?.cachedTokens) }}</div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-indigo-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">累计 Tokens</div>
            <div class="text-2xl font-bold text-indigo-600">{{ formatTokenCompact(userData?.tokens?.total) }}</div>
            <div class="text-[10px] text-slate-400 mt-1" v-if="userData?.tokens?.cached">
              含 {{ formatTokenCompact(userData.tokens.cached) }} 缓存
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-t-4 border-cyan-500">
            <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">累计缓存 Tokens</div>
            <div class="text-2xl font-bold text-cyan-600">{{ formatTokenCompact(userData?.tokens?.cached) }}</div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h4 class="font-bold text-slate-800 mb-4 flex items-center justify-between text-sm">
              <span>我的 Token 消耗趋势</span>
              <div class="flex gap-1">
                <div class="w-1.5 h-1.5 bg-emerald-100 rounded-full"></div>
                <div class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              </div>
            </h4>
            <div class="calendar-wrapper overflow-x-auto py-1">
              <div class="calendar-grid">
                <div 
                  v-for="(day, index) in calendarDays" 
                  :key="index"
                  class="calendar-day"
                  :data-level="day.level"
                  @mouseenter="showTooltip($event, day)"
                  @mouseleave="hideTooltip"
                ></div>
              </div>
            </div>
            <div class="mt-4 text-[10px] text-slate-400 text-right">
              最近三个月累计消耗: {{ formatTokenCompact(calendarTotal) }} Tokens
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h4 class="font-bold text-slate-800 mb-4 flex items-center justify-between text-sm">
              <span>常用提供商</span>
              <span class="text-indigo-600 font-normal">{{ formatNumber(aggregatedStats.totalCalls) }} 次</span>
            </h4>
            <div class="space-y-4">
              <div v-for="item in providerDist" :key="item.name" class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="font-medium text-slate-600">{{ item.name }}</span>
                  <span class="text-slate-400">{{ formatNumber(item.count) }} 次 ({{ item.percent }}%)</span>
                </div>
                <div class="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 transition-all duration-500" :style="{ width: item.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h4 class="font-bold text-slate-800 mb-4 flex items-center justify-between text-sm">
              <span>常用模型</span>
              <span class="text-emerald-600 font-normal">{{ formatNumber(aggregatedStats.totalCalls) }} 次</span>
            </h4>
            <div class="space-y-4">
              <div v-for="item in modelDist" :key="item.name" class="space-y-1">
                <div class="flex justify-between text-[11px]">
                  <span class="font-medium text-slate-600 truncate mr-2" :title="item.name">{{ item.name }}</span>
                  <span class="text-slate-400">{{ formatNumber(item.count) }} 次 ({{ item.percent }}%)</span>
                </div>
                <div class="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: item.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- API Key Area -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <h4 class="font-bold text-slate-800 mb-4 text-sm flex items-center justify-center gap-2">
            <i class="fas fa-key text-amber-500"></i> 我的 API 密钥
          </h4>
          <div class="bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-indigo-600 break-all text-sm mb-6 max-w-lg mx-auto">
            {{ apiKey }}
          </div>
          <button @click="copyApiKey" class="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mx-auto">
            <i :class="['fas', copied ? 'fa-check' : 'fa-copy']"></i>
            {{ copied ? '已复制' : '复制密钥' }}
          </button>
          <div class="mt-8 pt-8 border-t border-slate-50">
            <p class="text-xs text-slate-400 flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              API Key 用于访问 API 服务。请妥善保管，不要泄露给他人。
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Tooltip -->
    <div 
      v-show="tooltip.show" 
      class="fixed z-[1000] px-3 py-2 bg-slate-900 text-white text-[11px] rounded shadow-xl pointer-events-none whitespace-nowrap"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>

    <!-- Footer -->
    <footer class="p-8 text-center text-xs text-slate-400">
      &copy; 2024 AiProxy Potluck. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePotluckUser } from '@/api'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'

const toast = useToast()
const { userData, loading, fetchUserUsage } = usePotluckUser()
const { theme, toggleTheme, initTheme } = useTheme()

const apiKey = ref('')
const rememberKey = ref(true)
const isLoggedIn = ref(false)
const copied = ref(false)

// Login
const handleLogin = async () => {
  const key = apiKey.value.trim()
  if (!key) {
    toast.error('请输入 API Key')
    return
  }
  if (!key.startsWith('maki_')) {
    toast.error('API Key 格式不正确')
    return
  }

  const data = await fetchUserUsage(key)
  if (data) {
    isLoggedIn.value = true
    if (rememberKey.value) {
      localStorage.setItem('potluck_user_key', key)
    }
    updateCalendar()
    toast.success('登录成功')
  } else {
    toast.error('登录失败，请检查密钥是否正确')
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  apiKey.value = ''
  localStorage.removeItem('potluck_user_key')
  userData.value = null
  toast.success('已退出登录')
}

// Stats Processing
const aggregatedStats = computed(() => {
  const providers = {}
  const models = {}
  let totalCalls = 0
  let totalTokens = 0

  const history = userData.value?.usageHistory || {}
  Object.values(history).forEach(day => {
    if (day.providers) {
      Object.entries(day.providers).forEach(([p, u]) => {
        const count = typeof u === 'number' ? u : (u.requestCount || 0)
        const tokens = typeof u === 'number' ? 0 : (u.totalTokens || 0)
        providers[p] = (providers[p] || 0) + count
        totalCalls += count
        totalTokens += tokens
      })
    }
    if (day.models) {
      Object.entries(day.models).forEach(([m, u]) => {
        const count = typeof u === 'number' ? u : (u.requestCount || 0)
        models[m] = (models[m] || 0) + count
      })
    }
  })

  return { providers, models, totalCalls, totalTokens }
})

const providerDist = computed(() => {
  const { providers, totalCalls } = aggregatedStats.value
  if (totalCalls === 0) return []
  return Object.entries(providers).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => ({
    name, count, percent: Math.round((count / totalCalls) * 100)
  }))
})

const modelDist = computed(() => {
  const { models, totalCalls } = aggregatedStats.value
  if (totalCalls === 0) return []
  return Object.entries(models).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => ({
    name, count, percent: Math.round((count / totalCalls) * 100)
  }))
})

// Calendar Logic
const calendarDays = ref([])
const calendarTotal = ref(0)
const tooltip = ref({ show: false, x: 0, y: 0, text: '' })

const updateCalendar = () => {
  const history = userData.value?.usageHistory || {}
  const now = new Date()
  const startDate = new Date()
  startDate.setMonth(now.getMonth() - 3)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const dailyData = {}
  Object.entries(history).forEach(([date, data]) => {
    dailyData[date] = {
      totalTokens: data.summary?.totalTokens || 0,
      requestCount: data.summary?.requestCount || 0
    }
  })

  const values = Object.values(dailyData).map(d => d.totalTokens)
  const max = Math.max(...values, 1000)
  const dayCount = Math.floor((now - startDate) / (24 * 3600 * 1000)) + 1
  
  const days = []
  let total = 0

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    if (date > now) break
    const dateKey = date.toISOString().split('T')[0]
    const entry = dailyData[dateKey] || { totalTokens: 0, requestCount: 0 }
    const tokens = entry.totalTokens
    total += tokens
    let level = 0
    if (tokens > 0) {
      const ratio = tokens / max
      if (ratio < 0.25) level = 1
      else if (ratio < 0.5) level = 2
      else if (ratio < 0.75) level = 3
      else level = 4
    }
    days.push({ date: dateKey, tokens, requests: entry.requestCount, level })
  }
  calendarDays.value = days
  calendarTotal.value = total
}

const showTooltip = (event, day) => {
  tooltip.value = {
    show: true,
    x: event.clientX,
    y: event.clientY - 40,
    text: `${day.date}: ${formatNumber(day.requests)} 次请求, ${formatTokenCompact(day.tokens)} Tokens`
  }
}
const hideTooltip = () => { tooltip.value.show = false }

// Actions
const copyApiKey = async () => {
  try {
    await navigator.clipboard.writeText(apiKey.value)
    copied.value = true
    toast.success('密钥已复制到剪贴板')
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    toast.error('复制失败')
  }
}

// Helpers
const formatNumber = (v) => new Intl.NumberFormat('zh-CN').format(Number(v || 0))
const formatTokenCompact = (v) => {
  const value = Number(v || 0)
  if (!Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  const units = [{ threshold: 1e9, suffix: 'G' }, { threshold: 1e6, suffix: 'M' }, { threshold: 1e3, suffix: 'K' }]
  for (const unit of units) {
    if (abs >= unit.threshold) {
      const scaled = value / unit.threshold
      const digits = Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : 2
      return `${scaled.toFixed(digits).replace(/\.0+$|(\.\d*[1-9])0+$/,'$1')}${unit.suffix}`
    }
  }
  return formatNumber(value)
}

const formatRelativeTime = (iso) => {
  if (!iso) return '从未'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const m = Math.floor((Date.now() - d.getTime()) / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  const day = Math.floor(h / 24)
  return day < 30 ? `${day} 天前` : d.toLocaleDateString()
}

onMounted(() => {
  initTheme()
  const savedKey = localStorage.getItem('potluck_user_key')
  if (savedKey) {
    apiKey.value = savedKey
    handleLogin()
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.calendar-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 10px);
  gap: 2px;
  min-width: max-content;
}

.calendar-day {
  width: 10px;
  height: 10px;
  border-radius: 1px;
  background-color: #f1f5f9;
  cursor: pointer;
  transition: all 0.1s;
}

.calendar-day:hover { transform: scale(1.2); z-index: 10; }
.calendar-day[data-level="1"] { background-color: #dcfce7; }
.calendar-day[data-level="2"] { background-color: #86efac; }
.calendar-day[data-level="3"] { background-color: #22c55e; }
.calendar-day[data-level="4"] { background-color: #166534; }
</style>
