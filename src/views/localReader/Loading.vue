<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="loading-component">
    <svg class="spinner" :style="loadingSize" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle class="path" :style="loadingColor" fill="none" :stroke-width="stroke" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
    <p style="color: #fff;">下载中 ...</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      size: {
        type: Number,
        default: 100
      },
      stroke: {
        type: Number,
        default: 5
      },
      color: {
        type: String,
        default: '#ed424b'
      }
    },
    computed: {
      loadingSize() {
        const newSize = this.size + 'px'
        return {
          width: newSize,
          height: newSize
        }
      },
      loadingColor() {
        return {
          stroke: this.color
        }
      }
    }
  }
</script>

<style lang="less" type="text/less">
.loading-component {
  // display: inline-block;
  // pointer-events: none;
  // will-change: transform, opacity;
  // position: fixed;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保 Loading 组件在最上层 */
}

@offset: 187;
@duration: 1.4s;

.spinner {
  animation: rotator @duration linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.path {
  stroke-dasharray: @offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation:
  dash @duration ease-in-out infinite;
}

@keyframes colors {
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }
}

@keyframes dash {
  0% { stroke-dashoffset: @offset; }
  50% {
    stroke-dashoffset: @offset/4;
    transform:rotate(135deg);
  }
  100% {
    stroke-dashoffset: @offset;
    transform:rotate(450deg);
  }
}
</style>