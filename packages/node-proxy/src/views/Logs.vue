<template>
  <div class="logs-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800">实时日志</h2>
          <p class="text-sm text-slate-500 mt-1">
            <span class="inline-flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :class="connected ? 'bg-emerald-500' : 'bg-red-500'"></span>
              {{ connected ? '已连接' : '未连接' }}
            </span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="filterLevel"
            class="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">全部级别</option>
            <option value="debug">DEBUG</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
          </select>
          <button
            class="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
            @click="handleClearLogs"
          >
            <i class="fas fa-trash"></i> 清空
          </button>
        </div>
      </div>

      <div class="h-[60vh] min-h-[400px] overflow-auto bg-slate-900 rounded-xl p-4 font-mono text-sm">
        <div
          v-for="(log, index) in filteredLogs"
          :key="index"
          class="mb-1 flex flex-wrap gap-1"
        >
          <span class="text-slate-500 shrink-0">{{ log.timestamp }}</span>
          <span
            class="px-1.5 py-0.5 rounded text-xs font-medium shrink-0"
            :class="getLevelClass(log.level)"
          >
            {{ log.level }}
          </span>
          <span
            v-if="log.source"
            class="text-slate-600 text-xs shrink-0"
          >
            [{{ log.source }}]
          </span>
          <span :class="getMessageClass(log.level)">
            {{ log.message }}
          </span>
        </div>
        <div v-if="logs.length === 0" class="text-slate-500 text-center py-8">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p>正在等待日志数据...</p>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm text-slate-500">
          <span>日志数量: {{ logs.length }}</span>
          <span class="text-blue-500">DEBUG: {{ debugCount }}</span>
          <span class="text-green-500">INFO: {{ infoCount }}</span>
          <span class="text-yellow-500">WARN: {{ warnCount }}</span>
          <span class="text-red-500">ERROR: {{ errorCount }}</span>
        </div>
        <button
          class="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          @click="toggleAutoScroll"
        >
          <i :class="['fas', autoScroll ? 'fa-check' : 'fa-times']"></i>
          {{ autoScroll ? '自动滚动' : '停止滚动' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const logs = ref([])
const filterLevel = ref('all')
const autoScroll = ref(true)
const connected = ref(false)

let eventSource = null

const filteredLogs = computed(() => {
  if (filterLevel.value === 'all') return logs.value
  return logs.value.filter(log => log.level.toLowerCase() === filterLevel.value)
})

const debugCount = computed(() => logs.value.filter(l => l.level.toLowerCase() === 'debug').length)
const infoCount = computed(() => logs.value.filter(l => l.level.toLowerCase() === 'info').length)
const warnCount = computed(() => logs.value.filter(l => l.level.toLowerCase() === 'warn').length)
const errorCount = computed(() => logs.value.filter(l => l.level.toLowerCase() === 'error').length)

const getLevelClass = (level) => {
  const classes = {
    'DEBUG': 'bg-slate-500 text-white',
    'INFO': 'bg-blue-500 text-white',
    'WARN': 'bg-yellow-500 text-white',
    'ERROR': 'bg-red-500 text-white'
  }
  return classes[level.toUpperCase()] || 'bg-gray-500 text-white'
}

const getMessageClass = (level) => {
  const classes = {
    'DEBUG': 'text-slate-400',
    'INFO': 'text-slate-300',
    'WARN': 'text-yellow-400',
    'ERROR': 'text-red-400'
  }
  return classes[level.toUpperCase()] || 'text-slate-300'
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour12: false })
}

const connectEventSource = () => {
  if (eventSource) {
    eventSource.close()
  }

  const token = localStorage.getItem('authToken')
  const url = token ? `/api/events?token=${token}` : '/api/events'

  eventSource = new EventSource(url)

  eventSource.onopen = () => {
    connected.value = true
  }

  eventSource.onerror = (error) => {
    connected.value = false
    eventSource.close()
    setTimeout(connectEventSource, 5000)
  }

  eventSource.addEventListener('log', (event) => {
    try {
      const data = JSON.parse(event.data)
      addLogEntry(data)
    } catch (err) {
      console.error('[Logs] Failed to parse log event:', err)
    }
  })

  eventSource.addEventListener('provider_update', () => {})
  eventSource.addEventListener('config_update', () => {})
}

const addLogEntry = (logData) => {
  const entry = {
    timestamp: formatTimestamp(logData.timestamp || new Date().toISOString()),
    level: logData.level || 'INFO',
    message: logData.message || '',
    source: logData.source || ''
  }

  logs.value.push(entry)

  if (logs.value.length > 500) {
    logs.value.shift()
  }

  if (autoScroll.value) {
    nextTick(() => {
      const container = document.querySelector('.h-\\[60vh\\]')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }
}

const handleClearLogs = () => {
  logs.value = []
  toast.info('日志已清空')
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
}

onMounted(() => {
  connectEventSource()
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
})
</script>

<style scoped>
.logs-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
