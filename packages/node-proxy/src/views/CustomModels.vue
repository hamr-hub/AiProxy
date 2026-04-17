<template>
  <div class="custom-models-page">
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">自定义模型管理</h2>
        <button
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
          @click="openAddModal"
        >
          <i class="fas fa-plus"></i> 添加模型
        </button>
      </div>

      <div class="search-bar flex gap-4 mb-6">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="搜索模型名称..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">全部状态</option>
          <option value="enabled">启用</option>
          <option value="disabled">禁用</option>
        </select>
      </div>

      <Skeleton v-if="loading" variant="table" :rows="3" />
      <div v-else-if="filteredModels.length === 0" class="text-center py-12 text-slate-500">
        <i class="fas fa-robot text-4xl mb-3 text-slate-300"></i>
        <p>{{ searchQuery ? '未找到匹配的自定义模型' : '暂无自定义模型' }}</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50">
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">模型名称</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">目标提供商</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">目标模型</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">状态</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="model in filteredModels"
              :key="model.id"
              class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="font-medium text-slate-800">{{ model.name }}</span>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ model.provider }}</td>
              <td class="px-4 py-3 text-slate-600">{{ model.targetModel }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="model.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ model.enabled ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button
                  class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  @click="handleToggle(model)"
                  :title="model.enabled ? '禁用' : '启用'"
                >
                  <i :class="['fas', model.enabled ? 'fa-toggle-on text-emerald-500' : 'fa-toggle-off text-slate-400']"></i>
                </button>
                <button
                  class="p-2 hover:bg-red-100 rounded-lg transition-colors ml-1"
                  @click="handleDelete(model)"
                  title="删除"
                >
                  <i class="fas fa-trash text-red-500"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
          <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800">
                {{ isEditing ? '编辑模型' : '添加自定义模型' }}
              </h3>
              <button class="p-1 hover:bg-slate-100 rounded transition-colors" @click="closeModal">
                <i class="fas fa-x text-slate-500"></i>
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">模型名称</label>
                <input
                  type="text"
                  v-model="formData.name"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.name ? 'border-red-500' : 'border-slate-300'"
                  placeholder="自定义模型名称"
                />
                <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">目标提供商</label>
                <select
                  v-model="formData.provider"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="gemini-cli-oauth">Gemini CLI OAuth</option>
                  <option value="claude-custom">Claude Custom</option>
                  <option value="openai-custom">OpenAI Custom</option>
                  <option value="grok-custom">Grok Custom</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">目标模型</label>
                <input
                  type="text"
                  v-model="formData.targetModel"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  :class="errors.targetModel ? 'border-red-500' : 'border-slate-300'"
                  placeholder="目标模型名称"
                />
                <p v-if="errors.targetModel" class="mt-1 text-xs text-red-500">{{ errors.targetModel }}</p>
              </div>
              <div class="flex items-center gap-2">
                <input type="checkbox" id="enabled" v-model="formData.enabled" class="w-4 h-4" />
                <label for="enabled" class="text-sm text-slate-700">启用此模型</label>
              </div>
            </div>
            <div class="flex gap-3 pt-6">
              <button
                class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                @click="closeModal"
              >
                取消
              </button>
              <button
                class="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                @click="handleSave"
                :disabled="saving"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ isEditing ? '保存' : '添加' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Skeleton from '@/components/common/Skeleton.vue'

const toast = useToast()
const { confirmDelete } = useConfirm()

const customModels = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingModel = ref(null)
const saving = ref(false)
const errors = ref({})

const defaultFormData = {
  name: '',
  provider: 'gemini-cli-oauth',
  targetModel: '',
  enabled: true
}

const formData = ref({ ...defaultFormData })

const isEditing = computed(() => !!editingModel.value)

const filteredModels = computed(() => {
  let result = customModels.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      m.targetModel.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value) {
    const isEnabled = statusFilter.value === 'enabled'
    result = result.filter(m => m.enabled === isEnabled)
  }
  return result
})

const validateForm = () => {
  errors.value = {}
  if (!formData.value.name.trim()) {
    errors.value.name = '模型名称不能为空'
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = '模型名称至少2个字符'
  }
  if (!formData.value.targetModel.trim()) {
    errors.value.targetModel = '目标模型不能为空'
  }
  return Object.keys(errors.value).length === 0
}

const openAddModal = () => {
  editingModel.value = null
  formData.value = { ...defaultFormData }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingModel.value = null
  formData.value = { ...defaultFormData }
  errors.value = {}
}

const handleSave = () => {
  if (!validateForm()) return
  if (isEditing.value) {
    const index = customModels.value.findIndex(m => m.id === editingModel.value.id)
    if (index !== -1) {
      customModels.value[index] = { ...customModels.value[index], ...formData.value }
    }
    toast.success('模型更新成功')
  } else {
    customModels.value.push({
      id: Date.now(),
      ...formData.value
    })
    toast.success('模型添加成功')
  }
  closeModal()
}

const handleToggle = async (model) => {
  model.enabled = !model.enabled
  toast.success(model.enabled ? '模型已启用' : '模型已禁用')
}

const handleDelete = async (model) => {
  try {
    await confirmDelete(model.name)
    customModels.value = customModels.value.filter(m => m.id !== model.id)
    toast.success('模型删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      toast.error(err.message || '删除失败')
    }
  }
}

const fetchModels = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  customModels.value = [
    { id: 1, name: 'my-gpt-4o', provider: 'OpenAI Custom', targetModel: 'gpt-4o', enabled: true },
    { id: 2, name: 'my-gemini-pro', provider: 'Gemini CLI OAuth', targetModel: 'gemini-2.5-pro', enabled: true },
    { id: 3, name: 'my-claude-sonnet', provider: 'Claude Custom', targetModel: 'claude-3-5-sonnet-20241022', enabled: false }
  ]
  loading.value = false
}

onMounted(() => {
  fetchModels()
})
</script>

<style scoped>
.custom-models-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-enter-active {
  animation: modal-in 0.2s ease;
}

.modal-leave-active {
  animation: modal-out 0.2s ease;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes modal-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
</style>
