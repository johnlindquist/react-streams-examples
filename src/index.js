//#region imports
import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { from, of } from "rxjs"
import {
  map,
  startWith,
  switchMap,
  scan
} from "rxjs/operators"
//#endregion
const Toggle = pipeProps(
  switchMap(props => {
    const change = source(
      startWith(props.on),
      scan(on => !on)
    )

    return change.pipe(map(on => ({ on, change })))
  })
)

render(
  <Toggle on={true}>
    {props => (
      <div>
        <input
          type="checkbox"
          checked={props.on}
          onChange={props.change}
        />
        <h1 onClick={props.change}>
          {JSON.stringify(props.on)}
        </h1>
        <h2 onMouseOver={props.change}>
          {props.on ? "On" : "Off"}
        </h2>
      </div>
    )}
  </Toggle>,
  document.querySelector("#root")
)
