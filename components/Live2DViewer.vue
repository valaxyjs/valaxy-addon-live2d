<template>
  <div id="live2d">
    <div id="live2d-tips" />
    <canvas id="live2d-canvas" />
  </div>
</template>

<style lang="scss" scoped>
#live2d-canvas {
  /** Prevents users from modifying canvas attributes to invalidate live2d-tips */
  vertical-align: baseline !important;
}
</style>
