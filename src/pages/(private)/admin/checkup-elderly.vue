<script setup lang="ts">
import { ref, computed, h } from 'vue';
import {
  NDataTable,
  NPagination,
  NDatePicker,
  NInput,
  NButton,
  NDropdown,
  NIcon
} from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { Search } from '@vicons/ionicons5';

interface Checkup {
  id: string;
  date: string;
  posyandu: string;
  nama: string;
  gender: string;
  age: number;
  bmi?: string;
  bmiStatus: string;
  referralLetter?: string;
}

const checkupData = ref<Checkup[]>([
  {
    id: '1',
    date: '2025-04-16',
    posyandu: 'Menur 3',
    nama: 'Sigit',
    gender: 'Laki-Laki',
    age: 70,
    bmi: '23.4',
    bmiStatus: 'Normal'
  },
  {
    id: '2',
    date: '2025-04-16',
    posyandu: 'Menur 3',
    nama: 'Sigit',
    gender: 'Laki-Laki',
    age: 70,
    bmi: '24',
    bmiStatus: 'Obesitas'
  },
  {
    id: '3',
    date: '2025-04-16',
    posyandu: 'Menur 3',
    nama: 'Sigit',
    gender: 'Laki-Laki',
    age: 70,
    bmi: '18.5',
    bmiStatus: 'Stunting',
    referralLetter: 'https://example.com/suratrujukan.pdf'
  },
  {
    id: '4',
    date: '2025-04-16',
    posyandu: 'Menur 3',
    nama: 'Sigit',
    gender: 'Laki-Laki',
    age: 70,
    bmi: '18.5',
    bmiStatus: 'Stunting'
  },
  {
    id: '5',
    date: '2025-04-16',
    posyandu: 'Menur 3',
    nama: 'Sigit',
    gender: 'Laki-Laki',
    age: 70,
    bmi: '18.5',
    bmiStatus: 'Stunting'
  }
]);

const page = ref(1);
const pageSize = 5;
const selectedDate = ref<number | null>(null);
const searchTerm = ref('');

const filteredItemsCheckup = computed(() => {
  return checkupData.value.filter((item) => {
    const matchSearch =
      searchTerm.value === '' ||
      item.nama.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchDate =
      !selectedDate.value ||
      new Date(item.date).toDateString() ===
        new Date(selectedDate.value).toDateString();
    return matchSearch && matchDate;
  });
});

const paginatedItemsCheckup = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredItemsCheckup.value.slice(start, start + pageSize);
});

interface TableRow {
  id: string;
  date: string;
  posyandu: string;
  nama: string;
  gender: string;
  age: string;
  bmi: string;
  bmiStatus: string;
  referralLetter: string;
}

const columns: DataTableColumns<TableRow> = [
  { title: 'Tanggal', key: 'date' },
  { title: 'Posyandu', key: 'posyandu' },
  { title: 'Nama', key: 'nama' },
  { title: 'Jenis Kelamin', key: 'gender' },
  { title: 'Umur', key: 'age' },
  {
    title: 'IMT',
    key: 'bmiStatus',
    render(row) {
      if (!row.bmiStatus) return '-';

      let bgColor = '';
      let textColor = '';

      switch (row.bmiStatus) {
        case 'Normal':
          bgColor = '#E8F5E9';
          textColor = '#2E7D32';
          break;
        case 'Obesitas':
          bgColor = '#FFF3E0';
          textColor = '#E65100';
          break;
        case 'Stunting':
          bgColor = '#FFEBEE';
          textColor = '#C62828';
          break;
        default:
          bgColor = '#E0E0E0';
          textColor = '#616161';
      }

      return h(
        'div',
        {
          style: {
            backgroundColor: bgColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: '500'
          }
        },
        `${row.bmi} ${row.bmiStatus}`
      );
    }
  },
  {
    title: 'Surat Rujukan',
    key: 'referralLetter',
    render(row) {
      return row.referralLetter !== '-'
        ? h(
            'a',
            {
              href: row.referralLetter,
              target: '_blank',
              class: 'text-blue-500 underline'
            },
            'suratrujukan.pdf'
          )
        : '-';
    }
  },
  {
    title: 'Aksi',
    key: 'actions',
    render(row: TableRow) {
      return h(
        NDropdown,
        {
          trigger: 'click',
          options: [{ label: 'Detail', key: 'detail' }]
        },
        () =>
          h(
            NButton,
            {
              text: true,
              style: { padding: '4px' }
            },
            () =>
              h(
                'div',
                {
                  style: {
                    cursor: 'pointer',
                    fontSize: '20px'
                  }
                },
                '⋮'
              )
          )
      );
    }
  }
];
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl md:text-2xl font-semibold">Kesehatan Lansia</h1>
        <nav class="text-sm text-gray-500 mt-2">
          <a href="#" class="hover:underline">Dashboard</a>
          <span class="mx-1">></span>
          <span>Kesehatan Lansia</span>
        </nav>
      </div>
  
      <!-- Examination History -->
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Riwayat Pemeriksaan</h2>
          <div class="flex items-center gap-2">
            <n-date-picker
              type="date"
              v-model:value="selectedDate"
              :clearable="false"
              class="w-60 date-picker"
            />
            <div class="relative">
              <n-input
                v-model:value="searchTerm"
                placeholder="Search"
                class="w-60 search-input"
              >
                <template #prefix>
                  <n-icon size="18">
                    <Search />
                  </n-icon>
                </template>
              </n-input>
            </div>
            <n-button 
              type="primary" 
              class="custom-button"
            >
              Tambah Pemeriksaan
            </n-button>
          </div>
        </div>
  
        <n-data-table
          :columns="columns"
          :data="paginatedItemsCheckup"
          :pagination="false"
        />
  
        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
          <n-pagination
            v-model:page="page"
            :page-size="pageSize"
            :item-count="filteredItemsCheckup.length"
          />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  :deep(.n-data-table-thead) {
    background-color: #A6C9F5 !important;
  }
  :deep(.n-data-table-th) {
    background-color: #A6C9F5 !important;
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
  
  .custom-button {
    background-color: #0F5BC0 !important;
    border-color: #0F5BC0 !important;
  }
  
  .custom-button:hover {
    background-color: #0D4FA8 !important;
    border-color: #0D4FA8 !important;
  }
  
  .custom-button:active {
    background-color: #0B4390 !important;
    border-color: #0B4390 !important;
  }
  </style>
  