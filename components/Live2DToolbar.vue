<script lang="ts" setup>
withDefaults(defineProps<{
  isHidden?: boolean
}>(), {
  isHidden: false,
})

const emit = defineEmits([
  'toggleVisibility',
  'switchCharacter',
  'switchSkin',
  'captureFrame',
])
</script>

<template>
  <div id="live2d-tools" :class="isHidden ? 'hide' : 'show'">
    <span id="live2d-tool-quit" class="live2d-tool hide-live2d" @click="emit('toggleVisibility')">
      {{ isHidden ? 'Show' : 'Hide' }}
    </span>
    <span id="live2d-tool-switch-model" class="live2d-tool" style="--live2d-tool-bg: #c3a6cb" @click="emit('switchCharacter')">
      Tia
    </span>
    <span id="live2d-tool-switch-texture" class="live2d-tool" style="--live2d-tool-bg: #16a" @click="emit('switchSkin')">
      Switch
    </span>
    <span id="live2d-tool-photo" class="live2d-tool" style="--live2d-tool-bg: orange" @click="emit('captureFrame')">
      Save
    </span>
  </div>
</template>
