import { ref, shallowReactive, onMounted, onBeforeUnmount } from 'vue';

export default function useDeviceorientation() {
  const position = shallowReactive({ x: 0, y: 0 })
  const dom = ref(null)

  const updatePositionThrottled = throttle(event => {
    const { beta: b, gamma: g } = event

    // 将 beta 和 gamma 的值限制在 -30 到 30 度之间
    const beta = Math.round(Math.max(-30, Math.min(30, b)) * 1000) / 1000
    const gamma = Math.round(Math.max(-30, Math.min(30, g)) * 1000) / 1000

    // 将陀螺仪数据转换为小球的屏幕坐标
    // 由于 beta 和 gamma 被限制在 -30 到 30 之间，我们可以使用更精细的比例因子
    const offsetCenterX = (gamma / 30) * (dom.value.clientWidth / 2)
    const offsetCenterY = (beta / 30) * (dom.value.clientHeight / 2)

    // 限制小球在容器内移动
    position.offsetCenterX = offsetCenterX
    position.offsetCenterY = offsetCenterY

    // 更新事件回调参数字符串
    // eventDetails.value = `beta: ${beta}\ngamma: ${gamma}`
  })

  onMounted(() => {
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', updatePositionThrottled)
    }
  })

  onBeforeUnmount(() => {
    if ('DeviceOrientationEvent' in window) {
      window.removeEventListener('deviceorientation', updatePositionThrottled)
    }
  })

  return { position, dom }
}

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