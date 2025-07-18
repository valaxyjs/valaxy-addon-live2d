<script lang="ts" setup>
import type { Live2DToolConfig } from '../types'
import { useAddonLive2d, useAddonLive2dConfig } from '../client'
import { showHitokoto } from '../utils/tools'

const live2dOptions = useAddonLive2dConfig()
const { switchCharacter, switchSkin, captureFrame, toggleLive2DVisibility, isLive2DHide } = useAddonLive2d()

function handleToolAction(action: Live2DToolConfig['action']) {
  if (typeof action === 'function') {
    action()
    return
  }

  switch (action) {
    case 'switchCharacter':
      switchCharacter()
      break
    case 'switchSkin':
      switchSkin()
      break
    case 'captureFrame':
      captureFrame()
      break
    case 'toggleVisibility':
      toggleLive2DVisibility()
      break
    case 'showHitokoto':
      showHitokoto()
      break
  }
}

function getCurrentToolConfig(tool: Live2DToolConfig) {
  if (tool.action === 'toggleVisibility') {
    return isLive2DHide.value
      ? { ...tool.normal, ...tool.hidden }
      : tool.normal
  }
  return tool.normal || {}
}
</script>

<template>
  <div id="live2d-tools" :class="isLive2DHide ? 'hide' : 'show'">
    <span
      v-for="(tool, key) in Object.values(live2dOptions.tools!).filter(t => t.visible !== false)"
      :id="tool.id"
      :key="key"
      class="live2d-tool"
      :class="{ 'hide-live2d': tool.action === 'toggleVisibility' }"
      :style="`--live2d-tool-bg: ${getCurrentToolConfig(tool)?.bgColor || '#666'}`"
      @click="handleToolAction(tool.action)"
    >
      {{ getCurrentToolConfig(tool)?.label }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
#live2d-tools {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 99;
  bottom: 66px; // HACK: Height reserved for aplayer-body

  .live2d-tool {
    position: relative;
    background-color: var(--live2d-tool-bg);
    z-index: 100;
    border-radius: 0 5px 5px 0;
    font-size: 13px;
    cursor: pointer;
    font-family: Ubuntu, sans-serif;
    width: 35px;
    color: #fff;
    padding: 5px 0;
    line-height: 1.2rem;
    font-weight: 700;
    transform: translateX(-17px);
    visibility: visible;
    writing-mode: vertical-rl;
    transition-property: all;
    transition-duration: 0.5s, 0.5s;
    will-change: transform;
    overflow: hidden;

    &:hover {
      transform: translateX(0);
    }
  }

  // &.show .hide-live2d {
  //   background-color: #16a085;
  // }

  // &.hide .hide-live2d {
  //   background-color: #b854d4;
  // }
}

@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }

  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }

  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }

  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }

  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }

  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }

  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }

  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }

  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }

  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }

  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }

  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }

  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }

  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }

  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }

  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }

  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }

  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }

  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }

  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }

  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }

  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }

  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }

  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}
</style>
