<script setup lang="ts">

import ModalEditAdmin from '@/components/modal/input-admin/modal-edit-admin.vue';
import ModalInputAdmin from '@/components/modal/input-admin/modal-input-admin.vue';
import { API } from '@/composable/http/api-constant';
import { useAdminDeleteAdmin, useReadAdmin } from '@/services/admin';
import { useQueryClient } from '@tanstack/vue-query';
import { Search } from '@vicons/ionicons5';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NDataTable, NIcon, NInput, NModal, NPagination, useDialog, useMessage } from 'naive-ui';
import { computed, h, ref, watch } from 'vue';

interface Admin {
  id: number;
  name: string;
  email: string;
  type: 'SUPER_ADMIN' | 'KADER';
  healthPostId?: string | null;
}

const page = ref(1);
const pageSize = ref(5);
const search = ref('');

const apiParams = computed(() => ({
    page: page.value,
    limit: pageSize.value,
    search: search.value,
}));

const { data: apiAdmins, isLoading: isLoadingAdmins, refetch: refetchAdmins } = useReadAdmin(apiParams);

const adminData = ref<Admin[]>([]);

watch(apiAdmins, (newData) => {
  if (newData && newData.data) {
    adminData.value = newData.data;
  } else {
    adminData.value = [];
  }
}, { immediate: true });

const filteredData = computed(() =>
  adminData.value
);

const paginatedData = computed(() => {
  return adminData.value;
});

const dialog = useDialog();
const message = useMessage();
const queryClient = useQueryClient();

const { mutate: deleteAdmin, isPending: isDeleting } = useAdminDeleteAdmin(computed(() => String(selectedAdminId.value || '')));

const showEditModal = ref(false);
const selectedAdminId = ref<number | null>(null);
const showCreateModal = ref(false);

const handleDelete = (id: number) => {
    dialog.warning({
        title: 'Konfirmasi',
        content: 'Apakah Anda yakin ingin menghapus data admin ini?',
        positiveText: 'Hapus',
        negativeText: 'Batal',
        onPositiveClick: () => {
            selectedAdminId.value = id;
            deleteAdmin(null, {
                onSuccess: () => {
                    message.success('Admin berhasil dihapus');
                    queryClient.invalidateQueries({ queryKey: [API.ADMIN_GET_ADMIN] });
                    selectedAdminId.value = null;
                },
                onError: (error) => {
                    console.error('Error deleting admin:', error);
                    message.error(error.data?.message || 'Admin gagal dihapus');
                    selectedAdminId.value = null;
                }
            });
        },
        onNegativeClick: () => {
            message.info('Hapus Admin dibatalkan');
        }
    });

};

const columns: DataTableColumns<Admin> = [
  {
    title: 'Nama',

    key: 'name'

  },
  {
    title: 'Email',
    key: 'email'
  },
  {
    title: 'Role',

    key: 'type',
    render(row) {
      let roleText = '';
      let bgColor = ''
          if (row.type === 'SUPER_ADMIN') {
            roleText = 'Admin Puskesmas';
            bgColor = 'bg-blue-100 text-blue-700'
          } else if (row.type === 'KADER') {
            roleText = 'Kader Posyandu';
            bgColor = 'bg-green-100 text-green-700'
          }

      return h(
        'span',
        { class: `${bgColor} px-2 py-1 rounded-md inline-block text-xs font-medium` 
        },
        roleText
      )
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

            },
            onClick: () => {
              selectedAdminId.value = row.id;
              showEditModal.value = true;
            }
          },
          () => 'Ubah'

        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',

            onClick: () => handleDelete(row.id),

            style: {
              backgroundColor: '#FF0000',
              borderColor: '#FF0000',
              fontSize: '13px'

            },
            loading: isDeleting.value
          },
          () => 'Hapus'

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

          <n-button 
            type="primary" 
            class="bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 rounded-md ml-2" 
            @click="showCreateModal = true"
          >

            Tambah Admin
          </n-button>
        </div>
      </div>

      <!-- Table -->
      <n-data-table
        :columns="columns"

        :data="adminData"
        :pagination="false"
        :bordered="false"
        class="custom-table"
        :loading="isLoadingAdmins"

      />

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="page"
          :page-size="pageSize"

          :item-count="apiAdmins?.meta?.totalItems || 0"
          @update:page="(p) => page = p"
        />
      </div>
    </div>

    <!-- Edit Admin Modal -->
    <n-modal v-model:show="showEditModal">
      <ModalEditAdmin
        :id="String(selectedAdminId)"
        @close="showEditModal = false; selectedAdminId = null"
      />
    </n-modal>

    <!-- Create Admin Modal -->
    <n-modal v-model:show="showCreateModal">
      <ModalInputAdmin
        @close="showCreateModal = false"
      />
    </n-modal>

  </div>
</template>
<route lang="yaml">
meta:
  layout: admin
</route>

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

