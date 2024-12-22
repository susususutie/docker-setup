<template>
  <div ref="ballContainer" class="ball-container" @click="handleClick">
    <div class="ball" :style="ballStyle"></div>
    <!-- 添加按钮用于请求权限 -->
    <!-- <button @click="requestPermission">请求陀螺仪权限</button> -->
    <!-- 在页面下层级展示 eventDetails 数据 -->
    <div class="event-details">{{ eventDetails }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const ballContainer = ref(null);
const ballPosition = ref({ x: 0, y: 0 });
const eventDetails = ref(navigator.appVersion);

// 创建一个节流函数
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const updateBallPositionThrottled = (event) => {
  const { beta: b, gamma: g } = event;

  // 将 beta 和 gamma 的值限制在 -30 到 30 度之间
  const beta = Math.round(Math.max(-30, Math.min(30, b)) * 1000) / 1000;
  const gamma = Math.round(Math.max(-30, Math.min(30, g)) * 1000) / 1000;

  // 将陀螺仪数据转换为小球的屏幕坐标
  // 由于 beta 和 gamma 被限制在 -30 到 30 之间，我们可以使用更精细的比例因子
  const xOffset = (gamma / 30) * (ballContainer.value.clientWidth / 2);
  const yOffset = (beta / 30) * (ballContainer.value.clientHeight / 2);

  // 限制小球在容器内移动
  ballPosition.value.x = xOffset;
  ballPosition.value.y = yOffset;

  // 更新事件回调参数字符串
  eventDetails.value = `beta: ${beta}\ngamma: ${gamma}`;
};

const ballStyle = computed(() => ({
  transform: `translate(${ballPosition.value.x}px, ${ballPosition.value.y}px)`,
}));

// 请求权限并添加事件监听
const requestPermission = throttle(async (event) => {
  // event.preventDefault()
  event.stopPropagation()

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        // 权限被授予后，添加事件监听器
        window.addEventListener('deviceorientation', updateBallPositionThrottled);
      } else {
        // 权限被拒绝
        eventDetails.value = "权限被拒绝"
        console.log('Permission denied by user');
      }
    } catch (error) {
      eventDetails.value = "Error requesting permission"
      console.error('Error requesting permission:', error);
    }
  } else {
    // 对于不支持requestPermission的设备，直接添加事件监听器
    eventDetails.value = "不支持requestPermission"
    // window.addEventListener('deviceorientation', updateBallPositionThrottled );
  }
});

const handleClick = (event) => {

  // 获取点击位置相对于容器的位置
  const rect = ballContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 球的半径
  const ballRadius = 50 / 2; // 假设球的直径为50px

  // 更新球的位置
  ballPosition.value.x = x - ballRadius;
  ballPosition.value.y = y - ballRadius;

  eventDetails.value = `x: ${x - ballRadius}, y: ${y - ballRadius}`;
};

onMounted(() => {
  // 如果设备不需要权限请求，直接添加事件监听
  if (!window.DeviceOrientationEvent || typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', updateBallPositionThrottled);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('deviceorientation', updateBallPositionThrottled);
});
</script>

<style>
.ball-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
  /* 增加可点击的鼠标样式 */
  user-select: none;
  /* 防止文本被选中 */
}

.ball {
  position: absolute;
  width: 50px;
  height: 50px;
  left: calc(50% - 25px);
  top: calc(50% - 25px);
  border-radius: 50%;
  background-color: red;
  /* 初始位置在正中央 */
  transform: translate(0, 0);
}

.event-details {
  position: absolute;
  bottom: 24px;
  left: 24px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
  /* 保持格式 */
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