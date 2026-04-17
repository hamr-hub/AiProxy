<template>
  <div class="test-api p-6 max-w-5xl mx-auto">
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
        <span class="text-4xl">🔌</span> API 测试控制台
      </h2>
      <p class="text-slate-500 mt-2">AiProxy 端到端功能验证与调试工具</p>
    </div>

    <!-- Quick Start -->
    <div class="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8">
      <h3 class="text-amber-800 font-bold flex items-center gap-2 mb-3">
        <i class="fas fa-rocket"></i> 快速开始
      </h3>
      <p class="text-amber-700 text-sm mb-4">使用以下命令快速验证 API 连接：</p>
      <div class="relative group">
        <code class="block bg-amber-900/10 p-4 rounded-xl font-mono text-sm text-amber-900 break-all pr-12">
          curl {{ origin }}/health?key={{ apiKey || 'YOUR_KEY' }}
        </code>
        <button @click="copyToClipboard(`${origin}/health?key=${apiKey || '123456'}`)" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-amber-900/10 rounded-lg text-amber-800 transition-colors">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Health Check -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-heartbeat"></i>
            </span>
            健康检查
          </h3>
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="healthStatus.online ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
          >
            {{ healthStatus.online ? '在线' : '离线' }}
          </span>
        </div>
        <button 
          @click="checkHealth" 
          :disabled="testing.health"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4 shadow-md"
        >
          <i class="fas fa-rotate" :class="{ 'animate-spin': testing.health }"></i>
          {{ testing.health ? '正在检查...' : '立即检查' }}
        </button>
        <pre class="flex-1 bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-auto max-h-[200px]">{{ healthResult || '等待检查...' }}</pre>
      </div>

      <!-- Auth Test -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
          <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-shield-alt"></i>
          </span>
          认证测试
        </h3>
        <div class="space-y-4 mb-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">API Key</label>
            <input v-model="apiKey" type="text" placeholder="输入测试 Key" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm">
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">认证方式</label>
            <select v-model="authMethod" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm">
              <option value="bearer">Bearer Token</option>
              <option value="query">Query Parameter (?key=)</option>
              <option value="goog">x-goog-api-key</option>
              <option value="anthropic">x-api-key (Claude)</option>
            </select>
          </div>
        </div>
        <button 
          @click="testAuth" 
          :disabled="testing.auth"
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4 shadow-md"
        >
          <i class="fas fa-vial" :class="{ 'animate-spin': testing.auth }"></i>
          {{ testing.auth ? '正在测试...' : '测试认证' }}
        </button>
        <pre class="flex-1 bg-slate-900 p-4 rounded-xl font-mono text-xs overflow-auto max-h-[200px]" :class="authSuccess ? 'text-emerald-400' : 'text-red-400'">{{ authResult || '等待测试...' }}</pre>
      </div>

      <!-- Models List -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
          <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-cubes"></i>
          </span>
          模型列表
        </h3>
        <button 
          @click="getModels" 
          :disabled="testing.models"
          class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4 shadow-md"
        >
          <i class="fas fa-list" :class="{ 'animate-spin': testing.models }"></i>
          {{ testing.models ? '正在获取...' : '获取模型列表' }}
        </button>
        <pre class="flex-1 bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-auto max-h-[300px]">{{ modelsResult || '等待获取...' }}</pre>
      </div>

      <!-- Chat Test -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
          <span class="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-comments"></i>
          </span>
          聊天测试
        </h3>
        <div class="space-y-4 mb-4">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">模型名称</label>
            <input v-model="chatParams.model" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono text-sm">
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase">消息内容</label>
            <textarea v-model="chatParams.content" rows="3" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm resize-none"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="chatParams.stream" type="checkbox" id="stream" class="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500">
            <label for="stream" class="text-sm text-slate-600 cursor-pointer">启用流式响应 (Stream)</label>
          </div>
        </div>
        <button 
          @click="testChat" 
          :disabled="testing.chat"
          class="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-4 shadow-md"
        >
          <i class="fas fa-paper-plane" :class="{ 'animate-spin': testing.chat }"></i>
          {{ testing.chat ? '正在发送...' : '发送请求' }}
        </button>
        <div class="flex-1 bg-slate-900 p-4 rounded-xl font-mono text-xs overflow-auto max-h-[300px] whitespace-pre-wrap text-orange-200">
          {{ chatResult || '等待响应...' }}
          <span v-if="testing.chat" class="animate-pulse">|</span>
        </div>
      </div>
    </div>

    <!-- Automated Tests -->
    <div class="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-xl font-bold text-slate-800 flex items-center gap-3">
          <span class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-check-double"></i>
          </span>
          自动测试套件
        </h3>
        <button @click="runAllTests" :disabled="testing.all" class="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center gap-2">
          <i class="fas fa-play" v-if="!testing.all"></i>
          <i class="fas fa-circle-notch animate-spin" v-else></i>
          运行全部测试
        </button>
      </div>
      
      <div class="space-y-3">
        <div v-for="test in autoTests" :key="test.name" class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-l-4 transition-all" :class="getTestRowClass(test)">
          <div class="flex items-center gap-3">
            <i :class="getTestIconClass(test)"></i>
            <span class="font-bold text-slate-700">{{ test.name }}</span>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm" :class="getTestBadgeClass(test)">
            {{ test.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const origin = window.location.origin
const apiKey = ref('123456')
const authMethod = ref('bearer')
const testing = ref({ health: false, auth: false, models: false, chat: false, all: false })

const healthStatus = ref({ online: false })
const healthResult = ref('')
const authResult = ref('')
const authSuccess = ref(false)
const modelsResult = ref('')
const chatParams = ref({ model: 'gpt-4o-mini', content: '你好，请用一句话自我介绍。', stream: true })
const chatResult = ref('')

const autoTests = ref([
  { name: '基础健康检查', status: '等待运行' },
  { name: 'Bearer 认证机制', status: '等待运行' },
  { name: 'Query 参数认证', status: '等待运行' },
  { name: 'Google API Key 格式', status: '等待运行' },
  { name: 'Anthropic Key 格式', status: '等待运行' },
  { name: '鉴权失败拦截', status: '等待运行' },
  { name: 'CORS 跨域支持', status: '等待运行' }
])

// Actions
const checkHealth = async () => {
  testing.value.health = true
  healthResult.value = '正在检查...'
  try {
    const response = await fetch(`${origin}/health`)
    const data = await response.json()
    healthStatus.value.online = response.ok
    healthResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    healthStatus.value.online = false
    healthResult.value = `连接失败: ${error.message}`
  } finally {
    testing.value.health = false
  }
}

const testAuth = async () => {
  testing.value.auth = true
  authResult.value = '正在测试...'
  try {
    let url = `${origin}/health`
    const headers = { 'Content-Type': 'application/json' }
    
    if (authMethod.value === 'bearer') headers['Authorization'] = `Bearer ${apiKey.value}`
    else if (authMethod.value === 'query') url += `?key=${apiKey.value}`
    else if (authMethod.value === 'goog') headers['x-goog-api-key'] = apiKey.value
    else if (authMethod.value === 'anthropic') headers['x-api-key'] = apiKey.value

    const response = await fetch(url, { headers })
    const data = await response.json()
    authSuccess.value = response.ok
    authResult.value = response.ok ? `✅ 认证成功!\n\n${JSON.stringify(data, null, 2)}` : `❌ 认证失败 (${response.status}):\n\n${JSON.stringify(data, null, 2)}`
  } catch (error) {
    authSuccess.value = false
    authResult.value = `❌ 请求失败: ${error.message}`
  } finally {
    testing.value.auth = false
  }
}

const getModels = async () => {
  testing.value.models = true
  modelsResult.value = '正在获取模型列表...'
  try {
    const response = await fetch(`${origin}/v1/models?key=${apiKey.value}`)
    const data = await response.json()
    modelsResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    modelsResult.value = `获取失败: ${error.message}`
  } finally {
    testing.value.models = false
  }
}

const testChat = async () => {
  testing.value.chat = true
  chatResult.value = ''
  try {
    const response = await fetch(`${origin}/v1/chat/completions?key=${apiKey.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: chatParams.value.model,
        messages: [{ role: 'user', content: chatParams.value.content }],
        stream: chatParams.value.stream
      })
    })

    if (chatParams.value.stream) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        chatResult.value += chunk
      }
    } else {
      const data = await response.json()
      chatResult.value = JSON.stringify(data, null, 2)
    }
  } catch (error) {
    chatResult.value = `请求失败: ${error.message}`
  } finally {
    testing.value.chat = false
  }
}

const runAllTests = async () => {
  testing.value.all = true
  for (let i = 0; i < autoTests.value.length; i++) {
    autoTests.value[i].status = '运行中...'
    try {
      let success = false
      if (i === 0) success = (await fetch(`${origin}/health`)).ok
      else if (i === 1) success = (await fetch(`${origin}/health`, { headers: { 'Authorization': `Bearer ${apiKey.value}` } })).ok
      else if (i === 2) success = (await fetch(`${origin}/health?key=${apiKey.value}`)).ok
      else if (i === 3) success = (await fetch(`${origin}/health`, { headers: { 'x-goog-api-key': apiKey.value } })).ok
      else if (i === 4) success = (await fetch(`${origin}/health`, { headers: { 'x-api-key': apiKey.value } })).ok
      else if (i === 5) success = (await fetch(`${origin}/v1/chat/completions`, { method: 'POST', body: JSON.stringify({}) })).status === 401
      else if (i === 6) {
        const res = await fetch(`${origin}/v1/models`, { method: 'OPTIONS', headers: { 'Origin': origin, 'Access-Control-Request-Method': 'POST' } })
        success = [200, 204].includes(res.status)
      }
      autoTests.value[i].status = success ? '通过' : '失败'
    } catch {
      autoTests.value[i].status = '失败'
    }
  }
  testing.value.all = false
  toast.success('自动化测试运行完毕')
}

// Helpers
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  } catch {
    toast.error('复制失败')
  }
}

const getTestRowClass = (test) => {
  if (test.status === '通过') return 'border-emerald-500 bg-emerald-50/30'
  if (test.status === '失败') return 'border-red-500 bg-red-50/30'
  if (test.status === '运行中...') return 'border-blue-500 bg-blue-50/30'
  return 'border-slate-200'
}

const getTestIconClass = (test) => {
  if (test.status === '通过') return 'fas fa-check-circle text-emerald-500'
  if (test.status === '失败') return 'fas fa-times-circle text-red-500'
  if (test.status === '运行中...') return 'fas fa-circle-notch animate-spin text-blue-500'
  return 'fas fa-circle text-slate-300'
}

const getTestBadgeClass = (test) => {
  if (test.status === '通过') return 'bg-emerald-500 text-white'
  if (test.status === '失败') return 'bg-red-500 text-white'
  if (test.status === '运行中...') return 'bg-blue-500 text-white'
  return 'bg-slate-200 text-slate-500'
}
</script>

<style scoped>
pre {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}
pre::-webkit-scrollbar { width: 6px; }
pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
</style>
