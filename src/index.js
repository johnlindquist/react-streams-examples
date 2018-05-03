import React from "react"
import { render } from "react-dom"
import {
  action,
  handler,
  pipeProps,
  streamActions,
  streamProps
} from "react-streams"
import { of } from "rxjs"
import { map, mergeScan } from "rxjs/operators"

const StepperControl = streamProps(({ min, max, step }) => {
  const onUpdateMin = handler(map(e => Number(e.target.value)))
  const onUpdateMax = handler(map(e => Number(e.target.value)))
  const onUpdateStep = handler(map(e => Number(e.target.value)))
  const onUpdateValue = handler(map(e => Number(e.target.value)))

  const min$ = streamActions(of(min), [
    action(onUpdateMin, value => () => value),
    action(onUpdateMax, value => current => Math.min(value, current)),
    action(onUpdateValue, value => current => Math.min(value, current))
  ])

  const max$ = streamActions(of(max), [
    action(onUpdateMin, value => current => Math.max(value, current)),
    action(onUpdateValue, value => current => Math.max(value, current)),
    action(onUpdateMax, value => () => value)
  ])

  const step$ = streamActions(of(step), [
    action(onUpdateStep, value => () => value)
  ])

  return {
    min: min$,
    max: max$,
    step: step$,
    onUpdateMin,
    onUpdateMax,
    onUpdateStep,
    onUpdateValue
  }
})
const Stepper = pipeProps(
  /***
   * mergeScan because we want the current streamed stepper "value"
   * instead of the  "defaultValue"
   */
  mergeScan((acc = {}, { defaultValue, step, min, max }) => {
    const onDec = handler()
    const onInc = handler()
    const onChange = handler(map(e => Number(e.target.value)))

    const { value } = acc

    const clamp = value => (value > max ? max : value < min ? min : value)

    //clamping on the initial check allows the min/max to force the value down/up
    const checkValue = value => clamp(!value ? defaultValue : value)

    const value$ = streamActions(of(checkValue(value)), [
      //prevent going above or below the max/min
      action(onDec, () => value => (value - step < min ? value : value - step)),
      action(onInc, () => value => (value + step > max ? value : value + step)),
      action(onChange, value => () => value)
    ])

    return value$.pipe(
      map(value => ({
        value,
        onDec,
        onInc,
        onChange,
        min,
        max,
        step
      }))
    )
  })
)

render(
  <StepperControl min={4} max={18} step={1}>
    {({
      min,
      max,
      step,
      onUpdateMin,
      onUpdateMax,
      onUpdateStep,
      onUpdateValue
    }) => (
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            min: <input type="number" value={min} onChange={onUpdateMin} />
          </label>
          <label>
            max: <input type="number" value={max} onChange={onUpdateMax} />
          </label>
          <label>
            step: <input type="number" value={step} onChange={onUpdateStep} />
          </label>
        </div>
        <Stepper defaultValue={10} min={min} max={max} step={step}>
          {({ onDec, value, onBlur, onInc, onChange, min, max, step }) => (
            <div>
              <button onClick={onDec} aria-label="Increment value">
                -
              </button>
              <input
                style={{ width: "1rem" }}
                value={value}
                onBlur={onUpdateValue}
                onChange={onChange}
                type="text"
                aria-label="Set value"
              />
              <button onClick={onInc} aria-label="Decrement value">
                +
              </button>
              <br />
              {/* A Range input forces the "value" to be "min" + multiple of "step" */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
              />
            </div>
          )}
        </Stepper>
      </div>
    )}
  </StepperControl>,
  document.querySelector("#root")
)
