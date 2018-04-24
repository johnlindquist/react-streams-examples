import React, { Fragment } from "react"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import { combineLatest, merge, interval, of, from } from "rxjs"
import {
  distinctUntilChanged,
  pluck,
  mergeScan,
  map,
  mapTo,
  startWith,
  switchMap,
  scan,
  withLatestFrom
} from "rxjs/operators"

const Stepper = pipeProps(
  mergeScan((acc = {}, { defaultValue, step, min, max }) => {
    console.log(step, min, max)
    const onDec = source(mapTo(v => v - step))
    const onInc = source(mapTo(v => v + step))
    const onChange = source(pluck("target", "value"), map(x => () => x))

    const clamp = value => (value > max ? max : value < min ? min : value)

    const { value, prevDefaultValue } = acc
    const checkValue = value
      ? value > max
        ? max
        : value < min
          ? min
          : value
      : defaultValue !== prevDefaultValue
        ? defaultValue
        : prevDefaultValue

    return merge(onDec, onInc, onChange).pipe(
      startWith(checkValue),
      scan((acc, fn) => clamp(fn(acc))),
      map(value => ({
        value,
        prevDefaultValue: defaultValue,
        onDec,
        onInc,
        onChange
      }))
    )
  })
)

const App = pipeProps(
  switchMap(props => {
    const updateMin = source(
      pluck("target", "value"),
      map(value => Number(value)),
      startWith(props.min)
    )
    const updateMax = source(
      pluck("target", "value"),
      map(value => Number(value)),
      startWith(props.max)
    )
    const updateStep = source(
      pluck("target", "value"),
      map(value => Number(value)),
      startWith(props.step)
    )

    const validMin$ = from(updateMin).pipe(withLatestFrom(updateMax, Math.min))

    const validMax$ = from(updateMax).pipe(withLatestFrom(updateMin, Math.max))

    return combineLatest(
      validMin$,
      validMax$,
      updateStep,
      (min, max, step) => ({
        min,
        max,
        step,
        updateMin,
        updateMax,
        updateStep
      })
    )
  })
)

render(
  <App min={4} max={18} step={1}>
    {props => (
      <Fragment>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            min:{" "}
            <input type="number" value={props.min} onChange={props.updateMin} />
          </label>
          <label>
            max:{" "}
            <input type="number" value={props.max} onChange={props.updateMax} />
          </label>
          <label>
            step:{" "}
            <input
              type="number"
              value={props.step}
              onChange={props.updateStep}
            />
          </label>
        </div>
        <Stepper
          defaultValue={10}
          min={props.min}
          max={props.max}
          step={props.step}
        >
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
        </Stepper>
      </Fragment>
    )}
  </App>,
  document.querySelector("#root")
)
