<script setup lang="ts">
import { useUserReadImmunizationById, type Detail } from '@/services/immunization';
import { NCarousel, NTag } from 'naive-ui';
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
  <n-carousel show-arrow>
    <div v-if="!detail.length" class="text-center p-4 text-gray-500">
      Tidak ada data imunisasi yang tersedia.
    </div>
    <div
      v-for="(detail, index) in detail"
      :key="index"
      class="p-4 mb-2 space-y-3 bg-white rounded-md shadow"
    >
      <div>
        <p class="text-sm font-bold">Nama Vaksin</p>
        <p class="text-sm">{{ detail.name }}</p>
      </div>
      <div>
        <p class="text-sm font-bold">Usia yang Dianjurkan</p>
        <p class="text-sm">{{ detail.suggestedAge }}</p>
      </div>
      <div>
        <p class="text-sm font-bold">Tanggal Pemberian</p>
        <p class="text-sm">{{ detail.dateGiven }}</p>
      </div>
      <div>
        <p class="text-sm font-bold">Catatan</p>
        <p class="text-sm">{{ detail.note || '-' }}</p>
      </div>
      <div>
        <p class="text-sm font-bold">Status Pemberian</p>
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
    </div>
    <!-- Custom Dots Template -->
    <template #dots="{ total, currentIndex, to }">
      <ul class="custom-dots">
        <li
          v-for="index of total"
          :key="index"
          :class="{ ['is-active']: currentIndex === index - 1 }"
          @click="to(index - 1)"
        ></li>
      </ul>
    </template>
    <!-- Custom Arrow Template -->
    <!-- <template #arrow="{ prev, next }">
      <div class="custom-arrow">
        <button type="button" class="custom-arrow--left p-2 bg-gray-200 rounded-full" @click="prev">
          <NIcon><ArrowBack /></NIcon>
        </button>
        <button
          type="button"
          class="custom-arrow--right p-2 bg-gray-200 rounded-full"
          @click="next"
        >
          <NIcon><ArrowForward /></NIcon>
        </button>
      </div>
    </template> -->
  </n-carousel>
</template>
<style scoped>
.custom-arrow button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.custom-arrow--left,
.custom-arrow--right {
  color: #d61f69; /* Set warna arrow */
  font-size: 24px; /* Ukuran icon */
}

.custom-arrow--left:hover,
.custom-arrow--right:hover {
  transform: scale(1.1); /* Efek hover, zoom in */
}

.custom-dots {
  display: flex;
  margin: 12px 0 0 0; /* Menambahkan jarak 12px dari elemen sebelumnya */
  padding: 0;
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.custom-dots li {
  display: inline-block;
  width: 12px;
  height: 4px;
  margin: 0 3px;
  border-radius: 4px;
  background-color: rgba(228, 205, 218, 1);
  transition:
    width 0.3s,
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-dots li.is-active {
  width: 40px;
  background: #d61f69;
}</style>
