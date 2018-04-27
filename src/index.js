//#region imports
import React from "react"
import {
  from,
  interval,
  combineLatest,
  merge
} from "rxjs"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import {
  scan,
  startWith,
  exhaustMap,
  takeWhile,
  share,
  mapTo,
  filter,
  switchMap,
  takeUntil,
  last
} from "rxjs/operators"
//#endregion
const Alarm = pipeProps(
  switchMap(({ start }) => {
    const snooze = source()
    const dismiss = source()

    const makeCountdown = start =>
      interval(500).pipe(
        startWith(start),
        scan(count => count - 1),
        takeWhile(count => count >= 0),
        share()
      )

    const snooze$ = from(snooze).pipe(
      takeUntil(dismiss),
      startWith(start),
      mapTo(start),
      exhaustMap(makeCountdown)
    )

    const zero$ = snooze$.pipe(
      filter(count => count === 0)
    )

    const disabled$ = merge(
      merge(snooze$, dismiss).pipe(mapTo(true)),
      zero$.pipe(mapTo(false))
    )

    const message$ = merge(
      snooze$,
      zero$.pipe(mapTo(`Wakeup! 🤗`)),
      snooze$.pipe(
        last(),
        mapTo(`Have a great day! 🎉`)
      )
    )

    return combineLatest(
      message$,
      disabled$,
      (message, disabled) => ({
        message,
        disabled,
        snooze,
        dismiss
      })
    )
  })
)

render(
  <Alarm start={7}>
    {({ message, disabled, snooze, dismiss }) => (
      <div>
        <h2>{message}</h2>
        <button
          disabled={disabled}
          onClick={snooze}
        >
          Snooze
        </button>
        <button
          disabled={disabled}
          onClick={dismiss}
        >
          Dismiss
        </button>
      </div>
    )}
  </Alarm>,
  document.querySelector("#root")
)
