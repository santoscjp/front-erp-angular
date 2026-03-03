export function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

export function scrollTo(element: Element, to: number, duration: number): void {
  const start = element.scrollTop
  const change = to - start
  const increment = 20
  let currentTime = 0

  const animateScroll = () => {
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }
  animateScroll()
}

export function scrollToActiveElement(menuSelector: string, itemSelector: string): void {
  const activatedItem = document.querySelector(itemSelector)
  if (!activatedItem) return

  const simplebarContent = document.querySelector(`${menuSelector} .simplebar-content-wrapper`)
  if (!simplebarContent) return

  const activatedItemRect = activatedItem.getBoundingClientRect()
  const simplebarContentRect = simplebarContent.getBoundingClientRect()
  const activatedItemOffsetTop = activatedItemRect.top + simplebarContent.scrollTop
  const centerOffset =
    activatedItemOffsetTop -
    simplebarContentRect.top -
    simplebarContent.clientHeight / 2 +
    activatedItemRect.height / 2

  scrollTo(simplebarContent, centerOffset, 600)
}
