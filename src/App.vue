<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <n-message-provider>
    <n-config-provider
      :theme-overrides="{
        Button: {
          textColorHover: '#ec4899FF',
          textColorPressed: '#ec4899FF',
          textColorFocus: '#ec4899FF',
          colorTertiary: 'rgba(255, 255, 255, 0.08)',
          textColorTertiary: 'rgba(255, 5, 176, 0.52)',
          colorTertiaryHover: 'rgba(255, 255, 255, 0.12)',
          textColorTextPressed: '#EC4899FF',
          textColorGhostPressed: '#EC4899FF',
          colorPressedPrimary: '#EC4899FF',
          colorFocusPrimary: '#D61F69',
        },
        common: {
          primaryColor: '#D61F69',
          primaryColorHover: '#E4CDDAFF',
        },
        DataTable: {
          actionDividerColor: 'rgba(236, 72, 153, 1)',
          borderColor: 'rgba(239, 239, 245, 1)',
          tdColorHover: 'rgba(247, 247, 250, 1)',
          tdColorSorting: 'rgba(236, 72, 153, 1)',
          thColor: 'rgba(253, 243, 248, 1)',
          thTextColor: 'rgba(31, 42, 55, 1)',
        },
        Table: {
          borderColor: 'rgba(236, 72, 153, 1)',
          borderColorModal: 'rgba(236, 72, 153, 1)',
        },
        Tabs: {
          colorSegment: 'rgb(247, 247, 250)',
          tabColorSegment: '#E74694FF',
          tabTextColorHoverSegment: 'rgb(51, 54, 57)',
          tabTextColorActiveSegment: 'rgba(255, 255, 255, 1)',
        },
      }"
    >
      <n-modal-provider>
        <RouterView />
      </n-modal-provider>
    </n-config-provider>
  </n-message-provider>
</template>
