<script setup lang="ts">
import { ref, computed, h } from 'vue';
import {
  NButton,
  NDataTable,
  NInput,
  NPagination,
  NIcon
} from 'naive-ui';
import { Search } from '@vicons/ionicons5';
import type { DataTableColumns } from 'naive-ui';

const pageSize = 3;

// -------------------- QUESTION --------------------
interface Pertanyaan {
  id: number;
  pertanyaan: string;
  keterangan: string;
}

const pagePertanyaan = ref(1);
const searchPertanyaan = ref('');
const pertanyaanData = ref<Pertanyaan[]>([
  { id: 1, pertanyaan: 'Merokok?', keterangan: '-' },
  { id: 2, pertanyaan: 'Sesak Napas?', keterangan: 'Apakah Anda pernah merasa..' },
  { id: 3, pertanyaan: 'Berdahak?', keterangan: 'Apakah Anda biasanya..' }
]);

const filteredPertanyaan = computed(() =>
  pertanyaanData.value.filter((item) =>
    item.pertanyaan.toLowerCase().includes(searchPertanyaan.value.toLowerCase())
  )
);

const paginatedPertanyaan = computed(() => {
  const start = (pagePertanyaan.value - 1) * pageSize;
  return filteredPertanyaan.value.slice(start, start + pageSize);
});

const pertanyaanColumns: DataTableColumns<Pertanyaan> = [
  { 
    title: 'No', 
    key: 'id',
    width: 60,
    align: 'center'
  },
  { 
    title: 'Pertanyaan', 
    key: 'pertanyaan',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  { 
    title: 'Keterangan', 
    key: 'keterangan',
    width: 280,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Aksi',
    key: 'aksi',
    width: 150,
    align: 'center',
    titleAlign: 'center',
    render(row) {
      return h('div', { 
        class: 'flex gap-2 justify-center',
        style: 'width: 100%'
      }, [
        h(
          NButton,
          { type: 'primary',
            size: 'small',
            style: {
                backgroundColor: '#0F5BC0',
                borderColor: '#0F5BC0',
                fontSize: '13px'
            } },
          { default: () => 'Ubah' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            style: {
              fontSize: '13px',
              backgroundColor: '#FF0000',
              borderColor: '#FF0000'
            }
          },
          { default: () => 'Hapus' }
        )
      ]);
    }
  }
];

// -------------------- CONCLUSIONS --------------------
interface Kesimpulan {
  id: number;
  skor: number;
  kesimpulan: string;
  keterangan: string;
}

const pageKesimpulan = ref(1);
const searchKesimpulan = ref('');
const kesimpulanData = ref<Kesimpulan[]>([
  {
    id: 1,
    skor: 6,
    kesimpulan: 'Anda diduga PPOK',
    keterangan: 'Segera periksakan diri ke dokter..'
  },
  {
    id: 2,
    skor: 6,
    kesimpulan: 'Anda diduga PPOK',
    keterangan: 'Segera periksakan diri ke dokter..'
  },
  {
    id: 3,
    skor: 6,
    kesimpulan: 'Anda diduga PPOK',
    keterangan: 'Segera periksakan diri ke dokter..'
  }
]);

const filteredKesimpulan = computed(() =>
  kesimpulanData.value.filter((item) =>
    item.kesimpulan.toLowerCase().includes(searchKesimpulan.value.toLowerCase())
  )
);

const paginatedKesimpulan = computed(() => {
  const start = (pageKesimpulan.value - 1) * pageSize;
  return filteredKesimpulan.value.slice(start, start + pageSize);
});

const kesimpulanColumns: DataTableColumns<Kesimpulan> = [
  { 
    title: 'Total Skor', 
    key: 'skor',
    width: 60,
    align: 'center'
  },
  { 
    title: 'Kesimpulan', 
    key: 'kesimpulan',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  { 
    title: 'Keterangan', 
    key: 'keterangan',
    width: 280,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Aksi',
    key: 'aksi',
    width: 150,
    align: 'center',
    titleAlign: 'center',
    render(row) {
      return h('div', { 
        class: 'flex gap-2 justify-center',
        style: 'width: 100%'
      }, [
        h(
          NButton,
          { type: 'primary',
            size: 'small',
            style: {
                backgroundColor: '#0F5BC0',
                borderColor: '#0F5BC0',
                fontSize: '13px'
            } },
          { default: () => 'Ubah' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            style: {
              fontSize: '13px',
              backgroundColor: '#FF0000',
              borderColor: '#FF0000'
            }
          },
          { default: () => 'Hapus' }
        )
      ]);
    }
  }
];
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-semibold">Master Data</h1>
        <nav class="text-sm text-gray-500 mt-2">
          <a href="#" class="hover:underline">Dashboard</a>
          <span class="mx-1">></span>
          <span>Master Data Skrining Paru</span>
        </nav>
    </div>

    <!-- Question Table -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Pertanyaan Skrining Paru</h2>
        <div class="flex items-center gap-2">
          <n-input
            v-model:value="searchPertanyaan"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="tambah-btn">Tambah Pertanyaan</n-button>
        </div>
      </div>

      <n-data-table
        :columns="pertanyaanColumns"
        :data="paginatedPertanyaan"
        :pagination="false"
        :bordered="false"
      />

      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="pagePertanyaan"
          :page-size="pageSize"
          :item-count="filteredPertanyaan.length"
        />
      </div>
    </div>

    <!-- Conclusion Table -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Kesimpulan Skrining Paru</h2>
        <div class="flex items-center gap-2">
          <n-input
            v-model:value="searchKesimpulan"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="tambah-btn">Tambah Kesimpulan</n-button>
        </div>
      </div>

      <n-data-table
        :columns="kesimpulanColumns"
        :data="paginatedKesimpulan"
        :pagination="false"
        :bordered="false"
      />

      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="pageKesimpulan"
          :page-size="pageSize"
          :item-count="filteredKesimpulan.length"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal;
  font-size: 14px;
  padding: 12px 16px;
}
:deep(.n-data-table-td) {
  font-size: 14px;
  padding: 12px 16px;
}
:deep(.n-data-table .n-data-table-td:first-child) {
  width: 80px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-td:last-child) {
  width: 180px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-th:first-child) {
  width: 80px;
  text-align: center;
}
:deep(.n-data-table .n-data-table-th:last-child) {
  width: 180px;
  text-align: center;
}
.tambah-btn {
  background-color: #0F5BC0;
  border-color: #0F5BC0;
  font-weight: 500;
}
.tambah-btn:hover {
  background-color: #0D4FA8;
}
:deep(.n-button.n-button--error-type:hover) {
  background-color: #E60000 !important;
  border-color: #E60000 !important;
}
.search-input :deep(.n-input) {
  border-radius: 8px;
}
.search-input :deep(.n-input-wrapper) {
  padding-left: 12px;
}
.search-input :deep(.n-input__prefix) {
  margin-right: 8px;
  color: #8e8e8e;
}
</style>
