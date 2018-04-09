import React from "react"
import { render } from "react-dom"
import { pipeProps, sourceNext } from "react-streams"
import { map, pluck, startWith, switchMap } from "rxjs/operators"

const ToggleCheckbox = pipeProps(
  pluck("checked"),
  switchMap(checked => {
    const [change$, onChange] = sourceNext(pluck("target", "checked"))

    return change$.pipe(
      startWith(checked),
      map(checked => ({ checked, onChange }))
    )
  })
)

render(
  <ToggleCheckbox checked={true}>
    {props => (
      <div>
        <input
          type="checkbox"
          onChange={props.onChange}
          checked={props.checked}
        />
        <h1>{props.checked ? "ON" : "OFF"}</h1>
      </div>
    )}
  </ToggleCheckbox>,
  document.querySelector("#root")
)
