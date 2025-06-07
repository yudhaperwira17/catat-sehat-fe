<script setup lang="ts">
// import { useUserReadImmunizationById, type Detail } from '@/services/immunization';
import { NTag } from 'naive-ui';
import { computed, ref, watchEffect } from 'vue';

const props = defineProps<{
  childId: string
  vaccineId: string
}>()
const selectedChild = ref(props.childId)
watchEffect(() => {
  selectedChild.value = props.childId
})
const { data: immunizationById } = useUserReadImmunizationById(
  computed(() => selectedChild.value),
  ref(props.vaccineId)
)

const detail = computed(() => {
  return (
    immunizationById.value?.map((item: Detail) => ({
      id: item.id,
      name: item.name,
      suggestedAge: item.suggestedAge,
      dateGiven: item.dateGiven,
      note: item.note,
      status:
        item.vaccineStatus === 0
          ? 'Terlarang'
          : item.vaccineStatus === 1
            ? 'Tepat Waktu'
            : item.vaccineStatus === 2
              ? 'Terlambat'
               : item.vaccineStatus === null
                ? 'Belum Vaksin'
              : 'Kejar'
    })) || []
  )
})
</script>

<template>
  <div class="ml-16">
    <div class="font-bold p-2 px-4 bg-gray-50">Detail Imunisasi</div>
    <div class="grid grid-cols-5 bg-gray-100 font-semibold p-2 px-4 border-b border-gray-300">
      <div>Nama Vaksin</div>
      <div>Usia yang Dianjurkan</div>
      <div>Tanggal Pemberian</div>
      <div>Status Pemberian</div>
      <div>Catatan</div>
    </div>
    <div v-if="!detail.length" class="text-center p-4 text-gray-500">
      Tidak ada data imunisasi yang tersedia.
    </div>
    <div v-else>
      <div
        v-for="(detail, index) in detail"
        :key="index"
        class="grid grid-cols-5 p-2 px-4 border-b border-gray-200"
      >
        <div>{{ detail.name }}</div>
        <div>{{ detail.suggestedAge }}</div>
        <div>{{ detail.dateGiven || '-' }}</div>
        <div>
          <n-tag
            :type="
                 detail.status === 'Terlarang'
                  ? 'warning'
                  : detail.status === 'Tepat Waktu'
                    ? 'success'
                    : detail.status === 'Terlambat'
                      ? 'error'
                        : detail.status === 'Belum Vaksin'
                      ? 'info'
                      : 'default'
            "
            :bordered="false"
          >
            {{ detail.status }}
          </n-tag>
        </div>
        <div>{{ detail.note || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
