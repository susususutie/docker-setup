// useMouseTracking.js
import { ref, shallowReactive } from 'vue';

export function useClickTracking() {
  const position = shallowReactive({ offsetX: null, offsetY: null, offsetCenterX: null, offsetCenterY: null })

  function onClick(event) {
    const offsetX = event.offsetX
    const offsetY = event.offsetY
    const clientWidth = event.target.clientWidth
    const clientHeight = event.target.clientHeight

    position.offsetX = offsetX
    position.offsetY = offsetY
    position.offsetCenterX = offsetX - clientWidth / 2
    position.offsetCenterY = offsetY - clientHeight / 2
  }


  return { position, onClick, };
}