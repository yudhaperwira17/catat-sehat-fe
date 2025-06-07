<script setup lang="ts">
import ModalDetail from '@/components/modal/input-user/detail-schedule.vue';
import { ref } from 'vue';

const options = [
  {
    label: 'Detail',
    key: 'Detail'
  }
]

const detailPosyandu = ref(false)

const handleOptionClick = (key: string) => {
  if (key === 'Detail') {
    detailPosyandu.value = true
  }
}

defineProps<{
  id: string
}>()

</script>

<template>
  <n-dropdown :options="options" @select="handleOptionClick" trigger="click">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>

  <n-modal v-model:show="detailPosyandu" :on-after-leave="() => (detailPosyandu = false)">
    <ModalDetail :id="$props.id" @close="detailPosyandu = false" />
  </n-modal>
</template>
