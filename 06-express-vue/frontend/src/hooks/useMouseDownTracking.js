// useMouseTracking.js
import { ref, shallowReactive } from 'vue';

export function useMouseDownTracking() {
  const position = shallowReactive({ x: 0, y: 0, refX: 0, refY: 0 })
  const isTracking = ref(false);
  const startPosition = { x: 0, y: 0 }

  function onMousedown(event) {
    isTracking.value = true;
    startPosition.x = event.x - position.refX
    startPosition.y = event.y - position.refY
    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('mouseup', stopTracking);
  }

  function stopTracking() {
    isTracking.value = false;
    document.removeEventListener('mousemove', trackMouse);
    document.removeEventListener('mouseup', stopTracking);
  }

  function trackMouse(event) {
    if (isTracking.value) {
      position.x = event.offsetX
      position.y = event.offsetY;
      position.refX = event.x - startPosition.x
      position.refY = event.y - startPosition.y
    }
  }

  return { position, isTracking, onMousedown, stopTracking };
}