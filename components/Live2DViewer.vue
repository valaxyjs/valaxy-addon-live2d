<template>
  <div id="live2d">
    <div id="live2d-tips" />
    <canvas id="live2d-canvas" />
  </div>
</template>

<style lang="scss" scoped>
@use 'valaxy/client/styles/mixins/index.scss' as *;

#live2d-canvas {
  /** Prevents users from modifying canvas attributes to invalidate live2d-tips */
  vertical-align: baseline !important;
}

#live2d {
  bottom: -100%;
  left: 10px;
  position: fixed;
  transform-origin: bottom left;
  transform: scale(0.5);
  transition:
    transform 0.3s ease-in-out,
    bottom 3s ease-in-out;
  z-index: 30;
  display: flex;
  justify-content: center;
  align-items: center;

  #live2d-tips {
    opacity: 0;
    top: 0;
    position: absolute;
    width: 250px;
    height: auto;
    min-height: 70px;
    padding: 7px 10px;
    margin: 0 auto;
    border-radius: 12px;
    box-sizing: border-box;
    box-shadow:
      0 0 2px 0 rgba(0, 0, 0, 0.12),
      0 2px 2px 0 rgba(0, 0, 0, 0.24);
    transition: box-shadow 0.2s ease;
    background: #fafafa;
    color: #333;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    animation-delay: 5s;
    animation-duration: 50s;
    animation-iteration-count: infinite;
    animation-name: shake;
    animation-timing-function: ease-in-out;

    &.live2d-tips-active {
      opacity: 1;
      transition: opacity 0.2s;
    }

    span {
      color: #09c;
    }
  }

  @include screen('sm') {
    transform-origin: bottom left;
    transform: scale(0.7);
  }

  @include screen('md') {
    transform-origin: bottom left;
    transform: scale(0.8);
  }

  @include screen('lg') {
    transform-origin: bottom left;
    transform: scale(0.9);
  }

  @include screen('xl') {
    transform-origin: bottom left;
    transform: scale(1);
  }
}
</style>
