import React, { Fragment } from "react"
import { render } from "react-dom"
import {
  action,
  getTargetValue,
  handler,
  pipeProps,
  streamActions,
  streamProps
} from "react-streams"
import { of } from "rxjs"
import { map, mergeScan } from "rxjs/operators"

const Stepper = pipeProps(
  /***
   * mergeScan because we want the current streamed stepper "value"
   * instead of the props' "defaultValue"
   */
  mergeScan((acc = {}, { defaultValue, step, min, max }) => {
    const onDec = handler()
    const onInc = handler()
    const onChange = handler(getTargetValue)

    const { value } = acc

    const clamp = value => (value > max ? max : value < min ? min : value)
    const checkValue = value => (!value ? defaultValue : clamp(value))

    const value$ = streamActions(of(checkValue(value)), [
      action(onDec, () => value => clamp(value - step)),
      action(onInc, () => value => clamp(value + step)),
      action(onChange, value => () => clamp(value))
    ])

    return value$.pipe(
      map(value => ({
        value,
        onDec,
        onInc,
        onChange
      }))
    )
  })
)

const App = streamProps(({ min, max, step }) => {
  const updateMin = handler(map(e => Number(e.target.value)))
  const updateMax = handler(map(e => Number(e.target.value)))
  const updateStep = handler(map(e => Number(e.target.value)))

  const min$ = streamActions(of(min), [
    action(updateMin, value => () => value),
    action(updateMax, value => current => Math.min(value, current))
  ])

  const max$ = streamActions(of(max), [
    action(updateMin, value => current => Math.max(value, current)),
    action(updateMax, value => () => value)
  ])

  const step$ = streamActions(of(step), [
    action(updateStep, value => () => value)
  ])

  return {
    min: min$,
    max: max$,
    step: step$,
    updateMin,
    updateMax,
    updateStep
  }
})

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
