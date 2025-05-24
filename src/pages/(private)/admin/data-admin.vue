<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { NButton, NDataTable, NInput, NPagination, NIcon, NTag } from 'naive-ui';
import { Search } from '@vicons/ionicons5';
import type { DataTableColumns } from 'naive-ui';

interface Admin {
  id: number;
  nama: string;
  email: string;
  role: string;
}

const page = ref(1);
const pageSize = 5;
const search = ref('');

const adminData = ref<Admin[]>(
  Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    nama: 'Putra',
    email: 'putra@gmail.com',
    role: 'Admin Puskesmas'
  }))
);

const filteredData = computed(() =>
  adminData.value.filter((item) =>
    item.nama.toLowerCase().includes(search.value.toLowerCase()) ||
    item.email.toLowerCase().includes(search.value.toLowerCase()) ||
    item.role.toLowerCase().includes(search.value.toLowerCase())
  )
);

const paginatedData = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredData.value.slice(start, start + pageSize);
});

const hapusData = (id: number) => {
  adminData.value = adminData.value.filter((item) => item.id !== id);
};

const columns: DataTableColumns<Admin> = [
  {
    title: 'Nama',
    key: 'nama'
  },
  {
    title: 'Email',
    key: 'email'
  },
  {
    title: 'Role',
    key: 'role',
    render(row) {
      return h(
        NTag,
        { type: 'success', bordered: false },
        { default: () => row.role }
      );
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
        style: 'width: 100%' }, [
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
            onClick: () => hapusData(row.id),
            style: {
              backgroundColor: '#FF0000',
              borderColor: '#FF0000',
              fontSize: '13px'
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
          <span>Master Data Admin</span>
        </nav>
    </div>

    <!-- Card -->
    <div class="bg-white p-4 rounded-lg shadow">
      <!-- Subheader & Search -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Data Admin</h2>
        <div class="flex items-center gap-2">
          <n-input
            v-model:value="search"
            placeholder="Search"
            class="w-60 search-input"
            clearable
          >
            <template #prefix>
              <n-icon :component="Search" />
            </template>
          </n-input>
          <n-button type="primary" class="tambah-btn">
            Tambah Admin
          </n-button>
        </div>
      </div>

      <!-- Table -->
      <n-data-table
        :columns="columns"
        :data="paginatedData"
        :pagination="false"
        :bordered="false"
        class="custom-table"
      />

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="page"
          :page-size="pageSize"
          :item-count="filteredData.length"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-data-table-th) {
  background-color: #a6c9f5 !important;
  font-weight: normal !important;
  font-size: 14px !important;
  text-transform: capitalize !important;
  color: inherit !important;
}

:deep(.n-data-table-td) {
  font-size: 14px !important;
  color: inherit !important;
  padding: 12px 16px !important;
}

:deep(.n-data-table) {
  --n-merged-th-color: #a6c9f5 !important;
  --n-merged-td-color: #ffffff !important;
  --n-th-padding: 12px 16px !important;
  --n-td-padding: 12px 16px !important;
}

.search-btn {
  background-color: #0F5BC0;
  border-color: #0F5BC0;
}

.search-btn:hover {
  background-color: #0D4FA8;
}

.tambah-btn {
  background-color: #0F5BC0;
  border-color: #0F5BC0;
  font-weight: 500;
}

.tambah-btn:hover {
  background-color: #0D4FA8;
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

.search-input :deep(.n-input__input-el) {
  font-size: 14px;
}

:deep(.custom-table) {
  width: 100%;
}
</style>
