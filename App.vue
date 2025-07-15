<script setup lang="ts">
import { isEmptyAddon } from 'valaxy'
import * as addonHitokoto from 'valaxy-addon-hitokoto'
import { useAddonLive2d } from './client'
import Live2DToolbar from './components/Live2DToolbar.vue'
import Live2DViewer from './components/Live2DViewer.vue'
import { addonHitokoto as localHitokoto } from './shared'

import 'pixi.js'

useAddonLive2d()

if (!isEmptyAddon(addonHitokoto))
  localHitokoto.value = addonHitokoto.useAddonHitokoto()
</script>

<template>
  <Live2DViewer />
  <Live2DToolbar />
</template>
