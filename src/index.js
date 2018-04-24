import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { concat, from, fromEvent, of } from "rxjs"
import {
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  tap
} from "rxjs/operators"

const DrawCanvas = pipeProps(() => {
  const ref = React.createRef()

  const onMouseMove = source(
    map(({ pageX, pageY }) => ({
      x: pageX,
      y: pageY
    })),
    pairwise()
  )

  const onMetaKeyDown = fromEvent(
    document,
    "keydown"
  ).pipe(filter(event => event.key === "Meta"))

  const onMetaKeyUp = fromEvent(
    document,
    "keyup"
  ).pipe(filter(event => event.key === "Meta"))

  const draw$ = onMetaKeyDown.pipe(
    switchMap(() => {
      const ctx = ref.current.getContext("2d")
      ctx.canvas.width = window.innerWidth
      ctx.canvas.height = window.innerHeight

      return from(onMouseMove).pipe(
        takeUntil(onMetaKeyUp),
        map(([prev, curr]) => ({
          prev,
          curr,
          ctx
        }))
      )
    })
  )

  const setup$ = of({ onMouseMove, ref })
  return concat(setup$, draw$)
})

render(
  <DrawCanvas>
    {({ onMouseMove, ref, prev, curr, ctx }) => {
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(curr.x, curr.y)
        ctx.lineWidth = 20
        ctx.stroke()
        ctx.closePath()
      }
      return (
        <canvas
          onMouseMove={onMouseMove}
          ref={ref}
        />
      )
    }}
  </DrawCanvas>,

  document.querySelector("#root")
)
