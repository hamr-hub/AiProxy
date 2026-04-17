<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container" :class="[`modal-${size}`]">
          <div class="modal-header">
            <h3 class="modal-title">
              <i v-if="icon" :class="icon" :style="{ color: iconColor }"></i>
              {{ title }}
            </h3>
            <button class="modal-close" @click="handleCancel">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <p v-if="message" class="modal-message">{{ message }}</p>
            <slot></slot>
          </div>

          <div class="modal-footer">
            <button
              v-if="showCancel"
              class="btn btn-secondary"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="btn"
              :class="confirmClass"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'danger', 'warning'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  icon: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  closeOnConfirm: {
    type: Boolean,
    default: true
  },
  closeOnCancel: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

const iconColor = computed(() => {
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  }
  return colors[props.type] || colors.primary
})

const confirmClass = computed(() => {
  const classes = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning'
  }
  return classes[props.type] || classes.primary
})

const handleConfirm = () => {
  emit('confirm')
  if (props.closeOnConfirm) {
    emit('update:show', false)
  }
}

const handleCancel = () => {
  emit('cancel')
  if (props.closeOnCancel) {
    emit('update:show', false)
  }
}

watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 500px;
}

.modal-lg {
  max-width: 700px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title i {
  font-size: 20px;
}

.modal-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #9ca3af;
  border-radius: 8px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-message {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.modal-enter-active {
  animation: modal-in 0.2s ease;
}

.modal-leave-active {
  animation: modal-out 0.2s ease;
}

.modal-enter-active .modal-container {
  animation: modal-content-in 0.2s ease;
}

.modal-leave-active .modal-container {
  animation: modal-content-out 0.2s ease;
}

@keyframes modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes modal-content-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-content-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}
</style>
