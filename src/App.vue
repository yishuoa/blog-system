<template>
  <router-view />
</template>

<script setup>
import { useDark, usePreferredDark } from '@vueuse/core'

usePreferredDark()
useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})
</script>
