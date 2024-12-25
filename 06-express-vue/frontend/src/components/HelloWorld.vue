<template>
  <div ref="dom" class="ball-container" @click="onClick" @mousedown="onMousedown">
    <div class="ball" :style="ballStyle"></div>
    <!-- 添加按钮用于请求权限 -->
    <!-- <button @click="requestPermission">请求陀螺仪权限</button> -->
    <!-- 在页面下层级展示 logs 数据 -->
    <div class="logs">
      <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useClickTracking } from '../hooks/useClickTracking.js'
import useDeviceorientation from '../hooks/useDeviceorientation.js'
import { useMouseDownTracking } from '../hooks/useMouseDownTracking'

const ballSize = ref(40)
// const logs = shallowReactive([navigator.userAgent, 'mobilePosition', 'mousePosition', 'clickPosition'])

const { dom, position: mobilePosition } = useDeviceorientation()
const { onMousedown, position: mousePosition } = useMouseDownTracking()
const { onClick, position: clickPosition, } = useClickTracking()

const ballStyle = computed(() => ({
  transform: `translate(${mousePosition.refX}px, ${mousePosition.refY || 0}px)`,
}))

const logs = computed(() => [
  navigator.userAgent,
  `mobile: x:${mobilePosition.x},y:${mobilePosition.y}`,
  `mouse: x:${mousePosition.x},y:${mousePosition.y},refX:${mousePosition.refX},refY:${mousePosition.refY}`,
  `click: offsetX:${clickPosition.offsetX},offsetY:${clickPosition.offsetY},offsetCenterX:${clickPosition.offsetCenterX},offsetCenterY:${clickPosition.offsetCenterX}`
])

</script>

<style>
.ball-container {
  position: relative;
  width: 60vw;
  height: 50vh;
  left: 100px;
  top: 80px;
  overflow: hidden;
  /* 增加可点击的鼠标样式 */
  cursor: pointer;
  /* 防止文本被选中 */
  user-select: none;
  background-color: antiquewhite;
}

.ball {
  position: absolute;
  width: calc(v-bind(ballSize) * 1px);
  height: calc(v-bind(ballSize) * 1px);
  left: calc(50% - calc(v-bind(ballSize) * .5px));
  top: calc(50% - calc(v-bind(ballSize) * .5px));
  z-index: 2;
  border-radius: 50%;
  background-color: red;
  /* 初始位置在正中央 */
  transform: translate(0, 0);
}

.logs {
  position: absolute;
  bottom: 24px;
  left: 24px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
  line-height: 13px;
  font-size: 12px;
  max-height: 50%;
  overflow: auto;
  z-index: 1;

  /* 保持格式 */
  p {
    margin: 0;
  }
}

button {
  position: absolute;
  bottom: 24px;
  left: 24px;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>
