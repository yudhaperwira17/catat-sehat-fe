<script setup lang="ts">
import { RouterView } from "vue-router";
import { NMessageProvider, NConfigProvider, NModalProvider, NDialogProvider } from 'naive-ui';
</script>

<template>
  <n-message-provider>
    <n-config-provider
      :theme-overrides="{
        Button: {
          textColorHover: '#1678F2',
          textColorPressed: '#1678F2',
          textColorFocus: '#1678F2',
          colorTertiary: 'rgba(255, 255, 255, 0.08)',
          colorTertiaryHover: 'rgba(255, 255, 255, 0.12)',
          textColorTextPressed: '#1678F2',
          textColorGhostPressed: '#1678F2',
          colorPressedPrimary: '#1678F2',
          colorFocusPrimary: '#4C9DFF',
          color: '#ffffff',
        },
        common: {
          primaryColor: '#1678F2',
          primaryColorHover: '#76B4FF',
        },
        DataTable: {
          actionDividerColor: 'rgba(22, 120, 242, 1)',
          borderColor: 'rgba(239, 239, 245, 1)',
          tdColorHover: 'rgba(247, 247, 250, 1)',
          tdColorSorting: 'rgba(22, 120, 242, 1)',
          thColor: 'rgba(222, 239, 255, 1)',
          thTextColor: 'rgba(31, 42, 55, 1)',
        },
        Table: {
          borderColor: 'rgba(22, 120, 242, 1)',
          borderColorModal: 'rgba(22, 120, 242, 1)',
        },
        Tabs: {
          colorSegment: 'rgba(247, 247, 250)',
          tabColorSegment: '#1678F2',
          tabTextColorHoverSegment: 'rgb(51, 54, 57)',
          tabTextColorActiveSegment: 'rgba(255, 255, 255, 1)',
        },
      }"
    >
      <n-dialog-provider>
        <n-modal-provider>
          <RouterView />
        </n-modal-provider>
      </n-dialog-provider>
    </n-config-provider>
  </n-message-provider>
</template>
