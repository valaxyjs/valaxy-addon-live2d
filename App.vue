<script setup lang="ts">
import { watch } from 'vue'
import { useAddonLive2d } from './client'
import Live2DToolbar from './components/Live2DToolbar.vue'
import Live2DViewer from './components/Live2DViewer.vue'
import { hideLive2dTool, showLive2dTool } from './utils/animate'

import 'pixi.js'
import './styles/index.scss'

const { switchCharacter, switchSkin, captureFrame, toggleLive2DVisibility, isLive2DHide } = useAddonLive2d()

watch(isLive2DHide, isHide => (isHide ? hideLive2dTool : showLive2dTool)())
</script>

<template>
  <Live2DViewer />

  <Live2DToolbar
    :is-hidden="isLive2DHide"
    @toggle-visibility="toggleLive2DVisibility"
    @switch-character="switchCharacter"
    @switch-skin="switchSkin"
    @capture-frame="captureFrame"
  />
</template>
