<!-- user -->
<template>
    <div class="flex flex-nowrap overflow-hidden">
      <layout-user-sidebar />
      <main class="flex-1 overflow-auto overflow-x-hidden">
        <layout-user-header/>
        <layout-user-wrap-menu/>
        <router-view />
      </main>
    </div>
  </template>