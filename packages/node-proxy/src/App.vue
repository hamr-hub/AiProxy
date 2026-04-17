<template>
  <router-view />
  <GlobalToast />
  <ConfirmModal
    v-model:show="confirmState.show"
    :title="confirmState.title"
    :message="confirmState.message"
    :confirm-text="confirmState.confirmText"
    :cancel-text="confirmState.cancelText"
    :type="confirmState.type"
    :icon="confirmState.icon"
    @confirm="confirmState.onConfirm"
    @cancel="confirmState.onCancel"
  />
</template>

<script setup>
import GlobalToast from '@/components/common/GlobalToast.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useConfirm } from '@/composables/useConfirm'

const { confirmState } = useConfirm()
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
