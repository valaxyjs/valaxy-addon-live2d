<script setup lang="ts">
import { useAddonLive2d } from './client'
import Live2DToolbar from './components/Live2DToolbar.vue'
import Live2DViewer from './components/Live2DViewer.vue'

import 'pixi.js'

useAddonLive2d()
</script>

<template>
  <Live2DViewer />
  <Live2DToolbar />
</template>
