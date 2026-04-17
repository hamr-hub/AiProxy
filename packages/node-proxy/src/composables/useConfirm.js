import { ref } from 'vue'

export function useConfirm() {
  const confirmState = ref({
    show: false,
    title: '',
    message: '',
    confirmText: '确认',
    cancelText: '取消',
    type: 'primary',
    onConfirm: null,
    onCancel: null,
    icon: ''
  })

  const confirm = (options) => {
    return new Promise((resolve, reject) => {
      confirmState.value = {
        show: true,
        title: options.title || '确认操作',
        message: options.message || '',
        confirmText: options.confirmText || '确认',
        cancelText: options.cancelText || '取消',
        type: options.type || 'primary',
        icon: options.icon || '',
        onConfirm: () => {
          resolve('confirm')
          confirmState.value.show = false
        },
        onCancel: () => {
          reject('cancel')
          confirmState.value.show = false
        }
      }
    })
  }

  const confirmDelete = (name) => {
    return confirm({
      title: '确认删除',
      message: `确定要删除 "${name}" 吗？此操作不可撤销。`,
      confirmText: '删除',
      cancelText: '取消',
      type: 'danger',
      icon: 'fas fa-exclamation-triangle'
    })
  }

  const confirmAction = (title, message, type = 'warning') => {
    return confirm({ title, message, type })
  }

  return {
    confirmState,
    confirm,
    confirmDelete,
    confirmAction
  }
}
