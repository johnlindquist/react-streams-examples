import React from "react"
import { of, interval, combineLatest } from "rxjs"
import { render } from "react-dom"
import { pipeProps, source } from "react-streams"
import {
  concat,
  repeatWhen,
  scan,
  startWith,
  takeUntil,
  takeWhile,
  share,
  ignoreElements
} from "rxjs/operators"

const Alarm = pipeProps(props$ => {
  const snooze = source()
  const dismiss = source()

  const countdown$ = interval(250).pipe(
    startWith(5),
    scan(time => time - 1),
    takeWhile(time => time > 0),
    share()
  )

  const message$ = countdown$.pipe(
    concat(of("Wake up! 🎉")),
    repeatWhen(() => snooze),
    takeUntil(dismiss),
    concat(of("Have a nice day! 🤗"))
  )

  const areButtonsDisabled$ = countdown$.pipe(
    ignoreElements(),
    startWith(true),
    concat(of(false)),
    repeatWhen(() => snooze),
    takeUntil(dismiss),
    concat(of(true))
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
