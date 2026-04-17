import { ref, readonly } from 'vue'

const toasts = ref([])
let toastId = 0

const getIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || icons.info
}

export { getIcon }

export function useToast() {
  const addToast = ({ type = 'info', title = '', message, duration = 4000, position = 'top-right' }) => {
    const id = ++toastId
    const toast = { id, type, title, message, position, progress: null }

    if (duration > 0) {
      toasts.value.push(toast)
      const startTime = Date.now()
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(100, (elapsed / duration) * 100)
        const currentToast = toasts.value.find(t => t.id === id)
        if (currentToast) {
          currentToast.progress = progress
          if (progress < 100) {
            requestAnimationFrame(updateProgress)
          } else {
            removeToast(id)
          }
        }
      }
      requestAnimationFrame(updateProgress)
    } else {
      toasts.value.push(toast)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  const success = (message, title = '', options = {}) => {
    return addToast({ type: 'success', title, message, ...options })
  }

  const error = (message, title = '', options = {}) => {
    return addToast({ type: 'error', title, message, duration: 6000, ...options })
  }

  const warning = (message, title = '', options = {}) => {
    return addToast({ type: 'warning', title, message, ...options })
  }

  const info = (message, title = '', options = {}) => {
    return addToast({ type: 'info', title, message, ...options })
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  }
}
