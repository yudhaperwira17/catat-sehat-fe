<script setup lang="tsx">
import Expand from '@/components/componen-user/card/expand.vue'
import { useReadChild } from '@/services/child'
import { useUserReadImmunization, type Daum } from '@/services/immunization'
import { NTag } from 'naive-ui'
import { computed, ref } from 'vue'

const { data: childrenData } = useReadChild()
const selectedChild = ref<string>('')
const { data: immunization } = useUserReadImmunization(computed(() => selectedChild.value))

const childrenOptions = computed(() => {
  const options =
    childrenData.value?.data?.map((item) => {
      return { label: item.name, value: item.id }
    }) || []

  return [{ label: 'Pilih Anak', disabled: true, value: '' }, ...options]
})

const childrenFilter = ref<string>()
const selectChildren = (value: string) => {
  selectedChild.value = value
  childrenFilter.value = childrenData.value?.data?.find((item) => item.id === value)?.name
}

const formattedImmunization = computed(() => {
  const v = immunization.value || []
  return (
    v?.map?.((item: Daum) => ({
      id: item.id,
      name: item.name,
      lastVaccineGiven: item.lastVaccineGiven,
      upcomingVaccine: item.upcomingVaccine,
      expanded: false,
      vaccineId: item.vaccineId,
      immunizationStatus:
        item.immunizationStatus === 0
          ? 'Belum Dilakukan'
          : item.immunizationStatus === 1
            ? 'Sedang Berlangsung'
            : 'Selesai'
    })) || []
  )
})
const expandedItemId = ref<string | null>(null)

const toggleExpand = (itemId: string) => {
  if (expandedItemId.value === itemId) {
    expandedItemId.value = null
  } else {
    expandedItemId.value = itemId
  }
}
</script>

<template>
  <div class="flex flex-col w-full max-w-screen-xl mx-auto px-4">
    <h1 class="text-base font-semibold">Perkembangan Imunisasi</h1>
    <p class="text-gray-600 font-normal text-sm mb-4">Informasi Perkembangan Anak Imunisasi Anak</p>
    <h2 class="text-base items-center mb-4 font-medium">Riwayat Imunisasi</h2>
    <n-select
      class="w-full md:w-48 rounded-lg mb-4"
      type="primary"
      @update:value="selectChildren"
      :options="childrenOptions"
      placeholder="Pilih Anak"
      v-model:value="selectedChild"
    />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <n-card
        v-for="(detail, index) in formattedImmunization"
        :key="index"
        class="rounded-lg shadow-md"
      >
        <div class="flex flex-col space-y-4">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex flex-col">
              <p class="font-bold mb-2">Jenis Vaksin</p>
              <p class="text-gray-700">{{ detail.name }}</p>
            </div>
            <div class="flex flex-row items-center gap-3">
              <NTag
                :type="
                  detail.immunizationStatus === 'Selesai'
                    ? 'success'
                    : detail.immunizationStatus === 'Sedang Berlangsung'
                      ? 'warning'
                      : 'error'
                "
              >
                {{ detail.immunizationStatus }}
              </NTag>
              <n-button @click="toggleExpand(detail.id)" class="min-w-[40px]">
                <i-IconParkOutlineDown
                  class="cursor-pointer transition-transform duration-200"
                  :class="{ 'rotate-180': expandedItemId === detail.id }"
                ></i-IconParkOutlineDown>
              </n-button>
            </div>
          </div>
          <hr class="border-gray-200" />
          <!-- Vaccine Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <n-card size="small" class="rounded-md drop-shadow-sm">
              <p class="font-bold mb-2">Vaksin Terakhir</p>
              <p class="text-gray-700">{{ detail.lastVaccineGiven }}</p>
            </n-card>
            <n-card size="small" class="rounded-md drop-shadow-sm">
              <p class="font-bold mb-2">Vaksin Akan Datang</p>
              <p class="text-gray-700">{{ detail.upcomingVaccine }}</p>
            </n-card>
          </div>
          <!-- Expanded Section -->
          <Expand
            v-if="expandedItemId === detail.id"
            :childId="selectedChild"
            :vaccineId="detail.vaccineId"
            class="w-full"
          />
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .rotate-180 {
    transform: rotate(180deg);
  }
}
</style>
