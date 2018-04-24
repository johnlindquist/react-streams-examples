import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { from } from "rxjs"
import {
  map,
  startWith,
  switchMap,
  scan
} from "rxjs/operators"

const Toggle = pipeProps(
  switchMap(({ on }) => {
    const onChange = source(
      startWith(on),
      scan(bool => !bool)
    )

    return onChange.pipe(map(on => ({ on, onChange })))
  })
)

render(
  <Toggle on={true}>
    {props => (
      <div>
        <input
          type="checkbox"
          onChange={props.onChange}
          checked={props.on}
        />
        <h1 onClick={props.onChange}>
          {props.on ? "ON" : "OFF"}
        </h1>
      </div>
    )}
  </Toggle>,
  document.querySelector("#root")
)
