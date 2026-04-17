<template>
  <div class="potluck-admin p-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-indigo-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">总 Key 数</div>
        <div class="text-2xl font-bold text-slate-800">{{ stats?.totalKeys || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-emerald-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">已启用</div>
        <div class="text-2xl font-bold text-emerald-600">{{ stats?.enabledKeys || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-pink-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">今日总调用</div>
        <div class="text-2xl font-bold text-pink-600">{{ stats?.todayTotalUsage || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-cyan-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">累计调用</div>
        <div class="text-2xl font-bold text-cyan-600">{{ stats?.totalUsage || 0 }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-emerald-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">今日总 Tokens</div>
        <div class="text-2xl font-bold text-emerald-600">{{ formatTokenCompact(stats?.todayTotalTokens) }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-cyan-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">今日缓存</div>
        <div class="text-2xl font-bold text-cyan-600">{{ formatTokenCompact(stats?.todayCachedTokens) }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-pink-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">累计 Tokens</div>
        <div class="text-2xl font-bold text-pink-600">{{ formatTokenCompact(stats?.totalTokens) }}</div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-4 border-t-4 border-cyan-500">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">累计缓存</div>
        <div class="text-2xl font-bold text-cyan-600">{{ formatTokenCompact(stats?.totalCachedTokens) }}</div>
      </div>
    </div>

    <!-- Usage Trends and Distributions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Calendar -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
          <span><i class="fas fa-calendar-days text-indigo-500 mr-2"></i>Token 使用趋势</span>
          <div class="flex gap-1">
            <div class="w-2 h-2 rounded-sm bg-slate-100"></div>
            <div class="w-2 h-2 rounded-sm bg-emerald-700"></div>
          </div>
        </h3>
        <div class="calendar-wrapper overflow-x-auto py-2">
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

      <!-- Providers -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
          <span><i class="fas fa-chart-pie text-emerald-500 mr-2"></i>常用提供商</span>
          <span class="text-sm font-normal text-emerald-600">{{ formatNumber(aggregatedStats.totalCalls) }} 次</span>
        </h3>
        <div class="space-y-4">
          <div v-for="item in providerDist" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="font-medium text-slate-700">{{ item.name }}</span>
              <span class="text-slate-500">{{ formatNumber(item.count) }} 次 ({{ item.percent }}%)</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: item.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Models -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
          <span><i class="fas fa-fire text-pink-500 mr-2"></i>热门模型</span>
          <span class="text-sm font-normal text-pink-600">{{ formatTokenCompact(aggregatedStats.totalTokens) }} Tokens</span>
        </h3>
        <div class="space-y-4">
          <div v-for="item in modelDist" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="font-medium text-slate-700 truncate mr-2" :title="item.name">{{ item.name }}</span>
              <span class="text-slate-500">{{ formatNumber(item.count) }} 次 ({{ item.percent }}%)</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-pink-500 rounded-full transition-all duration-500"
                :style="{ width: item.percent + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Key List Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
        <i class="fas fa-key text-amber-500"></i> Key 列表
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索名称或 Key..." 
            class="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors w-64 shadow-sm"
          >
        </div>
        <select 
          v-model="sortValue"
          class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
        >
          <option value="name-asc">名称 A-Z</option>
          <option value="name-desc">名称 Z-A</option>
          <option value="usage-desc">今日用量 ↓</option>
          <option value="usage-asc">今日用量 ↑</option>
          <option value="total-desc">累计用量 ↓</option>
          <option value="lastUsed-desc">最近使用 ↓</option>
          <option value="created-desc">创建时间 ↓</option>
        </select>
        <button @click="handleResetAllTokens" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <i class="fas fa-eraser"></i> 重置全部 Token
        </button>
        <button @click="showApplyLimitModal = true" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <i class="fas fa-cog"></i> 批量应用限额
        </button>
        <button @click="showCreateModal = true" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <i class="fas fa-plus"></i> 生成新 Key
        </button>
      </div>
    </div>

    <!-- Key List -->
    <div class="space-y-4">
      <div v-for="key in filteredKeys" :key="key.id" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all hover:border-indigo-300" :class="{ 'opacity-60': !key.enabled }">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
          <div class="flex-1 min-w-[200px]">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-slate-800 text-lg">{{ key.name }}</span>
              <button @click="openEditName(key)" class="p-1 text-slate-400 hover:text-indigo-500 transition-colors">
                <i class="fas fa-edit text-xs"></i>
              </button>
            </div>
            <div class="flex items-center gap-2 text-sm font-mono text-slate-500">
              {{ key.maskedKey }}
              <button @click="copyToClipboard(key.id)" class="p-1 hover:text-indigo-500 transition-colors">
                <i class="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div v-if="getKeyTopProviders(key).length" class="mt-3 flex flex-wrap gap-2">
              <span v-for="p in getKeyTopProviders(key)" :key="p.name" class="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500">
                {{ p.name }}: <b class="text-indigo-600">{{ formatNumber(p.count) }}</b>
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 flex-[2]">
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">今日/限额</div>
              <div class="text-sm font-bold" :class="getUsageClass(key)">{{ key.todayUsage }}/{{ key.dailyLimit }}</div>
              <div class="text-[10px] text-slate-400 truncate">
                {{ formatTokenCompact(key.todayTotalTokens || 0) }} Tokens 
                <span v-if="key.todayCachedTokens" class="text-emerald-500">(含 {{ formatTokenCompact(key.todayCachedTokens) }} 缓存)</span>
              </div>
              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="getUsageBarClass(key)"
                  :style="{ width: Math.min((key.todayUsage / (key.dailyLimit || 1)) * 100, 100) + '%' }"
                ></div>
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">累计调用</div>
              <div class="text-sm font-bold text-slate-800">{{ formatNumber(key.totalUsage) }}</div>
              <div class="text-[10px] text-slate-400 truncate">
                {{ formatTokenCompact(key.totalTokens || 0) }} Tokens
                <span v-if="key.totalCachedTokens" class="text-emerald-500">(含 {{ formatTokenCompact(key.totalCachedTokens) }} 缓存)</span>
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">最后调用</div>
              <div class="text-sm font-medium text-slate-600">{{ formatRelativeTime(key.lastUsedAt) }}</div>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">状态</div>
              <div class="text-sm font-bold" :class="key.enabled ? 'text-emerald-600' : 'text-red-500'">
                {{ key.enabled ? '启用' : '禁用' }}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
            <button @click="handleResetKeyUsage(key.id)" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-100" title="重置今日用量">
              <i class="fas fa-redo"></i>
            </button>
            <button @click="handleResetKeyTokens(key.id)" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-100" title="重置 Token 统计">
              <i class="fas fa-eraser"></i>
            </button>
            <button @click="openEditLimit(key)" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-100" title="修改限额">
              <i class="fas fa-sliders-h"></i>
            </button>
            <button @click="handleToggleKey(key.id)" class="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100" :class="key.enabled ? 'text-emerald-600' : 'text-slate-400'" :title="key.enabled ? '禁用' : '启用'">
              <i :class="['fas', key.enabled ? 'fa-toggle-on' : 'fa-toggle-off']"></i>
            </button>
            <button @click="handleDeleteKey(key.id)" class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100" title="删除">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredKeys.length === 0" class="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center text-slate-400 italic">
        没有匹配的 Key
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">生成新 API Key</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">Key 名称 (可选)</label>
            <input v-model="createFormData.name" type="text" placeholder="例如：测试用户 1" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">每日调用限额</label>
            <input v-model.number="createFormData.dailyLimit" type="number" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500">
          </div>
          <button @click="handleCreateKey" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
            生成 Key
          </button>
        </div>
      </div>
    </div>

    <div v-if="showNewKeyModal" class="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">Key 已生成</h3>
          <button @click="showNewKeyModal = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6">
          <p class="text-sm text-slate-500 mb-4">请妥善保存此 Key，关闭后将无法再次查看完整内容：</p>
          <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 font-mono text-emerald-700 break-all text-center text-lg font-bold mb-6">
            {{ newKeySecret }}
          </div>
          <button @click="copyToClipboard(newKeySecret)" class="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <i class="fas fa-copy"></i> 复制 Key
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditLimitModal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">修改每日限额</h3>
          <button @click="showEditLimitModal = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">新的每日限额</label>
            <input v-model.number="editLimitData.dailyLimit" type="number" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500">
          </div>
          <button @click="handleUpdateLimit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
            保存
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditNameModal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">修改 Key 名称</h3>
          <button @click="showEditNameModal = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">新的名称</label>
            <input v-model="editNameData.name" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500">
          </div>
          <button @click="handleUpdateName" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
            保存
          </button>
        </div>
      </div>
    </div>

    <div v-if="showApplyLimitModal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">批量应用每日限额</h3>
          <button @click="showApplyLimitModal = false" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase">每日调用限额</label>
            <input v-model.number="applyLimitValue" type="number" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500">
          </div>
          <div class="bg-red-50 border border-red-100 rounded-xl p-4">
            <div class="text-xs font-bold text-red-600 uppercase mb-2">风险提示：</div>
            <ul class="text-[11px] text-red-500 space-y-1 list-disc pl-4">
              <li>所有 Key 的每日限额将被覆盖</li>
              <li>已单独设置限额的 Key 也会被修改</li>
              <li>此操作不可撤销</li>
            </ul>
          </div>
          <button @click="handleApplyLimitToAll" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
            应用限额
          </button>
        </div>
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
import { usePotluck } from '@/api'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const toast = useToast()
const { 
  keys, stats, loading, fetchKeys, createKey, resetKeyUsage, 
  resetKeyTokens, resetAllTokens, updateKeyLimit, updateKeyName, 
  toggleKey, deleteKey, applyLimitToAll 
} = usePotluck()

const searchQuery = ref('')
const sortValue = ref('name-asc')
const showCreateModal = ref(false)
const showNewKeyModal = ref(false)
const showEditLimitModal = ref(false)
const showEditNameModal = ref(false)
const showApplyLimitModal = ref(false)
const newKeySecret = ref('')
const applyLimitValue = ref(500)

const createFormData = ref({ name: '', dailyLimit: 500 })
const editLimitData = ref({ id: '', dailyLimit: 0 })
const editNameData = ref({ id: '', name: '' })

const confirmModal = ref({ show: false, title: '', message: '', onConfirm: () => {} })

const filteredKeys = computed(() => {
  let list = [...keys.value]
  const term = searchQuery.value.toLowerCase().trim()
  if (term) {
    list = list.filter(k => k.name.toLowerCase().includes(term) || k.id.toLowerCase().includes(term))
  }

  const [field, order] = sortValue.value.split('-')
  list.sort((a, b) => {
    let va, vb
    if (field === 'name') { va = a.name.toLowerCase(); vb = b.name.toLowerCase() }
    else if (field === 'usage') { va = a.todayUsage; vb = b.todayUsage }
    else if (field === 'total') { va = a.totalUsage; vb = b.totalUsage }
    else if (field === 'lastUsed') { va = a.lastUsedAt || ''; vb = b.lastUsedAt || '' }
    else if (field === 'created') { va = a.createdAt || ''; vb = b.createdAt || '' }

    if (va < vb) return order === 'asc' ? -1 : 1
    if (va > vb) return order === 'asc' ? 1 : -1
    return 0
  })
  return list
})

const aggregatedStats = computed(() => {
  const providers = {}
  const models = {}
  let totalCalls = 0
  let totalTokens = 0

  const history = stats.value?.usageHistory || {}
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
  return Object.entries(providers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / totalCalls) * 100)
    }))
})

const modelDist = computed(() => {
  const { models, totalCalls } = aggregatedStats.value
  if (totalCalls === 0) return []
  return Object.entries(models)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / totalCalls) * 100)
    }))
})

// Calendar Logic
const calendarDays = ref([])
const calendarTotal = ref(0)
const tooltip = ref({ show: false, x: 0, y: 0, text: '' })

const updateCalendar = () => {
  const history = stats.value?.usageHistory || {}
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
const handleCreateKey = async () => {
  try {
    const res = await createKey(createFormData.value.name, createFormData.value.dailyLimit)
    if (res?.success) {
      newKeySecret.value = res.data.id
      showCreateModal.value = false
      showNewKeyModal.value = true
      createFormData.value = { name: '', dailyLimit: 500 }
      toast.success('Key 已生成')
      updateCalendar()
    }
  } catch (err) {
    toast.error('生成失败: ' + err.message)
  }
}

const handleResetKeyUsage = (id) => {
  confirmModal.value = {
    show: true,
    title: '重置今日用量',
    message: '确定要重置该 Key 的今日调用次数吗？',
    onConfirm: async () => {
      try {
        await resetKeyUsage(id)
        toast.success('今日用量已重置')
        updateCalendar()
      } catch (err) {
        toast.error('操作失败: ' + err.message)
      }
    }
  }
}

const handleResetKeyTokens = (id) => {
  confirmModal.value = {
    show: true,
    title: '重置 Token 统计',
    message: '确定要重置该 Key 的 Token 统计吗？这会清空该 Key 的今日/累计 Token 与历史 Token 统计，但保留调用次数。',
    onConfirm: async () => {
      try {
        await resetKeyTokens(id)
        toast.success('Token 统计已重置')
        updateCalendar()
      } catch (err) {
        toast.error('操作失败: ' + err.message)
      }
    }
  }
}

const handleResetAllTokens = () => {
  confirmModal.value = {
    show: true,
    title: '重置全部 Token 统计',
    message: '确定要重置全部 Key 的 Token 统计吗？这会清空所有 Key 的今日/累计 Token 与历史 Token 统计，但保留调用次数。',
    onConfirm: async () => {
      try {
        await resetAllTokens()
        toast.success('全部 Token 统计已重置')
        updateCalendar()
      } catch (err) {
        toast.error('操作失败: ' + err.message)
      }
    }
  }
}

const openEditLimit = (key) => {
  editLimitData.value = { id: key.id, dailyLimit: key.dailyLimit }
  showEditLimitModal.value = true
}

const handleUpdateLimit = async () => {
  try {
    await updateKeyLimit(editLimitData.value.id, editLimitData.value.dailyLimit)
    toast.success('限额已更新')
    showEditLimitModal.value = false
    updateCalendar()
  } catch (err) {
    toast.error('更新失败: ' + err.message)
  }
}

const openEditName = (key) => {
  editNameData.value = { id: key.id, name: key.name }
  showEditNameModal.value = true
}

const handleUpdateName = async () => {
  try {
    await updateKeyName(editNameData.value.id, editNameData.value.name)
    toast.success('名称已更新')
    showEditNameModal.value = false
    updateCalendar()
  } catch (err) {
    toast.error('更新失败: ' + err.message)
  }
}

const handleToggleKey = async (id) => {
  try {
    await toggleKey(id)
    updateCalendar()
  } catch (err) {
    toast.error('操作失败: ' + err.message)
  }
}

const handleDeleteKey = (id) => {
  confirmModal.value = {
    show: true,
    title: '删除 Key',
    message: '确定要删除该 Key 吗？此操作不可恢复。',
    onConfirm: async () => {
      try {
        await deleteKey(id)
        toast.success('已删除')
        updateCalendar()
      } catch (err) {
        toast.error('删除失败: ' + err.message)
      }
    }
  }
}

const handleApplyLimitToAll = async () => {
  try {
    await applyLimitToAll(applyLimitValue.value)
    toast.success('已批量应用限额')
    showApplyLimitModal.value = false
    updateCalendar()
  } catch (err) {
    toast.error('操作失败: ' + err.message)
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
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

const getUsageClass = (key) => {
  const percent = (key.todayUsage / (key.dailyLimit || 1)) * 100
  if (percent >= 90) return 'text-red-600'
  if (percent >= 70) return 'text-amber-600'
  return 'text-slate-800'
}

const getUsageBarClass = (key) => {
  const percent = (key.todayUsage / (key.dailyLimit || 1)) * 100
  if (percent >= 90) return 'bg-red-500'
  if (percent >= 70) return 'bg-amber-500'
  return 'bg-emerald-500'
}

const getKeyTopProviders = (key) => {
  const providers = {}
  const history = key.usageHistory || {}
  Object.values(history).forEach(day => {
    if (day.providers) {
      Object.entries(day.providers).forEach(([p, u]) => {
        const count = typeof u === 'number' ? u : (u.requestCount || 0)
        providers[p] = (providers[p] || 0) + count
      })
    }
  })
  return Object.entries(providers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))
}

onMounted(async () => {
  await fetchKeys()
  updateCalendar()
})
</script>

<style scoped>
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
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.1s;
}

.calendar-day:hover {
  transform: scale(1.2);
  z-index: 10;
}

.calendar-day[data-level="1"] { background-color: #dcfce7; }
.calendar-day[data-level="2"] { background-color: #86efac; }
.calendar-day[data-level="3"] { background-color: #22c55e; }
.calendar-day[data-level="4"] { background-color: #166534; }

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}
</style>
