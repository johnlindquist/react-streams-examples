import React from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { merge } from "rxjs"
import { pluck, mergeMap, map, mapTo, startWith, scan } from "rxjs/operators"

const Stepper = pipeProps(
  mergeMap(({ defaultValue, step, min, max }) => {
    const onDec = source(mapTo(v => v - step))
    const onInc = source(mapTo(v => v + step))
    const onChange = source(pluck("target", "value"), map(x => () => x))

    const clamp = value => (value > max ? max : value < min ? min : value)

    return merge(onDec, onInc, onChange).pipe(
      startWith(defaultValue),
      scan((acc, fn) => clamp(fn(acc))),
      map(value => ({ value, onDec, onInc, onChange }))
    )
  })
)

render(
  <Stepper defaultValue={5} min={1} max={31} step={2}>
    {({ onDec, value, onBlur, onInc, onChange }) => (
      <div>
        <button onClick={onDec}>-</button>
        <input
          style={{ width: "1rem" }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type="text"
        />
        <button onClick={onInc}>+</button>
      </div>
    )}
  </Stepper>,
  document.querySelector("#root")
)
