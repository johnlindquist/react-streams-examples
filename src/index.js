import React from "react"
import { from, interval, combineLatest, merge } from "rxjs"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import {
  scan,
  startWith,
  exhaustMap,
  takeWhile,
  share,
  mapTo,
  filter
} from "rxjs/operators"

const Alarm = pipeProps(props$ => {
  const snooze = source(startWith(7), mapTo(7))
  const dismiss = source()

  const makeCountdown = start =>
    interval(250).pipe(
      startWith(start),
      scan(time => time - 1),
      takeWhile(time => time >= 0)
    )

  const countdown$ = from(snooze).pipe(exhaustMap(makeCountdown), share())

  const zero$ = countdown$.pipe(filter(v => v === 0))

  const message$ = merge(
    countdown$,
    zero$.pipe(mapTo("Wake up! 🎉")),
    from(dismiss).pipe(mapTo("Have a nice day! 🤗"))
  )

  const areButtonsDisabled$ = merge(
    merge(snooze, dismiss).pipe(mapTo(true)),
    zero$.pipe(mapTo(false))
  )

  return combineLatest(
    message$,
    areButtonsDisabled$,
    (message, areButtonsDisabled) => ({
      message,
      areButtonsDisabled,
      snooze,
      dismiss
    })
  )
})

render(
  <Alarm>
    {props => (
      <div>
        <h2>{props.message}</h2>
        <button disabled={props.areButtonsDisabled} onClick={props.snooze}>
          Snooze
        </button>
        <button disabled={props.areButtonsDisabled} onClick={props.dismiss}>
          Dismiss
        </button>
      </div>
    )}
  </Alarm>,
  document.querySelector("#root")
)
