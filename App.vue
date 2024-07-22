<script setup lang="ts">
import 'pixi.js'
import './styles/index.scss'
import { watch } from 'vue'
import { useAddonLive2d } from './client'
import { hideLive2dTool, showLive2dTool } from './utils/animate'

const { switchCharacter, switchSkin, captureFrame, toggleLive2DVisibility, isLive2DHide } = useAddonLive2d()

watch(isLive2DHide, isHide => (isHide ? hideLive2dTool : showLive2dTool)())
</script>

<template>
  <div id="live2d">
    <div id="live2d-tips" />
    <canvas id="live2d-canvas" />
  </div>

  <div id="live2d-tools" :class="isLive2DHide ? 'hide' : 'show'">
    <span id="live2d-tool-quit" class="live2d-tool hide-live2d" @click="toggleLive2DVisibility()">
      {{ !isLive2DHide ? 'Hide' : 'Show' }}
    </span>
    <span id="live2d-tool-switch-model" class="live2d-tool" style="--live2d-tool-bg: #c3a6cb" @click="switchCharacter()">
      Tia
    </span>
    <span id="live2d-tool-switch-texture" class="live2d-tool" style="--live2d-tool-bg: #16a" @click="switchSkin()">
      Switch
    </span>
    <span id="live2d-tool-photo" class="live2d-tool" style="--live2d-tool-bg: orange" @click="captureFrame()">
      Save
    </span>
  </div>
</template>
