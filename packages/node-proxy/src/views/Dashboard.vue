<template>
  <div class="dashboard">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-slate-800 mb-4">集群监控</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <i class="fas fa-node-js text-emerald-600 text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800">Node.js 服务</h3>
                <p class="text-xs text-slate-500">PID: {{ nodeInfo.pid || '--' }} | v{{ nodeInfo.nodeVersion || '--' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="nodeInfo.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ nodeInfo.status === 'online' ? '运行中' : '离线' }}
              </span>
              <button
                class="px-2 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                @click="refreshNodeMonitor"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">CPU 使用</span>
                <span class="text-xs font-medium" :class="getCpuColor(nodeInfo.cpu)">{{ nodeInfo.cpu || 0 }}%</span>
              </div>
              <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getCpuBarColor(nodeInfo.cpu)"
                  :style="{ width: (nodeInfo.cpu || 0) + '%' }"
                ></div>
              </div>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">内存使用</span>
                <span class="text-xs font-medium" :class="getMemoryColor(nodeInfo.memory)">{{ nodeInfo.memory || 0 }}%</span>
              </div>
              <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getMemoryBarColor(nodeInfo.memory)"
                  :style="{ width: (nodeInfo.memory || 0) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="text-xs text-slate-500 space-y-1">
            <div class="flex justify-between">
              <span>运行时间:</span>
              <span class="font-medium text-slate-700">{{ nodeInfo.uptime || '--' }}</span>
            </div>
            <div class="flex justify-between">
              <span>平台:</span>
              <span class="font-medium text-slate-700">{{ nodeInfo.platform || '--' }}</span>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">CPU 历史</span>
            </div>
            <div class="h-24 relative bg-slate-50 rounded-lg overflow-hidden">
              <canvas ref="nodeChartCanvas" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <i class="fab fa-python text-blue-600 text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800">Python 服务</h3>
                <p class="text-xs text-slate-500">本地模型控制器 | GPU 监控</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 text-xs rounded-full"
                :class="pythonInfo.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ pythonInfo.status === 'online' ? '运行中' : '离线' }}
              </span>
              <button
                class="px-2 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                @click="refreshPythonMonitor"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">CPU 使用</span>
                <span class="text-xs font-medium" :class="getCpuColor(pythonInfo.cpu)">{{ pythonInfo.cpu || 0 }}%</span>
              </div>
              <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getCpuBarColor(pythonInfo.cpu)"
                  :style="{ width: (pythonInfo.cpu || 0) + '%' }"
                ></div>
              </div>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-slate-500">内存使用</span>
                <span class="text-xs font-medium" :class="getMemoryColor(pythonInfo.memory)">{{ pythonInfo.memory || 0 }}%</span>
              </div>
              <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getMemoryBarColor(pythonInfo.memory)"
                  :style="{ width: (pythonInfo.memory || 0) + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div v-if="gpuInfo" class="p-3 bg-slate-50 rounded-lg mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">
                <i class="fas fa-microchip mr-1"></i>{{ gpuInfo.name || 'GPU' }}
              </span>
              <span class="text-xs text-slate-500">{{ gpuInfo.temperature || '--' }}°C</span>
            </div>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-500">利用率:</span>
                <span class="font-medium ml-1" :class="getGpuColor(gpuInfo.utilization)">{{ gpuInfo.utilization || 0 }}%</span>
              </div>
              <div>
                <span class="text-slate-500">显存:</span>
                <span class="font-medium ml-1">{{ gpuInfo.usedMemory || '--' }} / {{ gpuInfo.totalMemory || '--' }}</span>
              </div>
            </div>
            <div class="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="getGpuBarColor(gpuInfo.memoryUtilization)"
                :style="{ width: (gpuInfo.memoryUtilization || 0) + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">GPU 利用率历史</span>
            </div>
            <div class="h-24 relative bg-slate-50 rounded-lg overflow-hidden">
              <canvas ref="gpuChartCanvas" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">提供商节点状态</h3>
          <button
            class="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
            @click="refreshProviderStatus"
          >
            <i class="fas fa-refresh"></i> 刷新
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            v-for="provider in providerStatus"
            :key="provider.name"
            class="p-3 rounded-lg border transition-all"
            :class="[
              provider.status === 'healthy' ? 'bg-emerald-50 border-emerald-200' :
              provider.status === 'warning' ? 'bg-amber-50 border-amber-200' :
              'bg-red-50 border-red-200'
            ]"
          >
            <div class="flex items-center gap-2 mb-1">
              <span
                class="w-2 h-2 rounded-full"
                :class="[
                  provider.status === 'healthy' ? 'bg-emerald-500' :
                  provider.status === 'warning' ? 'bg-amber-500' :
                  'bg-red-500'
                ]"
              ></span>
              <span class="text-sm font-medium text-slate-800">{{ provider.name }}</span>
            </div>
            <p class="text-xs text-slate-500">{{ provider.accounts }} 账户</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">系统信息</h3>
          <button
            class="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
            @click="refreshSystemInfo"
          >
            <i class="fas fa-refresh"></i>
          </button>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-slate-500">版本号</span>
            <span class="font-medium text-slate-800">{{ systemInfo.version || '--' }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-slate-500">服务器时间</span>
            <span class="font-medium text-slate-800">{{ systemInfo.serverTime || '--' }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-slate-500">运行模式</span>
            <span class="font-medium" :class="systemInfo.mode === 'production' ? 'text-emerald-600' : 'text-blue-600'">
              {{ systemInfo.mode || 'development' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <details class="w-full">
        <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <i class="fas fa-route text-emerald-500"></i>
            <span class="font-medium text-slate-800">路径路由与模型列表</span>
          </div>
          <i class="fas fa-chevron-down text-slate-400 transition-transform"></i>
        </summary>
        <div class="p-4 border-t border-slate-100">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-3">路径路由调用示例</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="example in routingExamples"
                  :key="example.path"
                  class="p-3 bg-slate-50 rounded-lg text-sm font-mono cursor-pointer hover:bg-slate-100 transition-colors"
                  @click="copyToClipboard(example.path)"
                >
                  <div class="font-medium text-emerald-600">{{ example.name }}</div>
                  <div class="truncate text-slate-600">{{ example.path }}</div>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-3">可用模型列表</h4>
              <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                <span
                  v-for="model in availableModels"
                  :key="model"
                  class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors"
                  @click="copyToClipboard(model)"
                >
                  {{ model }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSystemMonitor, useProviderPool, useModelList } from '@/api'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const { systemInfo, cpuHistory, memoryHistory, gpuHistory, fetchSystemMonitor, fetchGpuStatus } = useSystemMonitor()
const { providers, fetchProviders } = useProviderPool()
const { models, routingExamples, fetchModels } = useModelList()

const CONTROLLER_BASE_URL = 'http://localhost:5000'

const nodeInfo = ref({
  status: 'offline',
  pid: null,
  nodeVersion: '',
  uptime: '--',
  cpu: 0,
  memory: 0,
  platform: ''
})

const pythonInfo = ref({
  status: 'offline',
  cpu: 0,
  memory: 0
})

const gpuInfo = ref(null)

const nodeChartCanvas = ref(null)
const gpuChartCanvas = ref(null)
const nodeChart = ref(null)
const gpuChart = ref(null)

const nodeCpuHistory = ref([])
const gpuUtilizationHistory = ref([])

const providerStatus = ref([])
const availableModels = computed(() => models.value.map(m => m.id || m.name).filter(Boolean))

let refreshIntervals = {}

const getCpuColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 80) return 'text-red-500'
  if (v >= 60) return 'text-amber-500'
  return 'text-slate-700'
}

const getCpuBarColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 80) return 'bg-red-500'
  if (v >= 60) return 'bg-amber-500'
  return 'bg-emerald-500'
}

const getMemoryColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 85) return 'text-red-500'
  if (v >= 70) return 'text-amber-500'
  return 'text-slate-700'
}

const getMemoryBarColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 85) return 'bg-red-500'
  if (v >= 70) return 'bg-amber-500'
  return 'bg-purple-500'
}

const getGpuColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 90) return 'text-red-500'
  if (v >= 75) return 'text-amber-500'
  return 'text-slate-700'
}

const getGpuBarColor = (value) => {
  const v = parseFloat(value || 0)
  if (v >= 90) return 'bg-red-500'
  if (v >= 70) return 'bg-amber-500'
  return 'bg-orange-500'
}

const refreshSystemInfo = async () => {
  await fetchSystemMonitor()
}

const refreshProviderStatus = async () => {
  await fetchProviders()
  updateProviderStatus()
}

const refreshNodeMonitor = async () => {
  await fetchSystemMonitor()
  updateNodeInfo()
}

const refreshPythonMonitor = async () => {
  await fetchGpuStatus()
  updatePythonInfo()
}

const updateNodeInfo = () => {
  nodeInfo.value = {
    status: 'online',
    pid: systemInfo.value.pid || process.pid,
    nodeVersion: systemInfo.value.nodeVersion || process.version,
    uptime: systemInfo.value.uptime || '--',
    cpu: parseFloat(systemInfo.value.cpu) || 0,
    memory: parseFloat(systemInfo.value.memory) || 0,
    platform: systemInfo.value.platform || process.platform
  }
}

const updatePythonInfo = async () => {
  try {
    const response = await fetch(`${CONTROLLER_BASE_URL}/manage/gpu`)
    if (response.ok) {
      const data = await response.json()
      pythonInfo.value = {
        status: 'online',
        cpu: parseFloat(data.cpuUsage || 0).toFixed(1),
        memory: parseFloat(data.memoryUsage || 0).toFixed(1)
      }
      gpuInfo.value = data
      updateGpuHistory(data.utilization)
    } else {
      pythonInfo.value.status = 'offline'
    }
  } catch {
    pythonInfo.value.status = 'offline'
  }
}

const updateProviderStatus = () => {
  providerStatus.value = providers.value.map(p => ({
    name: p.name || p.type || 'Unknown',
    status: p.status === 'healthy' ? 'healthy' : p.status === 'unhealthy' ? 'error' : 'warning',
    accounts: p.accounts?.length || p.nodeCount || 0
  }))
}

const updateGpuHistory = (utilization) => {
  if (utilization !== undefined && utilization !== null) {
    gpuUtilizationHistory.value.push(parseFloat(utilization))
    if (gpuUtilizationHistory.value.length > 60) {
      gpuUtilizationHistory.value.shift()
    }
  }
}

const initNodeChart = () => {
  const canvas = nodeChartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  nodeChart.value = { ctx, width: rect.width, height: rect.height }
}

const initGpuChart = () => {
  const canvas = gpuChartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  gpuChart.value = { ctx, width: rect.width, height: rect.height }
}

const updateNodeChart = () => {
  if (!nodeChart.value) initNodeChart()
  if (!nodeChart.value) return

  const { ctx, width, height } = nodeChart.value
  ctx.clearRect(0, 0, width, height)

  if (cpuHistory.value.length < 2) return

  const data = cpuHistory.value
  const padding = { top: 5, right: 5, bottom: 5, left: 5 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, padding.top + chartHeight)
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
  ctx.stroke()

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
  gradient.addColorStop(0, '#3b82f640')
  gradient.addColorStop(1, '#3b82f605')

  ctx.fillStyle = gradient
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    const y = padding.top + chartHeight - (value / 100) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, padding.top + chartHeight)
      ctx.lineTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 2
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    const y = padding.top + chartHeight - (value / 100) * chartHeight
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

const updateGpuChart = () => {
  if (!gpuChart.value) initGpuChart()
  if (!gpuChart.value) return

  const { ctx, width, height } = gpuChart.value
  ctx.clearRect(0, 0, width, height)

  if (gpuUtilizationHistory.value.length < 2) return

  const data = gpuUtilizationHistory.value
  const padding = { top: 5, right: 5, bottom: 5, left: 5 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, padding.top + chartHeight)
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
  ctx.stroke()

  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
  gradient.addColorStop(0, '#8b5cf640')
  gradient.addColorStop(1, '#8b5cf605')

  ctx.fillStyle = gradient
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    const y = padding.top + chartHeight - (value / 100) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, padding.top + chartHeight)
      ctx.lineTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#8b5cf6'
  ctx.lineWidth = 2
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = padding.left + (chartWidth / (data.length - 1)) * index
    const y = padding.top + chartHeight - (value / 100) * chartHeight
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`已复制: ${text}`)
  } catch {
    toast.error('复制失败')
  }
}

onMounted(async () => {
  await Promise.all([
    fetchSystemMonitor(),
    fetchProviders(),
    fetchModels()
  ])

  updateNodeInfo()
  await updatePythonInfo()
  updateProviderStatus()

  setTimeout(() => {
    initNodeChart()
    initGpuChart()
    updateNodeChart()
    updateGpuChart()
  }, 300)

  refreshIntervals.node = setInterval(() => {
    fetchSystemMonitor().then(() => {
      updateNodeInfo()
      updateNodeChart()
    })
  }, 5000)

  refreshIntervals.gpu = setInterval(() => {
    updatePythonInfo().then(() => {
      updateGpuChart()
    })
  }, 5000)

  refreshIntervals.providers = setInterval(() => {
    fetchProviders().then(updateProviderStatus)
  }, 10000)
})

onUnmounted(() => {
  Object.values(refreshIntervals).forEach(interval => {
    if (interval) clearInterval(interval)
  })
})
</script>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

details summary::-webkit-details-marker {
  display: none;
}
</style>
