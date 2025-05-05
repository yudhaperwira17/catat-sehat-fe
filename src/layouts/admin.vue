<!-- admin -->
<template>
    <div class="flex flex-nowrap overflow-hidden">
      <layout-admin-sidebar />
      <main class="flex-1 overflow-auto overflow-x-hidden">
        <layout-admin-header/>
        <layout-admin-wrap-menu/>
        <router-view />
      </main>
    </div>
  </template>