import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { merge } from "rxjs"
import { map, scan } from "rxjs/operators"

const Toggle = pipeProps(props$ => {
  const check = source(
    map(event => ({ on: event.target.checked }))
  )

  return merge(props$, check).pipe(
    scan((prevProps, nextProps) => nextProps),
    map(props => ({ ...props, check }))
  )
})

render(
  <Toggle on={true}>
    {({ on, check }) => (
      <div>
        <input
          type="checkbox"
          checked={on}
          onChange={check}
        />
        <h1>{JSON.stringify(on)}</h1>
        <h1>{on ? "ON" : "OFF"}</h1>
      </div>
    )}
  </Toggle>,
  document.querySelector("#root")
)
