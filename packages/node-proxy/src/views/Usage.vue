<template>
  <div class="usage-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">用量查询</h2>
          <p class="text-sm text-slate-500 mt-1">
            服务器时间: {{ serverTime }}
            <span v-if="fromCache" class="text-amber-500 ml-2">(缓存数据)</span>
          </p>
        </div>
        <button
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          @click="refreshData"
          :disabled="loading"
        >
          <i class="fas fa-refresh" :class="{ 'animate-spin': loading }"></i>
          {{ loading ? '刷新中...' : '刷新数据' }}
        </button>
      </div>

      <template v-if="loading">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Skeleton v-for="i in 4" :key="i" variant="rect" height="80px" />
        </div>
        <div class="space-y-4">
          <Skeleton v-for="i in 2" :key="i" variant="card" />
        </div>
      </template>

      <template v-else>
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <i class="fas fa-exclamation-circle mr-2"></i>
          {{ error }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="p-4 bg-emerald-50 rounded-xl">
            <p class="text-sm text-emerald-700 mb-1">活跃实例</p>
            <h3 class="text-2xl font-bold text-emerald-800">{{ activeInstances }}</h3>
          </div>
          <div class="p-4 bg-blue-50 rounded-xl">
            <p class="text-sm text-blue-700 mb-1">总实例数</p>
            <h3 class="text-2xl font-bold text-blue-800">{{ totalInstances }}</h3>
          </div>
          <div class="p-4 bg-purple-50 rounded-xl">
            <p class="text-sm text-purple-700 mb-1">提供商数</p>
            <h3 class="text-2xl font-bold text-purple-800">{{ providerCount }}</h3>
          </div>
          <div class="p-4 bg-orange-50 rounded-xl">
            <p class="text-sm text-orange-700 mb-1">成功获取用量</p>
            <h3 class="text-2xl font-bold text-orange-800">{{ successCount }}</h3>
          </div>
        </div>

        <div class="space-y-6">
          <div v-for="(providerData, providerType) in providers" :key="providerType" class="border border-slate-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-xs" :class="getProviderBadgeClass(providerType)">
                  {{ formatProviderType(providerType) }}
                </span>
                <span class="text-sm font-normal text-slate-400">
                  ({{ providerData.successCount }}/{{ providerData.totalCount }})
                </span>
              </h3>
            </div>

            <div v-if="providerData.instances.length === 0" class="text-center py-8 text-slate-400">
              暂无实例
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="instance in providerData.instances"
                :key="instance.uuid"
                class="p-3 rounded-lg border"
                :class="getInstanceClass(instance)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-slate-800">{{ instance.name }}</span>
                      <span v-if="instance.isDisabled" class="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">已禁用</span>
                      <span v-else-if="!instance.isHealthy" class="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs">不健康</span>
                    </div>
                    <p class="text-xs text-slate-500 truncate">{{ instance.configFilePath || '未配置路径' }}</p>
                    <p class="text-xs text-slate-400 mt-1">UUID: {{ instance.uuid }}</p>
                  </div>
                  <div class="text-right">
                    <div v-if="instance.success && instance.usage" class="text-sm">
                      <div v-if="instance.usage.tokensUsed !== undefined" class="text-emerald-600">
                        <span class="font-medium">{{ formatNumber(instance.usage.tokensUsed) }}</span>
                        <span class="text-slate-500"> / {{ formatNumber(instance.usage.tokensLimit) }}</span>
                      </div>
                      <div v-if="instance.usage.rpm !== undefined" class="text-xs text-slate-500 mt-1">
                        RPM: {{ instance.usage.rpm }}
                      </div>
                      <div v-if="instance.usage.tpm !== undefined" class="text-xs text-slate-500">
                        TPM: {{ formatNumber(instance.usage.tpm) }}
                      </div>
                      <div v-if="instance.usage.requests !== undefined" class="text-xs text-slate-500">
                        请求: {{ formatNumber(instance.usage.requests) }}
                      </div>
                    </div>
                    <div v-else-if="instance.error" class="text-xs text-red-500">
                      {{ instance.error }}
                    </div>
                    <div v-else class="text-xs text-slate-400">
                      加载中...
                    </div>
                  </div>
                </div>

                <div v-if="instance.success && instance.usage" class="mt-3 pt-3 border-t border-slate-100">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div v-if="instance.usage.tokensUsed !== undefined">
                      <span class="text-slate-500">已用 Token</span>
                      <p class="font-medium text-slate-700">{{ formatNumber(instance.usage.tokensUsed) }}</p>
                    </div>
                    <div v-if="instance.usage.tokensLimit !== undefined">
                      <span class="text-slate-500">Token 限额</span>
                      <p class="font-medium text-slate-700">{{ formatNumber(instance.usage.tokensLimit) }}</p>
                    </div>
                    <div v-if="instance.usage.remainingTokens !== undefined">
                      <span class="text-slate-500">剩余</span>
                      <p class="font-medium" :class="getRemainingClass(instance.usage)">
                        {{ formatNumber(instance.usage.remainingTokens) }}
                      </p>
                    </div>
                    <div v-if="instance.usage.percentUsed !== undefined">
                      <span class="text-slate-500">使用率</span>
                      <p class="font-medium text-slate-700">{{ instance.usage.percentUsed }}%</p>
                    </div>
                  </div>
                  <div v-if="instance.usage.quotaResetTime" class="mt-2 text-xs text-slate-500">
                    配额重置时间: {{ instance.usage.quotaResetTime }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="Object.keys(providers).length === 0" class="text-center py-12 text-slate-400">
          <i class="fas fa-chart-pie text-4xl mb-3"></i>
          <p>暂无用量数据</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsage } from '@/api'
import { useToast } from '@/composables/useToast'
import Skeleton from '@/components/common/Skeleton.vue'

const {
  usageData,
  loading,
  lastUpdate,
  serverTime,
  fetchUsage
} = useUsage()

const toast = useToast()
const error = ref(null)
const fromCache = ref(false)

const providers = computed(() => {
  return usageData.value?.providers || {}
})

const totalInstances = computed(() => {
  return Object.values(providers.value).reduce((sum, p) => sum + p.totalCount, 0)
})

const activeInstances = computed(() => {
  return Object.values(providers.value).reduce((sum, p) => {
    return sum + p.instances.filter(i => !i.isDisabled && i.isHealthy).length
  }, 0)
})

const successCount = computed(() => {
  return Object.values(providers.value).reduce((sum, p) => sum + p.successCount, 0)
})

const providerCount = computed(() => {
  return Object.keys(providers.value).length
})

const refreshData = async () => {
  error.value = null
  try {
    const data = await fetchUsage()
    if (data) {
      fromCache.value = data.fromCache || false
    }
  } catch (err) {
    error.value = err.message || '获取用量数据失败'
    toast.error('获取用量数据失败')
  }
}

const formatProviderType = (type) => {
  const map = {
    'claude-kiro-oauth': 'Kiro',
    'gemini-cli-oauth': 'Gemini CLI',
    'gemini-antigravity': 'Antigravity',
    'openai-codex-oauth': 'Codex',
    'grok-custom': 'Grok'
  }
  return map[type] || type
}

const getProviderBadgeClass = (type) => {
  const classes = {
    'claude-kiro-oauth': 'bg-purple-100 text-purple-700',
    'gemini-cli-oauth': 'bg-blue-100 text-blue-700',
    'gemini-antigravity': 'bg-indigo-100 text-indigo-700',
    'openai-codex-oauth': 'bg-gray-100 text-gray-700',
    'grok-custom': 'bg-orange-100 text-orange-700'
  }
  return classes[type] || 'bg-slate-100 text-slate-700'
}

const getInstanceClass = (instance) => {
  if (instance.isDisabled) return 'bg-gray-50 border-gray-200 opacity-60'
  if (!instance.isHealthy) return 'bg-red-50 border-red-200'
  if (instance.success) return 'bg-green-50 border-green-200'
  return 'bg-slate-50 border-slate-200'
}

const getRemainingClass = (usage) => {
  if (usage.percentUsed > 90) return 'text-red-600'
  if (usage.percentUsed > 70) return 'text-amber-600'
  return 'text-emerald-600'
}

const formatNumber = (num) => {
  if (num === undefined || num === null) return '--'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.usage-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
