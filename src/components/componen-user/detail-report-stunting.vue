<script setup lang="ts">
import { ref } from 'vue';
// import modalDetailReportStunting from '../modal/input-user/modal-detail-report-stunting.vue'
import ModalDetailReportStunting from '../modal/input-user/modal-detail-report-stunting.vue';

const DetailReportStunting = ref(false)

const props = defineProps<{
  id: string
}>()

const handleOptionClick = (key: string) => {
  switch (key) {
    case 'detail':
      DetailReportStunting.value = true

      break

    default:
      break
  }
}

const options = [
  {
    label: 'Detail',
    key: 'detail'
  }
]
</script>

<template>
  <n-dropdown :options="options" @select="handleOptionClick">
    <n-button>
      <i-mage:dots></i-mage:dots>
    </n-button>
  </n-dropdown>

  <n-modal
    v-model:show="DetailReportStunting"
    :on-after-leave="() => (DetailReportStunting = false)"
  >
    <ModalDetailReportStunting :id="props.id" @close="DetailReportStunting = false" />
  </n-modal>
</template>
