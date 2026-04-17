import { ref, computed } from 'vue'

const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

export function useSystemMonitor() {
  const cpuHistory = ref([])
  const memoryHistory = ref([])
  const gpuHistory = ref([])
  const gpuTempHistory = ref([])
  const gpuInfo = ref(null)
  const maxDataPoints = 60

  const systemInfo = ref({
    uptime: '--',
    cpu: 0,
    memory: 0,
    gpu: 0,
    version: '--',
    nodeVersion: '--',
    serverTime: '--',
    platform: '--',
    mode: 'development',
    pid: '--'
  })

  const fetchSystemMonitor = async () => {
    try {
      const data = await request('/system/monitor')
      
      systemInfo.value = {
        uptime: formatUptime(data.uptime || 0),
        cpu: data.cpu?.usage?.toFixed(1) || 0,
        memory: parseFloat(data.memory?.usagePercent || 0).toFixed(1),
        gpu: data.gpu?.utilization || 0,
        version: data.version || '--',
        nodeVersion: data.nodeVersion || '--',
        serverTime: data.serverTime || new Date().toLocaleString('zh-CN'),
        platform: data.platform || '--',
        mode: data.mode || 'development',
        pid: data.pid || '--'
      }

      if (data.cpu?.history?.length > 0) {
        cpuHistory.value = [...data.cpu.history]
      }
      if (data.memory?.history?.length > 0) {
        memoryHistory.value = [...data.memory.history]
      }
      
      return data
    } catch (error) {
      console.error('Failed to fetch system monitor:', error)
      return null
    }
  }

  const fetchGpuStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/manage/gpu')
      if (!response.ok) throw new Error('GPU API error')
      const data = await response.json()

      systemInfo.value.gpu = data.utilization || 0

      const formatBytes = (bytes) => {
        if (!bytes) return '--'
        const gb = bytes / (1024 ** 3)
        return gb.toFixed(1) + ' GB'
      }

      gpuInfo.value = {
        name: data.name || 'GPU',
        totalMemory: formatBytes(data.total_memory),
        usedMemory: formatBytes(data.used_memory),
        availableMemory: formatBytes(data.available_memory),
        temperature: data.temperature || '--',
        utilization: data.utilization || 0,
        memoryUtilization: data.memory_utilization || 0
      }

      if (data.utilization) {
        gpuHistory.value.push(data.utilization)
        if (gpuHistory.value.length > maxDataPoints) {
          gpuHistory.value.shift()
        }
      }
      if (data.temperature) {
        gpuTempHistory.value.push(data.temperature)
        if (gpuTempHistory.value.length > maxDataPoints) {
          gpuTempHistory.value.shift()
        }
      }

      return data
    } catch (error) {
      console.error('Failed to fetch GPU status:', error)
      return null
    }
  }

  const addToHistory = (history, value) => {
    if (!isNaN(value)) {
      history.push(value)
      if (history.length > maxDataPoints) {
        history.shift()
      }
    }
  }

  return {
    systemInfo,
    cpuHistory,
    memoryHistory,
    gpuHistory,
    gpuTempHistory,
    gpuInfo,
    fetchSystemMonitor,
    fetchGpuStatus,
    addToHistory
  }
}

export function useProviderPool() {
  const providers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchProviders = async (force = false) => {
    loading.value = true
    error.value = null
    try {
      const data = await request('/providers/pools')
      providers.value = data.providers || data || []
      return providers.value
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch providers:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const addProvider = async (providerData) => {
    try {
      const result = await request('/providers/pools', {
        method: 'POST',
        body: JSON.stringify(providerData)
      })
      await fetchProviders()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProvider = async (id, providerData) => {
    try {
      const result = await request(`/providers/pools/${id}`, {
        method: 'PUT',
        body: JSON.stringify(providerData)
      })
      await fetchProviders()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProvider = async (id) => {
    try {
      const result = await request(`/providers/pools/${id}`, {
        method: 'DELETE'
      })
      await fetchProviders()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const refreshHealth = async (id) => {
    try {
      return await request(`/providers/pools/${id}/health`, {
        method: 'POST'
      })
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    providers,
    loading,
    error,
    fetchProviders,
    addProvider,
    updateProvider,
    deleteProvider,
    refreshHealth
  }
}

export function useConfig() {
  const config = ref({})
  const loading = ref(false)

  const fetchConfig = async () => {
    loading.value = true
    try {
      config.value = await request('/config')
      return config.value
    } catch (err) {
      console.error('Failed to fetch config:', err)
      return {}
    } finally {
      loading.value = false
    }
  }

  const saveConfig = async (newConfig) => {
    try {
      const result = await request('/config', {
        method: 'PUT',
        body: JSON.stringify(newConfig)
      })
      config.value = result
      return result
    } catch (err) {
      console.error('Failed to save config:', err)
      throw err
    }
  }

  return {
    config,
    loading,
    fetchConfig,
    saveConfig
  }
}

export function useUploadConfig() {
  const configs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchConfigs = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await request('/upload-configs')
      configs.value = data || []
      return configs.value
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch configs:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const viewConfig = async (filePath) => {
    try {
      const encodedPath = encodeURIComponent(filePath)
      const data = await request(`/upload-configs/view/${encodedPath}`)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const downloadConfig = async (filePath) => {
    const token = localStorage.getItem('authToken')
    const encodedPath = encodeURIComponent(filePath)
    window.open(`${API_BASE}/upload-configs/download/${encodedPath}?token=${token}`, '_blank')
  }

  const deleteConfig = async (filePath) => {
    try {
      const encodedPath = encodeURIComponent(filePath)
      const result = await request(`/upload-configs/${encodedPath}`, { method: 'DELETE' })
      await fetchConfigs()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const downloadAllConfigs = async () => {
    const token = localStorage.getItem('authToken')
    window.open(`${API_BASE}/upload-configs/download-all?token=${token}`, '_blank')
  }

  const deleteUnboundConfigs = async () => {
    try {
      const result = await request('/upload-configs/delete-unbound', { method: 'DELETE' })
      await fetchConfigs()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const forceRefreshConfig = async (filePath) => {
    try {
      const encodedPath = encodeURIComponent(filePath)
      const result = await request(`/upload-configs/force-refresh/${encodedPath}`, { method: 'POST' })
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    viewConfig,
    downloadConfig,
    deleteConfig,
    downloadAllConfigs,
    deleteUnboundConfigs,
    forceRefreshConfig
  }
}

export function useUsage() {
  const usageData = ref(null)
  const loading = ref(false)
  const lastUpdate = ref('--')
  const serverTime = ref('--')

  const fetchUsage = async () => {
    loading.value = true
    try {
      const data = await request('/usage')
      usageData.value = data
      lastUpdate.value = new Date().toLocaleTimeString('zh-CN')
      serverTime.value = data.serverTime || '--'
      return data
    } catch (err) {
      console.error('Failed to fetch usage:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    usageData,
    loading,
    lastUpdate,
    serverTime,
    fetchUsage
  }
}

export function usePlugins() {
  const plugins = ref([])
  const loading = ref(false)

  const fetchPlugins = async () => {
    loading.value = true
    try {
      plugins.value = await request('/plugins')
      return plugins.value
    } catch (err) {
      console.error('Failed to fetch plugins:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const togglePlugin = async (id, enabled) => {
    try {
      await request(`/plugins/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled })
      })
      const plugin = plugins.value.find(p => p.id === id || p.name === id)
      if (plugin) plugin.enabled = enabled
    } catch (err) {
      console.error('Failed to toggle plugin:', err)
      throw err
    }
  }

  return {
    plugins,
    loading,
    fetchPlugins,
    togglePlugin
  }
}

export function useLogs() {
  const logs = ref([])
  const loading = ref(false)

  const fetchLogs = async (params = {}) => {
    loading.value = true
    try {
      const query = new URLSearchParams(params).toString()
      const data = await request(`/logs${query ? '?' + query : ''}`)
      logs.value = data.logs || data || []
      return logs.value
    } catch (err) {
      console.error('Failed to fetch logs:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    logs,
    loading,
    fetchLogs
  }
}

export function useModelList() {
  const models = ref([])
  const routingExamples = ref([])

  const fetchModels = async () => {
    try {
      const data = await request('/models')
      models.value = data.models || []
      routingExamples.value = data.routingExamples || []
      return models.value
    } catch (err) {
      console.error('Failed to fetch models:', err)
      return []
    }
  }

  return {
    models,
    routingExamples,
    fetchModels
  }
}

export function useNodes() {
  const nodes = ref([])
  const aggregatedMetrics = ref(null)
  const loading = ref(false)

  const fetchNodes = async () => {
    loading.value = true
    try {
      const data = await request('/nodes')
      nodes.value = data.nodes || []
      return nodes.value
    } catch (err) {
      console.error('Failed to fetch nodes:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchAggregatedMonitor = async () => {
    loading.value = true
    try {
      const data = await request('/nodes/aggregated-monitor')
      aggregatedMetrics.value = data
      return data
    } catch (err) {
      console.error('Failed to fetch aggregated monitor:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const registerNode = async (nodeInfo = {}) => {
    try {
      const response = await fetch('/api/nodes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodeInfo)
      })
      return await response.json()
    } catch (err) {
      console.error('Failed to register node:', err)
      return { success: false, error: err.message }
    }
  }

  const sendHeartbeat = async () => {
    try {
      const response = await fetch('/api/nodes/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return await response.json()
    } catch (err) {
      console.error('Failed to send heartbeat:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    nodes,
    aggregatedMetrics,
    loading,
    fetchNodes,
    fetchAggregatedMonitor,
    registerNode,
    sendHeartbeat
  }
}

export function useModelUsageStats() {
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await request('/model-usage-stats')
      stats.value = data.data || data
      return stats.value
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch model usage stats:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const resetStats = async () => {
    try {
      const data = await request('/model-usage-stats/reset', { method: 'POST' })
      stats.value = data.data || data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const resetTokens = async () => {
    try {
      const data = await request('/model-usage-stats/reset-tokens', { method: 'POST' })
      stats.value = data.data || data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
    resetStats,
    resetTokens
  }
}

export function usePotluck() {
  const keys = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchKeys = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await request('/potluck/keys')
      if (result && result.success) {
        keys.value = result.data.keys
        stats.value = result.data.stats
      }
      return result
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch potluck keys:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createKey = async (name, dailyLimit) => {
    try {
      const result = await request('/potluck/keys', {
        method: 'POST',
        body: JSON.stringify({ name, dailyLimit })
      })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const resetKeyUsage = async (id) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}/reset`, { method: 'POST' })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const resetKeyTokens = async (id) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}/reset-tokens`, { method: 'POST' })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const resetAllTokens = async () => {
    try {
      const result = await request('/potluck/stats/reset-tokens', { method: 'POST' })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateKeyLimit = async (id, dailyLimit) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}/limit`, {
        method: 'PUT',
        body: JSON.stringify({ dailyLimit })
      })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateKeyName = async (id, name) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}/name`, {
        method: 'PUT',
        body: JSON.stringify({ name })
      })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const toggleKey = async (id) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}/toggle`, { method: 'POST' })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteKey = async (id) => {
    try {
      const result = await request(`/potluck/keys/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const applyLimitToAll = async (dailyLimit) => {
    try {
      const result = await request('/potluck/keys/apply-limit', {
        method: 'POST',
        body: JSON.stringify({ dailyLimit })
      })
      await fetchKeys()
      return result
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    keys,
    stats,
    loading,
    error,
    fetchKeys,
    createKey,
    resetKeyUsage,
    resetKeyTokens,
    resetAllTokens,
    updateKeyLimit,
    updateKeyName,
    toggleKey,
    deleteKey,
    applyLimitToAll
  }
}

export function usePotluckUser() {
  const userData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchUserUsage = async (apiKey) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/potluckuser/usage`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '获取用量失败')
      }
      userData.value = data.data
      return data.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch potluck user usage:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    userData,
    loading,
    error,
    fetchUserUsage
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}天 ${hours}小时 ${minutes}分`
  if (hours > 0) return `${hours}小时 ${minutes}分`
  return `${minutes}分`
}
