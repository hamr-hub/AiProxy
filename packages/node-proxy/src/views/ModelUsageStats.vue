<template>
  <div class="model-usage-stats p-6">
    <!-- Header Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-t-4 border-emerald-500">
        <div class="text-xs font-semibold text-slate-500 uppercase mb-2">总请求数</div>
        <div class="text-3xl font-bold text-slate-800">{{ formatNumber(statsSummary.requestCount) }}</div>
        <div class="text-xs text-slate-400 mt-2">累计成功落库的调用次数</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-t-4 border-blue-500">
        <div class="text-xs font-semibold text-slate-500 uppercase mb-2">输入 Token</div>
        <div class="text-3xl font-bold text-slate-800">{{ formatTokenCompact(statsSummary.promptTokens) }}</div>
        <div class="text-xs text-slate-400 mt-2">输入 token 的累计值</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-t-4 border-cyan-500">
        <div class="text-xs font-semibold text-slate-500 uppercase mb-2">缓存 Token</div>
        <div class="text-3xl font-bold text-slate-800">{{ formatTokenCompact(statsSummary.cachedTokens) }}</div>
        <div class="text-xs text-slate-400 mt-2">缓存命中的累计值</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-t-4 border-indigo-500">
        <div class="text-xs font-semibold text-slate-500 uppercase mb-2">输出 Token</div>
        <div class="text-3xl font-bold text-slate-800">{{ formatTokenCompact(statsSummary.completionTokens) }}</div>
        <div class="text-xs text-slate-400 mt-2">输出 token 的累计值</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-t-4 border-orange-500">
        <div class="text-xs font-semibold text-slate-500 uppercase mb-2">总 Token</div>
        <div class="text-3xl font-bold text-slate-800">{{ formatTokenCompact(statsSummary.totalTokens) }}</div>
        <div class="text-xs text-slate-400 mt-2">{{ statsData?.updatedAt ? new Date(statsData.updatedAt).toLocaleString() : '等待数据' }}</div>
      </div>
    </div>

    <!-- Charts and Distributions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Token Usage Heatmap -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <i class="fas fa-calendar-days text-emerald-500"></i> Token 使用趋势 (3个月)
        </h3>
        <div class="calendar-wrapper overflow-x-auto py-2">
          <div class="calendar-grid" ref="calendarGridRef">
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
        <div class="mt-4 text-xs text-slate-500">
          最近三个月累计消耗: {{ formatTokenCompact(calendarTotal) }} Token
        </div>
      </div>

      <!-- Provider Distribution -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <i class="fas fa-sitemap text-blue-500"></i> Provider 分布
        </h3>
        <div class="space-y-4">
          <div v-for="item in providerDistribution" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-slate-700 truncate mr-2" :title="item.name">{{ item.name }}</span>
              <span class="text-slate-500 font-mono">{{ formatTokenCompact(item.totalTokens) }}</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Models Distribution -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <i class="fas fa-fire text-orange-500"></i> Top Models
        </h3>
        <div class="space-y-4">
          <div v-for="item in topModelsDistribution" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-slate-700 truncate mr-2" :title="item.name">{{ item.name }}</span>
              <span class="text-slate-500 font-mono">{{ formatTokenCompact(item.totalTokens) }}</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-500 rounded-full transition-all duration-500"
                :style="{ width: item.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Provider Cards -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <i class="fas fa-layer-group text-indigo-500"></i> Provider 视图
        </h3>
        <div class="flex gap-2">
          <button @click="refreshData" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-rotate-right" :class="{ 'animate-spin': loading }"></i> 刷新
          </button>
          <button @click="handleResetTokens" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-eraser"></i> 重置 Token
          </button>
          <button @click="handleResetStats" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fas fa-trash-can"></i> 重置统计
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="p in providersList" :key="p.name" class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-emerald-500 transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="text-base font-bold text-slate-800">{{ p.name }}</div>
              <div class="text-xs text-slate-400">包含 {{ p.modelCount }} 个模型</div>
            </div>
            <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded flex items-center gap-1">
              <i class="fas fa-bolt text-amber-500"></i> {{ formatNumber(p.summary.requestCount) }} 次
            </span>
          </div>
          <div class="grid grid-cols-2 gap-y-3 gap-x-2">
            <div class="space-y-0.5">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">总 Token</div>
              <div class="text-sm font-mono font-bold text-slate-700">{{ formatTokenCompact(p.summary.totalTokens) }}</div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">最近使用</div>
              <div class="text-sm text-slate-600">{{ formatRelativeTime(p.summary.lastUsedAt) }}</div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">输入</div>
              <div class="text-sm font-mono text-slate-600">{{ formatTokenCompact(p.summary.promptTokens) }}</div>
            </div>
            <div class="space-y-0.5">
              <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">输出</div>
              <div class="text-sm font-mono text-slate-600">{{ formatTokenCompact(p.summary.completionTokens) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Model Details Table -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <i class="fas fa-table text-emerald-500"></i> 模型明细
        </h3>
        <div class="flex flex-wrap gap-3">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索 provider 或 model" 
              class="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-colors w-64"
            >
          </div>
          <select 
            v-model="sortKey" 
            class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="totalTokens-desc">按总 Token 降序</option>
            <option value="requestCount-desc">按请求数降序</option>
            <option value="promptTokens-desc">按输入 Token 降序</option>
            <option value="completionTokens-desc">按输出 Token 降序</option>
            <option value="provider-asc">按 Provider 升序</option>
            <option value="model-asc">按 Model 升序</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th class="px-6 py-4">Provider</th>
              <th class="px-6 py-4">Model</th>
              <th class="px-6 py-4">请求数</th>
              <th class="px-6 py-4">Prompt</th>
              <th class="px-6 py-4">Cached</th>
              <th class="px-6 py-4">Completion</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4">最近使用</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in filteredRows" :key="r.provider + r.model" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                  <i class="fas fa-server text-slate-400"></i>{{ r.provider }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-800 font-medium">{{ r.model }}</td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ formatNumber(r.requestCount) }}</td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ formatTokenCompact(r.promptTokens) }}</td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ formatTokenCompact(r.cachedTokens) }}</td>
              <td class="px-6 py-4 text-sm font-mono text-slate-600">{{ formatTokenCompact(r.completionTokens) }}</td>
              <td class="px-6 py-4 text-sm font-mono font-bold text-slate-800">{{ formatTokenCompact(r.totalTokens) }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ formatRelativeTime(r.lastUsedAt) }}</td>
            </tr>
            <tr v-if="filteredRows.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-slate-400 italic">
                没有匹配的数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tooltip -->
    <div 
      v-show="tooltip.show" 
      class="fixed z-[1000] px-3 py-2 bg-slate-900 text-white text-[11px] rounded shadow-xl pointer-events-none whitespace-nowrap"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>

    <ConfirmModal
      v-model="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      @confirm="confirmModal.onConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useModelUsageStats } from '@/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const toast = useToast()
const { stats: statsData, loading, fetchStats, resetStats, resetTokens } = useModelUsageStats()

const searchQuery = ref('')
const sortKey = ref('totalTokens-desc')

const statsSummary = computed(() => statsData.value?.summary || {
  requestCount: 0,
  promptTokens: 0,
  cachedTokens: 0,
  completionTokens: 0,
  totalTokens: 0
})

const allRows = computed(() => {
  if (!statsData.value?.providers) return []
  const list = []
  for (const [provider, pd] of Object.entries(statsData.value.providers)) {
    for (const [model, md] of Object.entries(pd.models || {})) {
      list.push({
        provider,
        model,
        ...md
      })
    }
  }
  return list
})

const filteredRows = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const [field, dir] = sortKey.value.split('-')
  
  let list = allRows.value
  if (keyword) {
    list = list.filter(r => r.provider.toLowerCase().includes(keyword) || r.model.toLowerCase().includes(keyword))
  }
  
  return [...list].sort((a, b) => {
    if (field === 'provider' || field === 'model') {
      const l = String(a[field] || '')
      const r = String(b[field] || '')
      return dir === 'desc' ? r.localeCompare(l) : l.localeCompare(r)
    }
    const l = Number(a[field] || 0)
    const r = Number(b[field] || 0)
    return dir === 'desc' ? r - l : l - r
  })
})

const providerDistribution = computed(() => {
  if (!statsData.value?.providers) return []
  const providersRaw = Object.entries(statsData.value.providers).map(([name, p]) => ({
    name,
    totalTokens: Number(p.summary?.totalTokens || 0)
  })).sort((a, b) => b.totalTokens - a.totalTokens)

  const maxTokens = Math.max(...providersRaw.map(p => p.totalTokens), 1)
  
  const top = providersRaw.slice(0, 5).map(p => ({
    ...p,
    percentage: (p.totalTokens / maxTokens) * 100
  }))

  if (providersRaw.length > 5) {
    const otherTokens = providersRaw.slice(5).reduce((sum, p) => sum + p.totalTokens, 0)
    top.push({
      name: `其它 (${providersRaw.length - 5} 个)`,
      totalTokens: otherTokens,
      percentage: (otherTokens / maxTokens) * 100
    })
  }
  
  return top
})

const topModelsDistribution = computed(() => {
  const modelsRaw = [...allRows.value].sort((a, b) => Number(b.totalTokens || 0) - Number(a.totalTokens || 0))
  const maxTokens = Math.max(...modelsRaw.map(m => m.totalTokens), 1)
  
  const top = modelsRaw.slice(0, 5).map(m => ({
    name: `${m.provider}/${m.model}`,
    totalTokens: m.totalTokens,
    percentage: (m.totalTokens / maxTokens) * 100
  }))

  if (modelsRaw.length > 5) {
    const otherTokens = modelsRaw.slice(5).reduce((sum, m) => sum + (Number(m.totalTokens) || 0), 0)
    top.push({
      name: `其它 (${modelsRaw.length - 5} 个)`,
      totalTokens: otherTokens,
      percentage: (otherTokens / maxTokens) * 100
    })
  }
  
  return top
})

const providersList = computed(() => {
  if (!statsData.value?.providers) return []
  return Object.entries(statsData.value.providers).map(([name, p]) => ({
    name,
    summary: p.summary,
    modelCount: Object.keys(p.models || {}).length
  })).sort((a, b) => (b.summary.totalTokens || 0) - (a.summary.totalTokens || 0))
})

// Calendar Logic
const calendarDays = ref([])
const calendarTotal = ref(0)
const tooltip = ref({ show: false, x: 0, y: 0, text: '' })

const updateCalendar = () => {
  const dailyData = statsData.value?.daily || {}
  const now = new Date()
  const startDate = new Date()
  startDate.setMonth(now.getMonth() - 3)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const values = Object.values(dailyData).map(d => d.totalTokens || 0)
  const max = Math.max(...values, 1000)
  const dayCount = Math.floor((now - startDate) / (24 * 3600 * 1000)) + 1
  
  const days = []
  let total = 0

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    if (date > now) break

    const dateKey = date.toISOString().split('T')[0]
    const data = dailyData[dateKey] || { totalTokens: 0, requestCount: 0 }
    const tokens = data.totalTokens || 0
    total += tokens

    let level = 0
    if (tokens > 0) {
      const ratio = tokens / max
      if (ratio < 0.25) level = 1
      else if (ratio < 0.5) level = 2
      else if (ratio < 0.75) level = 3
      else level = 4
    }

    days.push({
      date: dateKey,
      tokens,
      requests: data.requestCount || 0,
      level
    })
  }
  
  calendarDays.value = days
  calendarTotal.value = total
}

const showTooltip = (event, day) => {
  tooltip.value = {
    show: true,
    x: event.clientX,
    y: event.clientY - 40,
    text: `${day.date}: ${formatNumber(day.requests)} 次请求, ${formatTokenCompact(day.tokens)} Token`
  }
}

const hideTooltip = () => {
  tooltip.value.show = false
}

// Actions
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  onConfirm: () => {}
})

const refreshData = async () => {
  await fetchStats()
  updateCalendar()
}

const handleResetTokens = () => {
  confirmModal.value = {
    show: true,
    title: '确认重置 Token 统计',
    message: '确认重置模型 Token 统计吗？这会清空输入 / 输出 / 缓存 / 总 Token，但保留请求次数与最近使用时间。',
    onConfirm: async () => {
      try {
        await resetTokens()
        toast.success('Token 统计已重置')
        updateCalendar()
      } catch (err) {
        toast.error('重置失败: ' + err.message)
      }
    }
  }
}

const handleResetStats = () => {
  confirmModal.value = {
    show: true,
    title: '确认重置全部统计',
    message: '确认重置全部模型统计吗？此操作会清空已落库的累计数据。',
    onConfirm: async () => {
      try {
        await resetStats()
        toast.success('统计数据已重置')
        updateCalendar()
      } catch (err) {
        toast.error('重置失败: ' + err.message)
      }
    }
  }
}

// Utils
const formatNumber = (v) => new Intl.NumberFormat('zh-CN').format(Number(v || 0))
const formatTokenCompact = (v) => {
  const value = Number(v || 0)
  if (!Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  const units = [
    { threshold: 1e9, suffix: 'G' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' }
  ]
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
  if (!iso) return '未记录'
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

onMounted(async () => {
  await fetchStats()
  updateCalendar()
})
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 12px);
  gap: 3px;
  min-width: max-content;
}

.calendar-day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: #f1f5f9;
  cursor: pointer;
  transition: all 0.1s;
}

.calendar-day:hover {
  transform: scale(1.2);
  z-index: 10;
  box-shadow: 0 0 0 1px #10b981;
}

.calendar-day[data-level="1"] { background-color: #dcfce7; }
.calendar-day[data-level="2"] { background-color: #86efac; }
.calendar-day[data-level="3"] { background-color: #22c55e; }
.calendar-day[data-level="4"] { background-color: #166534; }

/* Dark mode support if needed */
[data-theme="dark"] .calendar-day[data-level="1"] { background-color: #064e3b; }
[data-theme="dark"] .calendar-day[data-level="2"] { background-color: #065f46; }
[data-theme="dark"] .calendar-day[data-level="3"] { background-color: #059669; }
[data-theme="dark"] .calendar-day[data-level="4"] { background-color: #10b981; }
</style>
