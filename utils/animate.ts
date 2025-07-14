export function showLive2dTool(duration = 200) {
  const live2dTools = document.querySelectorAll('.live2d-tool:not(.hide-live2d)') as NodeListOf<HTMLElement>
  let start: number | null = null

  function animate(timestamp: number) {
    if (!start)
      start = timestamp
    const progress = timestamp - start
    const percentage = Math.min(progress / duration, 1)

    live2dTools.forEach((live2dTool) => {
      live2dTool.style.padding = `${5 * percentage}px 0`
      live2dTool.style.maxHeight = `${70 * percentage}px`
    })

    if (percentage < 1) {
      requestAnimationFrame(animate)
    }
    else {
      live2dTools.forEach((live2dTool) => {
        live2dTool.style.transform = ''
      })
    }
  }

  requestAnimationFrame(animate)
}

export function hideLive2dTool(duration = 200) {
  const live2dTools = document.querySelectorAll('.live2d-tool:not(.hide-live2d)') as NodeListOf<HTMLElement>
  let start: number | null = null

  function animateHide(timestamp: number) {
    if (start === null)
      start = timestamp
    const progress = timestamp - start
    const percentage = Math.min(progress / duration, 1)

    /**
     * TODO: Waiting for full method support, this is an optimization direction
     * @ses https://chromestatus.com/feature/5196713071738880
     */
    live2dTools.forEach((live2dTool) => {
      if (percentage < 1) {
        live2dTool.style.padding = `5px 0`
        live2dTool.style.maxHeight = `70px`
        // live2dTool.style.height = `calc-size(auto)`
        live2dTool.style.transform = `translateX(${-40 * percentage}px)`
      }
      else {
        live2dTool.style.padding = `0`
        live2dTool.style.maxHeight = `0`
        // live2dTool.style.height = `calc-size(0px)`
      }
    })

    if (percentage < 1 || progress < duration * 2) {
      requestAnimationFrame(animateHide)
    }
    else {
      start = null
    }
  }

  requestAnimationFrame(animateHide)
}
